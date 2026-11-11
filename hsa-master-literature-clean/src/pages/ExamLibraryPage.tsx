import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck2,
  Info,
  Play,
  Search,
} from 'lucide-react';
import {
  DifficultyLevel,
  Exam,
  ExamAttempt,
  QuestionTopic,
} from '../types';
import { ALL_DIFFICULTIES, ALL_QUESTION_TOPICS } from '../data/officialInfo';
import { ResilientImage } from '../components/ResilientImage';

type StatusFilter = 'all' | 'new' | 'todo' | 'completed';

interface ExamLibraryPageProps {
  exams: Exam[];
  userAttempts: ExamAttempt[];
  onSelectExamDetail: (examId: string) => void;
  onStartExamDirect: (examId: string) => void;
}

export const ExamLibraryPage: React.FC<ExamLibraryPageProps> = ({
  exams,
  userAttempts,
  onSelectExamDetail,
  onStartExamDirect,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'duration' | 'questions'>('newest');

  const completedExamIds = useMemo(
    () => new Set(userAttempts.map((a) => a.examId)),
    [userAttempts]
  );

  const filteredExams = useMemo(() => {
    return exams
      .filter((exam) => {
        const isCompleted = completedExamIds.has(exam.id);
        if (statusFilter === 'new' && !exam.isNew) return false;
        if (statusFilter === 'todo' && isCompleted) return false;
        if (statusFilter === 'completed' && !isCompleted) return false;
        if (topicFilter !== 'all' && exam.topic !== topicFilter) return false;
        if (difficultyFilter !== 'all' && exam.difficulty !== difficultyFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = exam.title.toLowerCase().includes(q);
          const matchCode = exam.code.toLowerCase().includes(q);
          const matchDesc = exam.description.toLowerCase().includes(q);
          if (!matchTitle && !matchCode && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
        if (sortBy === 'questions') return b.questionIds.length - a.questionIds.length;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [exams, completedExamIds, statusFilter, topicFilter, difficultyFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header & Academic Integrity Note */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Thư viện đề luyện tập & thi thử
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#10243A] dark:text-white mt-1">
              Hệ Thống Đề Thi Môn Ngữ Văn ({exams.length} Đề)
            </h1>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Tìm kiếm đề thi theo tên hoặc mã đề"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã đề, tên đề, chủ đề..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <span>
            <strong>Phân loại học thuật minh bạch:</strong> Hệ thống phân biệt rõ{' '}
            <strong className="text-[#10243A] dark:text-white">Đề mô phỏng cấu trúc HSA</strong>{' '}
            (xây dựng theo ma trận đánh giá năng lực đọc hiểu và tư duy ngôn ngữ) và{' '}
            <strong className="text-[#10243A] dark:text-white">Đề luyện tập tự biên soạn</strong>{' '}
            theo chuyên đề. Đây là tài liệu học tập số do học sinh lớp 12A03 Trường THPT Yên Lãng
            thực hiện, không phải đề thi chính thức của đơn vị tổ chức kỳ thi.
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Segmented Status Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
            {[
              { id: 'all', label: 'Tất cả đề thi' },
              { id: 'new', label: 'Đề mới' },
              { id: 'todo', label: 'Đề chưa làm' },
              { id: 'completed', label: 'Đề đã hoàn thành' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as StatusFilter)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-slate-900 text-[#10243A] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dropdown filters: Topic, Difficulty, Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              aria-label="Lọc theo chủ đề"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="all">Tất cả chủ đề</option>
              <option value="Tổng hợp toàn diện">Tổng hợp toàn diện</option>
              {ALL_QUESTION_TOPICS.map((t: QuestionTopic) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              aria-label="Lọc theo mức độ khó"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="all">Tất cả độ khó</option>
              {ALL_DIFFICULTIES.map((d: DifficultyLevel) => (
                <option key={d} value={d}>
                  Độ khó: {d}
                </option>
              ))}
            </select>

            <select
              aria-label="Sắp xếp đề thi"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'duration' | 'questions')}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="duration">Thời gian làm bài</option>
              <option value="questions">Số lượng câu hỏi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exam Grid */}
      {filteredExams.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white">
            Không tìm thấy đề thi phù hợp với bộ lọc
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hãy thử đặt lại bộ lọc trạng thái, chủ đề hoặc từ khóa tìm kiếm.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setTopicFilter('all');
              setDifficultyFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const isCompleted = completedExamIds.has(exam.id);
            const bestAttempt = userAttempts
              .filter((a) => a.examId === exam.id)
              .sort((a, b) => b.score - a.score)[0];

            return (
              <article
                key={exam.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#2563EB] transition-colors"
              >
                <div>
                  <div className="h-40 w-full relative overflow-hidden bg-slate-900">
                    <ResilientImage
                      src={exam.coverImage}
                      alt={exam.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10243A]/90 via-[#10243A]/30 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white font-mono">
                      <span className="font-semibold text-[#D6B978]">{exam.code}</span>
                      <span>
                        {isCompleted ? `Đã hoàn thành (${bestAttempt?.score} đ)` : 'Chưa làm'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Clean unboxed metadata per Zero-Pill rule */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span>{exam.categoryType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{exam.topic}</span>
                      {exam.isNew && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#2563EB] dark:text-blue-400 font-semibold">
                            Đề mới
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white leading-snug">
                      {exam.title}
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {exam.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    <span>Số lượng: {exam.questionIds.length} câu</span>
                    <span>·</span>
                    <span>Thời gian: {exam.durationMinutes} phút</span>
                    <span>·</span>
                    <span>Độ khó: {exam.difficulty}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => onSelectExamDetail(exam.id)}
                      className="py-2.5 px-3 text-xs font-semibold text-[#10243A] dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Chi tiết đề
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartExamDirect(exam.id)}
                      className="py-2.5 px-3 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-500 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Bắt đầu thi</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface ExamDetailPageProps {
  exam: Exam;
  previousAttempts: ExamAttempt[];
  onBack: () => void;
  onStartExam: (examId: string) => void;
  onViewAttemptResult: (attemptId: string) => void;
}

export const ExamDetailPage: React.FC<ExamDetailPageProps> = ({
  exam,
  previousAttempts,
  onBack,
  onStartExam,
  onViewAttemptResult,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#10243A] dark:hover:text-white cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Thư viện đề thi</span>
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-[#10243A] text-white p-6 sm:p-8 space-y-4">
          <div className="text-xs text-[#D6B978] font-mono">
            Mã đề: {exam.code} · {exam.categoryType} · Chuyên đề: {exam.topic}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
            {exam.title}
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">{exam.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 font-mono tabular-nums">
            <div>
              <div className="text-xs text-slate-400">Số lượng câu hỏi</div>
              <div className="text-lg font-bold text-white">{exam.questionIds.length} câu</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Thời gian làm bài</div>
              <div className="text-lg font-bold text-[#D6B978]">{exam.durationMinutes} phút</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Thang điểm chuẩn</div>
              <div className="text-lg font-bold text-white">{exam.maxScore} điểm</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Mức độ khó</div>
              <div className="text-lg font-bold text-white">{exam.difficulty}</div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#2563EB]" />
                <span>Nội Dung Kiến Thức Trọng Tâm</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {exam.knowledgeOutline.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F59E0B]" />
                <span>Hướng Dẫn Làm Bài Trực Tuyến</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {exam.instructions.map((inst) => (
                  <li key={inst} className="flex items-start gap-2">
                    <span className="font-mono text-[#2563EB] font-bold">·</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Khi nhấn <strong>BẮT ĐẦU THI</strong>, đồng hồ đếm ngược sẽ kích hoạt và bài làm được
              tự động lưu sau mỗi thao tác.
            </div>
            <button
              type="button"
              onClick={() => onStartExam(exam.id)}
              className="px-8 py-3.5 bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>BẮT ĐẦU THI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Previous attempts on this exam */}
      {previousAttempts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white">
            Lịch Sử Các Lần Bạn Đã Làm Đề Này ({previousAttempts.length} lần)
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {previousAttempts.map((att, index) => (
              <div
                key={att.id}
                className="py-3 flex items-center justify-between text-xs sm:text-sm"
              >
                <div>
                  <span className="font-mono font-semibold text-[#10243A] dark:text-white">
                    Lần #{previousAttempts.length - index}
                  </span>{' '}
                  · {new Date(att.completedAt).toLocaleString('vi-VN')} · Đúng {att.correctCount}/
                  {att.totalQuestions} câu
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#2563EB]">{att.score} điểm</span>
                  <button
                    type="button"
                    onClick={() => onViewAttemptResult(att.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Xem lại
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
