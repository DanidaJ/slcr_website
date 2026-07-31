# X-ray puzzle image

Drop the chest X-ray here as **`chest-xray.jpg`**.

- The board renders it as a 4 × 5 grid, so a **portrait 4:5 image** (e.g. 800 × 1000)
  lines up exactly. Other ratios still work — the sprite scales — but will look
  stretched.
- Keep it reasonably small (< 300 KB); it loads inside the puzzle popup.

The path is set by `IMAGE_SRC` in `src/components/game/XrayPuzzleGame.tsx`.
Point it at an R2 URL there if the asset ever moves off `public/`.
