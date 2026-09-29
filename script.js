(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const GRID = 20;
  const CELLS = canvas.width / GRID;
  const TICK_MS = 120;

  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");

  let snake, dx, dy, nextDx, nextDy, food, score, best, running;

  function loadBest() {
    return parseInt(localStorage.getItem("snakeBestScore") || "0", 10);
  }

  function saveBest(value) {
    localStorage.setItem("snakeBestScore", String(value));
  }

  function placeFood() {
    let candidate;
    do {
      candidate = {
        x: Math.floor(Math.random() * CELLS),
        y: Math.floor(Math.random() * CELLS),
      };
    } while (snake.some((s) => s.x === candidate.x && s.y === candidate.y));
    food = candidate;
  }

  function initState() {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    score = 0;
    scoreEl.textContent = score;
    placeFood();
  }

  function showOverlay(title, text) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlay.classList.remove("hidden");
  }

  function reset() {
    initState();
    running = true;
    overlay.classList.add("hidden");
  }

  function endGame() {
    running = false;
    if (score > best) {
      best = score;
      saveBest(best);
      bestEl.textContent = best;
    }
    showOverlay("Game Over", `Score: ${score} — press Space to try again`);
  }

  function update() {
    if (!running) return;
    dx = nextDx;
    dy = nextDy;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    const hitWall = head.x < 0 || head.x >= CELLS || head.y < 0 || head.y >= CELLS;
    const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);
    if (hitWall || hitSelf) {
      endGame();
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }
  }

  function draw() {
    ctx.fillStyle = "#0B2E30";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#02C39A";
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * GRID + 1, segment.y * GRID + 1, GRID - 2, GRID - 2);
    });

    ctx.fillStyle = "#F4A300";
    ctx.fillRect(food.x * GRID + 1, food.y * GRID + 1, GRID - 2, GRID - 2);
  }

  function tick() {
    update();
    draw();
  }

  function handleKey(e) {
    const key = e.key;
    if (key === " ") {
      if (!running) reset();
      e.preventDefault();
      return;
    }
    if ((key === "ArrowUp" || key === "w") && dy === 0) {
      nextDx = 0;
      nextDy = -1;
      e.preventDefault();
    } else if ((key === "ArrowDown" || key === "s") && dy === 0) {
      nextDx = 0;
      nextDy = 1;
      e.preventDefault();
    } else if ((key === "ArrowLeft" || key === "a") && dx === 0) {
      nextDx = -1;
      nextDy = 0;
      e.preventDefault();
    } else if ((key === "ArrowRight" || key === "d") && dx === 0) {
      nextDx = 1;
      nextDy = 0;
      e.preventDefault();
    }
  }

  document.addEventListener("keydown", handleKey);

  // Initial paint, before the first game actually starts.
  best = loadBest();
  bestEl.textContent = best;
  initState();
  running = false;
  draw();
  showOverlay("Ready?", "Use arrow keys (or WASD) to move.");

  setInterval(tick, TICK_MS);
})();
