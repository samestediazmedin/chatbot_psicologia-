# ChatBot Psico — Arquitectura 3 Capas

El proyecto se estructuró en tres carpetas principales para separar la interfaz (frontend), la lógica de negocio/bot (backend) y todo lo relacionado con la base de datos.

## Estructura

```
apps/
  frontend/
    public/
    src/
      assets/      # Íconos, imágenes y estilos
      components/  # UI reutilizable
      pages/       # Vistas (Dashboard, Pacientes, Agenda, Login)
      services/    # Axios + interceptores JWT
      hooks/       # useAuth, useDashboard
      context/
      utils/
  backend/
    src/
      app.ts                 # Servidor Express
      bot/                   # WhatsApp bot (flows, OpenAI, queries)
      config/
      controllers/
      routes/
      services/
      middlewares/
      utils/
      database/prisma.ts     # PrismaClient compartido
  database/
    schema/schema.prisma     # Definición completa de tablas
    migrations/
    seeders/
    backups/
config/                      # Templates y archivos de despliegue
resources/                   # Recursos compartidos (imágenes, etc.)
docs/
infra/
```

## Requisitos

- Node.js 20+
- pnpm 9+
- Docker (para entorno local)

## Comandos básicos

```bash
pnpm install
pnpm prisma:generate                # Usa database/schema/schema.prisma
pnpm dev:frontend                   # Dashboard React
pnpm dev:api                        # API Express
pnpm dev:bot                        # Bot WhatsApp
```

## Configuración de entorno

Copiar `config/.env.example` a `.env` y completar:

- `DATABASE_URL` apuntando a PostgreSQL
- `OPENAI_API_KEY`
- `JWT_SECRET`
- Variables de WhatsApp/Baileys

## Base de datos (`apps/database/`)

- `schema/schema.prisma` describe los 18 modelos y enums.
- `migrations/` y `seeders/` sirven para controlar versiones y carga inicial.
- Guía completa en `docs/migration.md`.

## Backend (`apps/backend/`)

- API Express en TypeScript (`src/app.ts`) con rutas `/api/auth/login` y `/api/dashboard/summary` protegidas por JWT.
- Carpeta `src/bot/` conserva el flujo de BuilderBot: registro, acompañamiento, tests, agendamiento.
- PrismaClient disponible en `src/database/prisma.ts` (reutilizable en servicios y bot).
- Scripts: `pnpm dev:api`, `pnpm dev:bot`, `pnpm prisma:generate`, `pnpm db:migrate`.

## Frontend (`apps/frontend/`)

- React + Vite + Tailwind + Zustand.
- Layout lateral + cabecera, métricas, pacientes y agenda con componentes reutilizables.
- `src/services/apiClient.ts` agrega interceptores JWT para llamar al backend.
- Variables en `apps/frontend/.env.example` (`VITE_API_URL`).

## Siguientes pasos

1. Completar migración del bot hacia Prisma/PostgreSQL
2. Implementar módulos adicionales en la API (pacientes, citas, practicantes)
3. Conectar el dashboard a endpoints reales (pacientes/agenda) y asegurar control de roles
4. Desplegar servicios en Railway usando `config/railway.toml`
