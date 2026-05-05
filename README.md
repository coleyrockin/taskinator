# Taskinator

Kanban-style task management board with drag-and-drop/status tracking, built with vanilla JavaScript and localStorage persistence.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

Taskinator is a lightweight, dependency-free task board that runs entirely in the browser. Users can create tasks, assign a work type, move tasks through a three-column workflow, and keep their board between sessions with `localStorage`.

## Features

- Create, edit, and delete tasks from a single accessible form.
- Categorize work as `Print`, `Web`, or `Mobile`.
- Move tasks between **To Do**, **In Progress**, and **Completed** columns.
- Persist task data locally in the browser without a backend service.
- Defensive storage parsing so malformed saved data does not crash the app.
- Safe DOM rendering with `createElement` and `textContent` instead of HTML string injection.
- Responsive layout and keyboard-friendly focus states.
- Pure DOM manipulation — no framework, build step, or runtime dependency.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Logic | JavaScript (ES6+) |
| Markup | HTML5 semantic structure |
| Styling | CSS3 custom properties and responsive grid |
| Persistence | Browser `localStorage` |

## Usage

Because this is a static app, you can run it directly:

1. Clone the repository:

   ```sh
   git clone https://github.com/coleyrockin/taskinator.git
   cd taskinator
   ```

2. Open `index.html` in a modern browser.
3. Enter a task name, choose a task type, and select **Add Task**.
4. Use **Edit**, **Delete**, or the status dropdown on each task card to manage the board.

Optional local server:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Project Structure

```text
.
├── index.html                 # Application markup and form structure
├── README.md                  # Project overview and usage
├── ROADMAP.md                 # Staged improvement plan
├── SECURITY.md                # Security scope and reporting notes
└── assets/
    ├── css/
    │   └── style.css          # Layout, theme, and responsive styles
    ├── images/
    │   └── select-arrow.svg   # Local select dropdown asset
    └── js/
        └── script.js          # State, persistence, rendering, and event handling
```

## Security and Accessibility Notes

Taskinator stores data locally in the user's browser. It does not authenticate users, transmit data to a server, or load third-party scripts.

Security-minded implementation details:

- User-provided task names are rendered with `textContent`, not `innerHTML`.
- Task types and statuses are allowlisted before they are stored or rendered.
- Saved task data is parsed inside `try/catch`, validated, normalized, and deduplicated.
- Corrupt or unexpected `localStorage` content falls back to an empty board instead of throwing.
- No secrets, environment files, external dependencies, or mixed-content network requests are required.

Accessibility details:

- Form controls have visible labels and required fields.
- Validation/status updates are announced through an `aria-live` region.
- The page includes a skip link, semantic landmarks, and keyboard-visible focus states.
- Dynamic task actions use buttons/selects with accessible labels.

## Verification

Run these checks from the repository root:

```sh
node --check assets/js/script.js
git diff --check
python3 - <<'PY'
from html.parser import HTMLParser
HTMLParser().feed(open('index.html', encoding='utf-8').read())
print('HTML parsed successfully')
PY
```

Manual smoke test:

1. Open `index.html` in a browser.
2. Add a task with normal text.
3. Add a task containing HTML-like text such as `<img src=x onerror=alert(1)>` and confirm it renders as text.
4. Edit, delete, and move tasks between columns.
5. Refresh and confirm tasks persist.

## Future Improvements

See [ROADMAP.md](./ROADMAP.md) for a staged plan. High-value next steps include drag-and-drop movement, import/export, automated browser tests, and optional due dates/priorities.

---

Built by [Boyd Roberts](https://github.com/coleyrockin).
