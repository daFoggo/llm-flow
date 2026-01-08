# Feature Implementation Guide (Feature-Driven Architecture)

This document outlines the standard workflow for implementing new features in `llm-flow` following the **Feature-Driven Architecture** (also known as Vertical Slice Architecture).

The primary goal of this architecture is **Feature Isolation**. This ensures that as the application grows, the codebase remains maintainable, testable, and free from "spaghetti code."

## 1. Directory Structure

We strictly separate **Business Logic** (located in `features/`) from **Routing/Integration** (located in `app/`).

### 1.1 `features/[feature-name]`

This directory contains all the logic, state, and UI specific to a single feature. A standard feature module includes:

```
features/
└── [feature-name]/          # e.g., auth, chat, billing
    ├── actions/             # Server Actions (mutations, db interactions)
    │   └── [name].action.ts
    ├── components/          # UI components specific to this feature
    │   ├── [component].tsx
    │   └── ...
    ├── services/            # Pure business logic (DB calls, complex data processing)
    │   └── [name].service.ts
    ├── schemas/             # Zod schemas (validation for forms & APIs)
    │   └── [name].schema.ts
    ├── types/               # TypeScript interfaces/types
    │   └── [name].types.ts
    ├── hooks/               # Custom hooks specific to this feature
    ├── providers/           # Context Providers (if global state is strictly needed for this feature)
    └── index.ts             # Public API: EXPORT ONLY what the app needs
```

### 1.2 `app/`

The `app` directory is reserved for **Routing** and **Layouts**. Files here should remain "thin," primarily serving as wrappers that import and render components from `features`.

```
app/
├── (routes)/                # Route groups (optional, for organization)
│   ├── [path]/
│   │   └── page.tsx     # Imports and renders Feature Components
└── layout.tsx               # Root layout, integrates Feature Providers
```

---

## 2. Implementation Workflow (Step-by-Step)

Example: Implementing an **Auth** feature.

### Step 1: Define Schemas & Types

Start by defining the data structure and validation rules.

- `features/auth/schemas/auth.schema.ts`: Define Zod schemas for Login/Register forms.
- `features/auth/types/auth.types.ts`: Define necessary TypeScript types.

### Step 2: Implement Core Logic (Services & Actions)

Handle business logic separate from the UI.

- `features/auth/services/auth.service.ts`: Functions for DB interaction (Prisma), password hashing, etc.
- `features/auth/actions/auth.action.ts`: Server Actions that call services, handle sessions/cookies. Use `next-safe-action` for type safety.

### Step 3: Build UI Components

Construct the interface using the defined logic.

- `features/auth/components/login-form.tsx`: Client component using `useForm` and calling Server Actions.
- `features/auth/components/register-form.tsx`.

### Step 4: Public API (The Wrapper)

**Crucial**: Create an `index.ts` file in the feature root to expose only the necessary parts to the rest of the app.

- `features/auth/index.ts`:
  ```typescript
  export * from "./components/login-form";
  export * from "./actions/auth.action";
  // Do NOT export internal helper functions unless necessary
  ```

### Step 5: Integrate into App (Routing)

Create the route in `app/` to display the feature.

- `app/(auth)/sign-in/page.tsx`:

  ```tsx
  import { LoginForm } from "@/features/auth";

  export default function SignInPage() {
    return (
      <div className="...">
        <LoginForm />
      </div>
    );
  }
  ```

---

## 3. Best Practices (The Golden Rules)

### 3.1 Feature Isolation

- **Rule**: Code in `features/A` should **NOT** directly import from `features/B/components/...`.
- **Solution**: If Feature A needs something from Feature B, it must import from Feature B's **Public API** (`@/features/B`).

### 3.2 No "Shared" Feature Folder

- **Anti-Pattern**: do NOT create a `features/shared` directory. "Shared" is not a business feature; it's a horizontal layer.
- **Solution**:
  - **Generic UI** (Buttons, Inputs, Modals): Place in `components/ui` or `components/design-system`.
  - **Shared Utilities** (Date formatting, currency): Place in `lib/utils` or `utils/`.
  - **Shared Domain Components** (e.g., `UserAvatar` used in Chat and Header): Use the **Ownership Pattern**. Determine which feature "owns" the component (e.g., `features/users`) and export it via that feature's `index.ts`. Other features can then import it from there.

### 3.3 Thin Pages

- `page.tsx` files should be minimal. Avoid writing complex logic (`useEffect`, `useState`) directly in pages. Move that logic into feature components.

### 3.4 Colocation

- Keep code as close as possible to where it is used. Do not create a component in `src/components` if it is only used by a single feature. Place it inside `features/[feature-name]/components`.
