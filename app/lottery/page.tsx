"use client";

import { useMemo, useRef, useState } from "react";

const COLORS = [
  "#F87171",
  "#FBBF24",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
  "#4ADE80",
  "#FB923C",
  "#22D3EE",
  "#C084FC",
];

const SPIN_DURATION_MS = 4500;

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
                    className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  >
                    {name}
                    <button
                      onClick={() => handleRemoveName(i)}
                      className="ml-1 text-white/80 hover:text-white"
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
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-72 w-72 sm:h-80 sm:w-80">
            {/* 指針 */}
            <div className="absolute left-1/2 top-[-12px] z-10 -translate-x-1/2">
              <div className="h-0 w-0 border-x-[14px] border-t-[22px] border-x-transparent border-t-red-600 drop-shadow" />
            </div>

            {/* 轉盤本體 */}
            <div
              className="relative h-full w-full overflow-hidden rounded-full border-4 border-gray-800 shadow-lg"
              style={{
                background: wheelBackground,
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                  : "none",
              }}
            >
              {names.map((name, i) => {
                const angle = i * sliceAngle + sliceAngle / 2;
                return (
                  <div
                    key={`${name}-${i}`}
                    className="absolute left-1/2 top-1/2 flex h-0 w-1/2 origin-left items-center justify-end pr-3 text-xs font-semibold text-white sm:text-sm"
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <span
                      className="max-w-[80px] truncate drop-shadow"
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

            {/* 中心圓點 */}
            <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-800 shadow" />
          </div>

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
