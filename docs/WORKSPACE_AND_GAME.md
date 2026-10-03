# Studio workspace and game layers

## Available in the static application

`/studio` is the same production map as `/map`, not a separate demo. It provides:

- Local project snapshots and JSON project export.
- Reusable templates for population, service coverage, and regional sales.
- A current-view share link and iframe embed snippet.
- A territory-control and a capacity simulation preset for strategy-game prototypes.
- Common import, validation, palette, label, SVG, PNG, and JPG export tooling.

Projects and imported records are kept in the browser with `localStorage`. A shared view link deliberately does not expose local data.

## Server-backed features to add next

These need an authenticated backend and are not represented as live capabilities in the static demo:

1. Accounts, organisation workspaces, roles, invitations, and audit logs.
2. Encrypted cloud project storage, version history, restore, and backups.
3. Public share records with expiring links and server-rendered embeds.
4. Team comments, approvals, and conflict-free collaborative editing.
5. WebSocket multiplayer rooms, authoritative game state, and anti-cheat validation.
6. Custom geography upload validation, background conversion jobs, and tile hosting.

For a game, keep simulation rules and multiplayer authority outside the renderer. The map should receive an owned-region value, markers, and events through a typed adapter; the server should validate turns, paths, resources, and combat.
