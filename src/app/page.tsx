
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";


const categories = [
  { id: 1, title: "Vocabulary", icon: "📖", count: "2,400+ words", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  { id: 2, title: "Grammar", icon: "✍️", count: "180+ lessons", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  { id: 3, title: "Listening", icon: "🎧", count: "500+ exercises", bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700" },
  { id: 4, title: "Speaking", icon: "🗣️", count: "300+ topics", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
  { id: 5, title: "Reading", icon: "📰", count: "1,000+ texts", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" },
  { id: 6, title: "Writing", icon: "🖊️", count: "250+ prompts", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
];

const stats = [
  { value: "50K+", label: "Active Learners" },
  { value: "10K+", label: "Lessons" },
  { value: "98%", label: "Satisfaction" },
  { value: "40+", label: "Countries" },
];

const testimonials = [
  {
    name: "Nguyen Thi Lan",
    role: "Software Engineer",
    avatar: "N",
    text: "My IELTS score jumped from 6.0 to 7.5 in just 3 months. The structured lessons and daily practice made all the difference.",
    rating: 5,
  },
  {
    name: "Tran Minh Duc",
    role: "University Student",
    avatar: "T",
    text: "I finally feel confident speaking English at work. The speaking exercises are incredibly practical and well-designed.",
    rating: 5,
  },
  {
    name: "Jab com",
    role: "Marketing Manager",
    avatar: "L",
    text: "The vocabulary builder is phenomenal. I learn 20 new words daily and actually remember them thanks to spaced repetition.",
    rating: 5,
  },
];

const levels = [
  { label: "A1-A2", name: "Beginner", desc: "Build your foundation", color: "bg-emerald-500" },
  { label: "B1-B2", name: "Intermediate", desc: "Expand your fluency", color: "bg-amber-500" },
  { label: "C1-C2", name: "Advanced", desc: "Achieve mastery", color: "bg-rose-500" },
];

export default async function Home() {
  // const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-linear-to-br from-stone-900 via-stone-800 to-emerald-950 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-28 lg:pt-40 lg:pb-36">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left copy */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
                🌿 #1 English Learning Platform
              </span>
              <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tight mb-6">
                Speak English
                <span className="block italic text-emerald-400" style={{ fontFamily: 'Georgia, serif' }}>
                  with confidence.
                </span>
              </h1>
              <p className="text-stone-400 text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-10">
                Structured lessons, real-world practice, and personal feedback — everything you need to go from beginner to fluent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/courses"
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-900/40 text-center"
                >
                  Start Learning Free →
                </Link>
                <Link
                  href="#"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 text-center"
                >
                  Watch Demo
                </Link>
              </div>
            </div>

            {/* Right — floating progress card */}
            <div className="shrink-0 w-full max-w-sm">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-semibold text-stone-300">Today&apos;s Progress</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">Day 12 🔥</span>
                </div>
                {[
                  { label: "Vocabulary", pct: 75, color: "bg-emerald-400" },
                  { label: "Grammar", pct: 50, color: "bg-amber-400" },
                  { label: "Listening", pct: 88, color: "bg-sky-400" },
                ].map((item) => (
                  <div key={item.label} className="mb-4">
                    <div className="flex justify-between text-xs text-stone-400 mb-1">
                      <span>{item.label}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-stone-400">Next lesson</span>
                  <span className="text-sm font-semibold text-white">Past Perfect Tense →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black text-stone-900 tracking-tight">{s.value}</p>
              <p className="text-sm text-stone-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEVELS ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Your Path</p>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-stone-900">
            Learn at{" "}
            <span className="italic text-emerald-600" style={{ fontFamily: 'Georgia, serif' }}>
              your pace
            </span>
          </h2>
          <p className="text-stone-500 mt-4 max-w-md mx-auto">
            From your first &quot;Hello&quot; to business-level fluency — we guide you every step.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((l) => (
            <div
              key={l.name}
              className="group relative border border-stone-200 bg-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${l.color}`} />
              <span className="inline-block text-xs font-bold tracking-widest text-stone-400 uppercase mb-4">{l.label}</span>
              <h3 className="text-2xl font-black text-stone-900 mb-2">{l.name}</h3>
              <p className="text-stone-500 text-sm">{l.desc}</p>
              <div className="mt-6 text-sm font-semibold text-stone-400 group-hover:text-emerald-600 transition-colors">
                Explore courses →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-stone-100/60 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">What You&apos;ll Learn</p>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-stone-900">
              All skills,{" "}
              <span className="italic text-emerald-600" style={{ fontFamily: 'Georgia, serif' }}>
                one place
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link
                href="#"
                key={cat.id}
                className={`group flex items-center gap-5 ${cat.bg} border ${cat.border} rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
              >
                <span className="text-4xl">{cat.icon}</span>
                <div>
                  <h3 className={`text-lg font-bold ${cat.text}`}>{cat.title}</h3>
                  <p className="text-stone-500 text-sm mt-0.5">{cat.count}</p>
                </div>
                <span className={`ml-auto text-xl ${cat.text} opacity-0 group-hover:opacity-100 transition-opacity`}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Learner Stories</p>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-stone-900">
            Real results,{" "}
            <span className="italic text-emerald-600" style={{ fontFamily: 'Georgia, serif' }}>
              real people
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{t.name}</p>
                  <p className="text-stone-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-linear-to-r from-stone-900 to-emerald-950 rounded-3xl p-12 lg:p-16 text-white text-center relative overflow-hidden">
          <div className="absolute top-4 right-8 text-8xl opacity-5 select-none rotate-12">A</div>
          <div className="absolute bottom-4 left-8 text-8xl opacity-5 select-none -rotate-12">英</div>
          <div className="relative">
            <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">Start Today — It&apos;s Free</p>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Your English journey
              <span className="block italic text-emerald-400" style={{ fontFamily: 'Georgia, serif' }}>
                starts now.
              </span>
            </h2>
            <p className="text-stone-400 max-w-md mx-auto mb-10">
              Join 50,000+ learners already building their confidence. No credit card required.
            </p>
            <div
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-900/50 text-lg"
            >
              <SignUpButton>Create Free Account →</SignUpButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
