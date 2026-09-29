# 🐍 Snake Game — Docker Edition

A tiny HTML/CSS/JavaScript Snake game, built as the hands-on project for the
Dockerfiles lecture. No build step, no dependencies, no framework — just
static files served by `nginx:alpine`.

## Play locally (no Docker)

Open `index.html` directly in a browser.

## Play with Docker

Build the image:

```
docker build -t snake-game .
```

Run it:

```
docker run -d -p 8080:80 --name snake-game snake-game
```

Open <http://localhost:8080> and play.

## Controls

- Arrow keys or `WASD` to move
- `Space` to start, or to try again after Game Over

## Tech

Vanilla HTML, CSS, and JavaScript. Your best score is remembered locally in
the browser (`localStorage`) between visits.

## Project files

| File | Purpose |
|---|---|
| `index.html` | Page structure and canvas element |
| `style.css` | Layout and theme |
| `script.js` | Game loop, input handling, collision detection |
| `Dockerfile` | Packages the site into an `nginx:alpine` image |
| `.dockerignore` | Keeps `README.md`, `Dockerfile`, and git metadata out of the served image |
