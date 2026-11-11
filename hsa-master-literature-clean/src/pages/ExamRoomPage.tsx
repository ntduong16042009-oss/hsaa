import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  FileText,
  Send,
} from 'lucide-react';
import { ActiveExamSession, Exam, Question } from '../types';
import { formatCountdown, getRemainingSeconds } from '../utils/examEngine';

interface ExamRoomPageProps {
  exam: Exam;
  questions: Question[];
  session: ActiveExamSession;
  onUpdateSession: (updated: ActiveExamSession) => void;
  onSubmitExam: (finalSession: ActiveExamSession) => void;
  onExitRoom: () => void;
}

export const ExamRoomPage: React.FC<ExamRoomPageProps> = ({
  exam,
  questions,
  session,
  onUpdateSession,
  onSubmitExam,
  onExitRoom,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    getRemainingSeconds(session.endsAt)
  );
  const [warningBanner, setWarningBanner] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const warned10Ref = useRef(false);
  const warned5Ref = useRef(false);
  const submittedRef = useRef(false);
  const latestSessionRef = useRef(session);
  latestSessionRef.current = session;

  const examQuestions = useMemo(() => {
    const qMap = new Map(questions.map((q) => [q.id, q]));
    return exam.questionIds
      .map((id) => qMap.get(id))
      .filter((q): q is Question => Boolean(q));
  }, [exam.questionIds, questions]);

  const currentIndex = Math.min(
    Math.max(0, session.currentQuestionIndex),
    Math.max(0, examQuestions.length - 1)
  );
  const currentQuestion = examQuestions[currentIndex];

  // Real-time countdown controlled by session.endsAt timestamp
  useEffect(() => {
    const tick = () => {
      const rem = getRemainingSeconds(latestSessionRef.current.endsAt);
      setRemainingSeconds(rem);

      if (rem <= 600 && rem > 300 && !warned10Ref.current) {
        warned10Ref.current = true;
        setWarningBanner('Cảnh báo thời gian: Thời gian làm bài còn dưới 10 phút!');
      }
      if (rem <= 300 && rem > 0 && !warned5Ref.current) {
        warned5Ref.current = true;
        setWarningBanner(
          'Cảnh báo khẩn: Thời gian làm bài chỉ còn dưới 5 phút! Hãy kiểm tra lại các câu đã chọn.'
        );
      }

      if (rem <= 0 && !submittedRef.current) {
        submittedRef.current = true;
        onSubmitExam(latestSessionRef.current);
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [onSubmitExam]);

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    const updated: ActiveExamSession = {
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: optionIndex,
      },
      lastSavedAt: Date.now(),
    };
    onUpdateSession(updated);
  };

  const handleGoToQuestion = (index: number) => {
    const safeIdx = Math.max(0, Math.min(examQuestions.length - 1, index));
    const updated: ActiveExamSession = {
      ...session,
      currentQuestionIndex: safeIdx,
      lastSavedAt: Date.now(),
    };
    onUpdateSession(updated);
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    const isFlagged = session.flaggedQuestions.includes(currentQuestion.id);
    const nextFlags = isFlagged
      ? session.flaggedQuestions.filter((id) => id !== currentQuestion.id)
      : [...session.flaggedQuestions, currentQuestion.id];

    const updated: ActiveExamSession = {
      ...session,
      flaggedQuestions: nextFlags,
      lastSavedAt: Date.now(),
    };
    onUpdateSession(updated);
  };

  const totalCount = examQuestions.length;
  const answeredCount = examQuestions.filter(
    (q) => session.answers[q.id] !== undefined
  ).length;
  const unansweredCount = totalCount - answeredCount;
  const flaggedCount = session.flaggedQuestions.length;

  const savedTimeFormatted = new Date(session.lastSavedAt).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (!currentQuestion) {
    return null;
  }

  const isCurrentFlagged = session.flaggedQuestions.includes(currentQuestion.id);
  const selectedOption = session.answers[currentQuestion.id];

  return (
    <div className="space-y-5 pb-10">
      {/* 1. HEADER PHÒNG THI */}
      <header className="bg-[#10243A] text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#D6B978] font-mono">
            <span>MÃ ĐỀ: {exam.code}</span>
            <span>·</span>
            <span>
              Đã làm: {answeredCount}/{totalCount} câu
            </span>
          </div>
          <h1 className="font-display text-base sm:text-lg font-bold text-white truncate">
            {exam.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 shrink-0">
          {/* Auto-save indicator */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-white/5 border border-white/10 px-3 py-2 rounded-xl font-mono tabular-nums">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Đã lưu tự động ({savedTimeFormatted})</span>
          </div>

          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono tabular-nums font-bold text-base border ${
              remainingSeconds <= 300
                ? 'bg-red-950/80 border-red-500 text-red-200'
                : remainingSeconds <= 600
                ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                : 'bg-white/10 border-white/20 text-white'
            }`}
            aria-label="Đồng hồ đếm ngược thời gian làm bài"
          >
            <Clock className="w-4 h-4 text-[#D6B978]" />
            <span>{formatCountdown(remainingSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            <span>NỘP BÀI</span>
          </button>
        </div>
      </header>

      {/* Time Warning Banner */}
      {warningBanner && (
        <div
          role="alert"
          className="bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <span className="font-medium">{warningBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setWarningBanner(null)}
            className="text-xs font-semibold underline cursor-pointer shrink-0"
          >
            Đã hiểu
          </button>
        </div>
      )}

      {/* MAIN EXAM WORKSPACE: Question Area + Question Navigation Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 2. KHU VỰC CÂU HỎI (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
          {/* Question top metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-bold text-sm text-[#10243A] dark:text-white">
                Câu {currentIndex + 1} / {totalCount}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Mã {currentQuestion.id}</span>
              <span aria-hidden="true">·</span>
              <span>{currentQuestion.topic}</span>
              <span aria-hidden="true">·</span>
              <span>Mức độ: {currentQuestion.difficulty}</span>
            </div>

            {isCurrentFlagged && (
              <span className="text-xs font-semibold text-[#F59E0B] flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>Đang đánh dấu xem lại</span>
              </span>
            )}
          </div>

          {/* Dedicated Reading Passage Pane if passage exists */}
          {currentQuestion.passage && (
            <div className="bg-[#F3F6FA] dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 sm:p-5 max-h-72 overflow-y-auto space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10243A] dark:text-[#D6B978]">
                <FileText className="w-3.5 h-3.5" />
                <span>NGỮ LIỆU ĐỌC HIỂU</span>
              </div>
              <p className="text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line font-normal">
                {currentQuestion.passage}
              </p>
              {currentQuestion.passageSource && (
                <div className="text-xs italic text-slate-500 dark:text-slate-400 text-right pt-1">
                  — {currentQuestion.passageSource}
                </div>
              )}
            </div>
          )}

          {/* Question Stem */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#172033] dark:text-white leading-relaxed">
              {currentQuestion.content}
            </h2>

            {/* 4 Answer Options */}
            <div className="space-y-3" role="radiogroup" aria-label={`Các phương án trả lời câu ${currentIndex + 1}`}>
              {currentQuestion.options.map((optText, optIdx) => {
                const letter = ['A', 'B', 'C', 'D'][optIdx];
                const isSelected = selectedOption === optIdx;

                return (
                  <button
                    key={letter}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-blue-950/50 border-[#2563EB] text-[#10243A] dark:text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-[15px] leading-relaxed">{optText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. CÁC NÚT ĐIỀU KHIỂN */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => handleGoToQuestion(currentIndex - 1)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:border-[#2563EB] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <button
                type="button"
                disabled={currentIndex === totalCount - 1}
                onClick={() => handleGoToQuestion(currentIndex + 1)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:border-[#2563EB] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isCurrentFlagged
                    ? 'bg-[#F59E0B] border-[#F59E0B] text-white'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#F59E0B]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isCurrentFlagged ? 'Bỏ đánh dấu' : 'Đánh dấu xem lại'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#10243A] dark:bg-[#2563EB] text-white hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap"
              >
                Kiểm tra & Nộp bài
              </button>
            </div>
          </div>
        </div>

        {/* 3. BẢNG ĐIỀU HƯỚNG CÂU HỎI (4 cols) */}
        <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-[#10243A] dark:text-white">
              Bảng Điều Hướng Câu Hỏi
            </h3>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {answeredCount}/{totalCount} đã chọn
            </span>
          </div>

          {/* 4 Status Colors Legend per Section X.3 */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#10243A] border border-white/20 shrink-0" />
              <span>Xanh navy: Câu hiện tại</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#16A34A] shrink-0" />
              <span>Xanh lá: Đã trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#F59E0B] shrink-0" />
              <span>Cam: Đánh dấu xem lại</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-800 shrink-0" />
              <span>Xám: Chưa trả lời</span>
            </div>
          </div>

          {/* Numbered buttons grid */}
          <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
            {examQuestions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isFlagged = session.flaggedQuestions.includes(q.id);
              const isAnswered = session.answers[q.id] !== undefined;

              let btnStyle =
                'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
              if (isCurrent) {
                btnStyle = 'bg-[#10243A] text-white border-[#10243A] ring-2 ring-[#D6B978]';
              } else if (isFlagged) {
                btnStyle = 'bg-[#F59E0B] text-white border-[#F59E0B]';
              } else if (isAnswered) {
                btnStyle = 'bg-[#16A34A] text-white border-[#16A34A]';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  aria-label={`Chuyển đến câu ${idx + 1}`}
                  onClick={() => handleGoToQuestion(idx)}
                  className={`h-9 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer tabular-nums ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-3 bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              Hoàn thành & Nộp bài thi
            </button>
            <button
              type="button"
              onClick={onExitRoom}
              className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Tạm rời phòng thi (Bài làm đã được lưu tự động)
            </button>
          </div>
        </aside>
      </div>

      {/* XI. HỘP THOẠI XÁC NHẬN NỘP BÀI */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-confirm-title"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-[#2563EB]">
                XÁC NHẬN NỘP BÀI THI
              </div>
              <h2
                id="submit-confirm-title"
                className="font-display text-xl font-bold text-[#10243A] dark:text-white"
              >
                Bạn có chắc chắn muốn nộp bài?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sau khi xác nhận nộp bài, hệ thống sẽ khóa bài thi và chấm điểm tự động ngay lập tức.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Số câu đã trả lời:</span>
                <span className="font-mono tabular-nums font-bold text-[#16A34A]">
                  {answeredCount} / {totalCount} câu
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Số câu chưa trả lời:</span>
                <span className="font-mono tabular-nums font-bold text-[#DC2626]">
                  {unansweredCount} câu
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Số câu đánh dấu xem lại:</span>
                <span className="font-mono tabular-nums font-bold text-[#F59E0B]">
                  {flaggedCount} câu
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">Thời gian còn lại:</span>
                <span className="font-mono tabular-nums font-bold text-[#10243A] dark:text-white">
                  {formatCountdown(remainingSeconds)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-2.5 px-4 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={() => {
                  submittedRef.current = true;
                  setShowConfirmModal(false);
                  onSubmitExam(session);
                }}
                className="py-2.5 px-4 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white cursor-pointer"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
