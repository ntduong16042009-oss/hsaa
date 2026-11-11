import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Award,
  Calendar,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  LogOut,
  Moon,
  Save,
  Settings,
  ShieldCheck,
  Sun,
  TrendingUp,
  User,
} from 'lucide-react';
import {
  AppView,
  Exam,
  ExamAttempt,
  Question,
  UserAccount,
} from '../types';
import { computeTopicStatistics } from '../utils/examEngine';
import {
  generateSalt,
  hashPasswordWithSalt,
  validatePasswordChange,
} from '../utils/authSecurity';
import {
  AccuracyDoughnutChart,
  ScoreLineChart,
  TopicBarChart,
} from '../components/AnalyticsCharts';

interface HistoryAndStatsPageProps {
  initialTab: 'history' | 'statistics';
  exams: Exam[];
  questions: Question[];
  realAttempts: ExamAttempt[];
  demoAttempts: ExamAttempt[];
  demoModeEnabled: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
  onViewAttemptResult: (attemptId: string) => void;
  onNavigate: (view: AppView) => void;
}

export const HistoryAndStatsPage: React.FC<HistoryAndStatsPageProps> = ({
  initialTab,
  exams,
  questions,
  realAttempts,
  demoAttempts,
  demoModeEnabled,
  onToggleDemoMode,
  onViewAttemptResult,
  onNavigate,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d'>('all');

  const isShowingDemo = realAttempts.length === 0 && demoModeEnabled;
  const sourceAttempts = isShowingDemo ? demoAttempts : realAttempts;

  const filteredAttempts = useMemo(() => {
    if (timeFilter === 'all') return sourceAttempts;
    const now = Date.now();
    const daysMs = (timeFilter === '7d' ? 7 : 30) * 24 * 60 * 60 * 1000;
    return sourceAttempts.filter((a) => {
      const t = new Date(a.completedAt).getTime();
      return now - t <= daysMs;
    });
  }, [sourceAttempts, timeFilter]);

  const examsMap = useMemo(() => new Map(exams.map((e) => [e.id, e])), [exams]);
  const questionsMap = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);
  const topicStats = useMemo(
    () => computeTopicStatistics(filteredAttempts, examsMap, questionsMap),
    [filteredAttempts, examsMap, questionsMap]
  );

  const totalCorrect = filteredAttempts.reduce((acc, a) => acc + a.correctCount, 0);
  const totalWrong = filteredAttempts.reduce((acc, a) => acc + a.wrongCount, 0);
  const totalUnanswered = filteredAttempts.reduce((acc, a) => acc + a.unansweredCount, 0);

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Time Filter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
            {initialTab === 'history' ? 'Nhật ký làm bài' : 'Phân tích dữ liệu học tập'}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#10243A] dark:text-white mt-1">
            {initialTab === 'history'
              ? 'Lịch Sử Thi Trực Tuyến'
              : 'Thống Kê Tiến Độ & Biểu Đồ Năng Lực'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {realAttempts.length === 0 && (
            <button
              type="button"
              onClick={() => onToggleDemoMode(!demoModeEnabled)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#2563EB] cursor-pointer"
            >
              {demoModeEnabled ? 'Tắt dữ liệu mẫu [DEMO]' : 'Bật dữ liệu mẫu [DEMO]'}
            </button>
          )}

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {[
              { id: 'all', label: 'Tất cả thời gian' },
              { id: '30d', label: '30 ngày qua' },
              { id: '7d', label: '7 ngày qua' },
            ].map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setTimeFilter(tf.id as 'all' | '7d' | '30d')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  timeFilter === tf.id
                    ? 'bg-white dark:bg-slate-900 text-[#10243A] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredAttempts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white">
            Chưa có dữ liệu lịch sử làm bài trong khoảng thời gian này
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Hãy hoàn thành một bài thi trong Thư viện đề thi hoặc bật chế độ xem dữ liệu mẫu [DEMO]
            để tham khảo hệ thống biểu đồ thống kê.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('exams')}
              className="px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Vào Thư viện đề thi
            </button>
            {realAttempts.length === 0 && !demoModeEnabled && (
              <button
                type="button"
                onClick={() => onToggleDemoMode(true)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Xem dữ liệu mẫu [DEMO]
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white">
                Line Chart: Tiến Bộ Điểm Số Qua Các Lần Thi {isShowingDemo ? '[DEMO]' : ''}
              </h2>
              <ScoreLineChart attempts={filteredAttempts} />
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white">
                Doughnut Chart: Tỷ Lệ Đúng & Sai {isShowingDemo ? '[DEMO]' : ''}
              </h2>
              <AccuracyDoughnutChart
                correctCount={totalCorrect}
                wrongCount={totalWrong}
                unansweredCount={totalUnanswered}
              />
            </div>

            <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white">
                Bar Chart: Kết Quả Theo 10 Chủ Đề Ngữ Văn {isShowingDemo ? '[DEMO]' : ''}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <TopicBarChart stats={topicStats.slice(0, 5)} />
                <TopicBarChart stats={topicStats.slice(5, 10)} />
              </div>
            </div>
          </div>

          {/* Detailed History Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#10243A] dark:text-white">
                Bảng Chi Tiết Lịch Sử Làm Bài ({filteredAttempts.length} lượt)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4 font-semibold">Mã đề</th>
                    <th className="py-3 px-4 font-semibold">Tên đề thi</th>
                    <th className="py-3 px-4 font-semibold">Ngày thực hiện</th>
                    <th className="py-3 px-4 font-semibold text-right">Điểm số</th>
                    <th className="py-3 px-4 font-semibold text-right">Đúng / Sai</th>
                    <th className="py-3 px-4 font-semibold text-right">Thời gian</th>
                    <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
                  {filteredAttempts.map((att) => (
                    <tr
                      key={att.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#2563EB] dark:text-blue-400">
                        {att.examCode}
                      </td>
                      <td className="py-3.5 px-4 font-sans font-semibold text-[#10243A] dark:text-white">
                        {att.examTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(att.completedAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#10243A] dark:text-white">
                        {att.score} / {att.maxScore}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[#16A34A]">{att.correctCount}Đ</span> ·{' '}
                        <span className="text-[#DC2626]">{att.wrongCount}S</span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500">
                        {Math.floor(att.durationSeconds / 60)}p {att.durationSeconds % 60}s
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <button
                          type="button"
                          onClick={() => onViewAttemptResult(att.id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-[#2563EB] hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AVATAR_PRESETS = [
  { id: '', label: 'Chữ cái đầu của tên (Mặc định)' },
  {
    id: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2310243A"/><circle cx="50" cy="38" r="18" fill="%23D6B978"/><path d="M22 86c0-15.5 12.5-28 28-28s28 12.5 28 28" fill="%23D6B978"/></svg>',
    label: 'Huy hiệu Học giả Navy Gold',
  },
  {
    id: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%232563EB"/><circle cx="50" cy="38" r="18" fill="%23FFFFFF"/><path d="M22 86c0-15.5 12.5-28 28-28s28 12.5 28 28" fill="%23FFFFFF"/></svg>',
    label: 'Huy hiệu Royal Blue',
  },
  {
    id: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2316A34A"/><circle cx="50" cy="38" r="18" fill="%23FFFFFF"/><path d="M22 86c0-15.5 12.5-28 28-28s28 12.5 28 28" fill="%23FFFFFF"/></svg>',
    label: 'Huy hiệu Thành tựu Xanh',
  },
];

interface UserProfilePageProps {
  user: UserAccount;
  initialSection?: 'info' | 'security' | 'settings';
  theme: 'light' | 'dark';
  realAttempts: ExamAttempt[];
  onUpdateProfile: (updated: UserAccount) => void;
  onToggleTheme: () => void;
  onRequestLogout: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  initialSection = 'info',
  theme,
  realAttempts,
  onUpdateProfile,
  onToggleTheme,
  onRequestLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'settings'>(
    initialSection
  );

  // Sync when user changes or initialSection prop updates
  useEffect(() => {
    setActiveTab(initialSection);
  }, [initialSection]);

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [className, setClassName] = useState(user.className);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password change state (never pre-populated with any password!)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [profileLogoutConfirmOpen, setProfileLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    setFullName(user.fullName);
    setEmail(user.email);
    setClassName(user.className);
    setAvatarUrl(user.avatarUrl || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPwError(null);
    setPwSuccess(null);
  }, [user.id]);

  const totalAttempts = realAttempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          (realAttempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts) * 10
        ) / 10
      : 0;
  const bestScore =
    totalAttempts > 0 ? Math.max(...realAttempts.map((a) => a.score)) : 0;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);

    if (!fullName.trim() || !email.trim()) {
      setProfileError('Họ và tên và Email không được để trống.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setProfileError('Địa chỉ Email không hợp lệ.');
      return;
    }

    onUpdateProfile({
      ...user,
      fullName: fullName.trim(),
      email: email.trim(),
      className: className.trim() || user.className,
      avatarUrl: avatarUrl.trim() || undefined,
    });
    setSavedNotice('Đã cập nhật thông tin hồ sơ cá nhân và ảnh đại diện thành công!');
    window.setTimeout(() => setSavedNotice(null), 3500);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    const validation = validatePasswordChange(
      user,
      currentPassword,
      newPassword,
      confirmNewPassword
    );

    if (!validation.valid) {
      setPwError(validation.error || 'Đổi mật khẩu không thành công.');
      return;
    }

    const nextSalt = generateSalt();
    const nextDigest = hashPasswordWithSalt(newPassword, nextSalt);

    onUpdateProfile({
      ...user,
      passwordSalt: nextSalt,
      passwordDigest: nextDigest,
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPwSuccess('Đã đổi mật khẩu an toàn thành công! Mật khẩu mới đã được mã hóa một chiều.');
  };

  const initials = user.fullName
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Profile Hero Header */}
      <div className="bg-[#10243A] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#D6B978] shrink-0 bg-slate-800"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#D6B978] text-[#10243A] font-display font-extrabold text-xl sm:text-2xl flex items-center justify-center shrink-0">
              {initials}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#D6B978]">
              <span>@{user.username}</span>
              <span>·</span>
              <span>Ngày tham gia: {user.joinedAt}</span>
              <span>·</span>
              <span className="text-emerald-300 font-semibold">
                Trạng thái: {user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {user.fullName}
            </h1>
            <div className="text-xs text-slate-300">
              Email: <span className="font-mono text-white">{user.email}</span> · Vai trò:{' '}
              <strong className="text-[#D6B978]">
                {user.role === 'super_admin'
                  ? 'QUẢN TRỊ CẤP CAO (SUPER ADMIN)'
                  : user.role === 'admin'
                    ? 'QUẢN TRỊ VIÊN (ADMIN)'
                    : `HỌC SINH LỚP ${user.className}`}
              </strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setProfileLogoutConfirmOpen(true)}
          className="px-4 py-2.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>ĐĂNG XUẤT</span>
        </button>
      </div>

      {/* Real Learning Achievements Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1.5">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Tổng số bài đã làm</span>
            <FileText className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#10243A] dark:text-white">
            {totalAttempts} bài
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1.5">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Điểm trung bình</span>
            <TrendingUp className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#10243A] dark:text-white">
            {avgScore} / 100
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1.5">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Điểm số cao nhất</span>
            <Award className="w-4 h-4 text-[#D6B978]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#10243A] dark:text-white">
            {bestScore} / 100
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'info', label: '1. Hồ sơ cá nhân & Ảnh đại diện', icon: User },
          { id: 'security', label: '2. Tài khoản của tôi & Đổi mật khẩu', icon: KeyRound },
          { id: 'settings', label: '3. Cài đặt cá nhân hóa', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'info' | 'security' | 'settings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#10243A] text-white dark:bg-[#2563EB]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HỒ SƠ CÁ NHÂN & ẢNH ĐẠI DIỆN */}
      {activeTab === 'info' && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#2563EB]" />
              <span>Thông Tin Cá Nhân & Đổi Ảnh Đại Diện</span>
            </h2>
            {savedNotice && (
              <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{savedNotice}</span>
              </span>
            )}
          </div>

          {profileError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-[#DC2626] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {/* Avatar Selector */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#10243A] dark:text-white">
              <Camera className="w-4 h-4 text-[#2563EB]" />
              <span>Chọn biểu tượng Ảnh đại diện (Avatar) hoặc nhập đường dẫn ảnh</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setAvatarUrl(preset.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    avatarUrl === preset.id
                      ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-950/40 text-[#2563EB]'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div>
              <label
                htmlFor="profile-avatar-url"
                className="block text-[11px] font-semibold text-slate-500 mb-1"
              >
                Hoặc dán URL hình ảnh đại diện tùy chỉnh:
              </label>
              <input
                id="profile-avatar-url"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="profile-fullname"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Họ và tên
              </label>
              <input
                id="profile-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tên đăng nhập (Định danh tài khoản)
              </label>
              <input
                type="text"
                disabled
                value={`@${user.username}`}
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="profile-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Email liên hệ
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="profile-class"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Lớp học
              </label>
              <input
                id="profile-class"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ngày tham gia hệ thống
              </label>
              <input
                type="text"
                disabled
                value={user.joinedAt}
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Trạng thái & Đơn vị
              </label>
              <input
                type="text"
                disabled
                value={`${user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'} · ${user.schoolName}`}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thay đổi hồ sơ</span>
          </button>
        </form>
      )}

      {/* TAB 2: TÀI KHOẢN CỦA TÔI & ĐỔI MẬT KHẨU AN TOÀN */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                <span>Bảo Mật Tài Khoản & Đổi Mật Khẩu An Toàn</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Vì lý do bảo mật, mật khẩu hiện tại không bao giờ được hiển thị trong hồ sơ. Vui lòng
                xác thực mật khẩu cũ trước khi thiết lập mật khẩu mới.
              </p>
            </div>
          </div>

          {pwError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs font-medium text-[#DC2626] dark:text-red-300 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{pwError}</span>
            </div>
          )}

          {pwSuccess && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs font-medium text-[#16A34A] dark:text-emerald-300 flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{pwSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 max-w-xl" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="pw-current"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  id="pw-current"
                  type={showCurrentPw ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại để xác minh"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  aria-label={showCurrentPw ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
                  onClick={() => setShowCurrentPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="pw-new"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Mật khẩu mới (tối thiểu 6 ký tự)
              </label>
              <div className="relative">
                <input
                  id="pw-new"
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  aria-label={showNewPw ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
                  onClick={() => setShowNewPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="pw-confirm"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Xác nhận mật khẩu mới
              </label>
              <input
                id="pw-confirm"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#10243A] hover:bg-[#1a3654] dark:bg-[#2563EB] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Cập nhật mật khẩu mới</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: CÀI ĐẶT CÁ NHÂN HÓA */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#2563EB]" />
            <span>Cài Đặt Giao Diện & Dữ Liệu Theo Tài Khoản (@{user.username})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#10243A] dark:text-white">
                  Chế độ giao diện riêng của tài khoản
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tự động đồng bộ chế độ Sáng (Light) hoặc Tối (Dark) mỗi khi đăng nhập vào tài khoản
                  này.
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#10243A] dark:text-white flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-[#D6B978]" />
                    <span>Đang bật: Tối</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#10243A]" />
                    <span>Đang bật: Sáng</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="text-sm font-bold text-[#10243A] dark:text-white">
                Bảo mật dữ liệu học tập cá nhân
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Toàn bộ {totalAttempts} bài thi đã nộp, lịch sử câu trả lời và tiến độ ôn tập câu sai
                của <strong>{user.fullName}</strong> được lưu trữ an toàn theo tài khoản, hoàn toàn độc lập và bảo mật.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Logout Confirmation Modal */}
      {profileLogoutConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-logout-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3
              id="profile-logout-title"
              className="font-display font-bold text-lg text-[#10243A] dark:text-white"
            >
              Xác Nhận Đăng Xuất Tài Khoản
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản <strong>@{user.username}</strong>? Toàn
              bộ dữ liệu lịch sử làm bài của tài khoản sẽ được giữ nguyên.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProfileLogoutConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                HỦY
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileLogoutConfirmOpen(false);
                  onRequestLogout();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                XÁC NHẬN ĐĂNG XUẤT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
