import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Play,
  RefreshCcw,
  Target,
  XCircle,
} from 'lucide-react';
import {
  AppView,
  DifficultyLevel,
  Question,
  QuestionTopic,
  WrongQuestionRecord,
} from '../types';
import { ALL_DIFFICULTIES, ALL_QUESTION_TOPICS } from '../data/officialInfo';

interface PracticeCenterPageProps {
  initialMode: 'topic' | 'wrong';
  questions: Question[];
  wrongRecords: WrongQuestionRecord[];
  demoWrongRecords: WrongQuestionRecord[];
  isShowingDemo: boolean;
  onRecordPracticeAnswer: (questionId: string, selectedOption: number) => void;
  onNavigate: (view: AppView) => void;
}

export const PracticeCenterPage: React.FC<PracticeCenterPageProps> = ({
  initialMode,
  questions,
  wrongRecords,
  demoWrongRecords,
  isShowingDemo,
  onRecordPracticeAnswer,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'topic' | 'wrong'>(initialMode);
  const [selectedTopic, setSelectedTopic] = useState<string>('Đọc hiểu văn bản');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questionLimit, setQuestionLimit] = useState<number>(10);

  // Active step-by-step practice session state
  const [practiceDeck, setPracticeDeck] = useState<Question[] | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [sessionStats, setSessionStats] = useState<{ correct: number; wrong: number }>({
    correct: 0,
    wrong: 0,
  });

  const questionsMap = useMemo(
    () => new Map(questions.map((q) => [q.id, q])),
    [questions]
  );

  const effectiveWrongRecords =
    wrongRecords.length > 0 ? wrongRecords : isShowingDemo ? demoWrongRecords : [];

  const startTopicPractice = () => {
    const filtered = questions.filter((q) => {
      if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      return true;
    });

    const deck = filtered.slice(0, questionLimit);
    if (deck.length === 0) return;

    setPracticeDeck(deck);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsChecked(false);
    setSessionStats({ correct: 0, wrong: 0 });
  };

  const startWrongPractice = (onlyUnmastered: boolean) => {
    const targetRecords = onlyUnmastered
      ? effectiveWrongRecords.filter((r) => !r.mastered)
      : effectiveWrongRecords;

    const deck = targetRecords
      .map((r) => questionsMap.get(r.questionId))
      .filter((q): q is Question => Boolean(q));

    if (deck.length === 0) return;

    setPracticeDeck(deck);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsChecked(false);
    setSessionStats({ correct: 0, wrong: 0 });
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !practiceDeck) return;
    const currentQ = practiceDeck[currentIdx];
    if (!currentQ || isChecked) return;

    setIsChecked(true);
    const isCorrect = selectedOption === currentQ.correctAnswer;
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
    }));
    onRecordPracticeAnswer(currentQ.id, selectedOption);
  };

  const handleNextQuestion = () => {
    if (!practiceDeck) return;
    if (currentIdx < practiceDeck.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      setPracticeDeck(null);
    }
  };

  // Render active interactive single-question practice player
  if (practiceDeck && practiceDeck.length > 0) {
    const currentQ = practiceDeck[currentIdx];
    const letters = ['A', 'B', 'C', 'D'];

    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setPracticeDeck(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#10243A] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kết thúc phiên luyện tập</span>
          </button>

          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <span className="text-[#16A34A] font-bold">Đúng: {sessionStats.correct}</span>
            <span className="text-[#DC2626] font-bold">Sai: {sessionStats.wrong}</span>
            <span className="text-[#10243A] dark:text-white font-bold">
              Câu {currentIdx + 1} / {practiceDeck.length}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="font-mono font-bold text-[#2563EB]">{currentQ.id}</span>
            <span>·</span>
            <span>{currentQ.topic}</span>
            <span>·</span>
            <span>Mức độ: {currentQ.difficulty}</span>
          </div>

          {currentQ.passage && (
            <div className="p-4 rounded-xl bg-[#F3F6FA] dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
              {currentQ.passage}
              {currentQ.passageSource && (
                <div className="text-right italic text-xs text-slate-500 mt-1">
                  — {currentQ.passageSource}
                </div>
              )}
            </div>
          )}

          <h2 className="text-base sm:text-lg font-bold text-[#172033] dark:text-white leading-relaxed">
            {currentQ.content}
          </h2>

          <div className="space-y-2.5">
            {currentQ.options.map((optText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === currentQ.correctAnswer;

              let btnStyle =
                'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200';
              if (!isChecked && isSelected) {
                btnStyle =
                  'border-[#2563EB] bg-blue-50/80 dark:bg-blue-950/40 text-[#10243A] dark:text-white font-semibold';
              } else if (isChecked) {
                if (isCorrectOpt) {
                  btnStyle =
                    'border-[#16A34A] bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle =
                    'border-[#DC2626] bg-red-50/90 dark:bg-red-950/40 text-red-950 dark:text-red-200';
                }
              }

              return (
                <button
                  key={letters[idx]}
                  type="button"
                  disabled={isChecked}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="font-mono font-bold text-xs w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {letters[idx]}
                  </span>
                  <span className="text-sm sm:text-[15px] leading-relaxed">{optText}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            {!isChecked ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleCheckAnswer}
                className="px-6 py-3 bg-[#2563EB] hover:bg-blue-500 disabled:opacity-40 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Kiểm tra đáp án ngay
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-[#10243A] dark:bg-[#2563EB] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {currentIdx < practiceDeck.length - 1
                    ? 'Sang câu tiếp theo'
                    : 'Hoàn thành bộ luyện tập'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {isChecked && (
            <div className="p-5 rounded-xl bg-[#F3F6FA] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-bold">
                {selectedOption === currentQ.correctAnswer ? (
                  <span className="text-[#16A34A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Chính xác! Bạn đã chọn đúng phương án {letters[currentQ.correctAnswer]}.</span>
                  </span>
                ) : (
                  <span className="text-[#DC2626] flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>
                      Chưa chính xác. Đáp án đúng là phương án {letters[currentQ.correctAnswer]}.
                    </span>
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <strong>Giải thích:</strong> {currentQ.explanation}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <strong>Gợi ý ghi nhớ:</strong> {currentQ.memoryTip}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Rèn luyện chủ động
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#10243A] dark:text-white mt-1">
              Trung Tâm Luyện Tập Thông Minh
            </h1>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('topic')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'topic'
                  ? 'bg-white dark:bg-slate-900 text-[#10243A] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Luyện theo chủ đề & từng câu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wrong')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'wrong'
                  ? 'bg-white dark:bg-slate-900 text-[#DC2626] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Luyện câu sai ({effectiveWrongRecords.filter((r) => !r.mastered).length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'topic' ? (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#2563EB]" />
                <span>Thiết Lập Bộ Câu Hỏi Luyện Tập Theo Chủ Đề</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn chuyên đề, mức độ khó và số lượng câu hỏi. Hệ thống sẽ hiển thị từng câu và
                chấm đáp án kèm giải thích ngay lập tức.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="practice-topic-select"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  1. Chọn chuyên đề Ngữ văn
                </label>
                <select
                  id="practice-topic-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="all">Tất cả 10 chuyên đề (Tổng hợp ngẫu nhiên)</option>
                  {ALL_QUESTION_TOPICS.map((t: QuestionTopic) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  2. Chọn độ khó câu hỏi
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', ...ALL_DIFFICULTIES].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                        selectedDifficulty === diff
                          ? 'bg-[#10243A] dark:bg-[#2563EB] text-white border-transparent'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {diff === 'all' ? 'Mọi mức độ' : (diff as DifficultyLevel)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  3. Chọn số lượng câu hỏi
                </label>
                <div className="flex flex-wrap gap-2 font-mono">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionLimit(num)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                        questionLimit === num
                          ? 'bg-[#2563EB] text-white border-transparent'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {num} câu
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={startTopicPractice}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Bắt Đầu Luyện Tập Ngay</span>
            </button>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#10243A] dark:text-white">
              4 Chế Độ Rèn Luyện Trên HSA MASTER
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="font-bold text-[#10243A] dark:text-white">
                  1. Thi thử trực tuyến có giới hạn thời gian
                </div>
                <p className="text-xs text-slate-500">
                  Không hiển thị đáp án trước khi nộp, tự động lưu bài và chấm điểm sau khi hoàn thành.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="font-bold text-[#10243A] dark:text-white">
                  2. Luyện tập từng câu (Kiểm tra ngay)
                </div>
                <p className="text-xs text-slate-500">
                  Hiển thị từng câu hỏi, đối chiếu đáp án và đọc giải thích chi tiết ngay sau khi chọn.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="font-bold text-[#10243A] dark:text-white">
                  3. Luyện tập theo 10 chuyên đề
                </div>
                <p className="text-xs text-slate-500">
                  Tập trung bứt phá từng mảng kiến thức Tiếng Việt, Tu từ, Đọc hiểu hoặc Suy luận.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="font-bold text-[#10243A] dark:text-white">
                  4. Luyện câu sai & Theo dõi thành thạo
                </div>
                <p className="text-xs text-slate-500">
                  Tự động gom các câu trả lời sai; khi trả lời đúng liên tiếp 2 lần sẽ được đánh dấu Đã thành thạo.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* LUYỆN CÂU SAI */
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-[#DC2626]" />
                <span>
                  Bộ Sưu Tập Câu Hỏi Trả Lời Sai ({effectiveWrongRecords.length} câu{' '}
                  {wrongRecords.length === 0 && isShowingDemo ? '[DEMO]' : ''})
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Trả lời đúng liên tiếp 2 lần một câu hỏi trong chế độ luyện tập để chuyển trạng thái
                sang “Đã khắc phục”.
              </p>
            </div>

            {effectiveWrongRecords.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => startWrongPractice(true)}
                  className="px-4 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  Luyện các câu chưa thành thạo (
                  {effectiveWrongRecords.filter((r) => !r.mastered).length})
                </button>
                <button
                  type="button"
                  onClick={() => startWrongPractice(false)}
                  className="px-4 py-2.5 bg-[#10243A] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  Ôn lại toàn bộ ({effectiveWrongRecords.length})
                </button>
              </div>
            )}
          </div>

          {effectiveWrongRecords.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto" />
              <h3 className="font-display text-base font-bold text-[#10243A] dark:text-white">
                Danh sách câu sai hiện đang trống
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Khi bạn làm đề thi hoặc luyện tập mà chọn sai đáp án, hệ thống sẽ tự động lưu câu
                hỏi vào đây để bạn ôn tập lại.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('exams')}
                className="px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Vào Thư viện đề thi
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {effectiveWrongRecords.map((rec) => {
                const q = questionsMap.get(rec.questionId);
                if (!q) return null;
                return (
                  <div
                    key={rec.questionId}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                        <span className="font-bold text-[#10243A] dark:text-white">{q.id}</span>
                        <span>·</span>
                        <span>{q.topic}</span>
                        <span>·</span>
                        <span>Số lần sai: {rec.wrongCount}</span>
                        <span>·</span>
                        <span>Chuỗi làm đúng lại: {rec.correctStreak}/2</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {q.content}
                      </div>
                      <div className="text-xs text-slate-500">
                        <strong className="text-[#16A34A]">Đáp án đúng:</strong>{' '}
                        {q.options[q.correctAnswer]}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {rec.mastered ? (
                        <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Đã khắc phục</span>
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#DC2626]">
                          Cần luyện lại
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
