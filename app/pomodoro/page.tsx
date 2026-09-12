"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "work" | "shortBreak" | "longBreak";

const MODE_LABEL: Record<Mode, string> = {
  work: "專注",
  shortBreak: "短休息",
  longBreak: "長休息",
};

const MODE_COLOR: Record<Mode, string> = {
  work: "#EF4444",
  shortBreak: "#10B981",
  longBreak: "#3B82F6",
};

export default function PomodoroPage() {
  const [workMin, setWorkMin] = useState(25);
  const [shortBreakMin, setShortBreakMin] = useState(5);
  const [longBreakMin, setLongBreakMin] = useState(15);
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = useState(4);

  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(workMin * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedWorkCycles, setCompletedWorkCycles] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const durations = useMemo(
    () => ({
      work: workMin * 60,
      shortBreak: shortBreakMin * 60,
      longBreak: longBreakMin * 60,
    }),
    [workMin, shortBreakMin, longBreakMin]
  );

  // 計時器 tick
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // 時間到，切換模式
  useEffect(() => {
    if (secondsLeft !== 0) return;
    if (!isRunning) return;

    playBeep();

    if (mode === "work") {
      const nextCompleted = completedWorkCycles + 1;
      setCompletedWorkCycles(nextCompleted);
      const isLongBreakTime = nextCompleted % cyclesBeforeLongBreak === 0;
      const nextMode: Mode = isLongBreakTime ? "longBreak" : "shortBreak";
      setMode(nextMode);
      setSecondsLeft(durations[nextMode]);
    } else {
      setMode("work");
      setSecondsLeft(durations.work);
    }
    setIsRunning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  function playBeep() {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // 忽略無法播放音效的環境
    }
  }

  function handleStartPause() {
    setIsRunning((prev) => !prev);
  }

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(durations[mode]);
  }

  function handleSkip() {
    setIsRunning(false);
    if (mode === "work") {
      const nextCompleted = completedWorkCycles + 1;
      setCompletedWorkCycles(nextCompleted);
      const isLongBreakTime = nextCompleted % cyclesBeforeLongBreak === 0;
      const nextMode: Mode = isLongBreakTime ? "longBreak" : "shortBreak";
      setMode(nextMode);
      setSecondsLeft(durations[nextMode]);
    } else {
      setMode("work");
      setSecondsLeft(durations.work);
    }
  }

  function handleSwitchMode(newMode: Mode) {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(durations[newMode]);
  }

  function handleSettingChange(setter: (v: number) => void, value: number) {
    if (isRunning) return;
    const safeValue = Math.max(1, Math.min(180, value));
    setter(safeValue);
  }

  // 設定值改變時，若目前不在計時中，同步更新剩餘秒數
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(durations[mode]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workMin, shortBreakMin, longBreakMin]);

  const totalForMode = durations[mode];
  const progress = totalForMode > 0 ? (totalForMode - secondsLeft) / totalForMode : 0;
  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const ringBackground = `conic-gradient(${MODE_COLOR[mode]} ${
    progress * 360
  }deg, #E5E7EB 0deg)`;

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-bold sm:text-3xl">🍅 番茄鐘</h1>

      {/* 模式切換 */}
      <div className="flex gap-2 rounded-full bg-gray-100 p-1">
        {(["work", "shortBreak", "longBreak"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleSwitchMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              mode === m
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {MODE_LABEL[m]}
          </button>
        ))}
      </div>

      {/* 圓形計時器 */}
      <div
        className="relative flex h-72 w-72 items-center justify-center rounded-full sm:h-80 sm:w-80"
        style={{ background: ringBackground }}
      >
        <div className="flex h-[85%] w-[85%] flex-col items-center justify-center gap-2 rounded-full bg-white shadow-inner">
          <span className="text-5xl font-bold tabular-nums text-gray-900 sm:text-6xl">
            {minutes}:{seconds}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {MODE_LABEL[mode]}中
          </span>
        </div>
      </div>

      {/* 控制按鈕 */}
      <div className="flex gap-3">
        <button
          onClick={handleStartPause}
          className="rounded-full bg-red-600 px-8 py-3 text-lg font-bold text-white shadow hover:bg-red-700"
        >
          {isRunning ? "暫停" : "開始"}
        </button>
        <button
          onClick={handleReset}
          className="rounded-full bg-gray-200 px-6 py-3 text-lg font-medium text-gray-700 shadow hover:bg-gray-300"
        >
          重置
        </button>
        <button
          onClick={handleSkip}
          className="rounded-full bg-gray-200 px-6 py-3 text-lg font-medium text-gray-700 shadow hover:bg-gray-300"
        >
          跳過
        </button>
      </div>

      <p className="text-sm text-gray-500">
        已完成專注次數：<span className="font-semibold">{completedWorkCycles}</span>
        （每 {cyclesBeforeLongBreak} 次進入長休息）
      </p>

      {/* 時間設定 */}
      <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-200 p-4">
        <span className="text-sm font-medium text-gray-700">
          時間設定（分鐘）{isRunning && "（計時中無法修改）"}
        </span>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SettingField
            label="專注"
            value={workMin}
            disabled={isRunning}
            onChange={(v) => handleSettingChange(setWorkMin, v)}
          />
          <SettingField
            label="短休息"
            value={shortBreakMin}
            disabled={isRunning}
            onChange={(v) => handleSettingChange(setShortBreakMin, v)}
          />
          <SettingField
            label="長休息"
            value={longBreakMin}
            disabled={isRunning}
            onChange={(v) => handleSettingChange(setLongBreakMin, v)}
          />
          <SettingField
            label="幾輪後長休"
            value={cyclesBeforeLongBreak}
            disabled={isRunning}
            onChange={(v) =>
              handleSettingChange(
                (val) => setCyclesBeforeLongBreak(val),
                v
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

function SettingField({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-600">
      {label}
      <input
        type="number"
        min={1}
        max={180}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value) || 1)}
        className="rounded-lg border border-gray-300 px-2 py-1 text-center outline-none focus:border-blue-500 disabled:bg-gray-100"
      />
    </label>
  );
}
