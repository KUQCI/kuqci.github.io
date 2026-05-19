// our amazing website
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ringTransition = {
  duration: 10,
  repeat: Infinity,
  ease: 'linear'
} as const;

const BLOCH_CENTER = 360;
const STATE_VECTOR_BASE_ANGLE =
  (Math.atan2(280 - BLOCH_CENTER, 468 - BLOCH_CENTER) * 180) / Math.PI;

type SphereOrbital = {
  rx: number;
  ry: number;
  stroke: string;
  strokeOpacity: number;
  baseAngle: number;
  duration: number;
  direction: 1 | -1;
};

const sphereOrbitals = [
  {
    rx: 212,
    ry: 78,
    stroke: '#7dd3fc',
    strokeOpacity: 0.36,
    baseAngle: 18,
    duration: 27,
    direction: 1
  },
  {
    rx: 212,
    ry: 78,
    stroke: '#2f80ed',
    strokeOpacity: 0.28,
    baseAngle: -48,
    duration: 38,
    direction: -1
  },
  {
    rx: 212,
    ry: 78,
    stroke: '#7dd3fc',
    strokeOpacity: 0.22,
    baseAngle: 78,
    duration: 46,
    direction: 1
  },
  {
    rx: 212,
    ry: 78,
    stroke: '#2f80ed',
    strokeOpacity: 0.24,
    baseAngle: -82,
    duration: 31,
    direction: -1
  }
] as const satisfies readonly SphereOrbital[];

export default function PondHero() {
  const reduceMotion = useReducedMotion();
  const graphicRef = useRef<HTMLDivElement>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const lastVectorRotationRef = useRef<number | null>(null);
  const orbitalLayoutRef = useRef<Array<{ phaseDelay: number; planeAngle: number }> | null>(null);
  const [cursorVectorRotation, setCursorVectorRotation] = useState<number | null>(null);

  if (orbitalLayoutRef.current === null) {
    const elapsedSeconds =
      typeof performance === 'undefined' ? Date.now() / 1000 : performance.now() / 1000;
    const directionCounts = sphereOrbitals.reduce<Record<1 | -1, number>>(
      (counts, orbital) => {
        counts[orbital.direction] += 1;
        return counts;
      },
      { 1: 0, '-1': 0 }
    );
    const directionSeen: Record<1 | -1, number> = { 1: 0, '-1': 0 };
    const directionStartPhase: Record<1 | -1, number> = {
      1: Math.random(),
      '-1': Math.random()
    };

    orbitalLayoutRef.current = sphereOrbitals.map((orbital) => {
      const groupIndex = directionSeen[orbital.direction];
      const groupCount = directionCounts[orbital.direction];
      const jitter = (Math.random() - 0.5) * 0.08;
      const phase = (directionStartPhase[orbital.direction] + groupIndex / groupCount + jitter + 1) % 1;
      const phaseDelay = -((elapsedSeconds + phase * orbital.duration) % orbital.duration);
      const planeAngle = orbital.baseAngle + (Math.random() - 0.5) * 22;

      directionSeen[orbital.direction] += 1;

      return { phaseDelay, planeAngle };
    });
  }

  const orbitalLayout = orbitalLayoutRef.current;
  const pulse = reduceMotion ? {} : { opacity: [0.32, 0.88, 0.32], scale: [1, 1.05, 1] };
  const bob = reduceMotion ? {} : { y: [0, -4, 0] };
  const pointerStateVectorTransition = {
    type: 'spring' as const,
    stiffness: 90,
    damping: 20,
    mass: 0.45
  };
  const stateVectorAnimate = { rotate: cursorVectorRotation ?? -24 };
  const stateVectorTransition =
    cursorVectorRotation === null ? { duration: 0 } : pointerStateVectorTransition;

  useEffect(() => {
    const unwrapToNearestRotation = (targetRotation: number) => {
      const previousRotation = lastVectorRotationRef.current;

      if (previousRotation === null) {
        lastVectorRotationRef.current = targetRotation;
        return targetRotation;
      }

      const delta = ((((targetRotation - previousRotation) % 360) + 540) % 360) - 180;
      const nextRotation = previousRotation + delta;
      lastVectorRotationRef.current = nextRotation;
      return nextRotation;
    };

    const pointStateVectorAt = (x: number, y: number) => {
      const rect = graphicRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      const dx = x - originX;
      const dy = y - originY;

      if (Math.hypot(dx, dy) < 8) {
        return;
      }

      const cursorAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      setCursorVectorRotation(unwrapToNearestRotation(cursorAngle - STATE_VECTOR_BASE_ANGLE));
    };

    const handlePointerMove = (event: PointerEvent) => {
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      pointStateVectorAt(event.clientX, event.clientY);
    };

    const updateFromLastPointer = () => {
      if (lastPointerRef.current) {
        pointStateVectorAt(lastPointerRef.current.x, lastPointerRef.current.y);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', updateFromLastPointer, { passive: true });
    window.addEventListener('resize', updateFromLastPointer);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', updateFromLastPointer);
      window.removeEventListener('resize', updateFromLastPointer);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-ink"
      aria-labelledby="hero-title"
    >
      <motion.div
        className="absolute inset-0 bg-radial-pond"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.2 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(125,211,252,0.06),transparent_34rem)]" />

      <div className="section-shell relative z-10 grid min-h-screen place-items-center py-24">
        <div
          ref={graphicRef}
          className="relative mx-auto aspect-square w-full max-w-[780px] -translate-y-14 md:-translate-y-20"
        >
          <motion.svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 720 720"
            role="img"
            aria-label="Abstract quantum pond with a minimal duck and Bloch sphere arcs"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1 }}
          >
            <defs>
              <radialGradient id="pondGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2f80ed" stopOpacity="0.22" />
                <stop offset="55%" stopColor="#7dd3fc" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#050914" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cyanLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2f80ed" stopOpacity="0.18" />
                <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.78" />
                <stop offset="100%" stopColor="#2f80ed" stopOpacity="0.18" />
              </linearGradient>
              <linearGradient id="duckDown" x1="0" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor="#fff3a3" />
                <stop offset="48%" stopColor="#f6d766" />
                <stop offset="100%" stopColor="#eab84d" />
              </linearGradient>
              <marker
                id="stateArrow"
                markerHeight="10"
                markerWidth="10"
                orient="auto"
                refX="9"
                refY="3"
              >
                <path d="M0,0 L9,3 L0,6 Z" fill="#f6c453" />
              </marker>
              <filter id="softGoldGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle cx="360" cy="360" r="280" fill="url(#pondGlow)" />

            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.35, duration: reduceMotion ? 0 : 1 }}
            >
              {[0, 1, 2, 3].map((ring) => (
                <motion.ellipse
                  key={ring}
                  cx="360"
                  cy="392"
                  rx={140 + ring * 44}
                  ry={34 + ring * 9}
                  fill="none"
                  stroke={ring === 1 ? '#7dd3fc' : '#2f80ed'}
                  strokeOpacity={0.42 - ring * 0.07}
                  strokeWidth="1.4"
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          rx: [140 + ring * 44, 150 + ring * 46, 140 + ring * 44],
                          opacity: [0.38, 0.16, 0.38]
                        }
                  }
                  transition={{
                    duration: 4.5 + ring,
                    repeat: Infinity,
                    delay: ring * 0.3,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </motion.g>

            <g>
              <ellipse
                cx="360"
                cy="360"
                rx="212"
                ry="212"
                fill="none"
                stroke="url(#cyanLine)"
                strokeDasharray="5 10"
                strokeOpacity="0.32"
                strokeWidth="1.2"
              />
              {sphereOrbitals.map((orbital, index) => (
                <motion.g
                  key={`${orbital.rx}-${orbital.ry}-${orbital.baseAngle}`}
                  style={{ transformBox: 'view-box', transformOrigin: '360px 360px' }}
                  animate={reduceMotion ? {} : { rotate: orbital.direction * 360 }}
                  transition={{ ...ringTransition, duration: orbital.duration, delay: orbitalLayout[index].phaseDelay }}
                >
                  <ellipse
                    cx="360"
                    cy="360"
                    rx={orbital.rx}
                    ry={orbital.ry}
                    fill="none"
                    stroke={orbital.stroke}
                    strokeOpacity={orbital.strokeOpacity}
                    strokeWidth="1.2"
                    transform={`rotate(${orbitalLayout[index].planeAngle} 360 360)`}
                  />
                </motion.g>
              ))}
              <path
                d="M360 148 L360 572"
                fill="none"
                stroke="#7dd3fc"
                strokeDasharray="2 12"
                strokeOpacity="0.22"
              />
              <path
                d="M148 360 L572 360"
                fill="none"
                stroke="#7dd3fc"
                strokeDasharray="2 12"
                strokeOpacity="0.18"
              />
            </g>

            <motion.g
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.9, duration: reduceMotion ? 0 : 1 }}
            >
              <motion.g
                style={{ transformBox: 'view-box', transformOrigin: '360px 360px' }}
                animate={stateVectorAnimate}
                transition={stateVectorTransition}
              >
                <path
                  d="M360 360 L468 280"
                  fill="none"
                  stroke="#f6c453"
                  strokeOpacity="0.18"
                  strokeWidth="10"
                  strokeLinecap="round"
                  filter="url(#softGoldGlow)"
                />
                <path
                  d="M360 360 L468 280"
                  fill="none"
                  stroke="#f6c453"
                  strokeWidth="3"
                  strokeLinecap="round"
                  markerEnd="url(#stateArrow)"
                />
                <motion.circle
                  cx="468"
                  cy="280"
                  r="5"
                  fill="#f6c453"
                  filter="url(#softGoldGlow)"
                  animate={reduceMotion ? {} : { r: [4, 6, 4], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.g>
              <circle cx="360" cy="360" r="4.5" fill="#f6c453" opacity="0.92" />
            </motion.g>

            <g className="mono-label" aria-hidden="true">
              <text x="349" y="142" fill="#7dd3fc" fillOpacity="0.58" fontSize="16">
                |0&gt;
              </text>
              <text x="350" y="594" fill="#7dd3fc" fillOpacity="0.36" fontSize="16">
                |1&gt;
              </text>
              <text x="579" y="364" fill="#7dd3fc" fillOpacity="0.34" fontSize="13">
                x
              </text>
            </g>

            <motion.g animate={bob} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}>
              <ellipse cx="360" cy="405" rx="68" ry="12" fill="#2f80ed" opacity="0.2" />
              <path
                d="M302 366 C310 338 343 324 383 331 C420 337 442 357 444 382 C416 397 355 405 310 390 C302 386 297 376 302 366Z"
                fill="url(#duckDown)"
                opacity="1"
              />
              <path
                d="M397 337 C415 337 430 348 435 363 C426 376 405 380 390 369 C390 355 393 344 397 337Z"
                fill="url(#duckDown)"
                opacity="1"
              />
              <path
                d="M405 328 C421 304 450 307 459 331 C446 347 423 350 405 338Z"
                fill="url(#duckDown)"
                opacity="1"
              />
              <path d="M458 325 L484 330 L457 337 Z" fill="#f0a72f" />
              <circle cx="446" cy="327" r="3.4" fill="#050914" opacity="0.88" />
              <path
                d="M327 362 C348 349 378 350 405 365"
                fill="none"
                stroke="#9a6b16"
                strokeOpacity="0.26"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </motion.g>

            {[['360', '148'], ['360', '572'], ['178', '360'], ['542', '360']].map(([cx, cy], index) => (
              <motion.circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={index < 2 ? '4' : '3'}
                fill="#7dd3fc"
                animate={pulse}
                transition={{ duration: 3.4, repeat: Infinity, delay: index * 0.25, ease: 'easeInOut' }}
              />
            ))}
          </motion.svg>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-ink via-ink/88 to-transparent"
            aria-hidden="true"
          />

          <motion.div
            className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 text-center md:bottom-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 1.25, duration: reduceMotion ? 0 : 0.8 }}
          >
            <p className="mono-label mb-4 text-xs font-semibold uppercase text-cyan-quantum/80">
              Khalifa University
            </p>
            <h1 id="hero-title" className="text-4xl font-semibold tracking-normal text-white md:text-7xl">
              Quantum Computing Initiative
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Learn quantum. Build quantum. Contribute to the ecosystem.
            </p>
            <p className="mono-label mt-10 flex flex-col items-center justify-center gap-2 text-xs uppercase text-slate-500">
              <span>Scroll to enter</span>
              <motion.svg
                aria-hidden="true"
                className="h-3.5 w-3.5 text-slate-500"
                viewBox="0 0 16 16"
                fill="none"
                animate={reduceMotion ? {} : { y: [0, 3, 0], opacity: [0.45, 0.8, 0.45] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path
                  d="M8 2.5V12M4.25 8.25 8 12l3.75-3.75"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
