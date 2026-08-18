# Procurement Dashboard

แดชบอร์ดจัดซื้อ (Procurement) — a client-side single-page app built with Vite + React 19 + TypeScript + Tailwind CSS v4. The UI is in Thai.

## Cursor Cloud specific instructions

### What this project is

- Purely a **frontend SPA**. There is no backend, database, or external service. All data comes from in-memory mock data under `src/data/` (`mockData.ts`, `inventory.ts`, `vendors.ts`) and lives in React state, so changes reset on page reload.
- Core flows to exercise when testing: creating vendor-assigned jobs, requesting purchases / generating purchase orders (3-vendor comparison), warehouse requisitions, and inventory/vendor management — all rendered from `src/App.tsx`.

### Where the code lives (important)

- The application code lives on the **`master`** branch (and feature branches off it), **not** on the default `main` branch, which contains only `README.md`. When starting fresh, base development branches on `master` so `package.json` and `src/` are present.

### Running / building (no lint or test setup)

- Standard commands are defined in `package.json` scripts; there is **no lint script and no test suite** in this repo.
  - `npm run dev` — Vite dev server on `http://localhost:5173/` (hot reload).
  - `npm run build` — type-checks with `tsc --noEmit` then `vite build` (this doubles as the "lint"/static-check step since TypeScript runs in `strict` mode with `noUnusedLocals`/`noUnusedParameters`).
  - `npm run preview` — serves the production build.
- Node 20.19+ or 22.12+ is required by Vite 7 (the VM ships Node 22.x, which works).
