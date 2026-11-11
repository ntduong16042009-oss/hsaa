import React from 'react';
import { ExamAttempt } from '../types';
import { TopicAccuracyStat } from '../utils/examEngine';

interface ScoreLineChartProps {
  attempts: ExamAttempt[];
}

export const ScoreLineChart: React.FC<ScoreLineChartProps> = ({ attempts }) => {
  const ordered = [...attempts].reverse().slice(-8);

  if (ordered.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        Chưa có dữ liệu điểm số theo thời gian.
      </div>
    );
  }

  const width = 560;
  const height = 210;
  const padLeft = 40;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 36;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const points = ordered.map((a, idx) => {
    const x =
      ordered.length === 1
        ? padLeft + innerW / 2
        : padLeft + (idx / (ordered.length - 1)) * innerW;
    const normalized = Math.max(0, Math.min(100, a.score));
    const y = padTop + innerH - (normalized / 100) * innerH;
    return { x, y, attempt: a };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${points[0].x},${padTop + innerH} ${polylinePoints} ${
    points[points.length - 1].x
  },${padTop + innerH}`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-56 overflow-visible"
        role="img"
        aria-label="Biểu đồ tiến bộ điểm số qua các lần thi"
      >
        <defs>
          <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {[0, 25, 50, 75, 100].map((val) => {
          const y = padTop + innerH - (val / 100) * innerH;
          return (
            <g key={val}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeDasharray={val === 0 ? undefined : '4 4'}
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono tabular-nums"
              >
                {val}
              </text>
            </g>
          );
        })}

        {points.length > 1 && <polygon points={areaPoints} fill="url(#scoreAreaGrad)" />}

        {points.length > 1 && (
          <polyline
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />
        )}

        {points.map((p, idx) => {
          const dateShort = new Date(p.attempt.completedAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
          });
          return (
            <g key={p.attempt.id + idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="fill-white dark:fill-slate-900 stroke-[#2563EB]"
                strokeWidth="2.5"
              />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                className="fill-[#10243A] dark:fill-slate-200 text-[11px] font-semibold font-mono tabular-nums"
              >
                {p.attempt.score}
              </text>
              <text
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono tabular-nums"
              >
                Lần {idx + 1} ({dateShort})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

interface TopicBarChartProps {
  stats: TopicAccuracyStat[];
}

export const TopicBarChart: React.FC<TopicBarChartProps> = ({ stats }) => {
  const activeStats = stats.filter((s) => s.totalAnswered > 0);
  const displayList = activeStats.length > 0 ? stats : stats.slice(0, 6);

  return (
    <div className="space-y-2.5" role="region" aria-label="Biểu đồ kết quả theo chủ đề">
      {displayList.map((item) => {
        const barColor =
          item.totalAnswered === 0
            ? 'bg-slate-200 dark:bg-slate-800'
            : item.accuracyPercent >= 80
            ? 'bg-[#16A34A]'
            : item.accuracyPercent >= 60
            ? 'bg-[#2563EB]'
            : item.accuracyPercent >= 40
            ? 'bg-[#F59E0B]'
            : 'bg-[#DC2626]';

        return (
          <div key={item.topic} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate pr-2">
                {item.topic}
              </span>
              <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                {item.totalAnswered > 0
                  ? `${item.accuracyPercent}% (${item.correctCount}/${item.totalAnswered})`
                  : 'Chưa làm'}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                style={{ width: `${Math.max(item.totalAnswered > 0 ? 4 : 0, item.accuracyPercent)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface AccuracyDoughnutChartProps {
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
}

export const AccuracyDoughnutChart: React.FC<AccuracyDoughnutChartProps> = ({
  correctCount,
  wrongCount,
  unansweredCount,
}) => {
  const total = correctCount + wrongCount + unansweredCount;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  const correctRatio = total > 0 ? correctCount / total : 0;
  const wrongRatio = total > 0 ? wrongCount / total : 0;
  const accuracy = total > 0 ? Math.round(correctRatio * 1000) / 10 : 0;

  const correctLen = correctRatio * circumference;
  const wrongLen = wrongRatio * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            className="text-slate-200 dark:text-slate-800"
          />
          {total > 0 && (
            <>
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#16A34A"
                strokeWidth="14"
                strokeDasharray={`${correctLen} ${circumference}`}
                strokeDashoffset="0"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#DC2626"
                strokeWidth="14"
                strokeDasharray={`${wrongLen} ${circumference}`}
                strokeDashoffset={-correctLen}
              />
            </>
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold font-mono tabular-nums text-[#10243A] dark:text-white">
            {accuracy}%
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Chính xác</span>
        </div>
      </div>

      <div className="space-y-2.5 text-sm w-full">
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-600 dark:text-slate-300">Trả lời đúng</span>
          <span className="font-mono tabular-nums font-semibold text-[#16A34A]">
            {correctCount} câu
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-600 dark:text-slate-300">Trả lời sai</span>
          <span className="font-mono tabular-nums font-semibold text-[#DC2626]">
            {wrongCount} câu
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-600 dark:text-slate-300">Chưa trả lời</span>
          <span className="font-mono tabular-nums font-semibold text-slate-500 dark:text-slate-400">
            {unansweredCount} câu
          </span>
        </div>
      </div>
    </div>
  );
};
