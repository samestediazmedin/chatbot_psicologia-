import OpenAI from "openai";
import { obtenerHist, saveHist, getCita } from "../../queries/queries.js";
import { prisma } from "../../../database/prisma.js";
import { assistantPrompt } from "../../openAi/prompts.js";
import { format } from "@formkit/tempo";
import { apiHorarios } from "../agend/aiHorarios.js";

const aiRegister = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

type ConversationMessage = {
	role: "system" | "user" | "assistant";
	content: string;
};

type ToolArguments = {
	nuevoHorario?: string;
};

type LegacyPrismaClient = typeof prisma & {
	cita?: {
		update: (args: { where: Record<string, unknown>; data: Record<string, unknown> }) => Promise<any>;
	};
	practicante?: {
		update: (args: { where: Record<string, unknown>; data: Record<string, unknown> }) => Promise<any>;
	};
};

const legacyPrisma = prisma as LegacyPrismaClient;

const parseArguments = (raw: unknown): ToolArguments => {
	if (!raw || typeof raw !== "string") {
		return {};
	}
	try {
		return JSON.parse(raw) as ToolArguments;
	} catch (error) {
		console.error("Failed to parse tool arguments", error);
		return {};
	}
};

const tools = [
	{
		type: "function",
		function: {
			name: "consultarCita",
			description: "Da los detalles de la cita agendada",
			parameters: {
				type: "object",
				properties: {},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "reAgendarCita",
			description:
				"Re agenda una cita, el usuario tiene que proveer la informacion de el dia la hora (No de fecha). Si no tienes la informacion de la fecha de reagendamiento, no podras ejecutar esta funcion",
			parameters: {
				type: "object",
				properties: {
					nuevoHorario: {
						type: "string",
						description:
							"Dia/s y Hora/s a la que la cita va a ser reagendada, en lenguaje natural",
					},
				},
				required: ["nuevoHorario"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "cancelarCita",
			description: "Cancel an existing appointment",
			parameters: {
				type: "object",
				properties: {},
			},
		},
	},
];

export async function apiAssistant2(numero, msg, id) {
	const conversationHistory = (await obtenerHist(numero)) as ConversationMessage[];
	conversationHistory.unshift({
		role: "system",
		content: assistantPrompt,
	});

	conversationHistory.push({ role: "user", content: msg });

	try {
		const response = await aiRegister.chat.completions.create({
			model: "gpt-4o-mini",
			messages: conversationHistory as any,
			tools: tools as any,
			tool_choice: "auto",
		});
		const assistantResponse = response.choices[0].message.content;
		const toolCalls = response.choices[0].message.tool_calls;

		conversationHistory.shift();

		if (toolCalls && toolCalls.length > 0) {
			for (const call of toolCalls) {
				console.log(call);
				if (call.type === "function") {
					if (call.function.name === "consultarCita") {
						console.log("consultarCita");
						const dia = (await getCita(id)) as any;
						const cita = format(dia?.fechaHora ?? new Date(), "dddd, D MMMM HH:mm", "es");

						conversationHistory.push({
							role: "assistant",
							content: `Se ha registrado su cita para el día ${cita}`,
						});

						// Guardar el historial actualizado
						conversationHistory.shift(); // Remover el prompt del sistema
						await saveHist(numero, conversationHistory);

						return `Su cita está agendada para el dia ${cita}`;
					}
					//! -----------------------------------------------------------------------------
					if (call.function.name === "reAgendarCita") {
						console.log("reAgendarCita");

						const args = parseArguments(call.function.arguments);
						if (!args.nuevoHorario) {
							throw new Error("No se recibió un horario válido para reagendar");
						}
						const nuevoHorario = await apiHorarios(args.nuevoHorario);
						const cita = (await getCita(id)) as any;
						const practicante = cita?.practicante;

						// Actualiza la cita con el nuevo horario
						const newCita = await legacyPrisma.cita?.update({
							where: { idCita: cita.idCita },
							data: { fechaHora: nuevoHorario.fechaHora },
						});

						//*Suma la hora vieja al horario del practicante
						const antiguoHorario = await apiHorarios(cita?.fechaHora ?? "");
						if (practicante?.horario) {
							for (const dia in antiguoHorario) {
								const horariosPrevios = practicante.horario[dia] ?? [];
								if (horariosPrevios.length) {
									practicante.horario[dia] = [
										...new Set([...horariosPrevios, ...antiguoHorario[dia]]),
									];
								} else {
									practicante.horario[dia] = antiguoHorario[dia];
								}
							}
						}

						await legacyPrisma.practicante?.update({
							where: { idPracticante: practicante?.idPracticante },
							data: { horario: practicante.horario },
						});
						return `Su cita ha sido reagendada para el dia ${format(
							newCita?.fechaHora ?? nuevoHorario.fechaHora,
							"dddd, D MMMM HH:mm",
							"es"
						)}`;
					}
					if (call.function.name === "cancelarCita") {
						conversationHistory.push({
							role: "assistant",
							content: `Se ha sido cancelada, recuerde que a la segunda cancelada, se le cerrarra su proceso.`,
						});

						conversationHistory.shift(); // Remover el prompt del sistema
						await saveHist(numero, conversationHistory);
						return `Se ha sido cancelada, recuerde que a la segunda cancelada, se le cerrarra su proceso.`;
					}
					conversationHistory.shift();
					await saveHist(numero, conversationHistory);
					return assistantResponse;
				}
			}
		} else {
			console.log("else");
			await saveHist(numero, conversationHistory);
			return assistantResponse;
		}
	} catch (error) {
		console.error("Error processing OpenAI request:", error);
		throw new Error("Failed to process the request.");
	}
}
