import React, { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  Layers,
  LogIn,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { AppView, UserAccount } from '../types';
import { OFFICIAL_PRODUCT_INFO } from '../data/officialInfo';
import {
  generateSalt,
  hashPasswordWithSalt,
  validateRegistrationInput,
  verifyPassword,
} from '../utils/authSecurity';

interface AuthPagesProps {
  mode: 'login' | 'register';
  users: UserAccount[];
  authNotice?: string | null;
  onSwitchMode: (mode: 'login' | 'register') => void;
  onLoginSuccess: (user: UserAccount, rememberMe: boolean) => void;
  onRegisterSuccess: (newUser: UserAccount, rememberMe: boolean) => void;
  onUpdateUserAccount: (updatedUser: UserAccount) => void;
  onNavigate: (view: AppView) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  mode,
  users,
  authNotice,
  onSwitchMode,
  onLoginSuccess,
  onRegisterSuccess,
  onUpdateUserAccount,
}) => {
  // Login state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Register state (strictly defaults to 'student' role - no role selector on registration)
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // First-Time Password Setup Modal state (for Super Admin dat020920 or newly created Admins without password)
  const [firstSetupUser, setFirstSetupUser] = useState<UserAccount | null>(null);
  const [setupNewPassword, setSetupNewPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  // Forgot Password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedId = identifier.trim().toLowerCase();
    if (!trimmedId) {
      setErrorMsg('Vui lòng nhập Email hoặc Tên đăng nhập.');
      return;
    }

    const matched = users.find(
      (u) =>
        u.username.toLowerCase() === trimmedId ||
        u.email.toLowerCase() === trimmedId
    );

    if (!matched) {
      setErrorMsg(
        'Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại Email/Tên đăng nhập hoặc Mật khẩu.'
      );
      return;
    }

    if (matched.status === 'locked') {
      setErrorMsg(
        'Tài khoản này hiện đang bị khóa bởi Quản trị viên. Vui lòng liên hệ Ban Quản trị.'
      );
      return;
    }

    // Check if this account requires first-time password setup (e.g. initial Super Admin dat020920 or newly added Admin)
    if (matched.requiresPasswordSetup || !matched.passwordDigest) {
      setFirstSetupUser(matched);
      setSetupNewPassword('');
      setSetupConfirmPassword('');
      setSetupError(null);
      setPassword('');
      return;
    }

    if (!password) {
      setErrorMsg('Vui lòng nhập Mật khẩu để đăng nhập.');
      return;
    }

    if (!verifyPassword(password, matched.passwordSalt, matched.passwordDigest)) {
      setErrorMsg(
        'Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại Email/Tên đăng nhập hoặc Mật khẩu.'
      );
      return;
    }

    setPassword('');
    onLoginSuccess(matched, rememberMe);
  };

  const handleFirstTimePasswordSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);

    if (!firstSetupUser) return;

    if (!setupNewPassword || setupNewPassword.length < 6) {
      setSetupError('Mật khẩu thiết lập lần đầu phải có độ dài tối thiểu 6 ký tự.');
      return;
    }

    if (setupNewPassword !== setupConfirmPassword) {
      setSetupError('Xác nhận mật khẩu không trùng khớp.');
      return;
    }

    const newSalt = generateSalt(firstSetupUser.id);
    const newDigest = hashPasswordWithSalt(setupNewPassword, newSalt);

    const updatedUser: UserAccount = {
      ...firstSetupUser,
      passwordSalt: newSalt,
      passwordDigest: newDigest,
      requiresPasswordSetup: false,
    };

    onUpdateUserAccount(updatedUser);
    setFirstSetupUser(null);
    setSetupNewPassword('');
    setSetupConfirmPassword('');
    onLoginSuccess(updatedUser, rememberMe);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const validation = validateRegistrationInput(
      {
        fullName,
        username,
        email,
        password: regPassword,
        confirmPassword,
        acceptedTerms,
      },
      users
    );

    if (!validation.valid) {
      setErrorMsg(validation.error || 'Thông tin đăng ký chưa hợp lệ.');
      return;
    }

    const cleanName = fullName.trim();
    const cleanUser = username.trim();
    const cleanEmail = email.trim();
    const salt = generateSalt();
    const digest = hashPasswordWithSalt(regPassword, salt);

    // Every self-registered account strictly defaults to 'student'
    const newAccount: UserAccount = {
      id: `user-${Date.now()}`,
      fullName: cleanName,
      username: cleanUser,
      email: cleanEmail,
      passwordSalt: salt,
      passwordDigest: digest,
      requiresPasswordSetup: false,
      role: 'student',
      className: OFFICIAL_PRODUCT_INFO.className,
      schoolName: OFFICIAL_PRODUCT_INFO.schoolName,
      academicYear: OFFICIAL_PRODUCT_INFO.academicYear,
      joinedAt: new Date().toISOString().slice(0, 10),
      status: 'active',
      preferences: {
        theme: 'light',
      },
    };

    setRegPassword('');
    setConfirmPassword('');
    onRegisterSuccess(newAccount, true);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    const cleanU = resetUsername.trim().toLowerCase();
    const cleanE = resetEmail.trim().toLowerCase();

    if (!cleanU || !cleanE || !resetNewPass || !resetConfirmPass) {
      setResetError('Vui lòng nhập đầy đủ Tên đăng nhập, Email và Mật khẩu mới.');
      return;
    }

    const targetUser = users.find(
      (u) =>
        u.username.toLowerCase() === cleanU && u.email.toLowerCase() === cleanE
    );

    if (!targetUser) {
      setResetError(
        'Không tìm thấy tài khoản khớp với cặp Tên đăng nhập và Email đã nhập.'
      );
      return;
    }

    // Security: ordinary users cannot reset Admin or Super Admin accounts via self-service
    if (targetUser.role === 'admin' || targetUser.role === 'super_admin') {
      setResetError(
        'Tài khoản Quản trị viên (Admin/Super Admin) không thể đặt lại mật khẩu qua chức năng này vì lý do bảo mật. Vui lòng liên hệ trực tiếp Super Admin của hệ thống.'
      );
      return;
    }

    if (resetNewPass.length < 6) {
      setResetError('Mật khẩu mới phải có độ dài tối thiểu 6 ký tự.');
      return;
    }

    if (resetNewPass !== resetConfirmPass) {
      setResetError('Xác nhận mật khẩu mới không trùng khớp.');
      return;
    }

    const newSalt = generateSalt(targetUser.id);
    const newDigest = hashPasswordWithSalt(resetNewPass, newSalt);

    onUpdateUserAccount({
      ...targetUser,
      passwordSalt: newSalt,
      passwordDigest: newDigest,
      requiresPasswordSetup: false,
    });

    setForgotModalOpen(false);
    setResetUsername('');
    setResetEmail('');
    setResetNewPass('');
    setResetConfirmPass('');
    setIdentifier(targetUser.username);
    setPassword('');
    onSwitchMode('login');
    setSuccessMsg(
      `Đã đặt lại mật khẩu thành công cho tài khoản @${targetUser.username}. Vui lòng đăng nhập bằng mật khẩu mới.`
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      {authNotice && (
        <div
          role="status"
          className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[#F59E0B]" />
          <span>{authNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Left column: Deep Navy Blue & Champagne Gold Academic Identity */}
        <div className="lg:col-span-5 bg-[#10243A] text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#D6B978]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>HỆ THỐNG TÀI KHOẢN & XÁC THỰC</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {OFFICIAL_PRODUCT_INFO.productName}
              </h1>
              <p className="text-xs font-semibold text-[#D6B978] tracking-wide">
                {OFFICIAL_PRODUCT_INFO.tagline}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                Nền tảng luyện tập, thi thử và đánh giá năng lực môn Ngữ văn với không gian dữ liệu
                học tập độc lập cho từng tài khoản.
              </p>
            </div>
          </div>

          {/* 3 Balanced Academic Value Pillars */}
          <div className="space-y-3 py-4 border-y border-white/10">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
              <BookOpen className="w-4 h-4 text-[#D6B978] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">
                  Luyện Thi & Ngân Hàng Câu Hỏi
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Hệ thống đề thi thử chuẩn cấu trúc và hơn 105 câu hỏi đọc hiểu, tư duy ngôn ngữ có
                  giải thích chi tiết.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
              <Layers className="w-4 h-4 text-[#D6B978] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">
                  Bảo Toàn & Tách Biệt Dữ Liệu
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Lịch sử thi, điểm số, thống kê năng lực và danh sách câu sai được lưu trữ riêng biệt
                  theo từng ID người dùng.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D6B978] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">
                  Bảo Mật Cơ Sở Dữ Liệu & Phân Quyền
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Hệ thống mã hóa mật khẩu một chiều an toàn, đồng bộ kết quả thi trực tuyến và phân quyền nghiêm ngặt giữa Học sinh và Quản trị viên.
                </p>
              </div>
            </div>
          </div>

          {/* Official Academic Credit Footer */}
          <div className="space-y-1 text-[11px] text-slate-300">
            <div>
              Năm học {OFFICIAL_PRODUCT_INFO.academicYear} · {OFFICIAL_PRODUCT_INFO.subjectTeacherRole}:{' '}
              <strong className="text-white">{OFFICIAL_PRODUCT_INFO.subjectTeacherName}</strong>
            </div>
            <div>
              Học sinh thực hiện:{' '}
              <strong className="text-[#D6B978]">
                {OFFICIAL_PRODUCT_INFO.students.join(' – ')}
              </strong>
            </div>
            <div className="text-slate-400">
              Lớp {OFFICIAL_PRODUCT_INFO.className} · Khóa {OFFICIAL_PRODUCT_INFO.cohort} ·{' '}
              {OFFICIAL_PRODUCT_INFO.schoolName}
            </div>
          </div>
        </div>

        {/* Right column: Clean, Balanced Login & Register Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-6">
          <div className="space-y-6">
            {/* Segmented Mode Switch */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  onSwitchMode('login');
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-[#10243A] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  onSwitchMode('register');
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-[#10243A] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Đăng ký tài khoản
              </button>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs font-medium text-[#DC2626] dark:text-red-300 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs font-medium text-[#16A34A] dark:text-emerald-300 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#10243A] dark:text-white">
                    Đăng nhập vào HSA MASTER
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Nhập Tên đăng nhập hoặc Email để truy cập. Đối với tài khoản quản trị chưa có mật
                    khẩu, nhập Username/Email rồi nhấn Đăng nhập để thiết lập mật khẩu lần đầu.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="login-identifier"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Email hoặc tên đăng nhập
                  </label>
                  <input
                    id="login-identifier"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Nhập email hoặc tên đăng nhập của bạn"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Mật khẩu
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetError(null);
                        setForgotModalOpen(true);
                      }}
                      className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      QUÊN MẬT KHẨU?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu (để trống nếu thiết lập lần đầu)"
                      className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                    />
                    <button
                      type="button"
                      aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>GHI NHỚ ĐĂNG NHẬP</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {rememberMe ? 'Duy trì phiên khi tải lại trang' : 'Phiên tạm thời theo tab'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#10243A] hover:bg-[#1a3654] dark:bg-[#2563EB] dark:hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>ĐĂNG NHẬP</span>
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setSuccessMsg(null);
                      onSwitchMode('register');
                    }}
                    className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    CHƯA CÓ TÀI KHOẢN? ĐĂNG KÝ NGAY
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5" noValidate>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#10243A] dark:text-white">
                    Đăng ký tài khoản học sinh mới
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Tài khoản đăng ký mới được cấp quyền Học sinh (Student) để lưu trữ lịch sử làm
                    bài và thống kê năng lực độc lập.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="reg-fullname"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Họ và tên
                    </label>
                    <input
                      id="reg-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên đầy đủ"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="reg-username"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Tên đăng nhập
                    </label>
                    <input
                      id="reg-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Tối thiểu 4 ký tự viết liền"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenban@yenlang.edu.vn"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="reg-password"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Tối thiểu 6 ký tự"
                        className="w-full pl-3.5 pr-9 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                      />
                      <button
                        type="button"
                        aria-label={showRegPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="reg-confirm-password"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        id="reg-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full pl-3.5 pr-9 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                      />
                      <button
                        type="button"
                        aria-label={
                          showConfirmPassword
                            ? 'Ẩn mật khẩu xác nhận'
                            : 'Hiện mật khẩu xác nhận'
                        }
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="inline-flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      id="reg-terms-checkbox"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>
                      Tôi đồng ý với quy chế sử dụng, bảo mật dữ liệu học tập của nền tảng{' '}
                      <strong className="text-[#10243A] dark:text-white">HSA MASTER</strong> (Trường{' '}
                      {OFFICIAL_PRODUCT_INFO.schoolName}).
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>TẠO TÀI KHOẢN</span>
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setSuccessMsg(null);
                      onSwitchMode('login');
                    }}
                    className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    ĐÃ CÓ TÀI KHOẢN? ĐĂNG NHẬP NGAY
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Bảo mật dữ liệu học tập · Phân quyền tài khoản</span>
            </span>
            <span>Năm học {OFFICIAL_PRODUCT_INFO.academicYear} · THPT Yên Lãng</span>
          </div>
        </div>
      </div>

      {/* FIRST-TIME PASSWORD SETUP MODAL (Luồng thiết lập mật khẩu lần đầu) */}
      {firstSetupUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="first-setup-password-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#10243A] dark:text-white">
                <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                <h3 id="first-setup-password-title" className="font-display font-bold text-lg">
                  Thiết Lập Mật Khẩu Lần Đầu
                </h3>
              </div>
              <button
                type="button"
                aria-label="Đóng hộp thoại thiết lập mật khẩu"
                onClick={() => setFirstSetupUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-bold text-[#10243A] dark:text-white">
                {firstSetupUser.fullName} ({firstSetupUser.role === 'super_admin' ? 'SUPER ADMIN' : firstSetupUser.role === 'admin' ? 'ADMIN' : 'STUDENT'})
              </div>
              <div className="font-mono text-slate-500">
                @{firstSetupUser.username} · {firstSetupUser.email}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tài khoản này chưa có mật khẩu khởi tạo. Vui lòng thiết lập mật khẩu mới để kích hoạt
              và đăng nhập vào hệ thống.
            </p>

            {setupError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-[#DC2626] dark:text-red-300 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{setupError}</span>
              </div>
            )}

            <form onSubmit={handleFirstTimePasswordSetupSubmit} className="space-y-3.5" noValidate>
              <div>
                <label
                  htmlFor="first-setup-new-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Mật khẩu mới (tối thiểu 6 ký tự)
                </label>
                <div className="relative">
                  <input
                    id="first-setup-new-password"
                    type={showSetupPassword ? 'text' : 'password'}
                    value={setupNewPassword}
                    onChange={(e) => setSetupNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full pl-3.5 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    aria-label={showSetupPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    onClick={() => setShowSetupPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSetupPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="first-setup-confirm-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Xác nhận mật khẩu mới
                </label>
                <input
                  id="first-setup-confirm-password"
                  type={showSetupPassword ? 'text' : 'password'}
                  value={setupConfirmPassword}
                  onChange={(e) => setSetupConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setFirstSetupUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                >
                  Hoàn tất & Đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {forgotModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#10243A] dark:text-white">
                <KeyRound className="w-5 h-5 text-[#2563EB]" />
                <h3 id="forgot-password-title" className="font-display font-bold text-lg">
                  Khôi Phục Mật Khẩu Tài Khoản
                </h3>
              </div>
              <button
                type="button"
                aria-label="Đóng hộp thoại quên mật khẩu"
                onClick={() => setForgotModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Xác minh Tên đăng nhập và Email đã đăng ký trên hệ thống để thiết lập mật khẩu mới.
            </p>

            {resetError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-[#DC2626] dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3" noValidate>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên đăng nhập cần khôi phục
                </label>
                <input
                  type="text"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập đã đăng ký"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email đã đăng ký
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Nhập email đã đăng ký"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mật khẩu mới (tối thiểu 6 ký tự)
                </label>
                <input
                  type="password"
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={resetConfirmPass}
                  onChange={(e) => setResetConfirmPass(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                >
                  Cập nhật mật khẩu mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
