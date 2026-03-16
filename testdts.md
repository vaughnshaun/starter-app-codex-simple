<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Placeholder principles -> I. Test-Driven Development (NON-NEGOTIABLE)
- Placeholder principles -> II. Frontend/Backend Separation of Concerns
- Placeholder principles -> III. Wrapper-Mediated Backend Access
- Placeholder principles -> IV. Boundary Verification
Added sections:
- Architecture Constraints
- Delivery Workflow
Removed sections:
- None
Templates requiring updates:
- ⚠ pending `.codex/prompts/speckit.constitution.md`
- ⚠ pending `.specify/templates/constitution-template.md`
- ⚠ pending `.specify/templates/plan-template.md`
- ⚠ pending `.specify/templates/tasks-template.md`
Follow-up TODOs:
- Align the prompt and template files with this constitution when edits outside this
  file are allowed.
-->
# Starter App Codex Simple Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)
All behavior changes MUST start with automated tests written before production
code. The required sequence is red, green, refactor: write the test, confirm it
fails for the expected reason, implement the smallest change that makes it pass,
then refactor while keeping the suite green. Work that skips the failing-test
step is non-compliant.

### II. Frontend/Backend Separation of Concerns
Frontend code MUST own presentation, interaction flow, and client-side state
management only. Backend code MUST own business rules, persistence, integration
logic, and server-side workflows. A module that mixes frontend and backend
responsibilities is prohibited because it weakens testability and makes changes
harder to reason about.

### III. Wrapper-Mediated Backend Access
Main frontend code MUST NOT call backend code directly. Pages, components,
screens, and other UI-facing modules MUST reach backend behavior only through a
dedicated wrapper or client layer that hides transport, authentication, error
mapping, and backend-specific details behind a frontend-safe interface.

### IV. Boundary Verification
Tests MUST verify the architectural boundaries in addition to feature behavior.
Changes that affect frontend/backend interaction MUST include coverage for the
wrapper or client layer and for the relevant integration path. A feature is not
complete until its tests prove both the expected user behavior and continued
compliance with the boundary rules above.

## Architecture Constraints

- Frontend and backend code MUST remain in separate modules, directories, or
  services whenever both concerns exist in the same project.
- Frontend UI modules MUST depend on wrapper/client modules instead of backend
  implementations. Meaning Supabase access should live in files such as
  `app/modules/auth/api.ts`.
- Wrapper/client modules MUST expose domain-oriented methods and hide backend
  implementation details from the frontend.
- Shared contracts or types MUST be defined in a neutral boundary and MUST NOT
  require frontend code to import backend implementation code.

## Terminology

Spec
- A product capability or user-facing behavior.
- Specs define what the system should do.
- Specs drive planning, tasks, and implementation.

Module
- A source code organization unit under `app/modules/*`.
- Modules group related implementation artifacts such as APIs, hooks, types, and components.
- Modules do not define the scope of a spec.

Relationship
- A spec may touch one or multiple modules.
- A module may support multiple specs.

## Technology Direction

The system should prefer the following technologies:

- Mobile framework: Expo with Expo Router
- Backend platform: Supabase
- Language: TypeScript
- Server-state management: TanStack Query
  - Fetch operations should use Supabase queries when necessary unless an edge function is needed
  - The fetch operations should be wrapped in a function and stored in the proper `api.ts` file. For example:
    ```JavaScript
    async function getTrips() {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
    ```
  - The client API layer should be wrapped in a useQuery hook and stored in the proper `api.ts`. For example
    ```JavaScript
    export function useTrips() {
      return useQuery({
       queryKey: ["trips"],
       queryFn: getTrips,
      });
    }
   ```
  - The mutation operations should be wrapped in a function and stored in the proper `api.ts` file. For example:
    ```JavaScript
    async function createTrip(trip: NewTrip) {
      const { data, error } = await supabase
        .from("trips")
        .insert(trip)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    ```
  - The client API layer should be wrapped in a useMutation hook and stored in the proper `api.ts`. For example
    ```JavaScript
    export function useCreateTrip() {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: createTrip,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["trips"] });
        },
      });
    }
   ```
- Client-state management: lightweight solutions such as Zustand or Context

Technology choices may evolve, but must preserve separation of concerns and
testability.

## Delivery Workflow

- Plans and tasks MUST show test creation before implementation for every story
  or behavior change.
- Reviews MUST reject direct frontend-to-backend calls from main UI code.
- Reviews MUST reject architecture changes that bypass or dilute the wrapper/client
  layer.
- Exceptions require a documented amendment to this constitution before the
  implementation is accepted.

## Governance

This constitution supersedes conflicting local practice. Amendments MUST update
this document, explain the rationale, and record any downstream prompt or
template files that still need alignment. Versioning follows semantic versioning:
MAJOR for incompatible principle changes or removals, MINOR for new principles or
materially expanded guidance, and PATCH for wording clarifications that do not
change enforcement. Every implementation review MUST verify compliance with TDD,
frontend/backend separation, and wrapper-mediated backend access.

**Version**: 1.0.0 | **Ratified**: 2026-03-15 | **Last Amended**: 2026-03-15
