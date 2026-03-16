import { prisma } from "../../../database/prisma.js";

type LegacyPrisma = typeof prisma & {
	consultorio?: {
		findMany: (args?: Record<string, unknown>) => Promise<Array<Record<string, unknown>>>;
	};
};

const legacyPrisma = prisma as LegacyPrisma;

type DiaAbrev = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

/**
 * Devuelve la próxima fecha (YYYY-MM-DD) correspondiente al día de la semana dado.
 */
function obtenerProximaFecha(diaAbrev: DiaAbrev) {
	const mapDias = { dom: 0, lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6 };
	const hoy = new Date();
	const hoyNum = hoy.getDay();
	const target = mapDias[diaAbrev];
	if (target === undefined) throw new Error(`Día inválido: ${diaAbrev}`);
	let diff = target - hoyNum;
	if (diff <= 0) diff += 7;
	const proxima = new Date(hoy);
	proxima.setDate(hoy.getDate() + diff);
	const yyyy = proxima.getFullYear();
	const mm = String(proxima.getMonth() + 1).padStart(2, "0");
	const dd = String(proxima.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

type Disponibilidad = Record<string, string[]>;

export async function controladorAgendamiento(datosUsuario: any) {
	try {
		const disponibilidadUsuario =
			(datosUsuario.disponibilidad as unknown as Disponibilidad) ?? ({} as Disponibilidad);
		if (!disponibilidadUsuario || Object.keys(disponibilidadUsuario).length === 0) {
			throw new Error("El usuario no tiene disponibilidad registrada");
		}

		// 1) Traer TODOS los practicantes con sesiones ≤ 70
		const candidatos = await prisma.practitioner.findMany({
			where: { sessionsCount: { lte: 70 }, active: true },
		});

		// 2) Filtrar solo los que tengan horas coincidentes
		const disponibles = [];
		for (const prac of candidatos) {
			const horarioPracticante = (prac.schedule as unknown as Disponibilidad) ?? ({} as Disponibilidad);
			const coincidencias = encontrarHorariosCoincidentes(
				disponibilidadUsuario,
				horarioPracticante
			);
			if (coincidencias.length > 0) {
				disponibles.push({ practicante: prac, coincidencias });
			}
		}

		if (disponibles.length === 0) {
			throw new Error("No hay practicantes disponibles con ese horario y ≤ 70 sesiones");
		}

		// 3) Selección aleatoria de un practicante válido
		const idx = Math.floor(Math.random() * disponibles.length);
		const { practicante, coincidencias } = disponibles[idx];
		const horarioCoincidente = coincidencias[0]; // tomamos el primer bloque
		const dia = horarioCoincidente.dia; // ej. 'mie'
		const hora = horarioCoincidente.horas[0]; // ej. '10:00'

		// 4) Convertir día+hora en un objeto Date
		const fechaStr = obtenerProximaFecha(dia); // '2025-04-23'
		const fechaHora = new Date(`${fechaStr}T${hora}:00`);

		// 5) Buscar un consultorio libre en esa fechaHora
		const consultorios =
			(await legacyPrisma.consultorio?.findMany({ where: { activo: true } })) ?? [];
		let consultorioSeleccionado = null;
		for (const c of consultorios) {
			const ocupada = await prisma.appointment.findFirst({
				where: {
					consultingRoomId: c.id,
					scheduledAt: fechaHora,
				},
			});
			if (!ocupada) {
				consultorioSeleccionado = c;
				break;
			}
		}
		if (!consultorioSeleccionado) {
			throw new Error("No hay consultorios disponibles en esa franja");
		}

		// 6) Crear la cita
		const nuevaCita = await prisma.appointment.create({
			data: {
				patientId: datosUsuario.idUsuario,
				practitionerId: practicante.id,
				consultingRoomId: consultorioSeleccionado.id,
				scheduledAt: fechaHora,
			},
		});

		// 7) Actualizar horario del practicante (remover la hora reservada) y aumentar sesiones
		const horarioActualizado = { ...practicante.schedule };
		const listaHoras = horarioActualizado[dia];
		const pos = listaHoras.indexOf(hora);
		if (pos > -1) listaHoras.splice(pos, 1);

		await prisma.practitioner.update({
			where: { id: practicante.id },
			data: {
				schedule: horarioActualizado,
				sessionsCount: { increment: 1 },
			},
		});

		// 8) Asignar PRÁCTICANTE al usuario (para futuras citas)
		await prisma.patient.update({
			where: { id: datosUsuario.idUsuario },
			data: { practitionerId: practicante.id },
		});

		return {
			success: true,
			cita: {
				...nuevaCita,
				practicante: {
					idPracticante: practicante.id,
					nombre: practicante.name,
				},
				consultorio: {
					idConsultorio: consultorioSeleccionado.id,
					nombre: consultorioSeleccionado.name,
				},
			},
		};
	} catch (error) {
		console.error("Error en agendamiento:", error);
		throw error;
	}
}

/**
 * Recorre ambos JSON de disponibilidad y devuelve un array
 * de { dia, horas: [...] } donde intersectan.
 */
function encontrarHorariosCoincidentes(
	horarioUsuario: Disponibilidad,
	horarioPracticante: Disponibilidad
) {
	const result = [];
	for (const dia in horarioUsuario) {
		if (!horarioPracticante[dia]) continue;
		const comunes = horarioUsuario[dia].filter((h) => horarioPracticante[dia].includes(h));
		if (comunes.length) {
			result.push({ dia, horas: comunes });
		}
	}
	return result;
}
