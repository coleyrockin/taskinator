# Taskinator

Kanban-style task management board with drag-and-drop status tracking, built with vanilla JavaScript and localStorage persistence.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

---

## About

Taskinator is a productivity tool that organizes tasks across three swim lanes — Tasks To Do, Tasks In Progress, and Tasks Completed. Users can create tasks with custom names and types, drag them between columns, and persist everything in the browser via localStorage. Zero dependencies, zero build steps.

## Features

- Create tasks with name and category type
- Three-column kanban layout (To Do → In Progress → Completed)
- Drag-and-drop or dropdown status changes
- Persistent state with localStorage
- Edit and delete tasks inline
- Pure DOM manipulation — no libraries

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Logic | JavaScript (ES6+) |
| Markup | HTML5 (semantic) |
| Styling | CSS3 |
| Persistence | localStorage |

## Getting Started

```bash
git clone https://github.com/coleyrockin/taskinator.git
cd taskinator
```

Open `index.html` in your browser.

## Project Structure

```
├── assets/
│   ├── css/       # Stylesheets
│   └── js/        # Application logic
├── index.html     # Main entry point
└── README.md
```

---

Built by [Boyd Roberts](https://github.com/coleyrockin)
