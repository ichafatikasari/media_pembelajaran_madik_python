import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LaneIndex, RunnerAnimState } from '../types';
import { playWhooshSound, playJumpSound, playCoinSound, playCrashSound } from '../utils/sound';
import { ArrowLeft, ArrowRight, ArrowUp, Zap, Sparkles, Gauge } from 'lucide-react';

export type SpeedPreset = 'relaxed' | 'fast' | 'turbo';

export const SPEED_PRESETS: Record<SpeedPreset, { id: SpeedPreset; label: string; icon: string; base: number; distStep: number }> = {
  relaxed: { id: 'relaxed', label: 'Santai', icon: '🐢', base: 0.0075, distStep: 0.14 },
  fast: { id: 'fast', label: 'Cepat (Default)', icon: '⚡', base: 0.0095, distStep: 0.18 },
  turbo: { id: 'turbo', label: 'Super Cepat', icon: '🚀', base: 0.0120, distStep: 0.24 },
};

interface SubwayCanvasProps {
  studentName: string;
  isPaused: boolean;
  onTriggerQuiz: (coinsCollected: number, distanceRun?: number) => void;
  animState: RunnerAnimState;
  countdown?: 3 | 2 | 1 | 'GO!' | null;
}

interface TrackItem {
  id: number;
  type: 'coin' | 'barrier' | 'train' | 'quiz_gate';
  lane: LaneIndex;
  z: number; // 1.0 (horizon) -> 0.0 (camera/player)
  collected?: boolean;
}

export const SubwayCanvas: React.FC<SubwayCanvasProps> = ({
  studentName,
  isPaused,
  onTriggerQuiz,
  animState,
  countdown = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Runner state
  const [currentLane, setCurrentLane] = useState<LaneIndex>(1); // Start in center (lane 1)
  const laneRef = useRef<LaneIndex>(1);
  laneRef.current = currentLane;

  const [coinsCount, setCoinsCount] = useState(0);
  const coinsRef = useRef(0);
  coinsRef.current = coinsCount;

  const [distanceRun, setDistanceRun] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);

  // User adjustable speed preset (Default: 'fast' = 0.0095 sedikit lebih cepat & seru)
  const [speedPreset, setSpeedPreset] = useState<SpeedPreset>(() => {
    try {
      const saved = localStorage.getItem('subway_speed_preset') as SpeedPreset;
      if (saved && SPEED_PRESETS[saved]) return saved;
    } catch {}
    return 'fast';
  });
  const speedPresetRef = useRef<SpeedPreset>(speedPreset);
  speedPresetRef.current = speedPreset;

  const handleSelectSpeed = (preset: SpeedPreset) => {
    setSpeedPreset(preset);
    speedPresetRef.current = preset;
    try {
      localStorage.setItem('subway_speed_preset', preset);
    } catch {}
    stateRef.current.speed = SPEED_PRESETS[preset].base;
  };

  const cycleSpeed = () => {
    const list: SpeedPreset[] = ['relaxed', 'fast', 'turbo'];
    const nextIdx = (list.indexOf(speedPresetRef.current) + 1) % list.length;
    handleSelectSpeed(list[nextIdx]);
  };

  // Physics & Animation internal refs
  const stateRef = useRef({
    laneX: 1, // continuous for smooth lane lerp (0.0 to 2.0)
    targetLane: 1 as LaneIndex,
    isJumping: false,
    jumpTimer: 0,
    jumpY: 0,
    speed: 0.0095, // Kecepatan lari brisk & seru (0.0095), melambat otomatis saat dekat rintangan
    distance: 0,
    tick: 0,
    runTick: 0,
    items: [] as TrackItem[],
    nextItemId: 1,
    spawnDistance: 0,
    hasTriggeredQuiz: false,
    quizGateSpawned: false,
  });

  // Touch gesture swipe detection
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Lane movement functions
  const moveLeft = useCallback(() => {
    if (isPaused || stateRef.current.hasTriggeredQuiz) return;
    setCurrentLane((prev) => {
      const next = (prev > 0 ? prev - 1 : 0) as LaneIndex;
      if (next !== prev) {
        stateRef.current.targetLane = next;
        playWhooshSound();
      }
      return next;
    });
  }, [isPaused]);

  const moveRight = useCallback(() => {
    if (isPaused || stateRef.current.hasTriggeredQuiz) return;
    setCurrentLane((prev) => {
      const next = (prev < 2 ? prev + 1 : 2) as LaneIndex;
      if (next !== prev) {
        stateRef.current.targetLane = next;
        playWhooshSound();
      }
      return next;
    });
  }, [isPaused]);

  const jump = useCallback(() => {
    if (isPaused || stateRef.current.hasTriggeredQuiz) return;
    if (!stateRef.current.isJumping) {
      stateRef.current.isJumping = true;
      stateRef.current.jumpTimer = 0;
      playJumpSound();
    }
  }, [isPaused]);

  // Reset state on new student (Generous coin runway, obstacles only spawn after student gets used to controls)
  useEffect(() => {
    setCurrentLane(1);
    setCoinsCount(0);
    setDistanceRun(0);
    setCurrentMultiplier(1.0);
    stateRef.current = {
      laneX: 1,
      targetLane: 1,
      isJumping: false,
      jumpTimer: 0,
      jumpY: 0,
      speed: SPEED_PRESETS[speedPresetRef.current || 'fast'].base, // Kecepatan lari aktif (Default 0.0095 - sedikit lebih cepat & seru)
      distance: 0,
      tick: 0,
      runTick: 0,
      items: [
        // Runway awal: Hanya KOIN EMAS untuk latihan geser kiri/kanan & lompat tanpa takut mati!
        { id: 1, type: 'coin', lane: 1, z: 0.28 },
        { id: 2, type: 'coin', lane: 1, z: 0.42 },
        { id: 3, type: 'coin', lane: 1, z: 0.56 },
        { id: 4, type: 'coin', lane: 0, z: 0.68 },
        { id: 5, type: 'coin', lane: 0, z: 0.82 },
        { id: 6, type: 'coin', lane: 2, z: 0.68 },
        { id: 7, type: 'coin', lane: 2, z: 0.82 },
        { id: 8, type: 'coin', lane: 1, z: 0.94 },
      ],
      nextItemId: 9,
      spawnDistance: 0,
      hasTriggeredQuiz: false,
      quizGateSpawned: false,
    };
  }, [studentName]);

  // Keyboard controls listener (Laptop teacher)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        moveLeft();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        moveRight();
      } else if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, moveLeft, moveRight, jump]);

  // Touch Swipe Handlers for Smartboard
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;

    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    // Minimum distance threshold for a swipe
    const minSwipe = 35;

    if (dt < 500) {
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx < -minSwipe) {
          moveLeft();
        } else if (dx > minSwipe) {
          moveRight();
        }
      } else {
        // Vertical swipe upward
        if (dy < -minSwipe) {
          jump();
        }
      }
    }
    touchStartRef.current = null;
  };

  // Main Subway 60 FPS Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const s = stateRef.current;
      s.tick++;

      // Canvas dimensions
      const width = canvas.width;
      const height = canvas.height;
      const horizonY = height * 0.32;
      const horizonX = width * 0.5;

      // 1. UPDATE PHYSICS (ONLY when actively running after GO!)
      const isRunning = !isPaused && !s.hasTriggeredQuiz && animState === 'running';

      if (isRunning) {
        s.runTick++;
        const curPreset = SPEED_PRESETS[speedPresetRef.current || 'fast'];

        // ==============================================================
        // DYNAMIC SPEED ACCELERATION WITH DISTANCE SURVIVED
        // "semakin jauh tidak terkena rintangan tambahkan kecepatan"
        // "semakin lama tidak game over, semakin cepat juga"
        // Kecepatan awal tetap standar (1.0x), bertambah seiring jarak bertahan!
        // ==============================================================
        const distBeyondWarmup = Math.max(0, s.distance - 25);
        // Multiplier naik bertahap dari 1.0x hingga maks ~1.85x
        const speedMultiplier = 1.0 + Math.min(0.85, (distBeyondWarmup / 180) * 0.85);

        s.speed = curPreset.base * speedMultiplier;
        s.distance += curPreset.distStep * speedMultiplier;

        if (s.runTick % 6 === 0) {
          setDistanceRun(Math.floor(s.distance));
          setCurrentMultiplier(Math.round(speedMultiplier * 10) / 10);
        }

        // Smooth lane interpolation (lerp)
        const targetX = s.targetLane;
        s.laneX += (targetX - s.laneX) * 0.22;

        // Jump physics (Snappy & floaty arcade jump)
        if (s.isJumping) {
          s.jumpTimer++;
          const jumpDuration = 30;
          const progress = s.jumpTimer / jumpDuration;
          if (progress >= 1) {
            s.isJumping = false;
            s.jumpY = 0;
            s.jumpTimer = 0;
          } else {
            // High springy jump arc
            s.jumpY = Math.sin(progress * Math.PI) * 82;
          }
        }

        // Advance track items toward player (z: 1 -> 0)
        for (let i = s.items.length - 1; i >= 0; i--) {
          const item = s.items[i];
          item.z -= s.speed;

          // Check interaction when item is close to runner (z around 0.15 - 0.02)
          if (item.z <= 0.15 && item.z >= 0.02) {
            // Horizontal overlap check: runner lane vs item lane
            const runnerLane = Math.round(s.laneX);

            if (item.type === 'coin' && !item.collected) {
              if (runnerLane === item.lane) {
                item.collected = true;
                coinsRef.current += 1;
                setCoinsCount(coinsRef.current);
                playCoinSound();
              }
            } else if (item.type === 'barrier') {
              // Barrier can be jumped over! (If not jumping or jump too low, crash!)
              if (runnerLane === item.lane && (!s.isJumping || s.jumpY < 32)) {
                s.hasTriggeredQuiz = true;
                playCrashSound();
                setTimeout(() => {
                  onTriggerQuiz(coinsRef.current, Math.floor(s.distance));
                }, 350);
              }
            } else if (item.type === 'train') {
              // Train CANNOT be jumped over! Must switch lane!
              if (runnerLane === item.lane) {
                s.hasTriggeredQuiz = true;
                playCrashSound();
                setTimeout(() => {
                  onTriggerQuiz(coinsRef.current, Math.floor(s.distance));
                }, 350);
              }
            } else if (item.type === 'quiz_gate') {
              // KOTAK SOAL TEORI PYTHON: HANYA kena jika runner berada di jalur yang sama!
              // Jika siswa geser ke kiri atau ke kanan menjauhi kotak soal, SISWA SELAMAT dan tidak game over!
              if (runnerLane === item.lane) {
                s.hasTriggeredQuiz = true;
                playCrashSound();
                setTimeout(() => {
                  onTriggerQuiz(coinsRef.current, Math.floor(s.distance));
                }, 350);
              }
            }
          }

          // Remove items behind camera
          if (item.z < -0.05) {
            s.items.splice(i, 1);
          }
        }

        // Spawning Track Items dengan frekuensi & kepadatan yang meningkat seiring jarak
        // "semakin banyak rintangannya"
        const spawnThreshold = Math.max(0.30, 0.44 - Math.min(0.14, (distBeyondWarmup / 200) * 0.14));

        s.spawnDistance += s.speed;
        if (s.spawnDistance > spawnThreshold) {
          s.spawnDistance = 0;

          if (s.distance < 25) {
            // FASE AWAL 0 - 25 METER: 100% LINTASAN KOIN AMAN!
            // Bebas dari rintangan mematikan agar siswa menikmati lari & membiasakan tombol!
            const cLane = Math.floor(Math.random() * 3) as LaneIndex;
            s.items.push({ id: s.nextItemId++, type: 'coin', lane: cLane, z: 1.0 });
            s.items.push({ id: s.nextItemId++, type: 'coin', lane: ((cLane + 1) % 3) as LaneIndex, z: 1.0 });
          } else {
            // SETELAH 25 METER: Rintangan bermunculan & semakin banyak seiring jarak!
            const rand = Math.random();
            const rLane = Math.floor(Math.random() * 3) as LaneIndex; // 0, 1, 2
            const laneB = ((rLane + 1) % 3) as LaneIndex;
            const laneC = ((rLane + 2) % 3) as LaneIndex;

            // Peluang rintangan ganda (2 jalur tertutup, 1 jalur aman / bisa dilompati)
            // Di atas 60m: 35% peluang
            // Di atas 120m: 60% peluang rintangan padat
            const dualHazardChance = s.distance >= 120 ? 0.60 : s.distance >= 60 ? 0.35 : 0.0;

            if (Math.random() < dualHazardChance) {
              // --- RINTANGAN GANDA (DUAL-LANE HAZARD) ---
              // Menghadirkan tantangan refleks tinggi khas Subway Surfers
              const comboType = Math.random();
              if (comboType < 0.38) {
                // Kereta di Lane A, Pagar di Lane B, Lane C koin emas aman!
                s.items.push({ id: s.nextItemId++, type: 'train', lane: rLane, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'barrier', lane: laneB, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: laneC, z: 1.0 });
              } else if (comboType < 0.68) {
                // Dua Pagar di 2 jalur (bisa dilompati atau beralih ke Lane C)
                s.items.push({ id: s.nextItemId++, type: 'barrier', lane: rLane, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'barrier', lane: laneB, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: laneC, z: 1.0 });
              } else {
                // Kotak Soal di Lane A, Kereta di Lane B, Koin di Lane C
                s.items.push({ id: s.nextItemId++, type: 'quiz_gate', lane: rLane, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'train', lane: laneB, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: laneC, z: 1.0 });
              }
            } else {
              // --- RINTANGAN TUNGGAL DENGAN 2 JALUR AMAN ---
              if (rand < 0.32) {
                // Pagar di 1 jalur, 2 jalur lain koin
                s.items.push({ id: s.nextItemId++, type: 'barrier', lane: rLane, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: laneB, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: laneC, z: 1.0 });
              } else if (rand < 0.60) {
                // Kereta Subway di 1 jalur, 2 jalur lain aman
                s.items.push({ id: s.nextItemId++, type: 'train', lane: rLane, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: laneB, z: 1.0 });
              } else if (rand < 0.82) {
                // Kotak Soal Teori Python di 1 jalur
                s.items.push({ id: s.nextItemId++, type: 'quiz_gate', lane: rLane, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: laneB, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: laneC, z: 1.0 });
              } else {
                // Koin bonus berjejer di 2 jalur
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: rLane, z: 1.0 });
                s.items.push({ id: s.nextItemId++, type: 'coin', lane: laneB, z: 1.0 });
              }
            }
          }
        }
      }

      // 2. RENDER GRAPHICS (SUBWAY 3D PERSPECTIVE)
      // Sky & City Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#1e293b'); // Dark evening subway sky
      skyGrad.addColorStop(0.5, '#334155');
      skyGrad.addColorStop(1, '#f97316'); // Sunset glow
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Distant City Skyline & Billboards
      drawSkyline(ctx, width, horizonY);

      // Subway Tunnel / Tracks Ground
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      groundGrad.addColorStop(0, '#475569');
      groundGrad.addColorStop(0.3, '#334155');
      groundGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Track Perspective Math
      // Bottom track widths
      const bottomSpread = width * 0.78;
      const bottomTrackLeft = (width - bottomSpread) / 2;
      const bottomTrackRight = bottomTrackLeft + bottomSpread;

      // Horizon track widths
      const topSpread = 50;
      const topTrackLeft = horizonX - topSpread / 2;
      const topTrackRight = horizonX + topSpread / 2;

      // Draw Gravel Ballast & Tunnel Rails (sleepers only move with s.runTick!)
      drawSubwayTracks(ctx, s.runTick, horizonX, horizonY, topSpread, bottomTrackLeft, bottomTrackRight, height);

      // Subway Tunnel Walls & Graffiti
      drawTunnelWalls(ctx, width, height, horizonY);

      // Overhead Subway Cables & Gantry Bars (only move with s.runTick!)
      drawOverheadGantry(ctx, s.runTick, width, horizonX, horizonY, height);

      // 3. SORT & DRAW TRACK ITEMS (Back to Front: z from 1.0 down to 0.0)
      const sortedItems = [...s.items].sort((a, b) => b.z - a.z);

      for (const item of sortedItems) {
        const itemX = getTrackX(item.lane, item.z, horizonX, bottomTrackLeft, bottomSpread);
        const itemY = horizonY + (height - horizonY) * Math.pow(1 - item.z, 1.4);
        const scale = Math.max(0.15, Math.pow(1 - item.z, 1.2));

        if (item.type === 'coin' && !item.collected) {
          drawSubwayCoin(ctx, itemX, itemY - 20 * scale, scale, s.runTick || s.tick);
        } else if (item.type === 'barrier') {
          drawBarrier(ctx, itemX, itemY, scale);
        } else if (item.type === 'train') {
          drawSubwayTrain(ctx, itemX, itemY, scale, s.runTick || s.tick);
        } else if (item.type === 'quiz_gate') {
          drawQuizGate(ctx, itemX, itemY, scale, s.runTick || s.tick);
        }
      }

      // 4. DRAW SUBWAY RUNNER CHARACTER
      // Player is positioned at z ≈ 0.05
      const playerZ = 0.05;
      const playerX = getTrackX(s.laneX, playerZ, horizonX, bottomTrackLeft, bottomSpread);
      const playerBaseY = horizonY + (height - horizonY) * Math.pow(1 - playerZ, 1.4);
      const playerScale = 1.05;

      drawSubwayRunner(
        ctx,
        playerX,
        playerBaseY - s.jumpY,
        playerBaseY,
        playerScale,
        s.runTick,
        s.tick,
        s.isJumping,
        animState,
        s.hasTriggeredQuiz,
        isPaused
      );

      // Continue Loop
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, onTriggerQuiz, animState]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 3D Subway Canvas Frame */}
      <div
        className="relative w-full overflow-hidden rounded-3xl border-4 border-amber-500 shadow-2xl bg-slate-950 select-none touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* TOP HUD: Classroom Projector Info */}
        <div className="absolute top-0 left-0 right-0 z-10 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-black/85 backdrop-blur-md border-b-2 border-amber-500/60 text-white font-['Press_Start_2P'] text-xs sm:text-sm">
          {/* Track Name */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-amber-400 text-xs sm:text-sm">SUBWAY PYTHON</span>
          </div>

          {/* Active Student Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-3.5 py-1.5 rounded-xl border border-amber-300 shadow">
            <span className="text-amber-200 text-[10px] sm:text-xs">SISWA:</span>
            <span className="text-white font-black tracking-wide uppercase text-xs sm:text-sm truncate max-w-[140px] sm:max-w-[220px]">
              {studentName || 'SISWA'}
            </span>
          </div>

          {/* Stats: Coins, Distance & Progress Bar */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-yellow-300 bg-black/50 px-2.5 py-1 rounded-lg border border-yellow-500/30">
              <span className="text-base">🪙</span>
              <span className="font-bold">{coinsCount}</span>
            </div>
            
            {/* Distance & Level Milestone Progress */}
            <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-lg border border-white/20">
              <span className="text-slate-300 hidden md:inline">JARAK:</span>
              <span className="text-white font-bold">{distanceRun}m</span>
              <div className="w-14 sm:w-20 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-amber-400/50" title={`Level ${Math.floor(distanceRun / 100) + 1} (${distanceRun % 100}/100m)`}>
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-500 transition-all duration-200"
                  style={{ width: `${Math.min(100, Math.max(8, distanceRun % 100))}%` }}
                />
              </div>
            </div>

            {/* Dynamic Speed Multiplier Badge */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-xs transition-all shadow ${
                currentMultiplier >= 1.5 
                  ? 'bg-rose-600/95 text-white border-rose-300 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]' 
                  : currentMultiplier >= 1.25 
                  ? 'bg-orange-500/90 text-white border-orange-300 shadow-md' 
                  : 'bg-amber-500/80 text-slate-950 border-amber-300'
              }`}
              title="Kecepatan otomatis bertambah semakin jauh kamu bertahan tanpa game over!"
            >
              <span>{currentMultiplier >= 1.5 ? '🔥' : currentMultiplier >= 1.2 ? '⚡' : '🏃'}</span>
              <span className="font-['Press_Start_2P'] text-[9px] sm:text-[10px]">
                {currentMultiplier.toFixed(1)}x
              </span>
              <span className="text-[10px] font-sans uppercase font-black hidden lg:inline">
                {currentMultiplier >= 1.5 ? 'HIPER!' : currentMultiplier >= 1.25 ? 'TURBO' : 'SPEED'}
              </span>
            </div>

            {/* Speed Quick Toggle */}
            <button
              type="button"
              onClick={cycleSpeed}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-slate-950 font-sans font-black px-2.5 py-1 rounded-lg border border-yellow-200 shadow transition-all cursor-pointer select-none"
              title="Klik untuk ubah kecepatan lari (Santai / Cepat / Super Cepat)"
            >
              <Gauge className="w-3.5 h-3.5 text-slate-950" />
              <span className="text-[11px] whitespace-nowrap">
                {SPEED_PRESETS[speedPreset].icon} {SPEED_PRESETS[speedPreset].label}
              </span>
            </button>
          </div>
        </div>

        {/* Arcade Countdown Overlay (3, 2, 1, GO!) */}
        {countdown && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none select-none transition-all">
            {/* Student Name Announcement */}
            <div className="mb-2 px-5 py-1.5 rounded-full bg-slate-900/90 border-2 border-amber-400 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xl">
              <span>🏃 SIAPKAN JARI! Giliran: <span className="text-white underline">{studentName}</span></span>
            </div>

            {/* Pulsating Glow + Giant Number */}
            <div className="relative flex items-center justify-center my-1">
              <div 
                className={`absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full blur-2xl opacity-75 animate-ping ${
                  countdown === 'GO!' ? 'bg-emerald-500' : countdown === 1 ? 'bg-cyan-400' : countdown === 2 ? 'bg-amber-400' : 'bg-rose-500'
                }`} 
              />
              <div 
                key={String(countdown)}
                className={`relative font-['Press_Start_2P'] font-black tracking-wider transition-transform drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] ${
                  countdown === 'GO!' 
                    ? 'text-5xl sm:text-7xl md:text-8xl text-emerald-400 scale-110 drop-shadow-[0_0_35px_rgba(52,211,153,0.95)]' 
                    : countdown === 1
                    ? 'text-6xl sm:text-8xl md:text-9xl text-cyan-300 drop-shadow-[0_0_35px_rgba(103,232,249,0.95)]'
                    : countdown === 2
                    ? 'text-6xl sm:text-8xl md:text-9xl text-yellow-300 drop-shadow-[0_0_35px_rgba(253,224,71,0.95)]'
                    : 'text-6xl sm:text-8xl md:text-9xl text-rose-500 drop-shadow-[0_0_35px_rgba(244,63,94,0.95)]'
                }`}
              >
                {countdown}
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="mt-2 px-4 py-1.5 rounded-xl bg-slate-900/85 border border-slate-700 text-slate-300 text-[11px] sm:text-xs text-center max-w-sm">
              {countdown === 'GO!' ? (
                <span className="text-emerald-300 font-bold flex items-center gap-1.5 justify-center">
                  <Zap className="w-3.5 h-3.5" /> LARI & HINDARI RINTANGAN SEKARANG!
                </span>
              ) : (
                <span>Panah Keyboard (Laptop) atau Sentuh Tombol Layar (Smartboard)</span>
              )}
            </div>
          </div>
        )}

        {/* Central Dynamic Phase Banner */}
        {!isPaused && !countdown && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full shadow-lg border-2 text-xs sm:text-sm font-bold flex items-center gap-2 pointer-events-none whitespace-nowrap transition-all duration-300"
            style={{
              backgroundColor: currentMultiplier >= 1.5 
                ? 'rgba(225, 29, 72, 0.95)' // rose red for hyper speed
                : currentMultiplier >= 1.25 
                ? 'rgba(234, 88, 12, 0.95)' // orange for turbo
                : distanceRun >= 25 
                ? 'rgba(245, 158, 11, 0.95)' // amber
                : 'rgba(16, 185, 129, 0.95)', // emerald for safe
              borderColor: currentMultiplier >= 1.5 ? '#fda4af' : currentMultiplier >= 1.25 ? '#fdba74' : distanceRun >= 25 ? '#fbbf24' : '#6ee7b7',
              color: '#ffffff'
            }}
          >
            <Sparkles className="w-4 h-4 text-white animate-spin" />
            <span>
              {distanceRun < 25
                ? '🪙 LINTASAN KOIN AMAN! Latihan Geser Kiri / Kanan & Lompat!'
                : distanceRun < 60
                ? `⚡ KECEPATAN: ${currentMultiplier.toFixed(1)}x! Hindari Rintangan & Tabrak Kotak Soal ❓`
                : distanceRun < 120
                ? `🔥 TURBO SPRINT (${currentMultiplier.toFixed(1)}x)! Rintangan Semakin Banyak & Rapat!`
                : `🚀 HIPER SPEED (${currentMultiplier.toFixed(1)}x)! Rintangan Ganda, Bertahan Terus!`}
            </span>
          </div>
        )}

        {/* Lane Indicator Tag */}
        <div className="absolute bottom-3 left-4 z-10 px-3 py-1 bg-black/75 rounded-lg border border-white/20 text-white font-['Press_Start_2P'] text-[10px] hidden sm:block">
          JALUR: {currentLane === 0 ? '◀ KIRI' : currentLane === 1 ? '● TENGAH' : 'KANAN ▶'}
        </div>

        {/* Main HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={960}
          height={480}
          className="w-full h-auto block aspect-[16/8] sm:aspect-[16/7.8] object-cover cursor-grab"
        />
      </div>

      {/* ============================================================== */}
      {/* VIRTUAL SMARTBOARD & TOUCHSCREEN CONTROLLER BUTTONS */}
      {/* (Designed with HUGE, finger-friendly dimensions for classroom displays) */}
      {/* ============================================================== */}
      <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-4 border-amber-400 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left & Right Lane Switch Buttons */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center">
          {/* Button: JALUR KIRI */}
          <button
            type="button"
            onClick={moveLeft}
            disabled={isPaused}
            className="w-24 sm:w-28 h-18 sm:h-22 rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-sm sm:text-base border-4 border-amber-500 bg-gradient-to-b from-amber-100 to-amber-200 text-amber-950 shadow-lg active:scale-95 active:bg-amber-300 hover:border-amber-600 transition-all cursor-pointer select-none disabled:opacity-50"
            title="Pindah ke Jalur Kiri"
          >
            <ArrowLeft className="w-8 h-8 sm:w-9 sm:h-9 text-amber-900" />
            <span className="font-['Press_Start_2P'] text-[10px] sm:text-xs">KIRI</span>
          </button>

          {/* Button: JALUR KANAN */}
          <button
            type="button"
            onClick={moveRight}
            disabled={isPaused}
            className="w-24 sm:w-28 h-18 sm:h-22 rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-sm sm:text-base border-4 border-amber-500 bg-gradient-to-b from-amber-100 to-amber-200 text-amber-950 shadow-lg active:scale-95 active:bg-amber-300 hover:border-amber-600 transition-all cursor-pointer select-none disabled:opacity-50"
            title="Pindah ke Jalur Kanan"
          >
            <ArrowRight className="w-8 h-8 sm:w-9 sm:h-9 text-amber-900" />
            <span className="font-['Press_Start_2P'] text-[10px] sm:text-xs">KANAN</span>
          </button>
        </div>

        {/* Center: Instruction badge for Laptop & Smartboard */}
        <div className="text-center text-xs font-semibold text-slate-700 bg-amber-50/80 px-4 py-2.5 rounded-2xl border border-amber-200 max-w-sm">
          <div className="font-bold text-slate-900 flex items-center justify-center gap-1.5 mb-1">
            <Zap className="w-4 h-4 text-orange-600" />
            <span>DUAL KONTROL: LAPTOP & SMARTBOARD</span>
          </div>
          <div className="text-[11px] text-slate-600 mb-2">
            • <strong>Laptop:</strong> Panah Keyboard ◀ ▶ & ▲ / SPASI<br />
            • <strong>Smartboard:</strong> Tap tombol besar di atas atau <em>Swipe</em> layar!
          </div>

          {/* Quick Speed Selector Pills */}
          <div className="pt-1.5 border-t border-amber-200 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-0.5">
              <Gauge className="w-3 h-3 text-amber-600" /> SPEED:
            </span>
            {(['relaxed', 'fast', 'turbo'] as SpeedPreset[]).map((key) => {
              const preset = SPEED_PRESETS[key];
              const isActive = speedPreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectSpeed(key)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                      : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-200'
                  }`}
                  title={`Pilih kecepatan ${preset.label}`}
                >
                  {preset.icon} {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Giant Jump Button */}
        <div className="w-full md:w-auto flex justify-center">
          <button
            type="button"
            onClick={jump}
            disabled={isPaused}
            className="w-full sm:w-52 h-18 sm:h-22 rounded-2xl flex items-center justify-center gap-3 font-black text-base sm:text-xl border-4 border-orange-600 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xl active:scale-95 transition-all cursor-pointer select-none disabled:opacity-50"
            title="Lompat Menghindari Pagar"
          >
            <ArrowUp className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="font-['Press_Start_2P'] text-xs sm:text-sm tracking-wider">LOMPAT!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// CANVAS RENDERING HELPER FUNCTIONS
// =========================================================================

// Calculate track X position for a given lane (0, 1, 2) at depth z (1 = horizon, 0 = screen bottom)
function getTrackX(lane: number, z: number, horizonX: number, bottomTrackLeft: number, bottomSpread: number): number {
  const topSpread = 50;
  // interpolate between top horizon lane and bottom screen lane
  const topX = horizonX + (lane - 1) * (topSpread / 2);
  const bottomX = bottomTrackLeft + (lane + 0.5) * (bottomSpread / 3);
  return topX + (bottomX - topX) * Math.pow(1 - z, 1.4);
}

// Draw Distant City Skyline & Billboards
function drawSkyline(ctx: CanvasRenderingContext2D, width: number, horizonY: number) {
  ctx.save();
  // Buildings silhouette
  ctx.fillStyle = '#0f172a';
  const buildings = [
    { x: 20, w: 60, h: 70 },
    { x: 90, w: 45, h: 90 },
    { x: 145, w: 75, h: 55 },
    { x: 230, w: 50, h: 80 },
    { x: 290, w: 65, h: 100 },
    { x: 610, w: 55, h: 85 },
    { x: 675, w: 70, h: 60 },
    { x: 755, w: 45, h: 95 },
    { x: 810, w: 80, h: 65 },
    { x: 900, w: 50, h: 80 },
  ];

  for (const b of buildings) {
    ctx.fillRect(b.x, horizonY - b.h, b.w, b.h);
    // Tiny building window lights
    ctx.fillStyle = '#fbbf24';
    for (let wy = horizonY - b.h + 10; wy < horizonY - 10; wy += 14) {
      for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 12) {
        if ((wx + wy) % 5 !== 0) {
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
    }
    ctx.fillStyle = '#0f172a';
  }

  // Glowing Python Billboard in Center Horizon
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(width / 2 - 85, horizonY - 55, 170, 32);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(width / 2 - 85, horizonY - 55, 170, 32);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 9px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PYTHON SUBWAY', width / 2, horizonY - 38);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 8px monospace';
  ctx.fillText('print("Hello World")', width / 2, horizonY - 26);

  ctx.restore();
}

// Draw Subway 3-Rail Tracks with Moving Sleepers
function drawSubwayTracks(
  ctx: CanvasRenderingContext2D,
  tick: number,
  horizonX: number,
  horizonY: number,
  topSpread: number,
  bottomTrackLeft: number,
  bottomTrackRight: number,
  height: number
) {
  ctx.save();

  // Moving wooden ties (sleepers) across all 3 lanes
  const numSleepers = 22;
  const speedOffset = (tick * 0.016) % (1 / numSleepers);

  for (let i = 0; i < numSleepers; i++) {
    const rawZ = 1 - (i / numSleepers + speedOffset);
    if (rawZ > 0.02 && rawZ < 0.98) {
      const z = rawZ;
      const y = horizonY + (height - horizonY) * Math.pow(1 - z, 1.4);
      const leftX = horizonX - (topSpread / 2) + (bottomTrackLeft - (horizonX - topSpread / 2)) * Math.pow(1 - z, 1.4);
      const rightX = horizonX + (topSpread / 2) + (bottomTrackRight - (horizonX + topSpread / 2)) * Math.pow(1 - z, 1.4);
      const tieHeight = Math.max(2, 8 * Math.pow(1 - z, 1.4));

      // Wooden sleeper color
      ctx.fillStyle = '#422006';
      ctx.fillRect(leftX, y, rightX - leftX, tieHeight);

      // Sleeper shadow
      ctx.fillStyle = '#1c0d02';
      ctx.fillRect(leftX, y + tieHeight, rightX - leftX, 2);
    }
  }

  // Draw 4 longitudinal metallic rail tracks (creating 3 lanes between them)
  const bottomSpread = bottomTrackRight - bottomTrackLeft;
  for (let r = 0; r <= 3; r++) {
    const topX = horizonX + (r - 1.5) * (topSpread / 3);
    const bottomX = bottomTrackLeft + r * (bottomSpread / 3);

    ctx.beginPath();
    ctx.moveTo(topX, horizonY);
    ctx.lineTo(bottomX, height);
    ctx.strokeStyle = '#cbd5e1'; // Silver metallic rail
    ctx.lineWidth = 4;
    ctx.stroke();

    // Rail highlight
    ctx.beginPath();
    ctx.moveTo(topX, horizonY);
    ctx.lineTo(bottomX, height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}

// Draw Tunnel walls & graffiti
function drawTunnelWalls(ctx: CanvasRenderingContext2D, width: number, height: number, horizonY: number) {
  ctx.save();
  // Left wall
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width * 0.1, horizonY);
  ctx.lineTo(width * 0.08, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Right wall
  ctx.beginPath();
  ctx.moveTo(width, 0);
  ctx.lineTo(width * 0.9, horizonY);
  ctx.lineTo(width * 0.92, height);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Graffiti on walls
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#f43f5e';
  ctx.save();
  ctx.translate(30, horizonY + 120);
  ctx.rotate(-Math.PI / 12);
  ctx.fillText('CODE', 0, 0);
  ctx.restore();

  ctx.fillStyle = '#06b6d4';
  ctx.save();
  ctx.translate(width - 90, horizonY + 130);
  ctx.rotate(Math.PI / 12);
  ctx.fillText('PY', 0, 0);
  ctx.restore();

  ctx.restore();
}

// Overhead Subway electrical cables and gantry
function drawOverheadGantry(
  ctx: CanvasRenderingContext2D,
  tick: number,
  width: number,
  horizonX: number,
  horizonY: number,
  height: number
) {
  ctx.save();
  // Overhead wires from vanishing point
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(horizonX, horizonY - 30);
  ctx.lineTo(width * 0.2, 0);
  ctx.moveTo(horizonX, horizonY - 30);
  ctx.lineTo(width * 0.8, 0);
  ctx.stroke();

  // Moving gantry bar
  const gantryZ = 1 - ((tick * 0.008) % 1);
  if (gantryZ > 0.1 && gantryZ < 0.95) {
    const y = horizonY - 30 + (height * 0.3) * Math.pow(1 - gantryZ, 1.4);
    const span = 140 + (width * 0.6) * Math.pow(1 - gantryZ, 1.4);

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4 * (1 - gantryZ);
    ctx.beginPath();
    ctx.moveTo(horizonX - span / 2, y);
    ctx.lineTo(horizonX + span / 2, y);
    ctx.stroke();
  }
  ctx.restore();
}

// Draw Golden Python Coin
function drawSubwayCoin(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, tick: number) {
  ctx.save();
  const radius = 18 * scale;
  const spin = Math.sin(tick * 0.2);

  // Outer gold circle with spin ellipse
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(3, radius * Math.abs(spin)), radius, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Python logo / P icon inside coin
  if (Math.abs(spin) > 0.4) {
    ctx.fillStyle = '#78350f';
    ctx.font = `bold ${Math.floor(16 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐍', x, y);
  }
  ctx.restore();
}

// Draw Subway Barrier / Hurdle
function drawBarrier(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  const w = 70 * scale;
  const h = 42 * scale;
  const drawX = x - w / 2;
  const drawY = y - h;

  // Barrier legs
  ctx.fillStyle = '#334155';
  ctx.fillRect(drawX + 6 * scale, drawY + 8 * scale, 6 * scale, h - 8 * scale);
  ctx.fillRect(drawX + w - 12 * scale, drawY + 8 * scale, 6 * scale, h - 8 * scale);

  // Horizontal striped bar
  ctx.fillStyle = '#ef4444'; // Red base
  ctx.fillRect(drawX, drawY, w, 16 * scale);

  // White reflective warning stripes
  ctx.fillStyle = '#ffffff';
  for (let sx = drawX + 4 * scale; sx < drawX + w; sx += 16 * scale) {
    ctx.beginPath();
    ctx.moveTo(sx, drawY);
    ctx.lineTo(sx + 8 * scale, drawY);
    ctx.lineTo(sx + 4 * scale, drawY + 16 * scale);
    ctx.lineTo(sx - 4 * scale, drawY + 16 * scale);
    ctx.closePath();
    ctx.fill();
  }

  // Border outline
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(drawX, drawY, w, 16 * scale);

  ctx.restore();
}

// Draw Subway Train Car (Approaching)
function drawSubwayTrain(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, tick: number) {
  ctx.save();
  const w = 84 * scale;
  const h = 100 * scale;
  const drawX = x - w / 2;
  const drawY = y - h;

  // Train body (Subway blue/red)
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.roundRect(drawX, drawY, w, h, [12 * scale, 12 * scale, 2 * scale, 2 * scale]);
  ctx.fill();

  // Train front window windshield
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(drawX + 8 * scale, drawY + 14 * scale, w - 16 * scale, 34 * scale);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(drawX + 8 * scale, drawY + 14 * scale, w - 16 * scale, 34 * scale);

  // Windshield reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.moveTo(drawX + 12 * scale, drawY + 16 * scale);
  ctx.lineTo(drawX + 34 * scale, drawY + 16 * scale);
  ctx.lineTo(drawX + 20 * scale, drawY + 44 * scale);
  ctx.closePath();
  ctx.fill();

  // Subway Red stripe
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(drawX, drawY + 54 * scale, w, 12 * scale);

  // Twin Headlights with pulsing beam
  const lightPulse = Math.sin(tick * 0.3) > 0 ? '#fef08a' : '#ffffff';
  ctx.fillStyle = lightPulse;
  ctx.beginPath();
  ctx.arc(drawX + 16 * scale, drawY + 76 * scale, 8 * scale, 0, Math.PI * 2);
  ctx.arc(drawX + w - 16 * scale, drawY + 76 * scale, 8 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Train Cowcatcher / Bumper grill
  ctx.fillStyle = '#475569';
  ctx.fillRect(drawX + 6 * scale, drawY + 88 * scale, w - 12 * scale, 12 * scale);

  ctx.restore();
}

// Draw Kotak Soal Teori Python (Mystery Quiz Box in a Single Lane)
function drawQuizGate(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, tick: number) {
  ctx.save();
  const boxW = 76 * scale;
  const boxH = 68 * scale;
  const drawX = x - boxW / 2;
  const drawY = y - boxH;

  // Floating bob animation
  const bob = Math.sin(tick * 0.18) * 5 * scale;
  const actualY = drawY + bob;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(x, y - 4 * scale, boxW * 0.55, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glowing cybernetic box body
  const boxGrad = ctx.createLinearGradient(drawX, actualY, drawX + boxW, actualY + boxH);
  boxGrad.addColorStop(0, '#f59e0b'); // Golden amber
  boxGrad.addColorStop(0.5, '#ea580c'); // Vibrant orange
  boxGrad.addColorStop(1, '#7c2d12');
  ctx.fillStyle = boxGrad;
  ctx.beginPath();
  ctx.roundRect(drawX, actualY, boxW, boxH, [10 * scale]);
  ctx.fill();

  // Neon glowing outline
  const neonPulse = (Math.sin(tick * 0.25) + 1) / 2;
  ctx.strokeStyle = neonPulse > 0.5 ? '#fef08a' : '#38bdf8';
  ctx.lineWidth = 3.5 * scale;
  ctx.stroke();

  // Tech corner brackets
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2 * scale;
  const cr = 8 * scale;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(drawX + 4 * scale, actualY + 4 * scale + cr);
  ctx.lineTo(drawX + 4 * scale, actualY + 4 * scale);
  ctx.lineTo(drawX + 4 * scale + cr, actualY + 4 * scale);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(drawX + boxW - 4 * scale - cr, actualY + 4 * scale);
  ctx.lineTo(drawX + boxW - 4 * scale, actualY + 4 * scale);
  ctx.lineTo(drawX + boxW - 4 * scale, actualY + 4 * scale + cr);
  ctx.stroke();

  // Inner Mystery Question Mark & Python Symbol
  ctx.fillStyle = '#ffffff';
  ctx.font = `black ${Math.max(14, Math.floor(26 * scale))}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❓', x, actualY + boxH * 0.46);

  // Floating Hologram Header above box: "[ ⚡SOAL PYTHON⚡ ]"
  const tagW = 96 * scale;
  const tagH = 18 * scale;
  const tagX = x - tagW / 2;
  const tagY = actualY - 24 * scale;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagW, tagH, [4 * scale]);
  ctx.fill();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.font = `bold ${Math.max(7, Math.floor(8 * scale))}px "Press Start 2P", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡SOAL PYTHON⚡', x, tagY + tagH / 2);

  ctx.restore();
}

// Draw Subway Runner Character (Third-Person Perspective from Behind)
function drawSubwayRunner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  groundY: number,
  scale: number,
  runTick: number,
  idleTick: number,
  isJumping: boolean,
  animState: RunnerAnimState,
  hasTriggeredQuiz: boolean,
  isPaused: boolean
) {
  ctx.save();

  // Shadow on the ground (always stays on ground regardless of jump height)
  const shadowScale = isJumping ? 0.6 : 1.0;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(x, groundY - 2, 22 * scale * shadowScale, 8 * scale * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  let renderY = y;
  let renderX = x;

  if (hasTriggeredQuiz) {
    // Stumble / impact shake
    renderX += (idleTick % 4 < 2 ? -3 : 3);
  }

  // Apakah benar-benar sedang berlari aktif (sudah GO! dan tidak pause)
  const isActuallyRunning = !isPaused && animState === 'running' && !hasTriggeredQuiz;

  // Running leg swing animation (HANYA saat aktif berlari!)
  const runCycle = isActuallyRunning ? Math.sin(runTick * 0.28) : 0;

  // Gerakan nafas halus / standby stance sebelum GO!
  if (!isActuallyRunning && !hasTriggeredQuiz && !isJumping) {
    renderY += Math.sin(idleTick * 0.08) * 1.5;
  }

  // 1. Shoes & Legs
  ctx.fillStyle = '#0284c7'; // Blue Jeans
  if (isJumping) {
    // Tucked legs during jump
    ctx.fillRect(renderX - 14 * scale, renderY - 26 * scale, 10 * scale, 20 * scale);
    ctx.fillRect(renderX + 4 * scale, renderY - 26 * scale, 10 * scale, 20 * scale);

    // Red sneakers
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(renderX - 16 * scale, renderY - 8 * scale, 12 * scale, 8 * scale);
    ctx.fillRect(renderX + 4 * scale, renderY - 8 * scale, 12 * scale, 8 * scale);
  } else if (!isActuallyRunning) {
    // STANDBY READY STANCE: Kaki tegak siap berlari di atas rel (tidak goyang lari sebelum GO!)
    const legY = renderY - 28 * scale;
    ctx.fillRect(renderX - 13 * scale, legY, 9 * scale, 24 * scale);
    ctx.fillRect(renderX + 4 * scale, legY, 9 * scale, 24 * scale);

    // Red sneakers kokoh di atas bantalan rel
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(renderX - 15 * scale, legY + 20 * scale, 12 * scale, 8 * scale);
    ctx.fillRect(renderX + 3 * scale, legY + 20 * scale, 12 * scale, 8 * scale);
  } else {
    // Alternating running legs saat lari kencang sesudah GO!
    const leftLegY = renderY - 28 * scale + runCycle * 8 * scale;
    const rightLegY = renderY - 28 * scale - runCycle * 8 * scale;

    ctx.fillRect(renderX - 14 * scale, leftLegY, 10 * scale, 24 * scale);
    ctx.fillRect(renderX + 4 * scale, rightLegY, 10 * scale, 24 * scale);

    // Red sneakers
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(renderX - 16 * scale, leftLegY + 20 * scale, 13 * scale, 8 * scale);
    ctx.fillRect(renderX + 3 * scale, rightLegY + 20 * scale, 13 * scale, 8 * scale);
  }

  // 2. Torso / Cool Subway Hoodie (Green Python / Subway theme)
  ctx.fillStyle = '#16a34a'; // Emerald Green Hoodie
  ctx.beginPath();
  ctx.roundRect(renderX - 18 * scale, renderY - 60 * scale, 36 * scale, 34 * scale, [8 * scale, 8 * scale, 4 * scale, 4 * scale]);
  ctx.fill();

  // Hoodie Back Decal: Python Logo / Number 10
  ctx.fillStyle = '#fde047';
  ctx.font = `bold ${Math.floor(13 * scale)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('10', renderX, renderY - 38 * scale);

  // 3. Backpack (Subway spray-can bag)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(renderX - 12 * scale, renderY - 56 * scale, 24 * scale, 22 * scale);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(renderX - 8 * scale, renderY - 50 * scale, 16 * scale, 12 * scale);

  // 4. Arms & Hands
  ctx.fillStyle = '#15803d';
  if (isJumping) {
    // Arms spread out in air
    ctx.fillRect(renderX - 26 * scale, renderY - 58 * scale, 9 * scale, 22 * scale);
    ctx.fillRect(renderX + 17 * scale, renderY - 58 * scale, 9 * scale, 22 * scale);
  } else if (!isActuallyRunning) {
    // Arms siap santai di samping badan saat hitung mundur
    ctx.fillRect(renderX - 22 * scale, renderY - 56 * scale, 8 * scale, 22 * scale);
    ctx.fillRect(renderX + 14 * scale, renderY - 56 * scale, 8 * scale, 22 * scale);
  } else {
    // Arms swinging saat sprint
    ctx.fillRect(renderX - 24 * scale, renderY - 56 * scale - runCycle * 6 * scale, 8 * scale, 22 * scale);
    ctx.fillRect(renderX + 16 * scale, renderY - 56 * scale + runCycle * 6 * scale, 8 * scale, 22 * scale);
  }

  // 5. Head & Cool Backward Cap
  // Head / Neck
  ctx.fillStyle = '#fbcfe8';
  ctx.fillRect(renderX - 8 * scale, renderY - 68 * scale, 16 * scale, 10 * scale);

  // Backward Cap (Red Baseball cap like Jake from Subway Surfers)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(renderX, renderY - 72 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Cap backward visor tab
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(renderX - 10 * scale, renderY - 66 * scale, 20 * scale, 6 * scale);

  ctx.restore();
}
