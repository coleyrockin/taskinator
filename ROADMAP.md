# Taskinator Roadmap

This roadmap keeps improvements practical for a small static app while showing clear product and engineering direction.

## Stage 1 — Stability and Polish

- Add a small automated smoke test that exercises add/edit/delete/status-change behavior in a browser.
- Improve empty-state messaging for each task column.
- Add a cancel-edit action so users can leave edit mode without submitting.
- Add confirmation or undo for destructive deletes.

## Stage 2 — Workflow Enhancements

- Support due dates, priorities, and optional notes.
- Add filtering/search for larger task boards.
- Add drag-and-drop movement between columns with keyboard-accessible alternatives.
- Add task counts per column.

## Stage 3 — Data Portability

- Add JSON export/import with schema validation.
- Add a reset-board action guarded by confirmation.
- Version the localStorage payload for smoother future migrations.
- Consider IndexedDB if task data expands beyond simple records.

## Stage 4 — Quality Gates

- Introduce a minimal test runner or Playwright smoke suite.
- Add HTML and CSS validation to CI once the project has a remote workflow.
- Add linting/formatting if the app grows beyond a few files.
- Document manual QA scenarios for accessibility and persistence.

## Stage 5 — Optional Product Expansion

- Add user-selectable themes with preserved contrast.
- Add offline-friendly PWA metadata and installability.
- Add calendar-style views for dated tasks.
- Add optional backend sync only if multi-device use becomes a real requirement.
