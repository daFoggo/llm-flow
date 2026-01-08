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
    │   └── [name].ts         # Convention: matches feature name, no .types suffix
    ├── hooks/               # Custom hooks specific to this feature
    ├── providers/           # Context Providers (optional, if logic requires it)
    └── index.ts             # Public API: EXPORT ONLY what the app needs
```

### 1.2 `app/`

The `app` directory is reserved for **Routing** and **Layouts**. Files here should remain "thin," primarily serving as wrappers that import and render components from `features`.

```
app/
├── (routes)/                # Route groups (optional, for organization)
│   ├── [path]/
│   │   └── page.tsx     # Imports and renders Feature Components
│   └── layout.tsx       # Root layout, integrates Feature Providers
└── layout.tsx               # Global root layout
```

---

## 2. Implementation Workflow (Step-by-Step)

Example: Implementing an **Auth** feature.

### Step 1: Define Schemas & Types

Start by defining the data structure and validation rules.

- `features/auth/schemas/auth.schema.ts`: Define Zod schemas for Login/Register forms.
- `features/auth/types/auth.ts`: Define necessary TypeScript types/interfaces.

### Step 2: Implement Core Logic (Services & Actions)

Handle business logic separate from the UI.

- `features/auth/services/auth.service.ts`: Functions for DB interaction, external API calls, etc.
- `features/auth/actions/auth.action.ts`: Server Actions that utilize `actionClient` (next-safe-action) and `kyClient` (for API requests).

### Step 3: Build UI Components

Construct the interface using the defined logic.

- `features/auth/components/login-form.tsx`: Client component using `useForm` and calling Server Actions.
- `features/auth/components/register-form.tsx`.

### Step 4: Public API (The Wrapper)

**Crucial**: Create an `index.ts` file in the feature root to expose the necessary parts to the rest of the app.

- `features/auth/index.ts`:
  ```typescript
  export * from "./actions/auth.action";
  export * from "./components/login-form";
  export * from "./services/auth.service";
  export * from "./schemas/auth.schema";
  export * from "./types/auth";
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
  - **Shared Domain Components**: Use the **Ownership Pattern**. Determine which feature "owns" the component (e.g., `features/users`) and export it via that feature's `index.ts`.

### 3.3 Thin Pages

- `page.tsx` files should be minimal. Avoid writing complex logic (`useEffect`, `useState`) directly in pages. Move that logic into feature components.

### 3.4 Colocation

- Keep code as close as possible to where it is used. Do not create a component in `src/components` if it is only used by a single feature. Place it inside `features/[feature-name]/components`.

---

## 4. Naming Conventions

Consistency is key for a maintainable codebase.

### 4.1 Files & Directories

- **Directories**: `kebab-case` (e.g., `features/chat-models`, `components/ui`).
- **Files**: `kebab-case` (e.g., `login-form.tsx`, `auth.action.ts`).

| File Type  | Pattern             | Example                       |
| :--------- | :------------------ | :---------------------------- |
| Actions    | `[name].action.ts`  | `auth.action.ts`              |
| Schemas    | `[name].schema.ts`  | `auth.schema.ts`              |
| Services   | `[name].service.ts` | `notebook-service.service.ts` |
| Types      | `[name].ts`         | `auth.ts`, `notebooks.ts`     |
| Components | `[kebab-case].tsx`  | `create-notebook-dialog.tsx`  |

### 4.2 Code

- **Interfaces / Types**: `PascalCase`. No `I` prefix.
  - Example: `User`, `LoginInput`, `Notebook`.
- **Variables / Functions**: `camelCase`.
  - Example: `const currentUser = ...`, `function getUser() { ... }`.
- **API / Database Fields**: `snake_case`.
  - This typically matches the backend response (e.g., Python/Django/FastAPI backends).
  - Example: `access_token`, `user_id`, `created_at`, `file_path`.
