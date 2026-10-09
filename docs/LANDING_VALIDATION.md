# Landing implementation validation

2026-09-30. Scope: root landing page and `/preview/*` destinations only.

- Figma MCP supplied desktop `318:1534` and mobile `393:3676` reference code and screenshots.
- TypeScript check passed (`tsc --noEmit`).
- Production build/static export passed with 55 generated pages, including the landing page and 16 preview destinations.
- Export link inspection checked 235 local links across all 17 new pages; all resolved to exported files.
- Desktop inspected at 1440px and mobile at 390px. No horizontal overflow found. All 42 visible desktop image slots loaded; mobile visible images also loaded.
- 34 Figma assets are stored locally and non-empty. SVG icons use their intrinsic dimensions; the logo preserves the source-image crop. Fonts are served locally.
- Mobile menu opens, closes on link selection, and routes to the marketplace placeholder. The placeholder displays a clear unavailable-service message and returns to the landing page.
- New landing/preview code contains no API calls, credential forms, simulated transactions or temporary Figma URLs.

The layout uses responsive document flow instead of Figma's fixed canvas positions. The mobile menu and illustrative-listing label are functional additions. Existing role pages, native Android packaging, backend behavior, legacy service-worker behavior and global AgriLink branding were not redesigned or revalidated. Marketing metrics, corporate registration and compliance wording remain supplied design copy and require product approval before public launch.

Local preview: serve `out` with a static web server after `npm run build`, or use `npm run dev` for development. If npm is not on PATH, use the local Next/TypeScript launchers documented in `../STATE_DOCUMENT.md` at the workspace root.
