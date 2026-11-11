import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Play,
  RefreshCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  ActiveExamSession,
  AppView,
  Exam,
  ExamAttempt,
  Question,
  UserAccount,
  WrongQuestionRecord,
} from '../types';
import { computeTopicStatistics } from '../utils/examEngine';
import {
  AccuracyDoughnutChart,
  ScoreLineChart,
  TopicBarChart,
} from '../components/AnalyticsCharts';

interface StudentDashboardProps {
  user: UserAccount;
  exams: Exam[];
  questions: Question[];
  realAttempts: ExamAttempt[];
  realWrongRecords: WrongQuestionRecord[];
  demoModeEnabled: boolean;
  demoAttempts: ExamAttempt[];
  demoWrongRecords: WrongQuestionRecord[];
  activeSession: ActiveExamSession | null;
  onToggleDemoMode: (enabled: boolean) => void;
  onNavigate: (view: AppView) => void;
  onSelectExam: (examId: string) => void;
  onResumeActiveExam: () => void;
  onViewAttemptResult: (attemptId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  exams,
  questions,
  realAttempts,
  realWrongRecords,
  demoModeEnabled,
  demoAttempts,
  demoWrongRecords,
  activeSession,
  onToggleDemoMode,
  onNavigate,
  onSelectExam,
  onResumeActiveExam,
  onViewAttemptResult,
}) => {
  const isShowingDemo = realAttempts.length === 0 && demoModeEnabled;
  const activeAttempts = isShowingDemo ? demoAttempts : realAttempts;
  const activeWrongRecords = isShowingDemo ? demoWrongRecords : realWrongRecords;

  const questionsMap = new Map(questions.map((q) => [q.id, q]));
  const examsMap = new Map(exams.map((e) => [e.id, e]));

  // Compute 5 core KPI cards strictly from activeAttempts
  const totalExamsDone = activeAttempts.length;
  const avgScore =
    totalExamsDone > 0
      ? Math.round(
          (activeAttempts.reduce((acc, a) => acc + a.score, 0) / totalExamsDone) * 10
        ) / 10
      : 0;
  const highestScore =
    totalExamsDone > 0 ? Math.max(...activeAttempts.map((a) => a.score)) : 0;

  const totalCorrect = activeAttempts.reduce((acc, a) => acc + a.correctCount, 0);
  const totalWrong = activeAttempts.reduce((acc, a) => acc + a.wrongCount, 0);
  const totalUnanswered = activeAttempts.reduce((acc, a) => acc + a.unansweredCount, 0);
  const totalQuestionsAnswered = totalCorrect + totalWrong + totalUnanswered;

  const overallAccuracy =
    totalQuestionsAnswered > 0
      ? Math.round((totalCorrect / totalQuestionsAnswered) * 1000) / 10
      : 0;

  const totalDurationSeconds = activeAttempts.reduce(
    (acc, a) => acc + a.durationSeconds,
    0
  );
  const totalMinutes = Math.round(totalDurationSeconds / 60);

  const topicStats = computeTopicStatistics(activeAttempts, examsMap, questionsMap);
  const weakTopics = topicStats
    .filter((t) => t.totalAnswered > 0 && t.accuracyPercent < 75)
    .sort((a, b) => a.accuracyPercent - b.accuracyPercent);

  const unmasteredWrong = activeWrongRecords.filter((r) => !r.mastered);

  const todayFormatted = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8 pb-8">
      {/* 1. PHẦN CHÀO MỪNG */}
      <section className="bg-[#10243A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs text-[#D6B978] font-medium">
            TRUNG TÂM QUẢN LÝ HỌC TẬP · {todayFormatted}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Xin chào, {user.fullName}!
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Lớp {user.className} · {user.schoolName} · Chúc bạn một buổi rèn luyện tư duy Ngữ văn
            tập trung và hiệu quả.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {realAttempts.length === 0 && (
            <button
              type="button"
              onClick={() => onToggleDemoMode(!demoModeEnabled)}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-[#D6B978] transition-colors cursor-pointer whitespace-nowrap"
            >
              {demoModeEnabled ? 'Tắt dữ liệu mẫu [DEMO]' : 'Xem dữ liệu mẫu [DEMO]'}
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('exams')}
            className="px-5 py-3 bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Bắt đầu luyện thi</span>
          </button>
        </div>
      </section>

      {/* Active Unfinished Exam Session Banner */}
      {activeSession && (
        <section className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>BÀI THI ĐANG LÀM DỞ ĐƯỢC TỰ ĐỘNG LƯU</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {activeSession.examTitle} ({activeSession.examCode})
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Đã trả lời {Object.keys(activeSession.answers).length} câu · Đánh dấu xem lại{' '}
              {activeSession.flaggedQuestions.length} câu
            </div>
          </div>
          <button
            type="button"
            onClick={onResumeActiveExam}
            className="px-4 py-2.5 bg-[#F59E0B] hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Tiếp tục làm bài ngay →
          </button>
        </section>
      )}

      {/* Demo mode transparent notice when enabled */}
      {isShowingDemo && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span>
              <strong>Chế độ xem minh họa [DEMO]:</strong> Bạn chưa có bài thi thực tế nên hệ thống
              đang hiển thị bộ dữ liệu mẫu có gắn nhãn <strong>[DEMO]</strong>. Ngay khi bạn hoàn
              thành một đề thi thật, toàn bộ số liệu thực tế của bạn sẽ được áp dụng.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onToggleDemoMode(false)}
            className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 underline cursor-pointer whitespace-nowrap shrink-0"
          >
            Trở về trạng thái trống thực tế
          </button>
        </div>
      )}

      {/* 2. CÁC THẺ THỐNG KÊ (5 KPI Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tổng số đề đã làm</span>
            <FileText className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#10243A] dark:text-white">
            {totalExamsDone} đề {isShowingDemo ? '[DEMO]' : ''}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Trên tổng số {exams.length} đề thư viện
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Điểm trung bình</span>
            <TrendingUp className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#10243A] dark:text-white">
            {avgScore} / 100
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Thang điểm chuẩn 100
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Điểm cao nhất</span>
            <Award className="w-4 h-4 text-[#D6B978]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#10243A] dark:text-white">
            {highestScore} / 100
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Thành tích tốt nhất hiện tại
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tỷ lệ trả lời đúng</span>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#16A34A]">
            {overallAccuracy}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {totalCorrect}/{totalQuestionsAnswered} câu chính xác
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tổng thời gian luyện</span>
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#10243A] dark:text-white">
            {totalMinutes} phút
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            ({totalDurationSeconds} giây tích lũy)
          </div>
        </div>
      </section>

      {/* Empty State with Clear Guidance if 0 attempts */}
      {activeAttempts.length === 0 ? (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-[#10243A]/5 dark:bg-white/5 text-[#10243A] dark:text-[#D6B978] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold text-[#10243A] dark:text-white">
              Tài khoản của bạn chưa có lịch sử làm bài thi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              HSA MASTER cam kết hiển thị số liệu trung thực từ kết quả làm bài thực tế của bạn,
              không tự tạo thành tích giả. Hãy chọn một đề thi đầu tiên trong Thư viện đề thi để hệ
              thống bắt đầu thống kê biểu đồ năng lực, hoặc bật chế độ xem dữ liệu mẫu [DEMO] để
              tham khảo giao diện phân tích.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('exams')}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Chọn đề thi đầu tiên ngay →
            </button>
            <button
              type="button"
              onClick={() => onToggleDemoMode(true)}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Xem thử biểu đồ với dữ liệu mẫu [DEMO]
            </button>
          </div>
        </section>
      ) : (
        /* 3. BIỂU ĐỒ (Line, Bar, Doughnut) */
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white">
                  Biểu Đồ Tiến Bộ Điểm Số {isShowingDemo ? '[DEMO]' : ''}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Theo dõi xu hướng điểm số qua các lần hoàn thành bài thi
                </p>
              </div>
              <span className="text-xs font-mono text-[#2563EB] dark:text-blue-400">
                Thang 100 điểm
              </span>
            </div>
            <ScoreLineChart attempts={activeAttempts} />
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white">
                Tỷ Lệ Trả Lời Đúng & Sai {isShowingDemo ? '[DEMO]' : ''}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tổng hợp từ tất cả các câu hỏi đã làm trong các kỳ thi
              </p>
            </div>
            <AccuracyDoughnutChart
              correctCount={totalCorrect}
              wrongCount={totalWrong}
              unansweredCount={totalUnanswered}
            />
          </div>

          <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white">
                  Kết Quả Theo 10 Chuyên Đề Ngữ Văn {isShowingDemo ? '[DEMO]' : ''}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Đánh giá tỷ lệ chính xác ở từng nhóm năng lực đọc hiểu và tiếng Việt
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('practice')}
                className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Luyện tập theo chủ đề →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <TopicBarChart stats={topicStats.slice(0, 5)} />
              <TopicBarChart stats={topicStats.slice(5, 10)} />
            </div>
          </div>
        </section>
      )}

      {/* 4. KHU VỰC HOẠT ĐỘNG (Đề gần đây, Câu cần luyện lại, Chủ đề yếu, Lịch sử) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Attempts & Exam suggestions */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white">
              Lịch Sử Làm Bài & Đề Thi Gần Đây {isShowingDemo ? '[DEMO]' : ''}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
            >
              Xem toàn bộ lịch sử
            </button>
          </div>

          {activeAttempts.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeAttempts.slice(0, 4).map((att) => (
                <div
                  key={att.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {att.examCode} · {new Date(att.completedAt).toLocaleDateString('vi-VN')} ·{' '}
                      {Math.round(att.durationSeconds / 60)} phút
                    </div>
                    <div className="text-sm font-semibold text-[#10243A] dark:text-white">
                      {att.examTitle}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      Đúng {att.correctCount}/{att.totalQuestions} câu ({att.accuracyPercent}%)
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-bold font-mono tabular-nums text-[#2563EB] dark:text-blue-400">
                        {att.score} đ
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewAttemptResult(att.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Xem kết quả
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gợi ý các đề thi để bạn bắt đầu ngay hôm nay:
              </p>
              {exams.slice(0, 3).map((ex) => (
                <div
                  key={ex.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-mono text-[#2563EB] dark:text-blue-400">
                      {ex.code} · {ex.questionIds.length} câu · {ex.durationMinutes} phút
                    </div>
                    <div className="text-sm font-semibold text-[#10243A] dark:text-white mt-0.5">
                      {ex.title}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectExam(ex.id)}
                    className="px-3.5 py-2 bg-[#10243A] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Vào thi
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Weak Topics & Questions needing review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-[#DC2626]" />
                <span>Câu Hỏi Cần Luyện Lại ({unmasteredWrong.length})</span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('wrong-practice')}
                className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Luyện câu sai →
              </button>
            </div>

            {unmasteredWrong.length > 0 ? (
              <div className="space-y-2.5">
                {unmasteredWrong.slice(0, 3).map((rec) => {
                  const q = questionsMap.get(rec.questionId);
                  if (!q) return null;
                  return (
                    <div
                      key={rec.questionId}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1"
                    >
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Mã {q.id} · {q.topic} · Sai {rec.wrongCount} lần
                      </div>
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                        {q.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hiện tại chưa có câu hỏi nào trong danh sách cần luyện lại. Các câu trả lời sai
                trong phòng thi sẽ tự động được tổng hợp tại đây.
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>Chủ Đề Cần Củng Cố Thêm</span>
            </h2>
            {weakTopics.length > 0 ? (
              <div className="space-y-2">
                {weakTopics.slice(0, 3).map((wt) => (
                  <div
                    key={wt.topic}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {wt.topic}
                    </span>
                    <span className="font-mono tabular-nums text-[#DC2626] dark:text-red-400 font-semibold">
                      Độ chính xác: {wt.accuracyPercent}%
                    </span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => onNavigate('practice')}
                  className="w-full mt-2 py-2 text-xs font-semibold text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Luyện chuyên sâu các chủ đề này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeAttempts.length === 0
                  ? 'Hoàn thành ít nhất 1 đề thi để hệ thống tự động chẩn đoán các chuyên đề còn yếu.'
                  : 'Tất cả các chuyên đề bạn đã làm đều đạt tỷ lệ chính xác từ 75% trở lên. Hãy tiếp tục phát huy!'}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
