"use client";

import { useState } from "react";

type FortuneLevel = {
  name: string;
  weight: number;
  color: string;
  bgColor: string;
  tier: "good" | "neutral" | "bad";
};

const FORTUNE_LEVELS: FortuneLevel[] = [
  { name: "大吉", weight: 5, color: "#B91C1C", bgColor: "#FEF2F2", tier: "good" },
  { name: "中吉", weight: 10, color: "#C2410C", bgColor: "#FFF7ED", tier: "good" },
  { name: "小吉", weight: 15, color: "#B45309", bgColor: "#FFFBEB", tier: "good" },
  { name: "吉", weight: 20, color: "#4D7C0F", bgColor: "#F7FEE7", tier: "good" },
  { name: "半吉", weight: 10, color: "#15803D", bgColor: "#F0FDF4", tier: "neutral" },
  { name: "末吉", weight: 10, color: "#0F766E", bgColor: "#F0FDFA", tier: "neutral" },
  { name: "凶", weight: 12, color: "#1D4ED8", bgColor: "#EFF6FF", tier: "bad" },
  { name: "小凶", weight: 8, color: "#4338CA", bgColor: "#EEF2FF", tier: "bad" },
  { name: "半凶", weight: 6, color: "#6D28D9", bgColor: "#F5F3FF", tier: "bad" },
  { name: "末小凶", weight: 3, color: "#7E22CE", bgColor: "#FAF5FF", tier: "bad" },
  { name: "大凶", weight: 1, color: "#171717", bgColor: "#F5F5F5", tier: "bad" },
];

const ASPECTS: Record<
  "good" | "neutral" | "bad",
  { career: string[]; love: string[]; wealth: string[]; health: string[] }
> = {
  good: {
    career: [
      "工作進展順利，努力會被看見。",
      "適合主動出擊，提出新想法會有好結果。",
      "貴人運旺，合作案容易成功。",
    ],
    love: [
      "桃花運旺，單身者有機會遇到心動對象。",
      "與另一半感情升溫，適合安排約會。",
      "真誠表達心意，會得到正面回應。",
    ],
    wealth: [
      "偏財運不錯，但仍建議理性投資。",
      "有機會獲得意外收入或獎金。",
      "財運亨通，適合規劃儲蓄或投資。",
    ],
    health: [
      "精神狀態良好，適合運動增強體力。",
      "身體無大礙，保持規律作息即可。",
      "氣色佳，正是調養身心的好時機。",
    ],
  },
  neutral: {
    career: [
      "工作平穩，維持現狀即可，不宜躁進。",
      "小有進展，需要多一點耐心。",
      "合作上溝通清楚，可避免誤會。",
    ],
    love: [
      "感情運普通，順其自然發展最好。",
      "單身者可多參加社交活動增加機會。",
      "情侶間宜多溝通，避免冷戰。",
    ],
    wealth: [
      "財運持平，量入為出較安心。",
      "不宜做大額投資，儲蓄為上策。",
      "收支平衡，適合檢視預算規劃。",
    ],
    health: [
      "健康普通，注意勿過度勞累。",
      "適度休息，避免熬夜。",
      "留意飲食均衡，多喝水。",
    ],
  },
  bad: {
    career: [
      "工作上容易遇到阻礙，凡事宜謹慎小心。",
      "不宜做重大決策，宜以守代攻。",
      "與同事溝通易生誤會，說話前多想想。",
    ],
    love: [
      "感情運低迷，避免衝動的言語與決定。",
      "單身者暫緩告白，時機尚未成熟。",
      "情侶間容易有摩擦，多包容忍讓。",
    ],
    wealth: [
      "財運不佳，避免借貸或投機行為。",
      "容易有意外開銷，記得控管預算。",
      "不宜投資，宜守成保本。",
    ],
    health: [
      "注意身體警訊，勿輕忽小病痛。",
      "容易疲勞，記得充分休息。",
      "出入小心，避免意外受傷。",
    ],
  },
};

function pickWeightedFortune(): FortuneLevel {
  const totalWeight = FORTUNE_LEVELS.reduce((sum, f) => sum + f.weight, 0);
  let r = Math.random() * totalWeight;
  for (const f of FORTUNE_LEVELS) {
    if (r < f.weight) return f;
    r -= f.weight;
  }
  return FORTUNE_LEVELS[FORTUNE_LEVELS.length - 1];
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function FortunePage() {
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState<{
    level: FortuneLevel;
    career: string;
    love: string;
    wealth: string;
    health: string;
  } | null>(null);

  function handleDraw() {
    if (drawing) return;
    setDrawing(true);
    setResult(null);

    setTimeout(() => {
      const level = pickWeightedFortune();
      const aspects = ASPECTS[level.tier];
      setResult({
        level,
        career: pickOne(aspects.career),
        love: pickOne(aspects.love),
        wealth: pickOne(aspects.wealth),
        health: pickOne(aspects.health),
      });
      setDrawing(false);
    }, 900);
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-bold sm:text-3xl">🎋 好運抽籤</h1>
      <p className="text-sm text-gray-500">誠心默念心願，點擊籤筒抽出今日運勢</p>

      {/* 籤筒 */}
      <button
        onClick={handleDraw}
        disabled={drawing}
        className={`flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-2xl border-4 border-red-800 bg-gradient-to-b from-red-600 to-red-800 text-white shadow-lg transition sm:h-48 sm:w-48 ${
          drawing ? "animate-bounce" : "hover:scale-105"
        }`}
      >
        <span className="text-5xl">🥢</span>
        <span className="text-lg font-bold">
          {drawing ? "抽籤中..." : "點我抽籤"}
        </span>
      </button>

      {result && (
        <div
          className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border-2 p-6 shadow-lg"
          style={{
            borderColor: result.level.color,
            backgroundColor: result.level.bgColor,
          }}
        >
          <span
            className="text-5xl font-extrabold tracking-widest"
            style={{ color: result.level.color }}
          >
            {result.level.name}
          </span>

          <div className="mt-2 grid w-full grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
            <FortuneRow icon="💼" label="事業" text={result.career} />
            <FortuneRow icon="❤️" label="感情" text={result.love} />
            <FortuneRow icon="💰" label="財運" text={result.wealth} />
            <FortuneRow icon="🩺" label="健康" text={result.health} />
          </div>

          <button
            onClick={handleDraw}
            className="mt-2 rounded-full bg-gray-800 px-6 py-2 text-sm font-medium text-white shadow hover:bg-gray-900"
          >
            重新抽一次
          </button>
        </div>
      )}
    </div>
  );
}

function FortuneRow({
  icon,
  label,
  text,
}: {
  icon: string;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-white/70 p-3">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}
