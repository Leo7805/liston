# Listen Loop

## Technique Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- UI: shadcn/ui
- Backend: .NET Minimal API
- API docs: Swagger / OpenAPI
- Speech: .NET speech SDK
- Package manager: npm

## Packages

### Frontend

- `shadcn/ui`

### Backend

- `Microsoft.CognitiveServices.Speech`
- `Swashbuckle.AspNetCore`

## Directory Structure

```text
.
├── README.md
├── backend/
│   ├── Endpoints/
│   ├── Services/
│   │   └── Speech/
│   ├── Models/
│   ├── DTOs/
│   ├── Configuration/
│   └── Program.cs
└── web/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── ui/
    │   └── shared/
    ├── lib/
    ├── hooks/
    ├── types/
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    └── tsconfig.json
```
