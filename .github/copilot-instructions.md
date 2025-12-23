# Copilot Instructions for one.atahgroup.com

These instructions help AI coding agents work productively in this Next.js + Apollo Client app.

## Architecture

- App Router: Pages live under `app/**/page.tsx`. Global providers are wired in `app/layout.tsx` via `ApolloProviderWrapper` and `SessionCapabilityProvider`.
- GraphQL: Apollo Client targets `https://api.atahgroup.com/graphql` with `credentials: "include"` (see `components/ApolloProviderWrapper.tsx`). Types are generated into `app/graphql.ts` from `app/schema.graphql` and documents under `app/**` and `components/**` (see `codegen.ts`).
- Session/Capability model: `SessionCapabilityProvider` queries `accountSessionInfo`, stores `session_capabilities` and `session_user_id` in `sessionStorage`, and redirects to `https://www.atahgroup.com` if the session is invalid. Use `hasSessionCapability()` and `getSessionUserId()` to gate UI/actions.
- Styling/theme: Tailwind CSS 4 + CSS variables `--background`/`--foreground`. Theme toggling persists to `localStorage` and updates CSS variables (see `components/NavBar.tsx`).
- SEO routes: `app/robots.txt/route.ts` and `app/sitemap.xml/route.ts` are edge/node handlers using `SITE_URL` or `NEXT_PUBLIC_SITE_URL` to build absolute URLs.

## Install & Run

- Use pnpm (repo has `pnpm-lock.yaml`). Common commands:
  - Install: `pnpm install`
  - Dev: `pnpm dev` (Next dev server)
  - Build: `pnpm build` and `pnpm start`
  - Lint: `pnpm lint`
  - GraphQL types: `pnpm codegen` (run after editing `app/schema.graphql` or any `gql` documents)

## Conventions & Patterns

- Client components: Add `"use client"` to files that use React hooks, Apollo hooks, or browser APIs (e.g., `components/*`, `app/account/page.tsx`).
- GraphQL queries/mutations: Defined inline with `gql` near usage. Prefer `useQuery`, `useLazyQuery`, and `useMutation` from `@apollo/client/react`. Example patterns:
  - Read: `useQuery(gql`query { accountListAllUsers { userId email } }`)` in `components/UserAccountManagement.tsx`.
  - Mutate: `useMutation(gql`mutation { accountDeleteUser(userId: $id) }`)` in `components/UserAccountActions.tsx`.
- Capability gating:
  - Gate entire panels: `UserAccountManagementPanel` uses `hasSessionCapability("AccountListUsers")`.
  - Gate actions per row: `Delete/Grant/Revoke` buttons disable when capability missing or `getSessionUserId() === user.userId`.
- Data flow for account admin:
  - List users → `accountListAllUsers` → render table (`AccountTable`)
  - Inspect user capabilities → `useLazyQuery(accountGetUserCapabilities)`
  - Grant/Revoke → mutations → toast feedback → refresh via passed `refreshCapabilities`/`refetch_users` callbacks
- Static sample data: Property page lists demo vending machines from `constants/location-data.ts` via `components/VendingMachineList.tsx` and `VendingMachineItem.tsx`.

## When Adding GraphQL Features

- Define schema changes in `app/schema.graphql` for local type generation (this does not change the remote API).
- Add `gql` documents near usage and run `pnpm codegen` to refresh `app/graphql.ts` types.
- Use `credentials: "include"` aware fetches (Apollo is already configured). Handle session redirects via `SessionCapabilityProvider`.
- Gate new UI actions behind capabilities using `hasSessionCapability("YourCapability")` and disable buttons accordingly.

## Routing & SEO

- New pages: create `app/<segment>/page.tsx`. They will be auto-included in the sitemap route.
- `app/sitemap.xml/route.ts` scans `app/**` for `page.*` files and emits absolute URLs. Configure `SITE_URL`/`NEXT_PUBLIC_SITE_URL` for correct hostnames.

## Gotchas

- Types: `app/graphql.ts` is generated—do not hand-edit. Always run `pnpm codegen` after changing schema/documents.
- Remote images: `next.config.ts` restricts remote image patterns; add new hosts as needed for `next/image` to load.
- Session errors: Any GraphQL auth error in `SessionCapabilityProvider` triggers redirect to `https://www.atahgroup.com`.

## Key Files

- Layout/providers: `app/layout.tsx`, `components/ApolloProviderWrapper.tsx`, `components/SessionCapabilityProvider.tsx`
- Account admin: `components/UserAccountManagement.tsx`, `components/UserAccountActions.tsx`
- Property demo: `components/VendingMachineList.tsx`, `components/VendingMachineItem.tsx`, `constants/location-data.ts`
- GraphQL: `app/schema.graphql`, `codegen.ts`, generated `app/graphql.ts`
- SEO: `app/robots.txt/route.ts`, `app/sitemap.xml/route.ts`
