import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useSpring, AnimatePresence, useInView } from "framer-motion";
import {
  Github, Linkedin, Mail, Download, ArrowUp, Send,
  MapPin, Phone, ExternalLink, Code2, Sparkles, GraduationCap,
  Briefcase, Award, Trophy, Sun, Moon, ChevronRight, Star,
  Cpu, Database, Wrench, Layers, Brain, Heart, Target, Rocket,
  type LucideIcon,
} from "lucide-react";
import { fetchPortfolio, submitContact } from "@/api/client";
import type { PortfolioData, Project } from "@/api/types";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const SKILL_ICONS: Record<string, LucideIcon> = {
  Layers, Cpu, Database, Code2, Brain, Wrench,
};

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  Trophy, Award, Star,
};

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mb-12 text-center">
      <p className="mb-3 inline-block rounded-full glass px-4 py-1 font-mono text-xs uppercase tracking-widest text-brand-purple">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-bold md:text-5xl">
        {title.split(" ").map((w, i) =>
          i === title.split(" ").length - 1 ? (
            <span key={i} className="gradient-text"> {w}</span>
          ) : (
            <span key={i}>{i ? " " : ""}{w}</span>
          ),
        )}
      </h2>
      {subtitle && <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">{subtitle}</p>}
    </Reveal>
  );
}

function SkillBar({ name, level }: { name: string; level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref}>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="text-foreground/80">{name}</span>
        <span className="font-mono text-muted-foreground">{level}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
        />
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group h-full overflow-hidden rounded-3xl glass"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          width={800}
          height={500}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold">{p.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-brand-blue">{t}</span>
          ))}
        </div>
        <ul className="mt-4 space-y-1">
          {p.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <ChevronRight className="h-3 w-3 text-brand-purple" /> {f}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center gap-2">
          <a href={p.github} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-medium transition-colors hover:bg-white/10">
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
          <a href={p.demo} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-2 text-xs font-medium text-white">
            <ExternalLink className="h-3.5 w-3.5" /> Live Demo
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function Field({ label, name, type = "text", textarea, required }: { label: string; name: string; type?: string; textarea?: boolean; required?: boolean }) {
  const base = "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand-purple focus:bg-white/[0.05]";
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea name={name} required={required} rows={5} className={base} placeholder={`Your ${label.toLowerCase()}...`} />
      ) : (
        <input name={name} required={required} type={type} className={base} placeholder={`Your ${label.toLowerCase()}...`} />
      )}
    </label>
  );
}

function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-brand-blue/20 blur-[120px] animate-blob" />
      <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-brand-purple/20 blur-[140px] animate-blob" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-brand-blue/15 blur-[120px] animate-blob" style={{ animationDelay: "6s" }} />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

function Nav({ theme, setTheme }: { theme: "dark" | "light"; setTheme: (t: "dark" | "light") => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className={`flex items-center justify-between rounded-full px-5 py-3 transition-all ${scrolled ? "glass-strong" : "glass"}`}>
          <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple text-white">
              <Code2 className="h-4 w-4" />
            </span>
            <span className="gradient-text">KM.</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-foreground transition-colors hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ data }: { data: PortfolioData }) {
  const { profile } = data;
  const [roleIdx, setRoleIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const roles = profile.roles;

  useEffect(() => {
    const full = roles[roleIdx];
    const speed = deleting ? 40 : 90;
    const t = setTimeout(() => {
      if (!deleting && text.length < full.length) {
        setText(full.slice(0, text.length + 1));
      } else if (!deleting && text.length === full.length) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && text.length > 0) {
        setText(full.slice(0, text.length - 1));
      } else {
        setDeleting(false);
        setRoleIdx((roleIdx + 1) % roles.length);
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, roleIdx, roles]);

  const [firstName, lastName] = profile.name.split(" ");

  return (
    <section id="top" className="relative min-h-screen px-4 pt-32 pb-20 md:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          {profile.available && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Available for internships & freelance
            </motion.div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-display text-5xl font-bold leading-[1.05] md:text-7xl">
            Hi, I'm <span className="gradient-text">{firstName}</span>
            <br />
            <span className="text-foreground/90">{lastName}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-4 text-base text-muted-foreground md:text-lg">
            {profile.tagline}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 flex items-center gap-2 font-mono text-lg md:text-2xl">
            <span className="text-muted-foreground">{">"}</span>
            <span className="gradient-text font-semibold">{text}</span>
            <span className="inline-block h-6 w-[3px] bg-brand-purple animate-blink md:h-7" />
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {profile.bio}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-purple/30 transition-transform hover:scale-105">
              <Download className="h-4 w-4" /> Download Resume
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10">
              <Send className="h-4 w-4" /> Contact Me
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 flex items-center gap-3">
            {[
              { icon: Github, href: profile.github, label: "GitHub" },
              { icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
              { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
              { icon: Phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, label: "Phone" },
            ].map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full glass transition-all hover:scale-110 hover:bg-white/10 hover:text-brand-purple">
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-blue to-brand-purple opacity-30 blur-2xl animate-pulse" />
          <div className="relative overflow-hidden rounded-[2rem] glass-strong p-2">
            <div className="overflow-hidden rounded-[1.5rem]">
              <img src={profile.profileImage} alt={profile.name} width={896} height={1024} className="aspect-[4/5] w-full object-cover" />
            </div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -left-4 top-10 flex items-center gap-2 rounded-2xl glass-strong px-3 py-2 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-brand-purple" /> AI Enthusiast
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -right-4 bottom-16 flex items-center gap-2 rounded-2xl glass-strong px-3 py-2 text-xs font-medium">
              <Code2 className="h-3.5 w-3.5 text-brand-blue" /> MERN Stack
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: PortfolioData }) {
  const { profile } = data;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await submitContact({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      });
      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Contact" title="Let's build something together" subtitle="Open to internships, freelance projects, and full-time roles." />
        <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
          <Reveal className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: profile.email },
              { icon: Phone, label: "Phone", value: profile.phone },
              { icon: MapPin, label: "Location", value: profile.location },
            ].map((c) => (
              <div key={c.label} className="glass flex items-center gap-4 rounded-2xl p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple">
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="truncate text-sm font-medium">{c.value}</p>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="glass rounded-3xl p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
              </div>
              <div className="mt-4">
                <Field label="Subject" name="subject" required />
              </div>
              <div className="mt-4">
                <Field label="Message" name="message" textarea required />
              </div>
              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
              <button type="submit" disabled={sending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-purple/30 transition-transform hover:scale-[1.02] disabled:opacity-60">
                {sending ? "Sending..." : sent ? "Sent! ✨" : (<>Send Message <Send className="h-4 w-4" /></>)}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer({ name }: { name: string }) {
  return (
    <footer className="relative z-10 border-t border-white/5 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple text-white">
                <Code2 className="h-4 w-4" />
              </span>
              <span className="gradient-text">{name}</span>
            </a>
            <p className="mt-3 text-xs text-muted-foreground">B.Tech IT student at Parul University — building modern MERN & AI-powered web experiences.</p>
          </div>
          <div>
            <p className="mb-3 font-display text-sm font-semibold">Quick Links</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {NAV_LINKS.map((l) => (
                <li key={l.id}><a className="hover:text-foreground" href={`#${l.id}`}>{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 text-[11px] text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <p>Designed & Developed by <span className="gradient-text font-semibold">{name}</span></p>
        </div>
      </div>
    </footer>
  );
}

function PortfolioContent({ data }: { data: PortfolioData }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-blue to-brand-purple" />
      <BackgroundFX />
      <Nav theme={theme} setTheme={setTheme} />
      <main className="relative z-10">
        <Hero data={data} />
        <section id="about" className="relative px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="About Me" title="A passionate builder and learner" />
            <div className="grid gap-6 md:grid-cols-2">
              <Reveal className="glass rounded-3xl p-8">
                <div className="mb-4 inline-flex items-center gap-2 text-brand-blue">
                  <Brain className="h-5 w-5" /> <span className="font-semibold">Professional Summary</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{data.about.summary}</p>
              </Reveal>
              <Reveal delay={0.1} className="glass rounded-3xl p-8">
                <div className="mb-4 inline-flex items-center gap-2 text-brand-purple">
                  <Target className="h-5 w-5" /> <span className="font-semibold">Career Objective</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{data.about.objective}</p>
              </Reveal>
              <Reveal delay={0.15} className="glass rounded-3xl p-8">
                <div className="mb-4 inline-flex items-center gap-2 text-brand-blue">
                  <Rocket className="h-5 w-5" /> <span className="font-semibold">Strengths</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.about.strengths.map((s) => (
                    <span key={s} className="rounded-full bg-white/5 px-3 py-1 text-xs text-foreground/80">{s}</span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2} className="glass rounded-3xl p-8">
                <div className="mb-4 inline-flex items-center gap-2 text-brand-purple">
                  <Heart className="h-5 w-5" /> <span className="font-semibold">Personal Interests</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.about.interests.map((s) => (
                    <span key={s} className="rounded-full bg-white/5 px-3 py-1 text-xs text-foreground/80">{s}</span>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal className="mt-16">
              <h3 className="mb-8 text-center font-display text-2xl font-semibold">Academic Journey</h3>
              <div className="relative mx-auto max-w-3xl">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-brand-blue via-brand-purple to-transparent md:left-1/2" />
                {data.about.timeline.map((t, i) => (
                  <Reveal key={t.year} delay={i * 0.08} className={`relative mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
                    <div className={`pl-12 md:pl-0 ${i % 2 ? "md:pr-12 md:text-right md:[direction:ltr]" : "md:pr-12 md:text-right"}`}>
                      <div className="glass rounded-2xl p-5">
                        <p className="font-mono text-xs text-brand-purple">{t.year}</p>
                        <h4 className="mt-1 font-display text-lg font-semibold">{t.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                    </div>
                    <div className="hidden md:block" />
                    <div className="absolute left-4 top-5 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple ring-4 ring-background md:left-1/2" />
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
        <section id="skills" className="relative px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Skills" title="What I work with daily" subtitle="A toolkit refined through projects, hackathons, and curiosity." />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.skillGroups.map((g, idx) => {
                const Icon = SKILL_ICONS[g.icon] ?? Code2;
                return (
                  <Reveal key={g.label} delay={idx * 0.08} className="group glass rounded-3xl p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.06]">
                    <div className={`mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${g.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-display text-lg font-semibold">{g.label}</h3>
                    <div className="mt-5 space-y-4">
                      {g.items.map((it) => (
                        <SkillBar key={it.name} name={it.name} level={it.level} />
                      ))}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
        <section id="projects" className="relative px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Projects" title="Things I've built recently" subtitle="A selection of projects that showcase my skills across web and AI." />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.projects.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <ProjectCard p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section id="experience" className="relative px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="Coursework" title="Focus areas & academic work" />
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-brand-blue via-brand-purple to-transparent md:left-6" />
              {data.experience.map((e, i) => (
                <Reveal key={e.title} delay={i * 0.08} className="relative mb-6 pl-14 md:pl-20">
                  <div className="absolute left-2 top-4 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple ring-4 ring-background md:left-4">
                    <Briefcase className="h-2.5 w-2.5 text-white" />
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-brand-purple/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand-purple">{e.type}</span>
                      <span className="font-mono text-xs text-muted-foreground">{e.period}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold">{e.title}</h3>
                    <p className="text-sm text-brand-blue">{e.org}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{e.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section id="education" className="relative px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Education" title="My academic background" />
            <div className="grid gap-6 md:grid-cols-3">
              {data.education.map((e, i) => (
                <Reveal key={e.degree} delay={i * 0.08}>
                  <motion.div whileHover={{ y: -6 }} className="glass h-full rounded-3xl p-6">
                    <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-display text-base font-semibold leading-tight">{e.degree}</h3>
                    <p className="mt-2 text-sm text-foreground/80">{e.college}</p>
                    <p className="text-xs text-muted-foreground">{e.university}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                      <span className="text-muted-foreground">{e.year}</span>
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-brand-purple">{e.cgpa}</span>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section id="certificates" className="relative px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Certificates" title="Continuous learning matters" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.certificates.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.05}>
                  <motion.div whileHover={{ scale: 1.02 }} className="glass flex items-start gap-4 rounded-2xl p-5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-semibold leading-tight">{c.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{c.org} · {c.year}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section id="achievements" className="relative px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Achievements" title="Milestones I'm proud of" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.achievements.map((a, i) => {
                const Icon = ACHIEVEMENT_ICONS[a.icon] ?? Trophy;
                return (
                  <Reveal key={a.title} delay={i * 0.05}>
                    <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6">
                      <Icon className="h-7 w-7 text-brand-purple" />
                      <h3 className="mt-4 font-display text-base font-semibold">{a.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Tech Stack" title="Tools in my arsenal" />
            <div className="flex flex-wrap justify-center gap-3">
              {data.techStack.map((t, i) => (
                <Reveal key={t} delay={i * 0.03}>
                  <motion.div whileHover={{ scale: 1.1, rotate: -2 }} className="glass cursor-default rounded-2xl px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10">
                    <span className="gradient-text">{t}</span>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="GitHub" title="My open-source activity" subtitle="Live stats from my GitHub — updated daily." />
            <Reveal className="glass overflow-hidden rounded-3xl p-6 md:p-8">
              <img src={`https://ghchart.rshah.org/8B5CF6/${data.githubUsername}`} alt="GitHub contributions" loading="lazy" className="w-full" />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <img src={`https://github-readme-stats.vercel.app/api?username=${data.githubUsername}&show_icons=true&theme=tokyonight&hide_border=true&bg_color=00000000`} alt="GitHub stats" loading="lazy" className="w-full rounded-xl" />
                <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${data.githubUsername}&layout=compact&theme=tokyonight&hide_border=true&bg_color=00000000`} alt="Top languages" loading="lazy" className="w-full rounded-xl" />
                <img src={`https://github-readme-streak-stats.herokuapp.com/?user=${data.githubUsername}&theme=tokyonight&hide_border=true&background=00000000`} alt="GitHub streak" loading="lazy" className="w-full rounded-xl md:col-span-2" />
              </div>
            </Reveal>
          </div>
        </section>
        <ContactSection data={data} />
      </main>
      <Footer name={data.profile.name} />
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-white shadow-lg shadow-brand-purple/30 transition-transform hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Portfolio() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-purple border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center glass rounded-3xl p-8">
          <h1 className="font-display text-xl font-semibold">Could not load portfolio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Make sure the Express server and MongoDB are running."}
          </p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            npm run dev:server && npm run seed
          </p>
        </div>
      </div>
    );
  }

  return <PortfolioContent data={data} />;
}
