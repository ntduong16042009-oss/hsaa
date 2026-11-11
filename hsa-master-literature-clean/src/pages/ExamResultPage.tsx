import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FilePlus2,
  HelpCircle,
  Lightbulb,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { AppView, Exam, ExamAttempt, Question } from '../types';
import { evaluateAttemptPerformance } from '../utils/examEngine';
import { AccuracyDoughnutChart } from '../components/AnalyticsCharts';

type ReviewFilter = 'wrong' | 'all' | 'correct' | 'unanswered';

interface ExamResultPageProps {
  attempt: ExamAttempt;
  exam?: Exam;
  questions: Question[];
  onNavigate: (view: AppView) => void;
  onRetakeExam: (examId: string) => void;
}

export const ExamResultPage: React.FC<ExamResultPageProps> = ({
  attempt,
  exam,
  questions,
  onNavigate,
  onRetakeExam,
}) => {
  // Default to showing 'wrong' questions first, falling back to 'all' if 0 wrong
  const [filter, setFilter] = useState<ReviewFilter>(() =>
    attempt.wrongCount > 0 ? 'wrong' : attempt.unansweredCount > 0 ? 'unanswered' : 'all'
  );

  const questionsMap = useMemo(
    () => new Map(questions.map((q) => [q.id, q])),
    [questions]
  );

  const orderedQuestionIds = useMemo(() => {
    if (exam && exam.questionIds.length > 0) return exam.questionIds;
    return Object.keys(attempt.answers);
  }, [exam, attempt.answers]);

  const reviewItems = useMemo(() => {
    return orderedQuestionIds
      .map((qId, index) => {
        const question = questionsMap.get(qId);
        if (!question) return null;
        const selected = attempt.answers[qId];
        const status: 'correct' | 'wrong' | 'unanswered' =
          selected === undefined || selected === null
            ? 'unanswered'
            : selected === question.correctAnswer
            ? 'correct'
            : 'wrong';
        return { index: index + 1, question, selected, status };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [orderedQuestionIds, questionsMap, attempt.answers]);

  const filteredReviewItems = useMemo(() => {
    if (filter === 'all') return reviewItems;
    return reviewItems.filter((item) => item.status === filter);
  }, [reviewItems, filter]);

  // Topic-by-topic Strengths & Weaknesses breakdown for this specific attempt
  const topicBreakdown = useMemo(() => {
    const map = new Map<
      string,
      { topic: string; total: number; correct: number; wrong: number; unanswered: number }
    >();
    for (const item of reviewItems) {
      const t = item.question.topic;
      const entry = map.get(t) || {
        topic: t,
        total: 0,
        correct: 0,
        wrong: 0,
        unanswered: 0,
      };
      entry.total += 1;
      if (item.status === 'correct') entry.correct += 1;
      else if (item.status === 'wrong') entry.wrong += 1;
      else entry.unanswered += 1;
      map.set(t, entry);
    }
    const list = Array.from(map.values()).map((entry) => ({
      ...entry,
      accuracy: entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0,
    }));
    const strengths = list
      .filter((i) => i.accuracy >= 70)
      .sort((a, b) => b.accuracy - a.accuracy);
    const weaknesses = list
      .filter((i) => i.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy);
    return { all: list, strengths, weaknesses };
  }, [reviewItems]);

  const evaluation = evaluateAttemptPerformance({
    totalQuestions: attempt.totalQuestions,
    correctCount: attempt.correctCount,
    wrongCount: attempt.wrongCount,
    unansweredCount: attempt.unansweredCount,
    score: attempt.score,
    maxScore: attempt.maxScore,
    accuracyPercent: attempt.accuracyPercent,
  });

  const mins = Math.floor(attempt.durationSeconds / 60);
  const secs = attempt.durationSeconds % 60;

  return (
    <div className="space-y-8 pb-10">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('exams')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#77849A] dark:text-slate-400 hover:text-[#10213A] dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thư viện đề thi</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('wrong-practice')}
            className="px-4 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>LUYỆN LẠI CÂU SAI</span>
          </button>

          <button
            type="button"
            onClick={() => onRetakeExam(attempt.examId)}
            className="px-4 py-2.5 bg-[#315EDE] hover:bg-[#254EC7] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Làm lại đề này
          </button>

          <button
            type="button"
            onClick={() => onNavigate('exams')}
            className="px-4 py-2.5 bg-[#10213A] dark:bg-slate-800 hover:bg-[#142943] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <FilePlus2 className="w-3.5 h-3.5 text-[#D9BD79]" />
            <span>Làm đề mới</span>
          </button>
        </div>
      </div>

      {/* 1. KHU VỰC TỔNG QUAN ĐIỂM SỐ NỔI BẬT */}
      <section className="bg-[#10213A] text-white rounded-3xl p-6 sm:p-8 border border-[#142943] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D9BD79] bg-white/5 border border-[#D9BD79]/25 px-3 py-1 rounded-lg">
              <Award className="w-3.5 h-3.5" />
              <span>
                BÁO CÁO KẾT QUẢ BÀI THI · MÃ ĐỀ: {attempt.examCode} ·{' '}
                {new Date(attempt.completedAt).toLocaleString('vi-VN')}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {attempt.examTitle}
            </h1>
          </div>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-[#142943] border border-[#D9BD79]/40 rounded-2xl px-7 py-5 text-center shrink-0"
          >
            <div className="text-xs text-[#D9BD79] font-bold tracking-wider uppercase">
              ĐIỂM SỐ ĐẠT ĐƯỢC
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-white mt-1">
              {attempt.score}{' '}
              <span className="text-base font-normal text-slate-300">/ {attempt.maxScore}</span>
            </div>
          </motion.div>
        </div>

        {/* 5 Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-white/10 font-mono tabular-nums">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-xs text-slate-300">Số câu đúng</div>
            <div className="text-xl font-bold text-[#16A34A] mt-1">
              {attempt.correctCount} câu
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-xs text-slate-300">Số câu sai</div>
            <div className="text-xl font-bold text-[#DC2626] mt-1">
              {attempt.wrongCount} câu
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-xs text-slate-300">Số câu bỏ trống</div>
            <div className="text-xl font-bold text-[#F59E0B] mt-1">
              {attempt.unansweredCount} câu
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-xs text-slate-300">Tỷ lệ chính xác</div>
            <div className="text-xl font-bold text-[#D9BD79] mt-1">
              {attempt.accuracyPercent}%
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-300">Thời gian hoàn thành</div>
            <div className="text-xl font-bold text-white mt-1">
              {mins}p {secs}s
            </div>
          </div>
        </div>
      </section>

      {/* 2. BIỂU ĐỒ KẾT QUẢ & PHÂN TÍCH ĐIỂM MẠNH / ĐIỂM YẾU */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Result Doughnut Chart + Competency Summary */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#315EDE]">
                BIỂU ĐỒ KẾT QUẢ BÀI THI
              </div>
              <h2 className="font-display text-base font-bold text-[#17243A] dark:text-white mt-0.5">
                Tỷ Lệ Đúng · Sai · Chưa Làm
              </h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#10213A] text-[#D9BD79]">
              {evaluation.levelLabel}
            </span>
          </div>

          <AccuracyDoughnutChart
            correctCount={attempt.correctCount}
            wrongCount={attempt.wrongCount}
            unansweredCount={attempt.unansweredCount}
          />

          <div className="pt-3 border-t border-[#E4E9F1] dark:border-slate-800 space-y-1.5">
            <div className="text-xs font-bold text-[#17243A] dark:text-white">
              {evaluation.headline}
            </div>
            <p className="text-xs text-[#77849A] dark:text-slate-400 leading-relaxed">
              {evaluation.detailedAdvice}
            </p>
          </div>
        </div>

        {/* Strengths & Weaknesses by Topic */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#315EDE]">
                CHẨN ĐOÁN NĂNG LỰC CHUYÊN ĐỀ
              </div>
              <h2 className="font-display text-base font-bold text-[#17243A] dark:text-white mt-0.5">
                Phân Tích Điểm Mạnh & Điểm Yếu Trong Đề Thi
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Điểm mạnh */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#16A34A]">
                  <TrendingUp className="w-4 h-4" />
                  <span>ĐIỂM MẠNH (Độ chính xác ≥ 70%)</span>
                </div>
                {topicBreakdown.strengths.length === 0 ? (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Chưa có chủ đề nào đạt trên 70% ở lần làm bài này. Hãy ôn lại phần giải thích bên dưới.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {topicBreakdown.strengths.map((item) => (
                      <div
                        key={item.topic}
                        className="flex items-center justify-between text-xs bg-white/80 dark:bg-slate-900/70 px-3 py-2 rounded-xl"
                      >
                        <span className="font-semibold text-[#17243A] dark:text-slate-200 truncate pr-2">
                          {item.topic}
                        </span>
                        <span className="font-mono font-bold text-[#16A34A] shrink-0">
                          {item.accuracy}% ({item.correct}/{item.total})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Điểm yếu */}
              <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
                  <TrendingDown className="w-4 h-4" />
                  <span>CẦN CẢI THIỆN (Độ chính xác &lt; 70%)</span>
                </div>
                {topicBreakdown.weaknesses.length === 0 ? (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Xuất sắc! Toàn bộ các chủ đề trong đề thi đều đạt tỷ lệ chính xác từ 70% trở lên.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {topicBreakdown.weaknesses.map((item) => (
                      <div
                        key={item.topic}
                        className="flex items-center justify-between text-xs bg-white/80 dark:bg-slate-900/70 px-3 py-2 rounded-xl"
                      >
                        <span className="font-semibold text-[#17243A] dark:text-slate-200 truncate pr-2">
                          {item.topic}
                        </span>
                        <span className="font-mono font-bold text-[#DC2626] shrink-0">
                          {item.accuracy}% ({item.correct}/{item.total})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4E9F1] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#77849A] dark:text-slate-400">
              Hệ thống đã tự động lưu {attempt.wrongCount} câu sai vào bộ nhớ ôn tập cá nhân.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('wrong-practice')}
                className="px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Luyện lại câu sai ngay →
              </button>
              <button
                type="button"
                onClick={() => onNavigate('exams')}
                className="px-3.5 py-2 bg-[#F4F6FA] dark:bg-slate-800 hover:bg-slate-200 text-[#17243A] dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Chọn đề thi mới
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KHU VỰC PHÂN TÍCH CHI TIẾT CÂU HỎI */}
      <section className="space-y-5">
        <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#17243A] dark:text-white">
              Danh Sách Câu Hỏi & Giải Thích Học Thuật Chi Tiết
            </h2>
            <p className="text-xs text-[#77849A] dark:text-slate-400">
              Mặc định ưu tiên hiển thị câu trả lời sai để học sinh rút kinh nghiệm ngay
            </p>
          </div>

          {/* 4 Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4F6FA] dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setFilter('wrong')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'wrong'
                  ? 'bg-white dark:bg-slate-900 text-[#DC2626] shadow-xs'
                  : 'text-[#77849A] dark:text-slate-400'
              }`}
            >
              Câu sai ({attempt.wrongCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unanswered')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'unanswered'
                  ? 'bg-white dark:bg-slate-900 text-[#F59E0B] shadow-xs'
                  : 'text-[#77849A] dark:text-slate-400'
              }`}
            >
              Chưa trả lời ({attempt.unansweredCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'correct'
                  ? 'bg-white dark:bg-slate-900 text-[#16A34A] shadow-xs'
                  : 'text-[#77849A] dark:text-slate-400'
              }`}
            >
              Câu đúng ({attempt.correctCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-[#10213A] dark:text-white shadow-xs'
                  : 'text-[#77849A] dark:text-slate-400'
              }`}
            >
              Tất cả câu hỏi ({attempt.totalQuestions})
            </button>
          </div>
        </div>

        {filteredReviewItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-[#17243A] dark:text-slate-200">
              Không có câu hỏi nào trong nhóm bộ lọc này.
            </p>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="text-xs font-semibold text-[#315EDE] underline cursor-pointer"
            >
              Xem toàn bộ {attempt.totalQuestions} câu hỏi trong đề
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredReviewItems.map(({ index, question, selected, status }) => {
              const letters = ['A', 'B', 'C', 'D'];
              return (
                <article
                  key={question.id}
                  className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-[#77849A] dark:text-slate-400 flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#10213A] dark:text-white">
                        Câu {index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">Mã {question.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{question.topic}</span>
                      <span aria-hidden="true">·</span>
                      <span>{question.difficulty}</span>
                    </div>

                    <div className="text-xs font-semibold flex items-center gap-1.5">
                      {status === 'correct' && (
                        <span className="text-[#16A34A] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Trả lời đúng</span>
                        </span>
                      )}
                      {status === 'wrong' && (
                        <span className="text-[#DC2626] flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>Trả lời sai</span>
                        </span>
                      )}
                      {status === 'unanswered' && (
                        <span className="text-[#F59E0B] flex items-center gap-1">
                          <HelpCircle className="w-4 h-4" />
                          <span>Bỏ trống chưa trả lời</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {question.passage && (
                    <div className="p-4 rounded-xl bg-[#F4F6FA] dark:bg-slate-800/60 border border-[#E4E9F1] dark:border-slate-700 text-xs sm:text-sm text-[#17243A] dark:text-slate-200 leading-relaxed whitespace-pre-line">
                      {question.passage}
                      {question.passageSource && (
                        <div className="text-right italic text-xs text-[#77849A] mt-1">
                          — {question.passageSource}
                        </div>
                      )}
                    </div>
                  )}

                  <h3 className="text-sm sm:text-base font-bold text-[#17243A] dark:text-white leading-relaxed">
                    {question.content}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {question.options.map((optText, optIdx) => {
                      const isCorrectOpt = optIdx === question.correctAnswer;
                      const isUserSelected = optIdx === selected;

                      let boxClass =
                        'border-[#E4E9F1] dark:border-slate-800 bg-[#F4F6FA]/50 dark:bg-slate-800/30 text-[#17243A] dark:text-slate-300';
                      if (isCorrectOpt) {
                        boxClass =
                          'border-[#16A34A] bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold';
                      } else if (isUserSelected && !isCorrectOpt) {
                        boxClass =
                          'border-[#DC2626] bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-200';
                      }

                      return (
                        <div
                          key={letters[optIdx]}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${boxClass}`}
                        >
                          <span className="font-mono font-bold shrink-0">{letters[optIdx]}.</span>
                          <div className="space-y-1">
                            <div>{optText}</div>
                            {isCorrectOpt && (
                              <div className="text-[11px] font-mono text-[#16A34A]">
                                ✓ Đáp án đúng
                              </div>
                            )}
                            {isUserSelected && !isCorrectOpt && (
                              <div className="text-[11px] font-mono text-[#DC2626]">
                                ✗ Đáp án bạn chọn
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation, Related Knowledge & Memory Tip */}
                  <div className="p-4 rounded-xl bg-[#F4F6FA] dark:bg-slate-800/80 border border-[#E4E9F1] dark:border-slate-700 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-[#315EDE] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#10213A] dark:text-white">Giải thích:</strong>{' '}
                        <span className="text-[#17243A] dark:text-slate-200">
                          {question.explanation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#10213A] dark:text-white">
                          Kiến thức liên quan:
                        </strong>{' '}
                        <span className="text-[#77849A] dark:text-slate-300">
                          {question.relatedKnowledge}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#10213A] dark:text-white">Gợi ý ghi nhớ:</strong>{' '}
                        <span className="text-[#77849A] dark:text-slate-300">
                          {question.memoryTip}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
