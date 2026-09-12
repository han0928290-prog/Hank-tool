"use client";

import { useMemo, useRef, useState } from "react";

const COLORS = [
  "#FBCFE8",
  "#FDE68A",
  "#BBF7D0",
  "#BFDBFE",
  "#DDD6FE",
  "#FED7AA",
  "#99F6E4",
  "#FECACA",
  "#E9D5FF",
  "#FEF08A",
];

const LIGHT_COUNT = 16;

const SPIN_DURATION_MS = 4500;

const WOOD_GRADIENT =
  "linear-gradient(180deg, #7a4322 0%, #5c2f14 35%, #3b1c0a 75%, #2a1206 100%)";
const WOOD_GRAIN =
  "repeating-linear-gradient(94deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 3px, transparent 8px)";
const WOOD_BEVEL =
  "inset 0 2px 0 rgba(255,205,120,0.25), inset 0 -4px 8px rgba(0,0,0,0.6), inset 5px 0 10px rgba(0,0,0,0.4), inset -5px 0 10px rgba(0,0,0,0.4), 0 10px 16px -6px rgba(0,0,0,0.55)";
const GOLD_GRADIENT =
  "linear-gradient(180deg, #fff6d8 0%, #ffd75e 35%, #c8860a 70%, #7a4a08 100%)";
const GOLD_BEVEL =
  "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.4)";

export default function LotteryPage() {
  const [rawInput, setRawInput] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sliceAngle = names.length > 0 ? 360 / names.length : 0;

  const wheelBackground = useMemo(() => {
    if (names.length === 0) {
      return "#E5E7EB";
    }
    if (names.length === 1) {
      return COLORS[0];
    }
    const stops = names.map((_, i) => {
      const color = COLORS[i % COLORS.length];
      const start = i * sliceAngle;
      const end = (i + 1) * sliceAngle;
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  }, [names, sliceAngle]);

  function handleUpdateNames() {
    const parsed = rawInput
      .split(/[\n,、]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setNames(parsed);
    setWinner(null);
    setRotation(0);
  }

  function handleRemoveName(index: number) {
    setNames((prev) => prev.filter((_, i) => i !== index));
    setWinner(null);
  }

  function handleSpin() {
    if (names.length < 2 || spinning) return;

    setWinner(null);
    setSpinning(true);

    const winnerIndex = Math.floor(Math.random() * names.length);
    const centerAngle = winnerIndex * sliceAngle + sliceAngle / 2;
    const jitter = (Math.random() - 0.5) * sliceAngle * 0.7;
    const targetAngle = centerAngle + jitter;

    const extraSpins = 6 + Math.floor(Math.random() * 3); // 6~8 圈
    const currentMod = ((rotation % 360) + 360) % 360;
    const neededDelta =
      ((360 - targetAngle - currentMod) % 360 + 360) % 360;
    const totalDelta = extraSpins * 360 + neededDelta;

    const newRotation = rotation + totalDelta;
    setRotation(newRotation);

    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = setTimeout(() => {
      setSpinning(false);
      setWinner(names[winnerIndex]);
    }, SPIN_DURATION_MS);
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-4 py-10 sm:py-16">
      <style>{`
        @keyframes bulbGlow {
          0%, 49% {
            box-shadow: 0 0 1px 0 rgba(255,214,120,0.3);
            opacity: 0.25;
          }
          50%, 100% {
            box-shadow: 0 0 12px 5px rgba(255,214,120,1), 0 0 20px 9px rgba(255,160,40,0.65);
            opacity: 1;
          }
        }
      `}</style>
      <h1 className="text-2xl font-bold sm:text-3xl">🎉 抽獎轉盤</h1>

      <div className="flex w-full max-w-4xl flex-col-reverse gap-10 md:flex-row md:items-start md:justify-center">
        {/* 名單輸入區 */}
        <div className="flex w-full flex-col gap-3 md:w-80">
          <label className="text-sm font-medium text-gray-700">
            輸入名單（每行一個，或用逗號分隔）
          </label>
          <textarea
            className="h-40 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500"
            placeholder={"小明\n小華\n小美"}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
          />
          <button
            onClick={handleUpdateNames}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            更新名單
          </button>

          {names.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                目前名單（{names.length} 人）
              </span>
              <ul className="flex flex-wrap gap-2">
                {names.map((name, i) => (
                  <li
                    key={`${name}-${i}`}
                    className="flex items-center gap-1 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-gray-700"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  >
                    {name}
                    <button
                      onClick={() => handleRemoveName(i)}
                      className="ml-1 text-gray-500 hover:text-gray-800"
                      aria-label={`移除 ${name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 轉盤區 */}
        <div className="flex flex-col items-center">
          <div className="relative h-72 w-72 sm:h-80 sm:w-80">
            {/* 指針 */}
            <div className="absolute left-1/2 top-[-20px] z-20 -translate-x-1/2">
              <div
                className="h-7 w-4"
                style={{
                  clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                  background:
                    "linear-gradient(115deg, #fca5a5 0%, #ef4444 35%, #b91c1c 100%)",
                  filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.45))",
                }}
              />
              <div
                className="mx-auto -mt-1 h-2.5 w-2.5 rounded-full ring-2 ring-white"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #fca5a5 0%, #dc2626 60%, #7f1d1d 100%)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.45)",
                }}
              />
            </div>

            {/* 金色外框 + 燈泡 */}
            <div
              className="absolute inset-0 rounded-full p-[10px]"
              style={{
                background:
                  "radial-gradient(circle at 32% 22%, #fef9c3 0%, #fde68a 22%, #f2b53a 45%, #d97706 72%, #8a4408 100%)",
                boxShadow:
                  "inset 0 3px 5px rgba(255,255,255,0.75), inset 0 -6px 10px rgba(0,0,0,0.35), 0 20px 32px -10px rgba(0,0,0,0.5), 0 6px 10px -4px rgba(0,0,0,0.3)",
              }}
            >
              {/* 金屬掃光高光 */}
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 210deg, rgba(255,255,255,0.55) 0deg, rgba(255,255,255,0) 55deg, rgba(255,255,255,0) 300deg, rgba(255,255,255,0.3) 360deg)",
                  mixBlendMode: "overlay",
                }}
              />

              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
                  const angle = (360 / LIGHT_COUNT) * i;
                  return (
                    <div
                      key={i}
                      className="absolute left-1/2 top-1/2 h-0 w-1/2 origin-left"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <div
                        className="absolute right-[3px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full sm:h-2.5 sm:w-2.5"
                        style={{
                          background:
                            "radial-gradient(circle at 35% 30%, #ffffff 0%, #fff7d6 40%, #ffd75e 75%, #f2a51f 100%)",
                          animationName: "bulbGlow",
                          animationDuration: "1s",
                          animationTimingFunction: "linear",
                          animationIterationCount: "infinite",
                          animationDelay: `${(i % 2) * 0.5}s`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 轉盤外殼：固定不轉，負責邊框與玻璃光澤 */}
              <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-white/90 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                {/* 旋轉層：色塊、分隔線與文字 */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: wheelBackground,
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning
                      ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                      : "none",
                  }}
                >
                  {names.length > 1 &&
                    names.map((_, i) => (
                      <div
                        key={`div-${i}`}
                        className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left bg-black/10"
                        style={{ transform: `rotate(${i * sliceAngle - 90}deg)` }}
                      />
                    ))}
                  {names.map((name, i) => {
                    const angle = i * sliceAngle + sliceAngle / 2;
                    return (
                      <div
                        key={`${name}-${i}`}
                        className="absolute left-1/2 top-1/2 flex h-0 w-1/2 origin-left items-center justify-end pr-3 text-xs font-semibold text-gray-700 sm:text-sm"
                        style={{
                          transform: `rotate(${angle - 90}deg)`,
                        }}
                      >
                        <span
                          className="max-w-[80px] truncate drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]"
                          title={name}
                        >
                          {name}
                        </span>
                      </div>
                    );
                  })}
                  {names.length === 0 && (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      請先輸入名單
                    </div>
                  )}
                </div>

                {/* 靜態玻璃光澤層：不隨轉盤旋轉，模擬壓克力罩反光 */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.25) 18%, rgba(255,255,255,0) 42%), radial-gradient(circle at 75% 85%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 55%)",
                    boxShadow: "inset 0 0 22px rgba(0,0,0,0.22)",
                  }}
                />
              </div>
            </div>

            {/* 中心圓點 */}
            <div
              className="absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-300"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #fca5a5 0%, #dc2626 55%, #7f1d1d 100%)",
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.5)",
              }}
            />
          </div>

          {/* 底座裝飾：獎盃式階梯木座 + 燙金字 */}
          <div className="-mt-1 flex flex-col items-center">
            {/* 金色頸環 */}
            <div
              className="h-2.5 w-9 rounded-sm"
              style={{
                background: GOLD_GRADIENT,
                boxShadow: GOLD_BEVEL,
              }}
            />
            {/* 木柱 */}
            <div
              className="h-4 w-4"
              style={{
                background: WOOD_GRADIENT,
                boxShadow:
                  "inset 2px 0 3px rgba(0,0,0,0.5), inset -2px 0 3px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,214,150,0.3)",
              }}
            />
            {/* 金色環飾 */}
            <div
              className="h-2 w-16 rounded-sm"
              style={{ background: GOLD_GRADIENT, boxShadow: GOLD_BEVEL }}
            />

            {/* 第一階：上層木座（最窄） */}
            <div
              className="relative h-4 w-36 overflow-hidden rounded-[3px]"
              style={{ background: WOOD_GRADIENT, boxShadow: WOOD_BEVEL }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{ background: WOOD_GRAIN }}
              />
            </div>

            {/* 金色環飾 */}
            <div
              className="h-2 w-44 rounded-sm"
              style={{ background: GOLD_GRADIENT, boxShadow: GOLD_BEVEL }}
            />

            {/* 第二階：中層木座（含燙金銘牌） */}
            <div
              className="relative flex h-11 w-52 items-center justify-center overflow-hidden rounded-[3px]"
              style={{ background: WOOD_GRADIENT, boxShadow: WOOD_BEVEL }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{ background: WOOD_GRAIN }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-3"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)",
                }}
              />

              {/* 內凹燙金銘牌 */}
              <div
                className="relative flex h-7 w-44 items-center justify-center rounded-sm border border-black/40"
                style={{
                  background: "linear-gradient(180deg, #241004 0%, #150a02 100%)",
                  boxShadow:
                    "inset 0 3px 5px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="text-sm font-bold tracking-[0.25em]"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    backgroundImage:
                      "linear-gradient(180deg, #fff6d8 0%, #ffd75e 35%, #c8860a 68%, #7a4a08 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.35), 0 -1px 1px rgba(0,0,0,0.7)",
                  }}
                >
                  HANK TOOL
                </span>
              </div>
            </div>

            {/* 金色環飾（最寬） */}
            <div
              className="h-2.5 w-64 rounded-sm"
              style={{ background: GOLD_GRADIENT, boxShadow: GOLD_BEVEL }}
            />

            {/* 第三階：底層木座（最寬最厚） */}
            <div
              className="relative h-6 w-72 overflow-hidden rounded-[4px]"
              style={{
                background: WOOD_GRADIENT,
                boxShadow:
                  "inset 0 2px 0 rgba(255,205,120,0.25), inset 0 -5px 10px rgba(0,0,0,0.6), inset 6px 0 12px rgba(0,0,0,0.4), inset -6px 0 12px rgba(0,0,0,0.4), 0 20px 28px -8px rgba(0,0,0,0.65)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{ background: WOOD_GRAIN }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-3"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)",
                }}
              />
            </div>

            {/* 地面陰影 */}
            <div
              className="mt-3 h-3 w-56 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 70%)",
              }}
            />
          </div>

          <div className="mt-4" />

          <button
            onClick={handleSpin}
            disabled={names.length < 2 || spinning}
            className="rounded-full bg-red-600 px-8 py-3 text-lg font-bold text-white shadow hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {spinning ? "轉動中..." : "開始抽獎"}
          </button>

          {names.length < 2 && (
            <p className="text-sm text-gray-500">請至少輸入 2 個名字才能開始抽獎</p>
          )}

          {winner && !spinning && (
            <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 px-6 py-4 text-center shadow">
              <p className="text-sm text-gray-600">🎊 中獎者是</p>
              <p className="text-2xl font-bold text-yellow-600">{winner}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
