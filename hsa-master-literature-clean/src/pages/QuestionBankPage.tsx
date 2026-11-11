import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  Lightbulb,
  Search,
  XCircle,
} from 'lucide-react';
import { DifficultyLevel, Question, QuestionTopic } from '../types';
import { ALL_DIFFICULTIES, ALL_QUESTION_TOPICS } from '../data/officialInfo';

interface QuestionBankPageProps {
  questions: Question[];
}

const SAVED_QUESTIONS_STORAGE_KEY = 'hsa_master_saved_questions_v1';

export const QuestionBankPage: React.FC<QuestionBankPageProps> = ({ questions }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'single'>('list');

  // Interactive answer selection & explanation toggle per question
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_QUESTIONS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [singleIndex, setSingleIndex] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_QUESTIONS_STORAGE_KEY, JSON.stringify(savedQuestionIds));
    } catch {
      // ignore storage errors
    }
  }, [savedQuestionIds]);

  const topicCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of questions) {
      map.set(q.topic, (map.get(q.topic) || 0) + 1);
    }
    return map;
  }, [questions]);

  const savedSet = useMemo(() => new Set(savedQuestionIds), [savedQuestionIds]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (showSavedOnly && !savedSet.has(q.id)) return false;
      if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const kw = searchQuery.toLowerCase();
        const inId = q.id.toLowerCase().includes(kw);
        const inContent = q.content.toLowerCase().includes(kw);
        const inPassage = (q.passage || '').toLowerCase().includes(kw);
        const inExplain = q.explanation.toLowerCase().includes(kw);
        if (!inId && !inContent && !inPassage && !inExplain) return false;
      }
      return true;
    });
  }, [questions, showSavedOnly, savedSet, selectedTopic, selectedDifficulty, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedQuestions = filteredQuestions.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const safeSingleIndex = Math.min(
    Math.max(0, singleIndex),
    Math.max(0, filteredQuestions.length - 1)
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionIdx }));
    setExpandedIds((prev) => ({ ...prev, [questionId]: true }));
  };

  const toggleSaveQuestion = (questionId: string) => {
    setSavedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const renderQuestionCard = (q: Question, idxInList?: number, totalInList?: number) => {
    const isExpanded = Boolean(expandedIds[q.id]);
    const userChoice = selectedOptions[q.id];
    const hasChosen = userChoice !== undefined;
    const isSaved = savedSet.has(q.id);
    const letters = ['A', 'B', 'C', 'D'];

    return (
      <article
        key={q.id}
        className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs hover:border-[#315EDE]/60 transition-colors"
      >
        {/* Top Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#E4E9F1] dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-[#10213A] dark:bg-[#315EDE] text-white font-mono font-bold">
              {q.id}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-slate-200 font-semibold">
              {q.topic}
            </span>
            <span className="px-2.5 py-1 rounded-lg border border-[#E4E9F1] dark:border-slate-700 text-[#77849A] dark:text-slate-300 font-medium">
              Mức độ: {q.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {q.sourceNote && (
              <span className="text-[11px] text-[#77849A] hidden sm:inline">
                {q.sourceNote}
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleSaveQuestion(q.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#D9BD79]/20 border-[#D9BD79] text-[#10213A] dark:text-[#D9BD79]'
                  : 'border-[#E4E9F1] dark:border-slate-700 text-[#77849A] hover:text-[#10213A] dark:hover:text-white'
              }`}
              title="Lưu câu hỏi yêu thích để ôn tập"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Đã lưu' : 'Lưu câu hỏi'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated Reading Passage Container */}
        {q.passage && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F6FA] dark:bg-slate-800/70 border border-[#E4E9F1] dark:border-slate-700 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#315EDE] dark:text-[#D9BD79]">
              <FileText className="w-3.5 h-3.5" />
              <span>Vùng Đọc Ngữ Liệu Văn Bản</span>
            </div>
            <div className="text-sm sm:text-[15px] text-[#17243A] dark:text-slate-200 leading-relaxed whitespace-pre-line break-words">
              {q.passage}
            </div>
            {q.passageSource && (
              <div className="text-right italic text-xs text-[#77849A] dark:text-slate-400 pt-1">
                — {q.passageSource}
              </div>
            )}
          </div>
        )}

        {/* Question Stem */}
        <h2 className="text-base sm:text-lg font-bold text-[#17243A] dark:text-white leading-relaxed break-words">
          {q.content}
        </h2>

        {/* Interactive 4 Options with Hover & Selected States */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt, idx) => {
            const isSelected = userChoice === idx;
            const showResult = isExpanded || hasChosen;
            const isCorrect = idx === q.correctAnswer;

            let optionStyle =
              'border-[#E4E9F1] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#17243A] dark:text-slate-200 hover:border-[#315EDE] hover:bg-[#F4F6FA]/70 dark:hover:bg-slate-800/60';
            let badgeStyle =
              'bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-slate-300';

            if (showResult) {
              if (isCorrect) {
                optionStyle =
                  'border-[#16A34A] bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold';
                badgeStyle = 'bg-[#16A34A] text-white';
              } else if (isSelected && !isCorrect) {
                optionStyle =
                  'border-[#DC2626] bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-200';
                badgeStyle = 'bg-[#DC2626] text-white';
              }
            } else if (isSelected) {
              optionStyle =
                'border-[#315EDE] bg-blue-50/80 dark:bg-blue-950/40 text-[#10213A] dark:text-white font-semibold';
              badgeStyle = 'bg-[#315EDE] text-white';
            }

            return (
              <button
                key={letters[idx]}
                type="button"
                onClick={() => handleSelectOption(q.id, idx)}
                className={`p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${optionStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                >
                  {letters[idx]}
                </span>
                <span className="leading-relaxed break-words flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Action Row: Reveal Explanation + Previous / Next Question Buttons */}
        <div className="pt-2 border-t border-[#E4E9F1] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => toggleExpand(q.id)}
            className="text-xs font-semibold text-[#315EDE] dark:text-blue-400 flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Ẩn lời giải & phân tích đáp án</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Xem đáp án đúng & lời giải chi tiết</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          {viewMode === 'single' && totalInList !== undefined && idxInList !== undefined && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={idxInList === 0}
                onClick={() => setSingleIndex((i) => Math.max(0, i - 1))}
                className="px-3.5 py-2 rounded-xl border border-[#E4E9F1] dark:border-slate-700 text-xs font-semibold text-[#17243A] dark:text-slate-200 disabled:opacity-40 hover:border-[#315EDE] flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Câu trước</span>
              </button>
              <span className="text-xs font-mono font-bold text-[#77849A] px-1">
                {idxInList + 1} / {totalInList}
              </span>
              <button
                type="button"
                disabled={idxInList >= totalInList - 1}
                onClick={() => setSingleIndex((i) => Math.min(totalInList - 1, i + 1))}
                className="px-3.5 py-2 rounded-xl bg-[#10213A] dark:bg-[#315EDE] text-white text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Detailed Explanation Box */}
        {isExpanded && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F6FA] dark:bg-slate-800/80 border border-[#E4E9F1] dark:border-slate-700 space-y-2.5 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold text-[#16A34A] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đáp án chính xác: Phương án {letters[q.correctAnswer]}</span>
              </div>
              {hasChosen && (
                <div
                  className={`font-semibold flex items-center gap-1 ${
                    userChoice === q.correctAnswer ? 'text-[#16A34A]' : 'text-[#DC2626]'
                  }`}
                >
                  {userChoice === q.correctAnswer ? (
                    <span>Bạn đã chọn đúng!</span>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Bạn đã chọn phương án {letters[userChoice]}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 pt-1">
              <BookOpen className="w-4 h-4 text-[#315EDE] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-[#10213A] dark:text-white">Giải thích chi tiết:</strong>{' '}
                {q.explanation}
              </div>
            </div>

            {q.relatedKnowledge && (
              <div className="flex items-start gap-2">
                <Layers className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-[#10213A] dark:text-white">Kiến thức liên quan:</strong>{' '}
                  {q.relatedKnowledge}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-[#10213A] dark:text-white">Gợi ý ghi nhớ:</strong>{' '}
                {q.memoryTip}
              </div>
            </div>
          </div>
        )}
      </article>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Filter Panel */}
      <section className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#315EDE]">
              Kho học liệu số chuẩn hóa · HSA MASTER 2.0
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#10213A] dark:text-white mt-1">
              Ngân Hàng Câu Hỏi Môn Ngữ Văn ({questions.length} Câu)
            </h1>
            <p className="text-xs sm:text-sm text-[#77849A] dark:text-slate-400 mt-1">
              Tích hợp vùng đọc ngữ liệu riêng, chọn đáp án trực tiếp để kiểm tra kết quả, lưu câu
              hỏi yêu thích và xem giải thích chuyên sâu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#77849A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Tìm kiếm câu hỏi trong ngân hàng"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                  setSingleIndex(0);
                }}
                placeholder="Tìm mã câu (Q001), nội dung, tác phẩm..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-white focus:outline-none focus:border-[#315EDE]"
              />
            </div>

            <div className="flex items-center p-1 rounded-xl bg-[#F4F6FA] dark:bg-slate-800 border border-[#E4E9F1] dark:border-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#10213A] text-white dark:bg-[#315EDE]'
                    : 'text-[#77849A] dark:text-slate-300'
                }`}
              >
                Danh sách
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === 'single'
                    ? 'bg-[#10213A] text-white dark:bg-[#315EDE]'
                    : 'text-[#77849A] dark:text-slate-300'
                }`}
              >
                Từng câu
              </button>
            </div>
          </div>
        </div>

        {/* 10 Topic Filter Buttons */}
        <div className="space-y-2 pt-3 border-t border-[#E4E9F1] dark:border-slate-800">
          <div className="text-xs font-semibold text-[#77849A] dark:text-slate-400">
            Lọc theo 10 chuyên đề Ngữ văn:
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSelectedTopic('all');
                setCurrentPage(1);
                setSingleIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                selectedTopic === 'all'
                  ? 'bg-[#10213A] text-white dark:bg-[#315EDE]'
                  : 'bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tất cả chủ đề ({questions.length})
            </button>
            {ALL_QUESTION_TOPICS.map((topic: QuestionTopic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setSelectedTopic(topic);
                  setCurrentPage(1);
                  setSingleIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                  selectedTopic === topic
                    ? 'bg-[#10213A] text-white dark:bg-[#315EDE]'
                    : 'bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {topic} ({topicCounts.get(topic) || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter, Saved Filter & Results Counter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E4E9F1] dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#77849A] mr-1">Mức độ khó:</span>
            {['all', ...ALL_DIFFICULTIES].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setCurrentPage(1);
                  setSingleIndex(0);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedDifficulty === diff
                    ? 'bg-[#315EDE] text-white'
                    : 'bg-[#F4F6FA] dark:bg-slate-800 text-[#77849A] dark:text-slate-400'
                }`}
              >
                {diff === 'all' ? 'Tất cả mức độ' : (diff as DifficultyLevel)}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setShowSavedOnly((prev) => !prev);
                setCurrentPage(1);
                setSingleIndex(0);
              }}
              className={`ml-1 px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                showSavedOnly
                  ? 'bg-[#D9BD79] text-[#10213A]'
                  : 'bg-[#F4F6FA] dark:bg-slate-800 text-[#77849A] dark:text-slate-400'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Đã lưu ({savedQuestionIds.length})</span>
            </button>
          </div>

          <div className="text-xs font-mono tabular-nums text-[#77849A] dark:text-slate-400">
            Tìm thấy {filteredQuestions.length} câu hỏi phù hợp
          </div>
        </div>
      </section>

      {/* Questions Content */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-[#77849A] mx-auto" />
          <h2 className="font-display text-lg font-bold text-[#10213A] dark:text-white">
            Không tìm thấy câu hỏi phù hợp với bộ lọc
          </h2>
          <p className="text-xs text-[#77849A]">
            Hãy thử đặt lại bộ lọc chủ đề, độ khó hoặc tắt bộ lọc câu hỏi đã lưu.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
              setShowSavedOnly(false);
            }}
            className="px-4 py-2 bg-[#315EDE] text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : viewMode === 'single' ? (
        <section className="space-y-4">
          {renderQuestionCard(
            filteredQuestions[safeSingleIndex],
            safeSingleIndex,
            filteredQuestions.length
          )}
        </section>
      ) : (
        <>
          <section className="space-y-4">
            {paginatedQuestions.map((q) => renderQuestionCard(q))}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-4">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E4E9F1] dark:border-slate-700 disabled:opacity-40 hover:border-[#315EDE] flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Câu / Trang trước</span>
              </button>

              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-bold cursor-pointer transition-colors ${
                      pageNum === safePage
                        ? 'bg-[#10213A] text-white dark:bg-[#315EDE]'
                        : 'bg-[#F4F6FA] dark:bg-slate-800 text-[#77849A] dark:text-slate-400 hover:text-[#10213A]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E4E9F1] dark:border-slate-700 disabled:opacity-40 hover:border-[#315EDE] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Câu / Trang tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
