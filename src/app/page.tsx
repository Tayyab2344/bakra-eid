"use client";

import { useEffect, useState, useRef } from "react";

interface Star {
  id: number;
  size: number;
  top: number;
  left: number;
  dur: string;
  delay: string;
  bg: string;
}

interface ParticleElement {
  id: number;
  size: number;
  rd: string;
  dl: string;
  lf: string;
  bg: string;
}

interface ShootingStar {
  id: number;
  sd: string;
  sdl: string;
  st: string;
  sl: string;
  sw2: string;
}

interface Lantern {
  id: number;
  c1: string;
  c2: string;
  sw: string;
  delay: string;
}

const lanColors = [
  ["#C9A84C", "#6b4a0a"],
  ["#c94c4c", "#6b1414"],
  ["#4c8fc9", "#14446b"],
  ["#4cc97a", "#146b3a"],
  ["#C9A84C", "#6b4a0a"],
  ["#c97a4c", "#6b3a14"],
  ["#9a4cc9", "#4a146b"],
];

export default function Home() {
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<ParticleElement[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [goatSrc, setGoatSrc] = useState("/goat.png");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Generate Stars on client mount
    const tempStars: Star[] = [];
    const starColors = ["#fff", "#E8C97A", "#a0d8c0", "#fff", "#fff"];
    for (let i = 0; i < 120; i++) {
      const sz = Math.random() * 2.8 + 0.4;
      tempStars.push({
        id: i,
        size: sz,
        top: Math.random() * 100,
        left: Math.random() * 100,
        dur: (Math.random() * 3 + 1.5).toFixed(1),
        delay: (Math.random() * 5).toFixed(1),
        bg: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }
    setStars(tempStars);

    // Generate Particles on client mount
    const tempParticles: ParticleElement[] = [];
    const golds = ["#C9A84C", "#E8C97A", "#fff", "#C9A84C"];
    for (let i = 0; i < 40; i++) {
      const sz = Math.random() * 5 + 2;
      tempParticles.push({
        id: i,
        size: sz,
        rd: (Math.random() * 8 + 6).toFixed(1),
        dl: (Math.random() * 10).toFixed(1),
        lf: (Math.random() * 100).toFixed(1),
        bg: golds[Math.floor(Math.random() * golds.length)],
      });
    }
    setParticles(tempParticles);

    // Generate Shooting Stars on client mount
    const tempShooting: ShootingStar[] = [];
    for (let i = 0; i < 6; i++) {
      tempShooting.push({
        id: i,
        sd: (Math.random() * 8 + 6).toFixed(1),
        sdl: (Math.random() * 12).toFixed(1),
        st: (Math.random() * 50).toFixed(1),
        sl: (Math.random() * 30).toFixed(1),
        sw2: Math.floor(Math.random() * 80 + 60).toString(),
      });
    }
    setShootingStars(tempShooting);

    // Generate Lanterns based on window width
    const generateLanterns = () => {
      const count = window.innerWidth < 480 ? 4 : 7;
      const items: Lantern[] = [];
      for (let i = 0; i < count; i++) {
        const [c1, c2] = lanColors[i % lanColors.length];
        const sw = (Math.random() * 2.5 + 2).toFixed(1);
        items.push({
          id: i,
          c1,
          c2,
          sw,
          delay: (i * 0.35).toFixed(1),
        });
      }
      setLanterns(items);
    };

    generateLanterns();
    window.addEventListener("resize", generateLanterns);

    return () => {
      window.removeEventListener("resize", generateLanterns);
    };
  }, []);

  // Fireworks Animation Hook
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const COLORS = ["#C9A84C", "#E8C97A", "#fff", "#4caf70", "#e05050", "#a0d8ff"];

    class FireworkParticle {
      x: number;
      y: number;
      color: string;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = Math.random() * 0.018 + 0.008;
        this.size = Math.random() * 3 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // gravity
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = Math.max(0, this.life);
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 6;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    let particlesArray: FireworkParticle[] = [];

    const burst = (x: number, y: number) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < 70; i++) {
        particlesArray.push(new FireworkParticle(x, y, i % 2 === 0 ? color : color2));
      }
    };

    const launchFirework = () => {
      const x = Math.random() * W * 0.8 + W * 0.1;
      const y = Math.random() * H * 0.45 + H * 0.05;
      burst(x, y);
    };

    let lastFW = 0;
    let animationFrameId: number;

    const animate = (ts: number) => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, W, H);
      if (ts - lastFW > 1800) {
        launchFirework();
        lastFW = ts;
      }
      particlesArray = particlesArray.filter((p) => p.life > 0);
      particlesArray.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
    };

    animationFrameId = requestAnimationFrame(animate);

    // Initial bursts
    const t1 = setTimeout(() => launchFirework(), 1200);
    const t2 = setTimeout(() => launchFirework(), 1600);
    const t3 = setTimeout(() => launchFirework(), 2000);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <>
      <div className="sky" />
      
      <div className="stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              width: `${s.size}px`,
              height: `${s.size}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              background: s.bg,
              // Custom properties passed via style object:
              // @ts-expect-error Custom CSS variables are valid react styles but typescript complains
              "--dur": `${s.dur}s`,
              "--dur-delay": `${s.delay}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.bg,
              // @ts-expect-error Custom CSS variables are valid react styles but typescript complains
              "--rd": `${p.rd}s`,
              "--dl": `${p.dl}s`,
              "--lf": `${p.lf}%`,
            }}
          />
        ))}
      </div>

      <div className="shoot">
        {shootingStars.map((s) => (
          <div
            key={s.id}
            className="shoot-star"
            style={{
              // @ts-expect-error Custom CSS variables are valid react styles but typescript complains
              "--sd": `${s.sd}s`,
              "--sdl": `${s.sdl}s`,
              "--st": `${s.st}%`,
              "--sl": `${s.sl}%`,
              "--sw2": `${s.sw2}px`,
            }}
          />
        ))}
      </div>

      <canvas ref={canvasRef} id="fireworks" />

      <div className="lanterns">
        {lanterns.map((l) => (
          <div
            key={l.id}
            className="lantern-wrap"
            style={{
              // @ts-expect-error Custom CSS variables are valid react styles but typescript complains
              "--sw": `${l.sw}s`,
              animationDelay: `${l.delay}s`,
            }}
          >
            <div className="lantern-string" />
            <div className="lantern-cap" />
            <div
              className="lantern-body"
              style={{
                background: `linear-gradient(135deg, ${l.c1}, ${l.c2})`,
              }}
            />
            <div className="lantern-base" />
            <div className="lantern-tassel" />
          </div>
        ))}
      </div>

      <div className="page">
        <div className="card">
          <div className="corner tl">✦</div>
          <div className="corner tr">✦</div>
          <div className="corner bl">✦</div>
          <div className="corner br">✦</div>

          {/* Moon */}
          <div className="moon-wrap">
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
              <path
                d="M42 11C34 11 24 19 24 34C24 49 34 57 42 57C30 57 12 47 12 34C12 21 30 11 42 11Z"
                fill="#C9A84C"
                opacity="0.92"
              />
              <polygon
                points="52,7 54,13 60,13 55,17 57,23 52,19 47,23 49,17 44,13 50,13"
                fill="#E8C97A"
              />
              <circle cx="58" cy="30" r="2.2" fill="#E8C97A" opacity="0.6" />
              <circle cx="54" cy="40" r="1.4" fill="#E8C97A" opacity="0.4" />
            </svg>
          </div>

          <div className="arabic">عید الاضحی مبارک</div>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>

          <h1 className="title">Eid ul Adha Mubarak</h1>
          <div className="subtitle">Bakra Eid 2026</div>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>

          {/* Goat section */}
          <div className="goat-section">
            <div className="garland">
              <div className="garland-dot" style={{ background: "#e05050", animationDelay: "0s" }} />
              <div className="garland-dot" style={{ background: "#e8c97a", animationDelay: "0.2s" }} />
              <div className="garland-dot" style={{ background: "#4caf70", animationDelay: "0.4s" }} />
              <div className="garland-dot" style={{ background: "#e05050", animationDelay: "0.6s" }} />
              <div className="garland-dot" style={{ background: "#e8c97a", animationDelay: "0.8s" }} />
              <div className="garland-dot" style={{ background: "#4caf70", animationDelay: "1.0s" }} />
              <div className="garland-dot" style={{ background: "#e05050", animationDelay: "1.2s" }} />
            </div>
            <div className="goat-glow-ring" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="goat-img"
              src={goatSrc}
              alt="Bakra - Goat"
              onError={() => {
                if (goatSrc !== "/goat_fallback.png") {
                  setGoatSrc("/goat_fallback.png");
                }
              }}
            />
          </div>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>

          <p className="message">
            May this blessed day of sacrifice fill your heart with joy, your home with warmth, and your life with the
            peace that comes from true devotion. May Allah accept your qurbani and grant you His endless blessings.
          </p>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>

          <div className="taqqabal">تقبل الله منا ومنكم</div>
          <div className="taqqabal-en">Taqabbal Allahu Minna wa Minkum</div>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>

          <div className="from-wrap">
            <div className="from-label">With warm wishes from</div>
            <div className="from-name">Rana Muhammad Tayyab Atiq</div>
            <div className="from-label" style={{ marginTop: "8px", color: "rgba(201,168,76,0.4)" }}>
              ✦ &nbsp; Eid Mubarak to you &amp; your loved ones &nbsp; ✦
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
