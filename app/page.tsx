import Link from "next/link";

const TOOLS = [
  {
    href: "/lottery",
    emoji: "🎡",
    title: "抽獎轉盤",
    description:
      "輸入名單、轉動轉盤，隨機抽出幸運得主。適合抽獎、分組或決定順序。",
    accent: "from-rose-500 to-orange-400",
    ring: "ring-rose-100",
  },
  {
    href: "/pomodoro",
    emoji: "🍅",
    title: "番茄鐘",
    description:
      "專注工作、規律休息。可自訂時間長度，幫助你維持高效率的工作節奏。",
    accent: "from-emerald-500 to-teal-400",
    ring: "ring-emerald-100",
  },
  {
    href: "/fortune",
    emoji: "🎋",
    title: "好運抽籤",
    description:
      "誠心抽一支籤，看看今天的事業、感情、財運與健康運勢如何。",
    accent: "from-indigo-500 to-purple-400",
    ring: "ring-indigo-100",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-rose-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
        />

        <div className="relative mx-auto flex w-full min-w-0 max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
          <span className="rounded-full border border-gray-200 bg-white/80 px-4 py-1 text-xs font-medium text-gray-500 shadow-sm backdrop-blur">
            免費・線上・即開即用
          </span>
          <h1 className="w-full min-w-0 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Hank 的小工具箱
          </h1>
          <p className="w-full min-w-0 max-w-xl text-base text-gray-600 sm:text-lg">
            集合幾個生活與工作中會用到的小工具，簡單、實用、不用安裝，
            打開網頁就能直接使用。
          </p>
          <a
            href="#tools"
            className="mt-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
          >
            開始探索工具 ↓
          </a>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            三個實用小工具
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            點選卡片，立即前往使用
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ${tool.ring} transition hover:-translate-y-1 hover:shadow-xl`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tool.accent}`}
              />
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 text-3xl">
                {tool.emoji}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{tool.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-gray-600">
                {tool.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
                立即使用
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
