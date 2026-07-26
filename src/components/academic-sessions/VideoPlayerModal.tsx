"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Maximize,
  Maximize2,
  Minimize,
  Minimize2,
  Minus,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

type VideoSource = {
  src: string;
  type: string;
};

type VideoPlayerModalProps = {
  open: boolean;
  sources: VideoSource[];
  poster?: string;
  title: string;
  onClose: () => void;
};

const ASPECT = 16 / 9;
const MINI_WIDTH = 384;
const MINI_MARGIN = 16;
/** Share of the viewport the expanded player may occupy. */
const EXPANDED_FILL = 0.96;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function VideoPlayerModal({
  open,
  sources,
  poster,
  title,
  onClose,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  // Set when the browser refused playback with sound, so we can offer a one-tap unmute
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const update = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const showControls = minimized || !playing || controlsVisible || scrubbing;

  const bumpControls = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = window.setTimeout(
      () => setControlsVisible(false),
      2800
    );
  }, []);

  useEffect(() => {
    if (!playing) {
      if (hideControlsTimer.current)
        window.clearTimeout(hideControlsTimer.current);
      setControlsVisible(true);
      return;
    }
    bumpControls();
    return () => {
      if (hideControlsTimer.current)
        window.clearTimeout(hideControlsTimer.current);
    };
  }, [playing, bumpControls]);

  // Start playback with sound; browsers that block it fall back to muted autoplay
  useEffect(() => {
    if (!open) return;
    const video = videoRef.current;
    if (!video) return;

    setMinimized(false);
    setAudioBlocked(false);
    setControlsVisible(true);
    try {
      video.currentTime = 0;
    } catch {
      /* metadata not ready yet — playback still starts from the beginning */
    }
    video.volume = volume;
    video.muted = false;

    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      setAudioBlocked(true);
      video.play().catch(() => setPlaying(false));
    });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) return;
    const video = videoRef.current;
    video?.pause();
    setPlaying(false);
  }, [open]);

  useEffect(() => {
    if (!open || minimized) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, minimized]);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  const handleClose = useCallback(() => {
    exitFullscreen();
    onClose();
  }, [exitFullscreen, onClose]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    if (!next && video.volume === 0) {
      video.volume = 1;
      setVolume(1);
    }
    setMuted(next);
    if (!next) setAudioBlocked(false);
  }, []);

  const seekBy = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(
      video.duration,
      Math.max(0, video.currentTime + delta)
    );
  }, []);

  const restart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    const root = rootRef.current;
    if (root?.requestFullscreen) {
      setMinimized(false);
      root.requestFullscreen().catch(() => {});
      return;
    }
    // iOS Safari only allows fullscreen on the video element itself
    const video = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    video?.webkitEnterFullscreen?.();
  }, []);

  const toggleMinimized = useCallback(() => {
    exitFullscreen();
    setMinimized((value) => !value);
  }, [exitFullscreen]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
        return;

      switch (event.key) {
        case "Escape":
          if (!document.fullscreenElement) handleClose();
          break;
        case " ":
        case "k":
        case "K":
          event.preventDefault();
          togglePlay();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "ArrowLeft":
          event.preventDefault();
          seekBy(-5);
          break;
        case "ArrowRight":
          event.preventDefault();
          seekBy(5);
          break;
        default:
          return;
      }
      bumpControls();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    open,
    handleClose,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    seekBy,
    bumpControls,
  ]);

  const seekToClientX = useCallback(
    (clientX: number) => {
      const bar = progressRef.current;
      const video = videoRef.current;
      if (!bar || !video || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width)
      );
      video.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    },
    [duration]
  );

  const frame = (() => {
    const { width: vw, height: vh } = viewport;
    if (minimized) {
      // Keep the mini player genuinely small next to narrow phone viewports
      const width = Math.min(MINI_WIDTH, Math.max(200, vw * 0.55));
      const height = width / ASPECT;
      return {
        width,
        height,
        x: vw - width - MINI_MARGIN,
        y: vh - height - MINI_MARGIN,
        radius: 14,
      };
    }
    const fill = isFullscreen ? 1 : EXPANDED_FILL;
    const width = Math.min(vw * fill, vh * fill * ASPECT);
    const height = width / ASPECT;
    return {
      width,
      height,
      x: (vw - width) / 2,
      y: (vh - height) / 2,
      radius: isFullscreen ? 0 : 16,
    };
  })();

  if (!mounted) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration ? (buffered / duration) * 100 : 0;

  const iconButton =
    "flex items-center justify-center rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-colors";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          key="video-modal"
          ref={rootRef}
          className={`fixed inset-0 z-[200] ${
            minimized ? "pointer-events-none" : ""
          }`}
        >
          <AnimatePresence>
            {!minimized && (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-navy-dark/95 backdrop-blur-sm"
                onClick={handleClose}
              />
            )}
          </AnimatePresence>

          <motion.div
            role="dialog"
            aria-modal={!minimized}
            aria-label={title}
            initial={{
              opacity: 0,
              scale: 0.94,
              x: frame.x,
              y: frame.y,
              width: frame.width,
              height: frame.height,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: frame.x,
              y: frame.y,
              width: frame.width,
              height: frame.height,
              borderRadius: frame.radius,
            }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.9 }}
            className="absolute top-0 left-0 overflow-hidden bg-black shadow-2xl shadow-navy-dark/60 ring-1 ring-white/10 pointer-events-auto"
            onPointerMove={bumpControls}
            onPointerDown={bumpControls}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full bg-black object-contain"
              playsInline
              preload="metadata"
              poster={poster}
              onClick={togglePlay}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onWaiting={() => setWaiting(true)}
              onPlaying={() => setWaiting(false)}
              onCanPlay={() => setWaiting(false)}
              onLoadedMetadata={(event) =>
                setDuration(event.currentTarget.duration || 0)
              }
              onDurationChange={(event) =>
                setDuration(event.currentTarget.duration || 0)
              }
              onTimeUpdate={(event) => {
                if (!scrubbing) setCurrentTime(event.currentTarget.currentTime);
              }}
              onProgress={(event) => {
                const video = event.currentTarget;
                if (video.buffered.length)
                  setBuffered(video.buffered.end(video.buffered.length - 1));
              }}
              onVolumeChange={(event) => {
                setMuted(event.currentTarget.muted);
                setVolume(event.currentTarget.volume);
              }}
            >
              {sources.map((source) => (
                <source key={source.src} src={source.src} type={source.type} />
              ))}
              Your browser does not support the video tag.
            </video>

            {waiting && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-white/80" />
              </div>
            )}

            {!playing && !waiting && (
              <button
                onClick={togglePlay}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center group"
              >
                <span
                  className={`flex items-center justify-center rounded-full bg-gold/90 text-navy shadow-xl transition-transform group-hover:scale-105 ${
                    minimized ? "h-12 w-12" : "h-16 w-16 sm:h-20 sm:w-20"
                  }`}
                >
                  <Play
                    className={minimized ? "ml-0.5 h-5 w-5" : "ml-1 h-7 w-7 sm:h-9 sm:w-9"}
                    fill="currentColor"
                  />
                </span>
              </button>
            )}

            {/* Top bar */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-black/75 to-transparent px-3 py-2.5 sm:px-4 sm:py-3"
                >
                  {!minimized && (
                    <p className="min-w-0 truncate pt-1 font-heading text-sm font-semibold text-white/90 sm:text-base">
                      {title}
                    </p>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={toggleMinimized}
                      aria-label={minimized ? "Expand player" : "Minimise player"}
                      title={minimized ? "Expand" : "Minimise"}
                      className={`${iconButton} h-8 w-8`}
                    >
                      {minimized ? (
                        <Maximize2 className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4.5 w-4.5" />
                      )}
                    </button>
                    <button
                      onClick={handleClose}
                      aria-label="Close video"
                      title="Close"
                      className={`${iconButton} h-8 w-8 hover:bg-red-500/80`}
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Unmute prompt when the browser blocked sound */}
            <AnimatePresence>
              {audioBlocked && muted && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  onClick={toggleMute}
                  className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy shadow-lg"
                >
                  <Volume2 className="h-4 w-4" />
                  Tap for sound
                </motion.button>
              )}
            </AnimatePresence>

            {/* Bottom controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2.5 pt-6 sm:px-4 sm:pb-3"
                >
                  <div
                    ref={progressRef}
                    role="slider"
                    tabIndex={0}
                    aria-label="Seek"
                    aria-valuemin={0}
                    aria-valuemax={Math.round(duration)}
                    aria-valuenow={Math.round(currentTime)}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      setScrubbing(true);
                      seekToClientX(event.clientX);
                    }}
                    onPointerMove={(event) => {
                      if (scrubbing) seekToClientX(event.clientX);
                    }}
                    onPointerUp={(event) => {
                      event.currentTarget.releasePointerCapture(event.pointerId);
                      setScrubbing(false);
                    }}
                    className="group relative flex h-4 w-full cursor-pointer items-center touch-none"
                  >
                    <div className="relative h-1 w-full rounded-full bg-white/25">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-white/35"
                        style={{ width: `${bufferedProgress}%` }}
                      />
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gold"
                        style={{ width: `${progress}%` }}
                      />
                      <span
                        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ left: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-1.5 flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={togglePlay}
                      aria-label={playing ? "Pause" : "Play"}
                      className={`${iconButton} h-8 w-8`}
                    >
                      {playing ? (
                        <Pause className="h-4.5 w-4.5" fill="currentColor" />
                      ) : (
                        <Play className="h-4.5 w-4.5" fill="currentColor" />
                      )}
                    </button>

                    {!minimized && (
                      <button
                        onClick={restart}
                        aria-label="Restart from the beginning"
                        title="Restart"
                        className={`${iconButton} hidden h-8 w-8 sm:flex`}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}

                    <div className="group/volume flex items-center">
                      <button
                        onClick={toggleMute}
                        aria-label={muted ? "Unmute" : "Mute"}
                        className={`${iconButton} h-8 w-8`}
                      >
                        {muted || volume === 0 ? (
                          <VolumeX className="h-4.5 w-4.5" />
                        ) : (
                          <Volume2 className="h-4.5 w-4.5" />
                        )}
                      </button>
                      {!minimized && (
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={muted ? 0 : volume}
                          aria-label="Volume"
                          onChange={(event) => {
                            const video = videoRef.current;
                            if (!video) return;
                            const next = Number(event.target.value);
                            video.volume = next;
                            video.muted = next === 0;
                            setVolume(next);
                            setMuted(next === 0);
                            if (next > 0) setAudioBlocked(false);
                          }}
                          className="ml-0.5 hidden h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 accent-gold transition-all duration-200 sm:block group-hover/volume:w-20 focus:w-20"
                        />
                      )}
                    </div>

                    <span className="ml-1 text-[11px] font-medium tabular-nums text-white/80 sm:text-xs">
                      {formatTime(currentTime)}
                      <span className="text-white/45"> / {formatTime(duration)}</span>
                    </span>

                    {!minimized && (
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          onClick={toggleMinimized}
                          aria-label="Minimise player"
                          title="Minimise"
                          className={`${iconButton} h-8 w-8`}
                        >
                          <Minimize2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={toggleFullscreen}
                          aria-label={
                            isFullscreen ? "Exit full screen" : "Full screen"
                          }
                          title={
                            isFullscreen ? "Exit full screen" : "Full screen"
                          }
                          className={`${iconButton} h-8 w-8`}
                        >
                          {isFullscreen ? (
                            <Minimize className="h-4.5 w-4.5" />
                          ) : (
                            <Maximize className="h-4.5 w-4.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
