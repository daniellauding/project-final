import { useEffect, useState, useRef, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePollStore } from "../stores/pollStore";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  PlusCircle, ArrowRight, ImagePlus, MousePointerClick, BarChart3, Lock, ChevronLeft, ChevronRight
} from "lucide-react";
import AuthModal from "../components/AuthModal";

/* ── Scroll fade-in ── */
function FadeIn({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
      {children}
    </div>
  );
}

/* ── Hero intro animation ── */
const INTRO_MS = 2600;

const dPath = "M132.234 584.797C68.9754 534.55 30.6254 470.301 19.4563 390.243C15.3078 360.507 15.5755 330.794 18.5121 300.998C19.0191 295.854 21.9956 295.896 25.7406 295.899C84.3964 295.94 143.052 295.928 201.708 295.928C229.869 295.928 258.032 295.821 286.192 296.033C290.926 296.069 292.359 294.873 292.351 289.986C292.207 196.004 292.244 102.021 292.246 8.03861C292.246 -0.120679 292.25 -0.0642185 300.625 0.0149155C336.41 0.353034 371.847 3.42771 406.428 13.3245C431.993 20.6409 456.243 30.9622 479.832 43.3165C524.507 66.7129 563.108 97.3954 594.026 137.174C640.834 197.397 664.036 265.636 660.863 342.252C657.072 433.779 618.389 508.663 550.905 569.182C493.993 620.22 426.457 647.467 350.735 654.563C318.219 657.61 286.162 652.825 254.686 644.743C209.906 633.246 169.065 613.465 132.234 584.797Z";
const nPath = "M0.233 288.44C0.387 219.951 -0.155 151.949 1.011 83.9771C1.539 53.1687 16.719 29.0411 43.053 12.516C52.842 6.37304 63.742 3.21422 75.249 2.77854C85.066 2.4069 94.922 2.4252 104.728 2.92089C107.187 3.04522 110.384 5.09928 111.779 7.22597C126.214 29.2387 140.536 51.3314 154.537 73.6225C230.142 193.986 305.42 314.555 381.27 434.764C426.17 505.928 471.93 576.551 517.24 647.457C518.57 649.534 519.19 652.058 520.15 654.374C517.65 654.941 515.16 656.005 512.66 656.004C395.84 655.972 279.02 655.792 162.204 655.77C132.876 655.765 103.537 655.83 74.221 656.593C42.214 657.427 20.97 641.636 6.88 614.482C1.403 603.929 0.431 592.153 0.418 580.405C0.329 502.081 0.286 423.758 0.234 345.434C0.222 326.603 0.233 307.771 0.233 288.44Z";
const dotPath = "M183.38 24.614C243.812 67.0427 251.454 155.246 199.035 206.758C165.05 240.156 124.592 250.785 79.1231 235.934C41.7941 223.741 17.3463 197.478 5.76275 159.973C-6.08628 121.609 0.623981 85.9324 23.2501 53.0269C52.911 9.89061 113.618 -7.84553 161.564 12.8807C169.008 16.0985 175.924 20.536 183.38 24.614Z";

function HeroIntro({ introDone, onComplete }: { introDone: boolean; onComplete: () => void }) {
  const [overlayGone, setOverlayGone] = useState(introDone);

  useEffect(() => {
    if (introDone) return;
    const t1 = setTimeout(() => { onComplete(); sessionStorage.setItem("pejla-intro", "done"); }, INTRO_MS);
    const t2 = setTimeout(() => setOverlayGone(true), INTRO_MS + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete, introDone]);

  return (
    <>
      <style>{`
        @keyframes pejla-d-in {
          0%   { transform: translate(-60vw, 50vh) rotate(-30deg); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        }
        @keyframes pejla-n-in {
          0%   { transform: translate(60vw, -50vh) rotate(25deg); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        }
        @keyframes pejla-dot-in {
          0%   { transform: translate(30vw, -70vh) scale(0.4); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes pejla-shrink {
          0%   { transform: scale(2.2); }
          55%  { transform: scale(2.2); }
          100% { transform: scale(1); }
        }
        @keyframes pejla-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); opacity: 0.92; } }
        @keyframes pejla-float   { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pejla-bounce  { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-14px) scale(1.06); } }
      `}</style>

      {/* Dark fullscreen overlay — covers header, fades out after intro */}
      {!overlayGone && (
        <div
          className={`fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center transition-opacity duration-700 ${introDone ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div
            className="relative w-[320px] h-[180px] md:w-[440px] md:h-[240px]"
            style={{ animation: `pejla-shrink ${INTRO_MS}ms cubic-bezier(0.22, 1, 0.36, 1) forwards` }}
          >
            <svg viewBox="0 0 661 657" fill="none" className="absolute left-0 top-0 w-[55%] h-full"
              style={{ animation: `pejla-d-in 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards`, opacity: 0 }}>
              <path d={dPath} fill="white"/>
            </svg>
            <svg viewBox="0 0 522 657" fill="none" className="absolute right-0 top-0 w-[44%] h-full"
              style={{ animation: `pejla-n-in 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards`, opacity: 0 }}>
              <path d={nPath} fill="white"/>
            </svg>
            <svg viewBox="0 0 260 260" fill="none" className="absolute left-0 top-0 w-[18%]"
              style={{ animation: `pejla-dot-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.35s forwards`, opacity: 0 }}>
              <path d={dotPath} fill="white"/>
            </svg>
          </div>
        </div>
      )}

      {/* In-page logo — visible after overlay fades, with idle animations */}
      <div className="relative w-[320px] h-[180px] md:w-[440px] md:h-[240px] mx-auto mb-14">
        <svg viewBox="0 0 661 657" fill="none" className="absolute left-0 top-0 w-[55%] h-full"
          style={{ animation: introDone ? "pejla-breathe 5s cubic-bezier(0.4,0,0.2,1) infinite" : "none" }}>
          <path d={dPath} fill="currentColor"/>
        </svg>
        <svg viewBox="0 0 522 657" fill="none" className="absolute right-0 top-0 w-[44%] h-full"
          style={{ animation: introDone ? "pejla-float 6s cubic-bezier(0.4,0,0.2,1) infinite" : "none" }}>
          <path d={nPath} fill="currentColor"/>
        </svg>
        <svg viewBox="0 0 260 260" fill="none" className="absolute left-0 top-0 w-[18%]"
          style={{ animation: introDone ? "pejla-bounce 4s cubic-bezier(0.4,0,0.2,1) infinite" : "none" }}>
          <path d={dotPath} fill="currentColor"/>
        </svg>
      </div>
    </>
  );
}

/* ── Quote carousel ── */
const quotes = [
  { text: "\u201CI prefer the first one\u201D is not feedback.", sub: "Pejla turns opinions into data." },
  { text: "\u201CCan you just make it pop more?\u201D", sub: "Now they vote instead of vibe-checking." },
  { text: "\u201CLet\u2019s circle back on the design.\u201D", sub: "Or just share a poll and decide in minutes." },
  { text: "\u201CI sent it to the team on Slack.\u201D", sub: "17 replies later, still no decision." },
];

function QuoteCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % quotes.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-[120px] md:h-[100px] flex items-center justify-center overflow-hidden">
      {quotes.map((q, i) => (
        <div key={i}
          className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out"
          style={{ opacity: i === idx ? 1 : 0, transform: i === idx ? "translateY(0)" : "translateY(12px)", pointerEvents: i === idx ? "auto" : "none" }}>
          <p className="text-2xl md:text-3xl font-medium text-foreground text-center leading-snug">{q.text}</p>
          <p className="text-base md:text-lg text-muted-foreground mt-2">{q.sub}</p>
        </div>
      ))}
      <div className="absolute bottom-0 flex gap-1.5">
        {quotes.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/30"}`}
            aria-label={`Quote ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/* ── Sequential animated words — plays once after intro, stays on last ── */
const sequenceWords = ["Design feedback,", "Client reviews,", "Sound picks,", "Code reviews,", "Creative decisions,"];
const SEQ_INTERVAL = 800; // ms per word

function RotatingWord({ started, skipAnim }: { started: boolean; skipAnim: boolean }) {
  const [idx, setIdx] = useState(skipAnim ? sequenceWords.length - 1 : -1);

  useEffect(() => {
    if (!started || skipAnim) return;
    const t = setTimeout(() => setIdx(0), 100);
    return () => clearTimeout(t);
  }, [started, skipAnim]);

  useEffect(() => {
    if (idx < 0 || idx >= sequenceWords.length - 1) return;
    const t = setTimeout(() => setIdx((i) => i + 1), SEQ_INTERVAL);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <span className="inline-grid">
      {sequenceWords.map((word, i) => (
        <span
          key={word}
          className={`col-start-1 row-start-1 ${skipAnim ? "" : "transition-all duration-500 ease-in-out"}`}
          style={{
            transform: i === idx ? "translateY(0)" : i < idx ? "translateY(-110%)" : "translateY(110%)",
            opacity: i === idx ? 1 : 0,
            clipPath: "inset(-10% 0 -10% 0)",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

/* ── Staggered reveal helper — skip=true shows instantly ── */
function StaggerIn({ show, delay, skip, children, className = "" }: { show: boolean; delay: number; skip?: boolean; children: ReactNode; className?: string }) {
  const instant = skip || false;
  const [visible, setVisible] = useState(instant);
  useEffect(() => {
    if (instant || !show) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [show, delay, instant]);
  return (
    <div className={`${instant ? "" : "transition-all duration-700 ease-out"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
      {children}
    </div>
  );
}

/* ── "without the noise" — appears after last rotating word ── */
function WithoutTheNoise({ started, skipAnim }: { started: boolean; skipAnim: boolean }) {
  const [visible, setVisible] = useState(skipAnim);
  useEffect(() => {
    if (!started || skipAnim) return;
    const t = setTimeout(() => setVisible(true), 100 + sequenceWords.length * SEQ_INTERVAL + 200);
    return () => clearTimeout(t);
  }, [started, skipAnim]);
  return (
    <span className={`inline-block ${skipAnim ? "" : "transition-all duration-700 ease-out"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
      without the noise
    </span>
  );
}

/* ── Step 1 illustration: two cards switching ── */
function CardStack() {
  const [front, setFront] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFront((f) => (f + 1) % 2), 2800);
    return () => clearInterval(t);
  }, []);
  const images = ["/how/01.png", "/how/02.png"];
  const images2x = ["/how/01@2x.png", "/how/02@2x.png"];
  return (
    <div className="relative w-full aspect-[3/4] max-w-sm mx-auto flex items-center justify-center">
      {[0, 1].map((i) => {
        const isFront = front === i;
        const tilt = i === 0 ? "-rotate-3" : "rotate-3";
        return (
          <div
            key={i}
            className={`absolute w-[80%] aspect-[3/4] rounded-2xl border border-border/60 bg-card shadow-lg transition-all duration-700 ease-in-out overflow-hidden ${tilt} ${
              isFront
                ? "z-10 scale-100 opacity-100 translate-y-0"
                : "z-0 scale-95 opacity-60 translate-y-3"
            }`}
          >
            <img
              src={images[i]}
              srcSet={`${images[i]} 960w, ${images2x[i]} 1920w`}
              sizes="300px"
              alt={`Option ${i === 0 ? "A" : "B"}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}

/* ── Step 2 illustration: animated voting bars ── */
function VotingBars() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimate(true); obs.unobserve(el); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const bars = [
    { pct: 52, color: "bg-primary" },
    { pct: 31, color: "bg-primary/60" },
    { pct: 17, color: "bg-primary/30" },
  ];

  return (
    <div ref={ref} className="w-full aspect-[4/3] rounded-2xl bg-muted/60 border border-border/40 flex flex-col justify-center px-8 gap-4">
      {bars.map((bar, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground/60">
            <span>Option {String.fromCharCode(65 + i)}</span>
            <span>{animate ? bar.pct : 0}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${bar.color} transition-all ease-out`}
              style={{
                width: animate ? `${bar.pct}%` : "0%",
                transitionDuration: `${800 + i * 300}ms`,
                transitionDelay: `${i * 200}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Step 3 illustration: animated checkmark ── */
function DecideIllustration() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimate(true); obs.unobserve(el); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full aspect-[4/3] rounded-2xl bg-muted/60 border border-border/40 flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-24 h-24">
        <circle
          cx="60" cy="60" r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary/20"
        />
        <circle
          cx="60" cy="60" r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="314"
          strokeDashoffset={animate ? "0" : "314"}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out"
          style={{ transitionDelay: "200ms" }}
          transform="rotate(-90 60 60)"
        />
        <path
          d="M38 62 L52 76 L82 46"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="70"
          strokeDashoffset={animate ? "0" : "70"}
          className="text-primary transition-all duration-700 ease-out"
          style={{ transitionDelay: "600ms" }}
        />
      </svg>
    </div>
  );
}

/* ── Floating cursors (Figma-live style) ── */
function FloatingCursors() {
  return (
    <>
      <style>{`
        @keyframes cursor-1 {
          0%   { left: 8%;  top: 22%; }
          15%  { left: 18%; top: 30%; }
          30%  { left: 25%; top: 18%; }
          40%  { left: 25%; top: 18%; transform: scale(0.85); }
          45%  { left: 25%; top: 18%; transform: scale(1); }
          60%  { left: 14%; top: 45%; }
          80%  { left: 10%; top: 35%; }
          100% { left: 8%;  top: 22%; }
        }
        @keyframes cursor-2 {
          0%   { left: 78%; top: 16%; }
          20%  { left: 70%; top: 35%; }
          35%  { left: 65%; top: 28%; }
          45%  { left: 65%; top: 28%; transform: scale(0.85); }
          50%  { left: 65%; top: 28%; transform: scale(1); }
          65%  { left: 75%; top: 50%; }
          85%  { left: 82%; top: 30%; }
          100% { left: 78%; top: 16%; }
        }
        @keyframes cursor-3 {
          0%   { left: 55%; top: 65%; }
          20%  { left: 40%; top: 55%; }
          40%  { left: 35%; top: 68%; }
          55%  { left: 35%; top: 68%; transform: scale(0.85); }
          60%  { left: 35%; top: 68%; transform: scale(1); }
          75%  { left: 50%; top: 72%; }
          100% { left: 55%; top: 65%; }
        }
        @keyframes click-ring {
          0%, 35%, 100% { opacity: 0; transform: scale(0); }
          40% { opacity: 0.5; transform: scale(0.5); }
          55% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>
      {[
        { anim: "cursor-1", dur: "8s",  delay: "0s",   color: "#f9a8d4", label: "Mia" },
        { anim: "cursor-2", dur: "9s",  delay: "1.5s", color: "#93c5fd", label: "Alex" },
        { anim: "cursor-3", dur: "10s", delay: "3s",   color: "#86efac", label: "Sam" },
      ].map((c) => (
        <div
          key={c.anim}
          className="absolute pointer-events-none"
          style={{
            animation: `${c.anim} ${c.dur} cubic-bezier(0.4, 0, 0.2, 1) ${c.delay} infinite`,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.06))",
          }}
        >
          <div className="relative">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M5.65 1.15a.5.5 0 0 0-.65.48v20.74a.5.5 0 0 0 .85.36l5.6-5.6h8.92a.5.5 0 0 0 .35-.85L5.65 1.15Z" fill={c.color} />
            </svg>
            <div
              className="absolute top-0 left-0 w-6 h-6 rounded-full -translate-x-1/4 -translate-y-1/4"
              style={{
                backgroundColor: c.color,
                animation: `click-ring ${c.dur} cubic-bezier(0.4, 0, 0.2, 1) ${c.delay} infinite`,
              }}
            />
          </div>
          <span
            className="text-[9px] font-medium rounded px-1 py-0.5 ml-3 -mt-0.5 whitespace-nowrap"
            style={{ backgroundColor: c.color, color: "#fff" }}
          >
            {c.label}
          </span>
        </div>
      ))}
    </>
  );
}

/* ── Hero poll preview (right side card with slide animation) ── */
function HeroPollPreview({ polls, getThumbnail, onCta }: { polls: any[]; getThumbnail: (p: any) => string | null; onCta: () => void }) {
  const maxSlides = Math.min(polls.length, 3);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0); // -1 left, 1 right
  const isCtaSlide = idx >= maxSlides;
  const poll = polls[Math.min(idx, maxSlides - 1)];
  const thumb = !isCtaSlide ? getThumbnail(poll) : null;
  const prev = () => { setDir(-1); setIdx((i) => (i > 0 ? i - 1 : maxSlides)); };
  const next = () => { setDir(1); setIdx((i) => (i < maxSlides ? i + 1 : 0)); };

  const slideClass = dir === 1
    ? "animate-[slideInRight_0.3s_ease-out]"
    : dir === -1
    ? "animate-[slideInLeft_0.3s_ease-out]"
    : "";

  return (
    <div className="flex flex-col items-start">
      <style>{`
        @keyframes slideInRight { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
      {/* Header: label + arrows */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium text-foreground">Recent designs</span>
        <div className="flex gap-1.5">
          <button onClick={prev} className="p-1.5 rounded-full border border-border bg-background hover:bg-secondary transition" aria-label="Previous">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button onClick={next} className="p-1.5 rounded-full border border-border bg-background hover:bg-secondary transition" aria-label="Next">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {/* Card with slide animation */}
      <div key={idx} className={slideClass}>
        {isCtaSlide ? (
          <div className="w-[340px] xl:w-[380px] h-[480px] xl:h-[520px] rounded-2xl border border-border/40 bg-card shadow-lg flex flex-col items-center justify-center text-center p-8 gap-4">
            <h3 className="text-xl font-semibold">Your turn</h3>
            <p className="text-sm text-muted-foreground">Share anything — designs, code, music, docs — and let your team vote.</p>
            <button onClick={onCta} className="mt-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 transition flex items-center gap-2">
              Share your designs <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link to={`/poll/${poll.shareId}`}
            className="group block w-[340px] xl:w-[380px] rounded-2xl border border-border/40 bg-card overflow-hidden shadow-lg hover:shadow-xl transition-all">
            <div className="h-[400px] xl:h-[440px] bg-muted relative overflow-hidden">
              {thumb ? (
                <>
                  <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                  {/* Play icon for video/audio polls */}
                  {poll.options.some((o: any) => o.videoUrl || o.audioUrl) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-background ml-0.5" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  )}
                </>
              ) : poll.options.some((o: any) => o.audioUrl) ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-muted/50">
                  <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-muted-foreground/25" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                    </svg>
                  </div>
                  <span className="text-sm text-muted-foreground/40">{poll.options.length} tracks</span>
                </div>
              ) : poll.options.some((o: any) => o.textContent) ? (
                <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 overflow-hidden relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-foreground/10 text-[10px] font-mono font-bold uppercase tracking-wide">
                      {(poll.options.find((o: any) => o.textContent)?.fileName || "").split('.').pop() || "md"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{poll.options.find((o: any) => o.textContent)?.fileName}</span>
                  </div>
                  <div className="flex-1 text-xs leading-relaxed text-muted-foreground/70 font-mono overflow-hidden">
                    {(poll.options.find((o: any) => o.textContent)?.textContent || "").slice(0, 300).split('\n').slice(0, 12).map((line: string, li: number) => (
                      <div key={li} className={line.startsWith('#') ? "font-semibold text-foreground/60 mt-1" : ""}>{line || "\u00A0"}</div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-100 dark:from-slate-800 to-transparent" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-muted/50 p-6">
                  <span className="text-lg font-semibold text-muted-foreground/30">{poll.title}</span>
                  <div className="flex gap-2">
                    {poll.options.slice(0, 3).map((o: any, oi: number) => (
                      <span key={oi} className="px-2 py-0.5 rounded-full bg-foreground/5 text-[10px] text-muted-foreground/50">{o.label}</span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground/30 mt-1">{poll.options.length} options</span>
                </div>
              )}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-foreground/70 backdrop-blur-sm text-background text-xs font-medium">
                {poll.totalVotes || 0} votes
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-foreground/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                {poll.options.slice(0, 5).map((_: any, i: number) => (
                  <div key={i} className={`rounded-full ${i === 0 ? "w-4 h-1.5 bg-background" : "w-1.5 h-1.5 bg-background/40"}`} />
                ))}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">{poll.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{poll.options.length} options · {poll.creatorName}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Click ripple effect — covers entire page ── */
function ClickRipple() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleColors = ["#f9a8d4", "#93c5fd", "#86efac"];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const parent = container.parentElement;
    if (!parent) return;

    const handleClick = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left + parent.scrollLeft;
      const y = e.clientY - rect.top + parent.scrollTop;
      const color = rippleColors[Math.floor(Math.random() * rippleColors.length)];
      const ripple = document.createElement("div");
      ripple.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;border-radius:50%;background:${color};opacity:0.4;pointer-events:none;transform:translate(-50%,-50%);z-index:50;`;
      container.appendChild(ripple);
      ripple.animate(
        [
          { width: "0px", height: "0px", opacity: 0.4 },
          { width: "70px", height: "70px", opacity: 0 },
        ],
        { duration: 500, easing: "ease-out" }
      ).onfinish = () => ripple.remove();
    };

    parent.addEventListener("click", handleClick);
    return () => parent.removeEventListener("click", handleClick);
  }, []);

  return <div ref={containerRef} className="absolute top-0 left-0 w-full pointer-events-none z-50 overflow-visible" style={{ height: "1px" }} />;
}

/* ── Scroll-driven slide-in from right ── */
function ScrollSlideIn({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when element bottom is at viewport bottom, 1 when element top reaches viewport center
      const raw = 1 - (rect.top - vh * 0.5) / (vh * 0.5);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateX(${(1 - progress) * 80}px)`,
        opacity: progress,
        transition: "transform 0.1s linear, opacity 0.1s linear",
      }}
    >
      {children}
    </div>
  );
}

/* ── Looping option thumbnail for cards with multiple options ── */
function LoopingThumbnail({ options, className, getOptionMedia }: { options: any[]; className: string; getOptionMedia: (opt: any) => { thumb: string | null; type: string } }) {
  const media = options.map(getOptionMedia);
  const hasAnyVisual = media.some((m) => m.thumb);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (media.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % media.length), 3000);
    return () => clearInterval(t);
  }, [media.length]);

  // No visuals at all — show icon-based or text placeholder
  if (!hasAnyVisual) {
    const primaryType = media[0]?.type || "none";
    const textOpt = options.find((o: any) => o.textContent);
    if (textOpt) {
      const ext = (textOpt.fileName || "").split('.').pop() || "md";
      return (
        <div className={`${className} flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-5 overflow-hidden relative`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded bg-foreground/10 text-[10px] font-mono font-bold uppercase tracking-wide">{ext}</span>
            {textOpt.fileName && <span className="text-[10px] text-muted-foreground/50 truncate">{textOpt.fileName}</span>}
          </div>
          <div className="flex-1 text-[11px] leading-relaxed text-muted-foreground/60 font-mono overflow-hidden">
            {(textOpt.textContent || "").slice(0, 400).split('\n').slice(0, 15).map((line: string, li: number) => (
              <div key={li} className={line.startsWith('#') ? "font-semibold text-foreground/50 mt-1" : ""}>{line || "\u00A0"}</div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-100 dark:from-slate-800 to-transparent" />
        </div>
      );
    }
    return (
      <div className={`${className} flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-muted/50`}>
        {primaryType === "audio" ? (
          <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
        ) : primaryType === "video" ? (
          <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-muted-foreground/30 ml-1" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        ) : (
          <span className="text-lg font-semibold text-muted-foreground/25">{options[0]?.label}</span>
        )}
        <div className="flex gap-1.5">
          {options.slice(0, 3).map((o: any, oi: number) => (
            <span key={oi} className="px-2 py-0.5 rounded-full bg-foreground/5 text-[10px] text-muted-foreground/40">{o.label}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {media.map((m, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}>
          {m.thumb ? (
            <img src={m.thumb} alt="" loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              {m.type === "audio" ? (
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-muted-foreground/20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              ) : m.type === "video" ? (
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-muted-foreground/20 ml-1" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              ) : m.type === "text" ? (
                <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-5 overflow-hidden relative">
                  <div className="text-[10px] leading-relaxed text-muted-foreground/50 font-mono overflow-hidden flex-1">
                    {(options[i]?.textContent || "").slice(0, 200).split('\n').slice(0, 8).map((line: string, li: number) => (
                      <div key={li} className={line.startsWith('#') ? "font-semibold text-foreground/40" : ""}>{line || "\u00A0"}</div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 dark:from-slate-800 to-transparent" />
                </div>
              ) : null}
            </div>
          )}
          {/* Play icon overlay for video/audio */}
          {(m.type === "video" || m.type === "audio") && m.thumb && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-background ml-0.5" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Recent designs — single stacked card, swap like pulling from a deck ── */
function RecentPollsCarousel({ polls, getThumbnail, getOptionMedia }: { polls: any[]; getThumbnail: (p: any) => string | null; getOptionMedia: (opt: any) => { thumb: string | null; type: string } }) {
  const [current, setCurrent] = useState(0);
  const maxVisible = 5;
  const hasMore = polls.length > maxVisible;
  const items = polls.slice(0, maxVisible);
  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : items.length - 1));
  const next = () => setCurrent((c) => (c < items.length - 1 ? c + 1 : 0));

  return (
    <>
      <style>{`
        @keyframes cardSwapIn { from { transform: scale(0.92) rotate(2deg); opacity: 0; } to { transform: scale(1) rotate(0deg); opacity: 1; } }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <h2 className="text-xl md:text-2xl">Recent designs</h2>
        <div className="flex gap-1.5">
          <button onClick={prev}
            className="p-1.5 rounded-full border border-border bg-background hover:bg-secondary transition" aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next}
            className="p-1.5 rounded-full border border-border bg-background hover:bg-secondary transition" aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Card fan — active centered, previous fan left, next fan right */}
      <div className="relative mx-auto" style={{ width: "min(700px, 90vw)", height: "540px" }}>
        {items.map((poll, i) => {
          const offset = i - current; // negative = left, positive = right

          // Only render active + up to 2 on each side
          if (Math.abs(offset) > 2) return null;

          const isActive = offset === 0;
          const absOff = Math.abs(offset);

          // Fan layout: cards peek from left/right, tucked behind active
          const side = offset < 0 ? -1 : 1; // -1 = left, 1 = right
          const scale = isActive ? 1 : absOff === 1 ? 0.92 : 0.85;
          const rotate = isActive ? 0 : side * (absOff === 1 ? 3 : 5);
          const translateX = isActive ? 0 : side * (absOff === 1 ? 12 : 20); // percent — just peeking
          const translateY = isActive ? 0 : absOff === 1 ? 8 : 14;
          const opacity = isActive ? 1 : absOff === 1 ? 0.5 : 0.25;
          const zIndex = isActive ? 30 : absOff === 1 ? 20 : 10;

          return (
            <div
              key={poll._id}
              className={`absolute inset-0 rounded-2xl border bg-card overflow-hidden shadow-lg cursor-pointer transition-all duration-500 ease-out ${
                isActive ? "border-primary/30 shadow-xl" : "border-border/20"
              }`}
              style={{
                zIndex,
                transform: `translateX(${translateX}%) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                opacity,
                transformOrigin: isActive ? "center" : offset < 0 ? "right center" : "left center",
              }}
              onClick={() => {
                if (isActive) window.location.href = `/poll/${poll.shareId}`;
                else setCurrent(i);
              }}
            >
              <LoopingThumbnail options={poll.options} getOptionMedia={getOptionMedia}
                className="bg-muted overflow-hidden h-[380px] md:h-[420px] lg:h-[440px]" />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-foreground/70 backdrop-blur-sm text-background text-xs font-medium">
                {poll.totalVotes || 0} votes
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{poll.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{poll.options.length} options · by {poll.creatorName}</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Dots + View all */}
      <div className="flex flex-col items-center gap-4 mt-6">
        <div className="flex gap-2">
          {items.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-foreground" : "w-2 bg-muted-foreground/30"}`}
              aria-label={`Design ${i + 1}`} />
          ))}
        </div>
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          {hasMore ? `View all ${polls.length} designs` : "View all"} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </>
  );
}

/* ── Scroll fade-out (hero poll card slides away) ── */
function ScrollFadeOut({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const update = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const fade = Math.max(0, 1 - scrollY / 400);
  const shift = scrollY * 0.4;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: fade,
        transform: `translateX(${shift}px)`,
        transition: "none",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

/* ── Steps ── */
const steps = [
  { icon: ImagePlus, title: "Share", desc: "Upload images, Figma embeds, or video. Compare iterations side by side." },
  { icon: MousePointerClick, title: "Vote", desc: "One-tap voting. Share a link — anyone can vote, no sign-up needed." },
  { icon: BarChart3, title: "Decide", desc: "See results instantly. Comments, remixes, and a clear winner." },
];

/* ── Page ── */
const Home = ({ forceLanding = false }: { forceLanding?: boolean }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { polls, loading, fetchPolls } = usePollStore();
  const [showAuth, setShowAuth] = useState(false);
  const handleCta = () => user ? navigate("/create") : setShowAuth(true);
  const [introDone, setIntroDone] = useState(() => sessionStorage.getItem("pejla-intro") === "done");
  const isReturning = useRef(sessionStorage.getItem("pejla-intro") === "done").current;

  useEffect(() => { fetchPolls(); }, [fetchPolls]);

  const getThumbnail = (poll: (typeof polls)[0]): string | null => {
    for (const opt of poll.options) {
      if (opt.coverUrl) return opt.coverUrl;
      if (opt.imageUrl) return opt.imageUrl;
      if (opt.videoUrl && opt.videoUrl.includes("cloudinary")) {
        return opt.videoUrl.replace(/\.[^.]+$/, ".jpg");
      }
    }
    return null;
  };

  // Get media type for a poll option (for play icon overlay)
  const getOptionMedia = (opt: any): { thumb: string | null; type: "image" | "video" | "audio" | "embed" | "text" | "none" } => {
    if (opt.coverUrl) return { thumb: opt.coverUrl, type: opt.videoUrl ? "video" : opt.audioUrl ? "audio" : "image" };
    if (opt.imageUrl) return { thumb: opt.imageUrl, type: "image" };
    if (opt.videoUrl) {
      const thumb = opt.videoUrl.includes("cloudinary") ? opt.videoUrl.replace(/\.[^.]+$/, ".jpg") : null;
      return { thumb, type: "video" };
    }
    if (opt.audioUrl) return { thumb: null, type: "audio" };
    if (opt.embedUrl) return { thumb: null, type: "embed" };
    if (opt.textContent) return { thumb: null, type: "text" };
    return { thumb: null, type: "none" };
  };

  const publicPolls = polls.filter((p) => !p.visibility || p.visibility === "public");

  if (!user || forceLanding) {
    return (
      <>
        <div className="min-h-[calc(100vh-4rem)] flex flex-col overflow-hidden relative">
          <ClickRipple />
          {/* Hero — staggers in sequence after intro. Returning users see it all instantly. */}
          <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-28 text-center relative overflow-hidden">
            {/* Cursors */}
            <StaggerIn show={introDone} delay={3800} skip={isReturning} className="absolute inset-0 pointer-events-none">
              <FloatingCursors />
            </StaggerIn>

            <HeroIntro introDone={introDone} onComplete={() => setIntroDone(true)} />

            {/* 1. Rotating words — start right after intro */}
            <StaggerIn show={introDone} delay={0} skip={isReturning}>
              <h1 className="text-5xl md:text-7xl tracking-tight max-w-3xl leading-[1.15]">
                <RotatingWord started={introDone} skipAnim={isReturning} />
                <br />
                <WithoutTheNoise started={introDone} skipAnim={isReturning} />
              </h1>
            </StaggerIn>

            {/* 2. Description */}
            <StaggerIn show={introDone} delay={3600} skip={isReturning}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mt-6 mx-auto leading-relaxed">
                Share anything — designs, code, music, docs — and let
                people vote on what ships.
              </p>
            </StaggerIn>

            {/* 3. CTAs */}
            <StaggerIn show={introDone} delay={4200} skip={isReturning}>
              <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center items-center">
                <Button onClick={handleCta} className="h-14 px-10 text-lg w-full sm:w-auto">
                  Share something <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="h-14 px-10 text-lg w-full sm:w-auto" asChild>
                  <a href="#how-it-works">How it works</a>
                </Button>
              </div>
            </StaggerIn>

            {/* 4. Poll preview card — desktop only */}
            {publicPolls.length > 0 && (
              <StaggerIn show={introDone} delay={4600} skip={isReturning} className="hidden lg:flex absolute right-[-40px] xl:right-[-20px] top-1/2 -translate-y-1/2 z-10">
                <ScrollFadeOut>
                  <HeroPollPreview polls={publicPolls} getThumbnail={getThumbnail} onCta={handleCta} />
                </ScrollFadeOut>
              </StaggerIn>
            )}
          </section>

          {/* Quote carousel */}
          <section className="border-t border-border/60 py-12 px-4 bg-muted/30">
            <div className="container mx-auto max-w-3xl">
              <QuoteCarousel />
            </div>
          </section>

          {/* Recent polls — full-width carousel, focus one at a time */}
          {publicPolls.length > 0 && (
            <section className="border-t border-border/60 py-16 overflow-hidden">
              <FadeIn>
                <RecentPollsCarousel polls={publicPolls} getThumbnail={getThumbnail} getOptionMedia={getOptionMedia} />
              </FadeIn>
            </section>
          )}

          {/* CTA */}
          <section className="border-t border-border/60 py-20 px-4 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl tracking-tight mb-4">Ready to pejla?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Free forever. Get your first design feedback in 30 seconds.
              </p>
              <Button size="lg" onClick={handleCta}>
                Share your designs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="mt-4">
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How it works
                </a>
              </div>
            </FadeIn>
          </section>

          {/* How it works — left/right blocks */}
          <section id="how-it-works" className="border-t border-border/60">
            {/* Share */}
            <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
              <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step 1</span>
                    <h2 className="text-2xl md:text-3xl tracking-tight mt-2 mb-3">Share your options</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Upload designs, animations, sound clips, or any file. Paste a Figma, YouTube, or CodePen link.
                      Compare iterations side by side — v1 vs v2 vs v3.
                      Set visibility to public, unlisted, or private.
                    </p>
                  </div>
                  <CardStack />
                </div>
              </FadeIn>
            </div>

            {/* Vote */}
            <div className="border-t border-border/40">
              <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
                <FadeIn>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                      <VotingBars />
                    </div>
                    <div className="order-1 md:order-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step 2</span>
                      <h2 className="text-2xl md:text-3xl tracking-tight mt-2 mb-3">Collect votes</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Share a link — anyone can vote with one tap, on any device.
                        Enable anonymous voting for honest feedback.
                        Protect sensitive polls with a password.
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Decide */}
            <div className="border-t border-border/40">
              <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
                <FadeIn>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step 3</span>
                      <h2 className="text-2xl md:text-3xl tracking-tight mt-2 mb-3">Decide with clarity</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        See results instantly — percentages, comments, and a clear winner.
                        Remix any poll to explore new variations.
                        No more "let's circle back" — just data.
                      </p>
                    </div>
                    <DecideIllustration />
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>
        </div>

        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  // Logged-in: poll feed
  return (
    <div className="container mx-auto p-4 pt-20 pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl">Welcome back{user.username ? `, ${user.username}` : ""}</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse recent decisions or start your own.</p>
        </div>
        <Button asChild>
          <Link to="/create"><PlusCircle className="mr-2 h-4 w-4" /> New</Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : polls.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => {
              const thumb = getThumbnail(poll);
              return (
                <Link key={poll._id} to={`/poll/${poll.shareId}`}
                  className="group block rounded-xl border border-border/60 bg-card overflow-hidden hover:bg-accent/50 transition-colors">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : poll.options.some((o: any) => o.textContent) ? (() => {
                      const textOpt = poll.options.find((o: any) => o.textContent);
                      const ext = (textOpt?.fileName || "").split(".").pop() || "md";
                      return (
                        <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 overflow-hidden relative">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="px-1.5 py-0.5 rounded bg-foreground/10 text-[9px] font-mono font-bold uppercase tracking-wide">{ext}</span>
                          </div>
                          <div className="flex-1 text-[10px] leading-relaxed text-muted-foreground/60 font-mono overflow-hidden">
                            {(textOpt?.textContent || "").slice(0, 200).split("\n").slice(0, 8).map((line: string, li: number) => (
                              <div key={li} className={line.startsWith("#") ? "font-semibold text-foreground/50 mt-0.5" : ""}>{line || "\u00A0"}</div>
                            ))}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-100 dark:from-slate-800 to-transparent" />
                        </div>
                      );
                    })() : poll.options.some((o: any) => o.audioUrl) ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50">
                        <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-6 h-6 text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                          </svg>
                        </div>
                        <span className="text-[10px] text-muted-foreground/40">{poll.options.length} tracks</span>
                      </div>
                    ) : poll.options.some((o: any) => o.embedUrl) ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-muted-foreground/20" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                        </svg>
                        <span className="text-[10px] text-muted-foreground/40">Embed</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50 p-4">
                        <span className="text-sm font-medium text-muted-foreground/25">{poll.title}</span>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {poll.options.slice(0, 3).map((o: any, oi: number) => (
                            <span key={oi} className="px-2 py-0.5 rounded-full bg-foreground/5 text-[9px] text-muted-foreground/40 truncate max-w-[100px]">{o.label}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      {poll.password && (
                        <Badge variant="outline" className="text-[10px] bg-background/80 backdrop-blur-sm flex items-center gap-0.5"><Lock className="h-2.5 w-2.5" /> protected</Badge>
                      )}
                      {poll.visibility && poll.visibility !== "public" && (
                        <Badge variant="outline" className="text-[10px] bg-background/80 backdrop-blur-sm">{poll.visibility}</Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">{poll.totalVotes || 0} votes</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{poll.title}</h3>
                    <p className="text-xs text-muted-foreground">By {poll.creatorName} · {poll.options.length} options</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link to="/create"><PlusCircle className="mr-2 h-4 w-4" /> Create new</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="relative w-[200px] h-[110px] mx-auto mb-8 opacity-20">
            <svg viewBox="0 0 661 657" fill="none" className="absolute left-0 top-0 w-[55%] h-full">
              <path d={dPath} fill="currentColor"/>
            </svg>
            <svg viewBox="0 0 522 657" fill="none" className="absolute right-0 top-0 w-[44%] h-full">
              <path d={nPath} fill="currentColor"/>
            </svg>
            <svg viewBox="0 0 260 260" fill="none" className="absolute left-0 top-0 w-[18%]">
              <path d={dotPath} fill="currentColor"/>
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-2">No polls yet</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Share your work, collect votes, and let the best idea win.
          </p>
          <Button size="lg" asChild>
            <Link to="/create"><PlusCircle className="mr-2 h-4 w-4" /> Share your first design</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
