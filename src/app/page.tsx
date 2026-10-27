
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, ArrowLeft, Sparkles, Orbit, BrainCircuit,
  Compass, Hammer, Heart, Send, RotateCcw, ShieldCheck,
  CheckCircle2, Clock3, Rocket, Target, WandSparkles,
  ChevronRight, MessageCircle, Stars, Zap, Menu, X,
  GraduationCap, BriefcaseBusiness, CircleUserRound,
  Trash2, Lightbulb, ArrowUpRight
} from "lucide-react";

type Scenario = "Explorer" | "Builder" | "Balanced Path";
type Page = "home" | "onboarding" | "dashboard" | "chat";

type Profile = {
  name: string;
  interests: string;
  learning: string;
  skills: string;
  goal: string;
  career: string;
  fiveYearGoal: string;
  motivation: string;
  years: number;
  scenario: Scenario;
};

type Message = {
  id: string;
  role: "user" | "future";
  content: string;
  time: string;
};

const emptyProfile: Profile = {
  name: "", interests: "", learning: "", skills: "",
  goal: "", career: "", fiveYearGoal: "", motivation: "",
  years: 10, scenario: "Builder"
};

const scenarios: {
  name: Scenario;
  description: string;
  icon: typeof Compass;
}[] = [
  {
    name: "Explorer",
    description: "Curiosity, new experiences, and discovering possibilities.",
    icon: Compass
  },
  {
    name: "Builder",
    description: "Creating projects, developing expertise, and building ideas.",
    icon: Hammer
  },
  {
    name: "Balanced Path",
    description: "Meaningful progress, relationships, and sustainable growth.",
    icon: Heart
  }
];

const suggestions = [
  "What should I focus on this year?",
  "What challenges might I face?",
  "How can I stay motivated?",
  "What advice would you give me?"
];

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function simulatedReply(message: string, p: Profile): string {
  const q = message.toLowerCase();
  const name = p.name || "friend";
  const goal = p.goal || "your main ambition";
  const career = p.career || "your chosen direction";
  const skills = p.skills || "the skills that matter to you";
  const learning = p.learning || "something meaningful";

  if (/focus|today|this year|start|first step|now/.test(q)) {
    return `Hey ${name}, from this imagined ${p.years}-year future, I'd tell you to start smaller than you think. You're interested in ${career}, so pick one skill related to ${skills} and practice it consistently. Instead of worrying about the entire journey toward "${goal}", choose one achievable action this week.`;
  }

  if (/challenge|hard|failure|struggle|obstacle|mistake/.test(q)) {
    return `In this possible future, the most valuable challenges weren't necessarily dramatic. They might have been uncertainty, slow progress, or moments of doubt. While learning ${learning}, you could discover that asking for help, trying again, and changing your approach matter more than getting everything right the first time.`;
  }

  if (/motiv|inspir|give up|discipline|consistent/.test(q)) {
    return `Remember why you started, ${name}. You said that "${p.motivation || goal}" matters to you. Motivation can change from day to day, so create habits that work even when enthusiasm fades. Celebrate small progress, take breaks when needed, and allow your ambitions to evolve.`;
  }

  if (/career|job|work|profession|success/.test(q)) {
    return `Imagine that you continued exploring ${career}. You might have built projects, met mentors, developed ${skills}, and discovered opportunities you cannot currently see. That doesn't guarantee a particular job or outcome, but it gives you practical ways to increase your options.`;
  }

  if (/learn|skill|study|education|knowledge/.test(q)) {
    return `I hope you stay curious about ${learning}. In this scenario, your growth comes from combining learning with real practice. Build something, share it with someone, collect feedback, and improve it. Those experiences could be just as valuable as completing another course.`;
  }

  if (/happy|balance|family|friend|health|life/.test(q)) {
    return `One thing I'd encourage is making room for life outside your ambitions. In our imagined future, friendships, rest, health, and curiosity all remain important. You don't need to sacrifice everything else to make progress toward ${goal}.`;
  }

  if (/future|become|where|achievement|year/.test(q)) {
    return `Picture a version of yourself ${p.years} years from now who has kept exploring ${career}. Perhaps you've worked toward ${goal} and discovered new interests along the way. The details are uncertain, but the next choices you make can help shape the opportunities available to you.`;
  }

  const alternatives = [
    `That's an interesting question, ${name}. In this ${p.scenario.toLowerCase()} scenario, I'd think about how it connects to ${goal}. What is one experiment you could try today to learn more?`,
    `A possible future doesn't require every decision to be perfect. Keep developing ${skills}, ask questions, and give yourself permission to change direction when you learn something new.`,
    `If I could offer one thought from this fictional future, it would be this: build opportunities through curiosity and action rather than trying to predict exactly what happens next.`,
    `Your interest in ${p.interests || career} could open several different paths. Consider what you enjoy, what problems you want to solve, and who you might learn from.`
  ];

  return alternatives[message.length % alternatives.length];
}

function milestones(p: Profile) {
  return [
    {
      year: 1,
      title: "The First Breakthrough",
      description: `You might complete a meaningful project while learning ${p.learning || "new skills"}.`,
      icon: GraduationCap
    },
    {
      year: 3,
      title: "Building Momentum",
      description: `You could develop stronger abilities in ${p.skills || "your chosen field"} and connect with mentors.`,
      icon: Zap
    },
    {
      year: 5,
      title: "New Opportunities",
      description: `You might make meaningful progress toward ${p.fiveYearGoal || p.goal || "your ambitions"}.`,
      icon: BriefcaseBusiness
    },
    {
      year: 10,
      title: "A New Perspective",
      description: `You could discover a fulfilling direction in ${p.career || "a career that matters to you"}.`,
      icon: Rocket
    },
    {
      year: 20,
      title: "A Lasting Impact",
      description: "You might use your experience to mentor others and contribute to your community.",
      icon: Stars
    }
  ].filter(item => item.year <= p.years);
}

export default function Home() {
  const [page, setPage] = useState<Page>("home");
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem("futureme-profile");
      const chat = localStorage.getItem("futureme-chat");
      if (data) {
        const parsed = JSON.parse(data) as Profile;
        setProfile({ ...emptyProfile, ...parsed });
        setSaved(true);
      }
      if (chat) setMessages(JSON.parse(chat) as Message[]);
    } catch {
      localStorage.removeItem("futureme-profile");
      localStorage.removeItem("futureme-chat");
    }
    setLoaded(true);

    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
      if (generationTimer.current) clearTimeout(generationTimer.current);
    };
  }, []);

  useEffect(() => {
    if (loaded && saved) {
      localStorage.setItem("futureme-profile", JSON.stringify(profile));
    }
  }, [profile, loaded, saved]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("futureme-chat", JSON.stringify(messages));
    }
  }, [messages, loaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function navigate(next: Page) {
    setMobileOpen(false);
    if ((next === "dashboard" || next === "chat") && !saved) {
      setPage("onboarding");
      return;
    }
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function update(field: keyof Profile, value: string | number) {
    setProfile(prev => ({ ...prev, [field]: value }));
    setError("");
  }

  function nextStep() {
    if (step === 0 && !profile.name.trim()) {
      setError("Please enter your name to continue.");
      return;
    }
    if (step === 1 && !profile.goal.trim()) {
      setError("Please tell us your main ambition.");
      return;
    }
    setError("");
    if (step < 3) setStep(prev => prev + 1);
    else generate();
  }

  function generate() {
    setGenerating(true);
    generationTimer.current = setTimeout(() => {
      setSaved(true);
      setMessages([]);
      setGenerating(false);
      setStep(0);
      setPage("dashboard");
      window.scrollTo({ top: 0 });
    }, 1100);
  }

  function sendMessage(text = input) {
    const clean = text.trim();
    if (!clean || typing) return;

    const userMessage: Message = {
      id: makeId(),
      role: "user",
      content: clean,
      time: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    replyTimer.current = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: makeId(),
          role: "future",
          content: simulatedReply(clean, profile),
          time: new Date().toISOString()
        }
      ]);
      setTyping(false);
    }, 700);
  }

  function clearChat() {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setTyping(false);
    setMessages([]);
  }

  function deleteData() {
    if (!window.confirm("Delete your FutureMe profile and conversations?")) return;
    if (replyTimer.current) clearTimeout(replyTimer.current);
    if (generationTimer.current) clearTimeout(generationTimer.current);
    localStorage.removeItem("futureme-profile");
    localStorage.removeItem("futureme-chat");
    setSaved(false);
    setProfile(emptyProfile);
    setMessages([]);
    setTyping(false);
    setStep(0);
    navigate("home");
  }

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:bg-white/[0.07]";

  const panel =
    "rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-xl";

  const navItems: { label: string; target: Page }[] = [
    { label: "Home", target: "home" },
    { label: "Simulator", target: "onboarding" },
    { label: "Dashboard", target: "dashboard" },
    { label: "Future Chat", target: "chat" }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080B16] text-slate-100 selection:bg-violet-500/40">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-16 h-[480px] w-[480px] rounded-full bg-violet-700/10 blur-[110px]" />
        <div className="absolute -right-40 top-60 h-[520px] w-[520px] rounded-full bg-sky-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-fuchsia-700/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,.12) 1px, transparent 1px),linear-gradient(90deg,rgba(148,163,184,.12) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(to bottom,black,transparent 85%)"
          }}
        />
      </div>

      {/* Navigation */}
      <header className="relative z-30 border-b border-white/[0.07] bg-[#080B16]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button onClick={() => navigate("home")} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 shadow-lg shadow-violet-500/20">
              <Orbit size={23} className="text-white" />
            </span>
            <span className="text-xl font-black tracking-tight">future<span className="text-violet-400">me.</span></span>
          </button>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            {navItems.map(item => (
              <button key={item.label} onClick={() => navigate(item.target)}
                className={`text-sm transition hover:text-white ${page === item.target ? "text-violet-300" : "text-slate-400"}`}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:block">
            <button onClick={() => navigate(saved ? "dashboard" : "onboarding")}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#080B16] transition hover:bg-violet-200">
              {saved ? "My Future" : "Get Started"} <ArrowUpRight size={15} className="ml-1 inline" />
            </button>
          </div>

          <button aria-label="Toggle menu" aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileOpen && (
          <nav aria-label="Mobile navigation" className="space-y-2 border-t border-white/10 bg-[#111827] p-5 md:hidden">
            {navItems.map(item => (
              <button key={item.label} onClick={() => navigate(item.target)}
                className="block w-full rounded-xl px-4 py-3 text-left text-slate-200 hover:bg-white/10">
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="relative z-10">
        {/* HOME */}
        {page === "home" && (
          <>
            <section className="mx-auto grid min-h-[790px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8">
              <div>
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-2 text-xs font-semibold tracking-wider text-violet-300">
                  <Sparkles size={14} /> EXPLORE YOUR POSSIBLE TOMORROWS
                </div>
                <h1 className="max-w-2xl text-5xl font-black leading-[1.06] tracking-[-0.045em] sm:text-6xl xl:text-7xl">
                  MEET YOUR
                  <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-300 to-sky-400 bg-clip-text text-transparent">
                    FUTURE SELF.
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-xl leading-relaxed text-slate-300">
                  The future isn't written. Explore who you could become.
                </p>
                <p className="mt-4 max-w-lg leading-8 text-slate-400">
                  Step into a possible tomorrow, explore your ambitions, and discover the choices that could shape your journey.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button onClick={() => navigate(saved ? "dashboard" : "onboarding")}
                    className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 font-bold text-white shadow-xl shadow-violet-700/25 transition hover:scale-[1.03] hover:shadow-violet-700/40">
                    Meet My Future Self <ArrowRight size={19} className="transition group-hover:translate-x-1" />
                  </button>
                  <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                    className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-semibold transition hover:bg-white/10">
                    Explore How It Works
                  </button>
                </div>
                <div className="mt-10 flex items-center gap-3 text-sm text-slate-400">
                  <ShieldCheck className="text-emerald-400" size={20} />
                  Free simulation · No account required · Stored in your browser
                </div>
              </div>

              {/* Futuristic timeline visual */}
              <div className="relative mx-auto flex h-[490px] w-full max-w-[560px] items-center justify-center sm:h-[560px]">
                <div className="absolute h-[380px] w-[380px] animate-pulse rounded-full bg-violet-600/10 blur-[80px] motion-reduce:animate-none" />
                <div className="absolute h-[350px] w-[350px] rounded-full border border-violet-400/15 sm:h-[440px] sm:w-[440px]" />
                <div className="absolute h-[285px] w-[285px] rounded-full border border-dashed border-sky-400/20 sm:h-[360px] sm:w-[360px]" />
                <div className="absolute h-[220px] w-[220px] rounded-full border border-violet-400/30 sm:h-[280px] sm:w-[280px]" />
                <div className="absolute h-[210px] w-[210px] rounded-full bg-gradient-to-br from-violet-600/25 via-indigo-500/10 to-sky-500/25 blur-2xl" />

                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-violet-400/40 bg-[#13132c]/90 shadow-[0_0_100px_rgba(139,92,246,.22)] sm:h-60 sm:w-60">
                  <div className="absolute inset-3 rounded-full border border-white/10" />
                  <CircleUserRound className="h-28 w-28 text-violet-300/85 sm:h-36 sm:w-36" strokeWidth={0.8} />
                  <div className="absolute -bottom-4 rounded-full border border-violet-500/30 bg-[#16132d] px-5 py-2 text-xs font-bold tracking-[0.2em] text-violet-300">
                    FUTURE YOU
                  </div>
                </div>

                <div className="absolute left-0 top-[15%] rounded-2xl border border-white/10 bg-[#171a30]/90 p-4 shadow-xl backdrop-blur-lg">
                  <Target className="mb-2 text-violet-400" size={22} />
                  <div className="text-sm font-bold">Your ambitions</div>
                  <div className="text-xs text-slate-500">Discover your path</div>
                </div>
                <div className="absolute right-0 top-[21%] rounded-2xl border border-white/10 bg-[#171a30]/90 p-4 shadow-xl backdrop-blur-lg">
                  <BrainCircuit className="mb-2 text-sky-400" size={22} />
                  <div className="text-sm font-bold">New skills</div>
                  <div className="text-xs text-slate-500">Unlock possibilities</div>
                </div>
                <div className="absolute bottom-[12%] left-[2%] rounded-2xl border border-white/10 bg-[#171a30]/90 p-4 shadow-xl backdrop-blur-lg">
                  <Rocket className="mb-2 text-pink-400" size={22} />
                  <div className="text-sm font-bold">Future milestones</div>
                  <div className="text-xs text-slate-500">Imagine what's next</div>
                </div>
                <div className="absolute bottom-[9%] right-[2%] rounded-xl border border-violet-400/20 bg-[#171a30]/95 px-4 py-3 text-xs font-semibold tracking-widest text-violet-300">
                  PAST · NOW · FUTURE
                </div>
              </div>
            </section>

            <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
              <div className="mb-12 text-center">
                <div className="mb-4 text-xs font-bold tracking-[0.25em] text-violet-400">THE EXPERIENCE</div>
                <h2 className="text-3xl font-black tracking-tight sm:text-5xl">A glimpse into what could be.</h2>
                <p className="mt-4 text-slate-400">Three simple steps. Countless possibilities to explore.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {[
                  { icon: CircleUserRound, title: "Discover Yourself", description: "Share your interests, goals, and the future you'd like to explore." },
                  { icon: Orbit, title: "Explore Your Future", description: "See a personalized, fictional journey across your chosen timeline." },
                  { icon: MessageCircle, title: "Start a Conversation", description: "Talk to a simulated future version of yourself and explore new perspectives." }
                ].map((item, i) => (
                  <div key={item.title} className={`${panel} p-8 transition hover:-translate-y-1 hover:border-violet-400/30`}>
                    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                      <item.icon size={27} />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-slate-500">STEP 0{i + 1}</span>
                    <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ONBOARDING */}
        {page === "onboarding" && (
          <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
            <div className="mb-10 text-center">
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-violet-300">
                <Sparkles size={17} /> YOUR FUTURE STARTS HERE
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Design your possible future.</h1>
              <p className="mt-4 text-slate-400">Tell us a little about yourself to personalize the simulation.</p>
            </div>

            <div className={`${panel} p-6 sm:p-10`}>
              <div className="mb-5 flex items-center justify-between text-sm">
                <span className="font-semibold text-violet-300">Step {step + 1} of 4</span>
                <span className="text-slate-500">{["About You", "Your Ambitions", "Future Timeline", "Choose Scenario"][step]}</span>
              </div>
              <div className="mb-10 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400 transition-all duration-500"
                  style={{ width: `${(step + 1) * 25}%` }} />
              </div>

              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">First, let's get to know you.</h2>
                  <div><label htmlFor="name" className="mb-2 block text-sm text-slate-300">What should we call you? *</label>
                    <input id="name" className={inputClass} value={profile.name} maxLength={80}
                      onChange={e => update("name", e.target.value)} placeholder="Your first name" /></div>
                  <div><label htmlFor="interests" className="mb-2 block text-sm text-slate-300">What are your interests?</label>
                    <input id="interests" className={inputClass} value={profile.interests}
                      onChange={e => update("interests", e.target.value)} placeholder="Technology, art, science, travel..." /></div>
                  <div><label htmlFor="learning" className="mb-2 block text-sm text-slate-300">What are you currently studying or learning?</label>
                    <input id="learning" className={inputClass} value={profile.learning}
                      onChange={e => update("learning", e.target.value)} placeholder="For example, web development" /></div>
                  <div><label htmlFor="skills" className="mb-2 block text-sm text-slate-300">Which skills would you like to develop?</label>
                    <input id="skills" className={inputClass} value={profile.skills}
                      onChange={e => update("skills", e.target.value)} placeholder="Programming, leadership, communication..." /></div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">What drives you forward?</h2>
                  <div><label htmlFor="goal" className="mb-2 block text-sm text-slate-300">Your biggest ambition *</label>
                    <textarea id="goal" rows={2} className={inputClass} value={profile.goal}
                      onChange={e => update("goal", e.target.value)} placeholder="I want to build something meaningful..." /></div>
                  <div><label htmlFor="career" className="mb-2 block text-sm text-slate-300">Career you'd like to explore</label>
                    <input id="career" className={inputClass} value={profile.career}
                      onChange={e => update("career", e.target.value)} placeholder="AI engineer, entrepreneur, designer..." /></div>
                  <div><label htmlFor="fiveyear" className="mb-2 block text-sm text-slate-300">What would you like to achieve in five years?</label>
                    <input id="fiveyear" className={inputClass} value={profile.fiveYearGoal}
                      onChange={e => update("fiveYearGoal", e.target.value)} placeholder="Launch a company, earn a degree..." /></div>
                  <div><label htmlFor="motivation" className="mb-2 block text-sm text-slate-300">What motivates you?</label>
                    <input id="motivation" className={inputClass} value={profile.motivation}
                      onChange={e => update("motivation", e.target.value)} placeholder="Creating opportunities, helping others..." /></div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold">How far ahead should we imagine?</h2>
                  <p className="mt-2 text-slate-400">Choose the future version of yourself you'd like to meet.</p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {[1, 5, 10, 20].map(year => (
                      <button key={year} onClick={() => update("years", year)}
                        className={`rounded-2xl border p-7 text-left transition hover:scale-[1.02] ${
                          profile.years === year
                            ? "border-violet-400 bg-violet-500/20 shadow-lg shadow-violet-500/10"
                            : "border-white/10 bg-white/[0.035] hover:border-white/25"
                        }`}>
                        <Clock3 className="mb-5 text-violet-300" size={25} />
                        <div className="text-3xl font-black">+{year}</div>
                        <div className="mt-2 text-sm text-slate-400">{year === 1 ? "Year" : "Years"} from now</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold">Choose your possible path.</h2>
                  <p className="mt-2 text-slate-400">Every future is a possibility, not a prediction.</p>
                  <div className="mt-7 space-y-4">
                    {scenarios.map(s => (
                      <button key={s.name} onClick={() => update("scenario", s.name)}
                        className={`flex w-full items-center gap-5 rounded-2xl border p-5 text-left transition ${
                          profile.scenario === s.name
                            ? "border-violet-400 bg-violet-500/15"
                            : "border-white/10 bg-white/[0.035] hover:border-violet-400/30"
                        }`}>
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                          <s.icon size={25} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold">{s.name}</div>
                          <div className="mt-1 text-sm leading-6 text-slate-400">{s.description}</div>
                        </div>
                        {profile.scenario === s.name && <CheckCircle2 className="shrink-0 text-violet-400" size={22} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <p role="alert" className="mt-6 text-sm text-rose-300">{error}</p>}

              <div className="mt-10 flex justify-between gap-4">
                <button onClick={() => step === 0 ? navigate("home") : setStep(prev => prev - 1)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-300 hover:bg-white/5">
                  <ArrowLeft size={17} /> Back
                </button>
                <button disabled={generating} onClick={nextStep}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-bold transition hover:bg-violet-500 disabled:opacity-60">
                  {generating ? "Creating scenario..." : step === 3 ? "Explore My Future" : "Continue"}
                  {!generating && <ArrowRight size={17} />}
                </button>
              </div>
              {generating && (
                <div className="mt-5 text-center text-sm text-violet-300" role="status">
                  Exploring possible futures with a rule-based simulation...
                </div>
              )}
            </div>
          </section>
        )}

        {/* DASHBOARD */}
        {page === "dashboard" && saved && (
          <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-violet-300">
                  <Sparkles size={18} /> YOUR POSSIBLE FUTURE
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                  Hello, <span className="text-violet-400">{profile.name}.</span>
                </h1>
                <p className="mt-3 text-slate-400">Welcome to a possible version of your future.</p>
              </div>
              <button onClick={() => navigate("chat")}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-bold hover:bg-violet-500">
                <MessageCircle size={19} /> Talk to Future You
              </button>
            </div>

            <div className="mb-6 rounded-2xl border border-sky-400/20 bg-sky-400/[0.055] px-5 py-4 text-sm leading-7 text-sky-200">
              <Lightbulb size={18} className="mr-2 inline" />
              This is an imaginative, rule-based scenario—not an AI prediction. Your real future will depend on many factors, including choices, opportunities, and circumstances.
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className={`${panel} relative overflow-hidden p-7 sm:p-9`}>
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />
                <div className="relative">
                  <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-2 text-xs font-bold tracking-widest text-violet-300">
                    FUTURE IDENTITY
                  </span>
                  <div className="mt-10 flex items-center gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-sky-600">
                      <CircleUserRound size={43} />
                    </div>
                    <div>
                      <h2 className="break-words text-3xl font-black">{profile.name}</h2>
                      <p className="mt-1 text-slate-400">A possible you in {new Date().getFullYear() + profile.years}</p>
                    </div>
                  </div>

                  <div className="mt-10 grid gap-5 sm:grid-cols-2">
                    {[
                      ["CAREER DIRECTION", profile.career || "Still exploring"],
                      ["FUTURE SCENARIO", profile.scenario],
                      ["MAIN AMBITION", profile.goal],
                      ["TIME HORIZON", `${profile.years} year${profile.years === 1 ? "" : "s"}`]
                    ].map(([label, value]) => (
                      <div key={label} className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5">
                        <div className="text-[11px] font-bold tracking-widest text-slate-500">{label}</div>
                        <p className="mt-3 break-words font-semibold">{value || "To be discovered"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${panel} flex flex-col justify-between p-7 sm:p-9`}>
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300">
                    <WandSparkles size={28} />
                  </div>
                  <h3 className="text-2xl font-bold">Your future is unwritten.</h3>
                  <p className="mt-4 leading-8 text-slate-400">
                    Imagine making consistent progress toward <span className="text-white">{profile.goal}</span>.
                    Every small experiment, project, and conversation could help you explore new opportunities.
                  </p>
                </div>
                <button onClick={() => navigate("chat")}
                  className="mt-8 flex w-full items-center justify-between rounded-2xl border border-violet-400/30 bg-violet-500/10 p-5 font-bold text-violet-200 hover:bg-violet-500/20">
                  Ask Your Future Self <ArrowRight size={19} />
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-7 flex items-center gap-3">
                <Target className="text-violet-400" />
                <h2 className="text-2xl font-bold">Your Possible Milestones</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {milestones(profile).map(item => (
                  <div key={item.year} className={`${panel} p-6 transition hover:border-violet-400/25`}>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                        <item.icon size={23} />
                      </div>
                      <span className="text-xs font-bold tracking-widest text-slate-500">YEAR +{item.year}</span>
                    </div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button onClick={() => { setStep(0); navigate("onboarding"); }}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/10">
                <RotateCcw size={16} className="mr-2 inline" /> Redesign My Future
              </button>
              <button onClick={deleteData}
                className="rounded-xl border border-rose-400/20 px-5 py-3 text-sm font-semibold text-rose-300 hover:bg-rose-400/10">
                <Trash2 size={16} className="mr-2 inline" /> Delete My Data
              </button>
            </div>
          </section>
        )}

        {/* CHAT */}
        {page === "chat" && saved && (
          <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-violet-300">
                <Sparkles size={16} /> SIMULATED FUTURE CONVERSATION
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">A conversation across time.</h1>
              <p className="mt-3 text-slate-400">Ask questions, explore possibilities, and discover new perspectives.</p>
            </div>

            <div className={`${panel} flex h-[min(75vh,750px)] min-h-[550px] flex-col overflow-hidden`}>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-600">
                    <CircleUserRound size={27} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-bold">Future {profile.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Rule-based simulation · {new Date().getFullYear() + profile.years}
                    </div>
                  </div>
                </div>
                <button title="Clear conversation" aria-label="Clear conversation"
                  onClick={clearChat} className="rounded-xl border border-white/10 p-3 text-slate-400 hover:bg-white/10 hover:text-white">
                  <RotateCcw size={19} />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-7" aria-live="polite">
                <div className="mx-auto max-w-md rounded-xl bg-sky-400/10 px-4 py-3 text-center text-xs leading-6 text-sky-200">
                  You're talking to an imagined future self. Responses are generated by local rules, not a real person or a predictive AI.
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600">
                    <Sparkles size={18} />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-[#1a1e35] px-5 py-4 text-sm leading-7 sm:text-base">
                    Hey {profile.name}! Imagine we're talking {profile.years} years from now. I know you've been thinking about {profile.goal}. What would you like to explore together?
                  </div>
                </div>

                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-7 sm:max-w-[75%] sm:text-base ${
                      m.role === "user"
                        ? "rounded-br-sm bg-violet-600 text-white"
                        : "rounded-bl-sm border border-white/10 bg-[#1a1e35]"
                    }`}>
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      <div className={`mt-2 text-right text-[10px] ${m.role === "user" ? "text-violet-200" : "text-slate-500"}`}>
                        {new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex items-center gap-3 text-sm text-violet-300" role="status">
                    <Sparkles size={16} className="animate-pulse motion-reduce:animate-none" />
                    Imagining a response...
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-white/10 bg-[#101525]/90 p-4 sm:p-6">
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                  {suggestions.map(question => (
                    <button key={question} disabled={typing} onClick={() => sendMessage(question)}
                      className="shrink-0 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-medium text-violet-200 transition hover:bg-violet-400/20 disabled:opacity-50">
                      {question}
                    </button>
                  ))}
                </div>
                <form onSubmit={e => { e.preventDefault(); sendMessage(); }}
                  className="flex items-end gap-3">
                  <input aria-label="Message your future self" value={input} onChange={e => setInput(e.target.value)}
                    maxLength={1000}
                    placeholder="Ask your future self anything..."
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-4 text-sm outline-none placeholder:text-slate-500 focus:border-violet-400/60" />
                  <button type="submit" disabled={!input.trim() || typing}
                    aria-label="Send message"
                    className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-violet-600 transition hover:bg-violet-500 disabled:opacity-40">
                    <Send size={21} />
                  </button>
                </form>
                <p className="mt-3 text-center text-[11px] text-slate-500">
                  Your conversation is saved only in this browser.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-10 mt-12 border-t border-white/[0.07] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Orbit size={18} className="text-violet-400" />
            <span className="font-bold text-slate-300">futureme.</span>
            <span>Explore possibilities. Create your path.</span>
          </div>
          <span>Fictional futures, never guaranteed predictions.</span>
        </div>
      </footer>
    </div>
  );
}
  