# Migración MySQL → PostgreSQL

## 1. Exportar datos desde MySQL

1. Genera un volcado tabla por tabla para evitar locks largos:
   ```bash
   mysqldump -u root -p chatbot_psico informacionUsuario practicante consultorio cita ghq12 tests > backup.sql
   ```
2. Para columnas JSON (historial del bot) exporta con `SELECT ... INTO OUTFILE` para poder parsearlas en Node.

## 2. Normalizar historial del bot

- Cada fila de `informacionUsuario.historial` contiene un arreglo `[ { role, content } ]`.
- Convierte ese arreglo en registros:
- `apps/database/schema`: `ChatSession` (una fila por conversación continua)
  - `ChatMessage` (una fila por mensaje dentro de la sesión)
- El índice del arreglo sirve como marca de tiempo relativa.

## 3. Preparar pruebas psicológicas

- GHQ-12 se mapea directo a `PsychEvaluation + Ghq12Result`.
- Para DASS-12 usa un script Node que combine los puntajes previos (BDI/BAI/PSS/WHOQOL/SSI) y los proyecte a los campos `depressionScore`, `anxietyScore`, `stressScore`.
- Guarda las respuestas completas en `responses_json` para recrear métricas.

## 4. Ejecutar Prisma sobre PostgreSQL

1. Levanta la base local con Docker:
   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```
2. Genera el cliente Prisma apuntando al nuevo esquema:
   ```bash
   pnpm prisma:generate
   ```
   (internamente ejecuta `prisma generate --schema apps/database/schema/schema.prisma`).
3. Aplica las migraciones o sincroniza el esquema:
   ```bash
   pnpm db:migrate
   ```

## 5. Importar datos

- Usa scripts en `apps/backend/src/database` para conectarte a PostgreSQL y ejecutar inserts masivos.
- Ejecuta primero practicantes/consultorios → pacientes → citas → resultados de tests.
- Los historiales transformados deben cargarse antes de reconstruir métricas para que las herramientas de IA tengan contexto.

## 6. Validaciones

- Compara conteos básicos:
  ```sql
  SELECT COUNT(*) FROM "Patient";
  SELECT COUNT(*) FROM "Appointment";
  ```
- Revisa muestras manuales de citas y métricas para garantizar que los `riskLevel` fueron asignados correctamente.
- Ejecuta `pnpm --filter @chatbot-psico/backend dev:api` y confirma que `/api/dashboard/summary` responde sin errores.
