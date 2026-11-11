import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  History,
  Layers,
  Play,
  RefreshCcw,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  ActiveExamSession,
  AppView,
  Exam,
  ExamAttempt,
  WrongQuestionRecord,
} from '../types';
import { GENERATED_IMAGES, OFFICIAL_PRODUCT_INFO } from '../data/officialInfo';
import { ResilientImage } from '../components/ResilientImage';

interface HomePageProps {
  exams: Exam[];
  totalQuestionsCount: number;
  userAttempts?: ExamAttempt[];
  wrongRecords?: WrongQuestionRecord[];
  activeSession?: ActiveExamSession | null;
  onNavigate: (view: AppView) => void;
  onSelectExam: (examId: string) => void;
  onStartExam?: (examId: string) => void;
  onResumeActiveExam?: () => void;
  onViewAttemptResult?: (attemptId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  exams,
  totalQuestionsCount,
  userAttempts = [],
  wrongRecords = [],
  activeSession = null,
  onNavigate,
  onSelectExam,
  onStartExam,
  onResumeActiveExam,
  onViewAttemptResult,
}) => {
  const completedExamIds = new Set(userAttempts.map((a) => a.examId));
  const completedExamsCount = completedExamIds.size;
  const progressPercent =
    exams.length > 0 ? Math.round((completedExamsCount / exams.length) * 100) : 0;

  const avgScore =
    userAttempts.length > 0
      ? Math.round(
          (userAttempts.reduce((acc, a) => acc + a.score, 0) / userAttempts.length) * 10
        ) / 10
      : 0;

  const totalCorrect = userAttempts.reduce((acc, a) => acc + a.correctCount, 0);
  const totalAnswered = userAttempts.reduce((acc, a) => acc + a.totalQuestions, 0);
  const accuracyPercent =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 1000) / 10 : 0;

  const unmasteredWrongCount = wrongRecords.filter((r) => !r.mastered).length;
  const nextRecommendedExam =
    exams.find((e) => !completedExamIds.has(e.id)) || exams[0];

  const features = [
    {
      icon: FileCheck2,
      title: 'Thi thử trực tuyến',
      description:
        'Phòng thi mô phỏng trực quan với đồng hồ đếm ngược chuẩn xác, tự động lưu bài tức thời và bảng điều hướng 4 trạng thái màu.',
      targetView: 'exams' as AppView,
      actionText: 'Vào phòng luyện thi',
    },
    {
      icon: Target,
      title: 'Luyện tập thông minh',
      description:
        'Chế độ luyện từng câu có kiểm tra đáp án ngay lập tức và luyện tập chuyên sâu tùy chỉnh theo chủ đề, số câu và mức độ khó.',
      targetView: 'practice' as AppView,
      actionText: 'Bắt đầu luyện tập',
    },
    {
      icon: RefreshCcw,
      title: 'Phân tích câu sai',
      description:
        'Tự động tổng hợp danh sách câu trả lời sai, cung cấp lời giải chi tiết, kiến thức liên quan và theo dõi chuỗi làm đúng lại.',
      targetView: 'wrong-practice' as AppView,
      actionText: 'Xem câu cần ôn lại',
    },
    {
      icon: Layers,
      title: 'Ngân hàng câu hỏi',
      description: `Hệ thống ${totalQuestionsCount} câu hỏi biên soạn bài bản, phân loại rõ ràng theo 10 chuyên đề Ngữ văn và 4 cấp độ nhận thức.`,
      targetView: 'question-bank' as AppView,
      actionText: 'Tra cứu ngân hàng câu',
    },
    {
      icon: Clock,
      title: 'Theo dõi tiến độ',
      description:
        'Lưu trữ toàn bộ lịch sử làm bài, thời gian hoàn thành, điểm số từng lần thi để học sinh tự đối chiếu sự tiến bộ cá nhân.',
      targetView: 'history' as AppView,
      actionText: 'Xem lịch sử làm bài',
    },
    {
      icon: BarChart3,
      title: 'Thống kê kết quả',
      description:
        'Hệ thống biểu đồ Line, Bar và Doughnut phân tích tỷ lệ chính xác theo từng chuyên đề giúp nhận diện điểm mạnh và phần cần bồi đắp.',
      targetView: 'statistics' as AppView,
      actionText: 'Phân tích thống kê',
    },
  ];

  return (
    <div className="space-y-10 pb-8">
      {/* 1. HERO CAO CẤP (HSA MASTER 2.0) */}
      <section className="bg-[#10213A] text-white rounded-2xl overflow-hidden border border-[#142943] shadow-sm">
        <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#D9BD79] uppercase">
                <span>SẢN PHẨM HỌC TẬP SỐ – MÔN NGỮ VĂN</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-[1.15]">
                CHINH PHỤC HSA – BẮT ĐẦU TỪ HÔM NAY
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                HSA MASTER là nền tảng học tập số hiện đại hỗ trợ học sinh rèn luyện tư duy ngôn
                ngữ, đọc hiểu văn bản, phân tích ngữ liệu mới và tự đánh giá năng lực môn Ngữ văn
                thông qua hệ thống luyện thi trực tuyến chuẩn hóa.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('exams')}
                  className="px-6 py-3.5 bg-[#315EDE] hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <span>BẮT ĐẦU LUYỆN THI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Compass className="w-4 h-4 text-[#D9BD79]" />
                  <span>KHÁM PHÁ HỆ THỐNG</span>
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Năm học {OFFICIAL_PRODUCT_INFO.academicYear}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Giáo viên bộ môn:{' '}
                  <strong className="text-white">
                    {OFFICIAL_PRODUCT_INFO.subjectTeacherName}
                  </strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Học sinh thực hiện:{' '}
                  <strong className="text-[#D9BD79]">
                    {OFFICIAL_PRODUCT_INFO.students.join(' & ')}
                  </strong>{' '}
                  (Lớp {OFFICIAL_PRODUCT_INFO.className} · Khóa {OFFICIAL_PRODUCT_INFO.cohort} ·{' '}
                  {OFFICIAL_PRODUCT_INFO.schoolName})
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl overflow-hidden border border-white/15 relative min-h-[260px]">
              <ResilientImage
                src={GENERATED_IMAGES.homeHero}
                alt="Thư viện học thuật hiện đại kết hợp công nghệ phân tích Ngữ văn"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10213A]/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-200 bg-[#10213A]/90 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
                <div className="font-semibold text-[#D9BD79] mb-0.5">
                  Đọc hiểu sâu · Tư duy ngôn ngữ · Tự đánh giá
                </div>
                <div>
                  Tích hợp ngữ liệu văn học, nghị luận xã hội và văn bản thông tin đa phương thức.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BỐN THẺ SỐ LIỆU THỰC TẾ BÊN DƯỚI HERO */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-3 hover:border-[#315EDE] transition-colors">
          <div>
            <div className="text-xs font-medium text-[#77849A] dark:text-slate-400">
              Tổng số đề thi
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-[#10213A] dark:text-white mt-1">
              {exams.length} Đề
            </div>
            <div className="text-xs text-[#77849A] dark:text-slate-400 mt-1">
              Đề mô phỏng & Đề chuyên đề
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#315EDE]/10 text-[#315EDE] flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-3 hover:border-[#315EDE] transition-colors">
          <div>
            <div className="text-xs font-medium text-[#77849A] dark:text-slate-400">
              Tổng số câu hỏi
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-[#10213A] dark:text-white mt-1">
              {totalQuestionsCount} Câu
            </div>
            <div className="text-xs text-[#77849A] dark:text-slate-400 mt-1">
              Có giải thích & mẹo ghi nhớ
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D9BD79]/20 text-[#10213A] dark:text-[#D9BD79] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-3 hover:border-[#315EDE] transition-colors">
          <div>
            <div className="text-xs font-medium text-[#77849A] dark:text-slate-400">
              Số chủ đề trọng tâm
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-[#10213A] dark:text-white mt-1">
              10 Chủ đề
            </div>
            <div className="text-xs text-[#77849A] dark:text-slate-400 mt-1">
              Tiếng Việt, Tu từ & Đọc hiểu
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-3 hover:border-[#315EDE] transition-colors">
          <div>
            <div className="text-xs font-medium text-[#77849A] dark:text-slate-400">
              Chế độ luyện tập
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-[#10213A] dark:text-white mt-1">
              4 Chế độ
            </div>
            <div className="text-xs text-[#77849A] dark:text-slate-400 mt-1">
              Thi thử · Từng câu · Câu sai · Chủ đề
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* 3. TIẾP TỤC HỌC · TIẾN ĐỘ HỌC TẬP · HOẠT ĐỘNG GẦN ĐÂY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tiếp tục học & Tiến độ học tập */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#315EDE]">
                  Tiếp tục học & Tiến độ thực tế
                </p>
                <h2 className="font-display text-xl font-bold text-[#10213A] dark:text-white mt-0.5">
                  Lộ Trình Rèn Luyện Của Bạn
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#F4F6FA] dark:bg-slate-800 text-[#10213A] dark:text-[#D9BD79]">
                Hoàn thành {completedExamsCount}/{exams.length} đề ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 rounded-full bg-[#F4F6FA] dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#315EDE] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(4, progressPercent)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#77849A] dark:text-slate-400 font-mono">
                <span>Điểm TB: {avgScore}/100</span>
                <span>Độ chính xác: {accuracyPercent}%</span>
                <span>Câu sai cần ôn: {unmasteredWrongCount} câu</span>
              </div>
            </div>

            {/* Continue Learning Card */}
            {activeSession ? (
              <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ĐANG LÀM DỞ BÀI THI</span>
                  </div>
                  <div className="text-sm font-bold text-[#10213A] dark:text-white">
                    {activeSession.examTitle} ({activeSession.examCode})
                  </div>
                  <div className="text-xs text-[#77849A] dark:text-slate-400">
                    Đã chọn {Object.keys(activeSession.answers).length} câu · Đánh dấu{' '}
                    {activeSession.flaggedQuestions.length} câu
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onResumeActiveExam ? onResumeActiveExam() : onSelectExam(activeSession.examId)
                  }
                  className="px-4 py-2.5 bg-[#315EDE] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Tiếp tục làm bài →
                </button>
              </div>
            ) : (
              nextRecommendedExam && (
                <div className="p-4 rounded-xl bg-[#F4F6FA] dark:bg-slate-800/60 border border-[#E4E9F1] dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-[#315EDE] dark:text-blue-400">
                      ĐỀ XUẤT LUYỆN TẬP TIẾP THEO · {nextRecommendedExam.code}
                    </div>
                    <div className="text-sm font-bold text-[#10213A] dark:text-white">
                      {nextRecommendedExam.title}
                    </div>
                    <div className="text-xs text-[#77849A] dark:text-slate-400 font-mono">
                      {nextRecommendedExam.questionIds.length} câu ·{' '}
                      {nextRecommendedExam.durationMinutes} phút · Độ khó:{' '}
                      {nextRecommendedExam.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        onStartExam
                          ? onStartExam(nextRecommendedExam.id)
                          : onSelectExam(nextRecommendedExam.id)
                      }
                      className="px-4 py-2.5 bg-[#10213A] hover:bg-[#142943] dark:bg-[#315EDE] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Vào thi ngay</span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="pt-3 border-t border-[#E4E9F1] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="font-semibold text-[#315EDE] dark:text-blue-400 hover:underline cursor-pointer"
            >
              Luyện tập theo 10 chuyên đề →
            </button>
            <button
              type="button"
              onClick={() => onNavigate('statistics')}
              className="font-semibold text-[#77849A] hover:text-[#10213A] dark:hover:text-white cursor-pointer flex items-center gap-1"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Xem biểu đồ phân tích năng lực</span>
            </button>
          </div>
        </div>

        {/* Right: Hoạt động gần đây */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#315EDE]" />
                <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
                  Hoạt Động Làm Bài Gần Đây
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-[#315EDE] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Tất cả ({userAttempts.length})
              </button>
            </div>

            {userAttempts.length > 0 ? (
              <div className="divide-y divide-[#E4E9F1] dark:divide-slate-800">
                {userAttempts.slice(0, 3).map((att) => (
                  <div
                    key={att.id}
                    className="py-2.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-[#10213A] dark:text-white truncate">
                        {att.examTitle}
                      </div>
                      <div className="text-[11px] font-mono text-[#77849A]">
                        {att.examCode} · Đúng {att.correctCount}/{att.totalQuestions} câu (
                        {att.accuracyPercent}%)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onViewAttemptResult
                          ? onViewAttemptResult(att.id)
                          : onNavigate('history')
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-[#F4F6FA] dark:bg-slate-800 font-mono font-bold text-[#315EDE] dark:text-blue-400 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                    >
                      {att.score} đ
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#F4F6FA] dark:bg-slate-800/60 text-xs text-[#77849A] dark:text-slate-300 space-y-2 leading-relaxed">
                <p>
                  Bạn chưa có lượt nộp bài nào trong phiên hiện tại. Kết quả các đề thi thử và câu
                  hỏi luyện tập sẽ được cập nhật trực tiếp tại đây.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('exams')}
                  className="text-[#315EDE] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                >
                  Chọn đề thi đầu tiên trong thư viện →
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E4E9F1] dark:border-slate-800 flex items-center justify-between text-xs text-[#77849A]">
            <span>Tự động lưu kết quả theo tài khoản</span>
            <button
              type="button"
              onClick={() => onNavigate('wrong-practice')}
              className="font-semibold text-[#DC2626] hover:underline cursor-pointer"
            >
              Ôn câu sai ({unmasteredWrongCount})
            </button>
          </div>
        </div>
      </section>

      {/* 4. CHỨC NĂNG NỔI BẬT */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#315EDE]">
              Hệ sinh thái học tập số
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#10213A] dark:text-white mt-1">
              6 Chức Năng Nổi Bật Của HSA MASTER
            </h2>
          </div>
          <p className="text-sm text-[#77849A] dark:text-slate-400 max-w-md">
            Thiết kế chuyên biệt cho môn Ngữ văn nhằm rèn luyện đồng bộ kiến thức ngôn ngữ và năng
            lực cảm thụ, phân tích văn bản.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.button
                type="button"
                key={feat.title}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.16 }}
                onClick={() => onNavigate(feat.targetView)}
                className="group text-left bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:border-[#315EDE] dark:hover:border-blue-500 transition-colors shadow-2xs"
              >
                <div className="space-y-3.5 w-full">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#10213A]/5 dark:bg-white/5 text-[#10213A] dark:text-[#D9BD79] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[#77849A]">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#10213A] dark:text-white group-hover:text-[#315EDE] dark:group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[#77849A] dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 mt-5 w-full border-t border-[#E4E9F1] dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#315EDE] dark:text-blue-400">
                  <span>{feat.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* 5. ĐỀ THI MỚI NHẤT */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#315EDE]">
              Đề thi mới nhất
            </p>
            <h2 className="font-display text-2xl font-bold text-[#10213A] dark:text-white mt-1">
              Đề Luyện Tập & Mô Phỏng Tiêu Biểu
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('exams')}
            className="px-4 py-2 text-xs font-semibold text-[#10213A] dark:text-white bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-xl hover:border-[#315EDE] transition-colors cursor-pointer whitespace-nowrap"
          >
            Xem toàn bộ {exams.length} đề thi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {exams.slice(0, 3).map((exam) => {
            const isDone = completedExamIds.has(exam.id);
            return (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#315EDE] transition-colors"
              >
                <div className="p-5 space-y-2.5">
                  <div className="text-xs text-[#77849A] dark:text-slate-400 flex items-center justify-between gap-1.5 flex-wrap">
                    <span className="font-mono font-semibold text-[#315EDE] dark:text-blue-400">
                      {exam.code}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-[#F4F6FA] text-[#77849A] dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {isDone ? 'Đã hoàn thành' : 'Chưa làm'}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#10213A] dark:text-white leading-snug">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-[#77849A] dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                <div className="px-5 py-3.5 bg-[#F4F6FA] dark:bg-slate-800/50 border-t border-[#E4E9F1] dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-xs text-[#77849A] dark:text-slate-400 font-mono tabular-nums">
                    {exam.questionIds.length} câu · {exam.durationMinutes} phút · {exam.difficulty}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectExam(exam.id)}
                    className="px-3.5 py-1.5 bg-[#10213A] hover:bg-[#142943] dark:bg-[#315EDE] dark:hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Chi tiết đề
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. THÔNG TIN DỰ ÁN & MỤC TIÊU HỌC THUẬT */}
      <section className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold tracking-wider text-[#315EDE]">
              MỤC TIÊU GIÁO DỤC & ĐỊNH HƯỚNG HỌC THUẬT
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#10213A] dark:text-white">
              Vì Sao HSA MASTER Được Xây Dựng?
            </h2>
            <p className="text-sm text-[#77849A] dark:text-slate-300 leading-relaxed">
              Trong bối cảnh đổi mới kiểm tra đánh giá môn Ngữ văn theo hướng phát triển phẩm chất
              và năng lực, học sinh không chỉ cần ghi nhớ kiến thức văn học sử mà còn phải làm chủ
              kỹ năng đọc hiểu văn bản mới, phân tích cấu trúc ngôn từ và suy luận phản biện.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Tạo môi trường tự học và luyện tập trực tuyến thuận tiện, khoa học',
                'Giúp học sinh làm quen với áp lực thời gian và cấu trúc câu hỏi đánh giá năng lực',
                'Cung cấp giải thích chi tiết và gợi ý ghi nhớ sau mỗi câu trả lời',
                'Minh bạch hóa tiến độ học tập bằng số liệu thực tế của từng tài khoản',
              ].map((goal) => (
                <div
                  key={goal}
                  className="flex items-start gap-2.5 text-sm text-[#17243A] dark:text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{goal}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#F4F6FA] dark:bg-slate-800/60 border border-[#E4E9F1] dark:border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10213A] text-[#D9BD79] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#77849A] dark:text-slate-400">
                  Hồ sơ chính thức sản phẩm
                </div>
                <div className="font-display font-bold text-base text-[#10213A] dark:text-white">
                  {OFFICIAL_PRODUCT_INFO.productName} – {OFFICIAL_PRODUCT_INFO.subject}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-[#17243A] dark:text-slate-300 border-t border-[#E4E9F1] dark:border-slate-700 pt-3">
              <div className="flex justify-between">
                <span className="text-[#77849A] dark:text-slate-400">Năm học:</span>
                <span className="font-mono tabular-nums font-semibold">
                  {OFFICIAL_PRODUCT_INFO.academicYear}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77849A] dark:text-slate-400">Giáo viên bộ môn:</span>
                <span className="font-semibold text-[#10213A] dark:text-[#D9BD79]">
                  {OFFICIAL_PRODUCT_INFO.subjectTeacherName}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#E4E9F1] dark:border-slate-700 space-y-1.5">
                <div className="text-[#77849A] dark:text-slate-400">Học sinh thực hiện:</div>
                <div className="font-semibold text-[#10213A] dark:text-white">
                  1. {OFFICIAL_PRODUCT_INFO.students[0]}
                </div>
                <div className="font-semibold text-[#10213A] dark:text-white">
                  2. {OFFICIAL_PRODUCT_INFO.students[1]}
                </div>
                <div className="pt-1 text-xs text-[#77849A] dark:text-slate-300 space-y-1">
                  <div>
                    Lớp:{' '}
                    <strong className="text-[#17243A] dark:text-white">
                      {OFFICIAL_PRODUCT_INFO.className}
                    </strong>{' '}
                    · Khóa:{' '}
                    <strong className="font-mono text-[#17243A] dark:text-white">
                      {OFFICIAL_PRODUCT_INFO.cohort}
                    </strong>
                  </div>
                  <div>
                    Trường:{' '}
                    <strong className="text-[#17243A] dark:text-white">
                      {OFFICIAL_PRODUCT_INFO.schoolName}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="w-full py-2.5 text-xs font-semibold text-[#315EDE] dark:text-blue-400 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-700 rounded-xl hover:border-[#315EDE] transition-colors cursor-pointer"
            >
              Xem trang Giới thiệu sản phẩm chi tiết
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
