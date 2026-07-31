"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Timer, Trophy, LoaderCircle } from "lucide-react";

const COLS = 4;
const ROWS = 5;
const TILE_COUNT = COLS * ROWS;
/** Home square for the blank — the puzzle is only solved once it returns here. */
const BLANK_HOME = 7;
/** Drop the chest X-ray here in `public/`. Swap for an R2 URL if it ever moves. */
const IMAGE_SRC = "/images/game/chest-xray.jpg";
const NAME_STORAGE_KEY = "slcr:xray-player-name";
const MAX_NAME_LENGTH = 24;

type Board = (number | null)[];
type LeaderboardRow = { name: string; seconds: number };

function solvedBoard(): Board {
  return Array.from({ length: TILE_COUNT }, (_, i) =>
    i === BLANK_HOME ? null : i
  );
}

function isSolved(board: Board): boolean {
  return board.every((value, index) =>
    index === BLANK_HOME ? value === null : value === index
  );
}

/**
 * Plain Fisher–Yates is safe here: any tile may jump into the blank, so every
 * permutation is reachable and there is no 15-puzzle parity trap to dodge.
 */
function shuffledBoard(): Board {
  const board = solvedBoard();
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }
  return isSolved(board) ? shuffledBoard() : board;
}

function readStoredName(): string {
  try {
    return localStorage.getItem(NAME_STORAGE_KEY) ?? "";
  } catch {
    // Private-mode storage failures are not worth surfacing.
    return "";
  }
}

/** Percentage sprite offsets so tiles stay aligned at any board size. */
function tileStyle(value: number): React.CSSProperties {
  const x = value % COLS;
  const y = Math.floor(value / COLS);
  return {
    backgroundImage: `url("${IMAGE_SRC}")`,
    backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
    backgroundPosition: `${(x / (COLS - 1)) * 100}% ${(y / (ROWS - 1)) * 100}%`,
  };
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0
    ? `${minutes}m ${String(seconds).padStart(2, "0")}s`
    : `${seconds}s`;
}

export default function XrayPuzzleGame() {
  // Lazy initialisers are safe because this component is imported with
  // `ssr: false` — it only ever renders on the client, so Math.random() and
  // localStorage cannot desync hydration.
  const [board, setBoard] = useState<Board>(shuffledBoard);
  const [name, setName] = useState<string>(readStoredName);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [scores, setScores] = useState<LeaderboardRow[] | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "error">(
    "idle"
  );
  const [imageFailed, setImageFailed] = useState(false);
  const dragIndex = useRef<number | null>(null);

  // Derived, not stored — the board is the single source of truth for the win.
  const solved = useMemo(() => isSolved(board), [board]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/xray-game/leaderboard", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { scores: [] }))
      .then((data) => setScores(data.scores ?? []))
      .catch(() => setScores([]));
    return () => controller.abort();
  }, []);

  // The clock runs between the first move and the win, and nowhere else.
  useEffect(() => {
    if (!started || solved) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [started, solved]);

  const submitScore = useCallback(
    (finalMoves: number, finalSeconds: number, playerName: string) => {
      const trimmed = playerName.trim();
      try {
        localStorage.setItem(NAME_STORAGE_KEY, trimmed);
      } catch {
        // Ignore — the score still submits.
      }

      setSaveState("saving");
      fetch("/api/xray-game/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          seconds: finalSeconds,
          moves: finalMoves,
        }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("save failed");
          const data = await res.json();
          setScores(data.scores ?? []);
          setSaveState("idle");
        })
        .catch(() => setSaveState("error"));
    },
    []
  );

  const startGame = useCallback(() => {
    setBoard(shuffledBoard());
    setMoves(0);
    setSeconds(0);
    setStarted(false);
    setSaveState("idle");
  }, []);

  const moveTile = useCallback(
    (from: number) => {
      if (solved || board[from] === null) return;
      const blank = board.indexOf(null);
      if (blank === -1) return;

      const next = [...board];
      next[blank] = next[from];
      next[from] = null;
      const nextMoves = moves + 1;

      setBoard(next);
      setMoves(nextMoves);
      setStarted(true);

      // Submitting from the handler keeps the win a single, non-repeating event.
      if (isSolved(next)) submitScore(nextMoves, seconds, name);
    },
    [board, moves, seconds, name, solved, submitScore]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-8">
      {/* ── Board ── */}
      <div className="flex flex-col items-center">
        <div
          className="grid w-full max-w-[300px] overflow-hidden rounded-xl border-2 border-navy/15 bg-navy/5 shadow-inner"
          style={{
            aspectRatio: `${COLS} / ${ROWS}`,
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {board.map((value, index) => {
            if (value === null) {
              return (
                <div
                  key="blank"
                  aria-label="Empty square"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const payload = Number(e.dataTransfer.getData("text/plain"));
                    const from = dragIndex.current ?? payload;
                    dragIndex.current = null;
                    if (Number.isInteger(from)) moveTile(from);
                  }}
                  className="border border-white/60 bg-navy/10"
                />
              );
            }

            return (
              <button
                key={value}
                type="button"
                draggable={!solved}
                onDragStart={(e) => {
                  dragIndex.current = index;
                  // Firefox refuses to start a drag without payload on the event.
                  e.dataTransfer.setData("text/plain", String(index));
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => {
                  dragIndex.current = null;
                }}
                onClick={() => moveTile(index)}
                disabled={solved}
                aria-label={`Tile ${value + 1}`}
                style={tileStyle(value)}
                className="border border-white/60 bg-navy/20 bg-no-repeat transition-opacity hover:opacity-90 focus:z-10 focus:outline-2 focus:outline-offset-[-2px] focus:outline-gold disabled:cursor-default active:cursor-grabbing"
              />
            );
          })}
        </div>

        {imageFailed && (
          <p className="mt-3 max-w-[300px] text-center text-xs leading-relaxed text-red-600">
            X-ray image not found — add it at{" "}
            <code className="rounded bg-red-50 px-1">{IMAGE_SRC}</code>.
          </p>
        )}

        <div className="mt-4 flex w-full max-w-[300px] items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
            <Timer className="h-4 w-4 text-gold" />
            {formatTime(seconds)}
            <span className="font-normal text-navy/40">· {moves} moves</span>
          </span>
          <button
            type="button"
            onClick={startGame}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-light"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart
          </button>
        </div>

        <p
          role="status"
          className={`mt-3 max-w-[300px] text-center text-sm leading-relaxed ${
            solved ? "font-semibold text-navy" : "text-navy/55"
          }`}
        >
          {solved
            ? `🎉 X-ray reconstructed in ${formatTime(seconds)}!`
            : "Tap or drag any tile to move it into the empty square."}
        </p>
        {solved && saveState === "error" && (
          <p className="mt-1 text-xs text-red-600">
            Your time could not be saved to the leaderboard.
          </p>
        )}
      </div>

      {/* ── Side panel ── */}
      <div className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="xray-player-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy/50"
          >
            Player name
          </label>
          <input
            id="xray-player-name"
            type="text"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anonymous"
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy outline-none transition-colors placeholder:text-navy/35 focus:border-gold"
          />
          <p className="mt-1.5 text-[11px] leading-snug text-navy/40">
            Set this before you finish — it is saved with your time.
          </p>
        </div>

        <div>
          <h3 className="mb-2 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-navy">
            <Trophy className="h-4 w-4 text-gold" />
            Fastest players
          </h3>

          {scores === null ? (
            <p className="flex items-center gap-2 py-2 text-sm text-navy/45">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              Loading…
            </p>
          ) : scores.length === 0 ? (
            <p className="py-2 text-sm text-navy/45">
              No times yet — be the first.
            </p>
          ) : (
            <ol className="divide-y divide-navy/10 overflow-hidden rounded-lg border border-navy/10">
              {scores.map((row, i) => (
                <li
                  key={`${row.name}-${row.seconds}-${i}`}
                  className="flex items-center gap-2 bg-white px-3 py-2 text-sm"
                >
                  <span
                    className={`w-5 flex-shrink-0 text-xs font-bold ${
                      i === 0 ? "text-gold" : "text-navy/35"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-navy/80">
                    {row.name}
                  </span>
                  <span className="flex-shrink-0 font-semibold tabular-nums text-navy">
                    {formatTime(row.seconds)}
                  </span>
                </li>
              ))}
            </ol>
          )}
          {saveState === "saving" && (
            <p className="mt-2 text-xs text-navy/45">Saving your time…</p>
          )}
        </div>
      </div>

      {/* Probes the sprite so a missing file gives a clear hint, not blank tiles. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMAGE_SRC}
        alt=""
        aria-hidden="true"
        className="hidden"
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}
