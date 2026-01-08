# llm-flow

**llm-flow** is a modern web application built with [Next.js 16](https://nextjs.org), designed with a scalable **Feature-Driven Architecture** (Vertical Slice Architecture).

## Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Directory)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Server Actions:** [next-safe-action](https://next-safe-action.dev/)
- **Forms:** [React Hook Form](https://react-hook-form.com/)

## Architecture

This project follows a **Feature-Driven Architecture** to ensure modularity and maintainability.

### Key Concepts

1.  **features/**: Contains all business logic, isolated by domain (Vertical Slices).
    - Example: `features/auth`, `features/chat`.
    - Each feature contains its own `components`, `actions`, `services`, and `schemas`.
2.  **app/**: Strictly for Routing and Layouts.
    - Acts as a thin integration layer.
    - Routes simply import and render components exposed by features.
3.  **components/**: Global shared UI components (e.g., Buttons, Inputs) that contain _no business logic_.

For a detailed guide on how to implement features in this project, please refer to [docs/feature-implementation-guide.md](./docs/feature-implementation-guide.md).

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contribution

Please verify that any new feature follows the project's [Feature-Driven Architecture](./docs/feature-implementation-guide.md) guidelines.
