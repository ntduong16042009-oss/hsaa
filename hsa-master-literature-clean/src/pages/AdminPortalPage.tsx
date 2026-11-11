import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Info,
  LayoutDashboard,
  Lock,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlock,
  Upload,
  UserCheck,
  UserCog,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  DifficultyLevel,
  Exam,
  ExamAttempt,
  LoginHistoryEntry,
  Question,
  QuestionTopic,
  UserAccount,
  UserRole,
} from '../types';
import {
  ALL_DIFFICULTIES,
  ALL_QUESTION_TOPICS,
  GENERATED_IMAGES,
  OFFICIAL_PRODUCT_INFO,
} from '../data/officialInfo';
import { generateSalt, hashPasswordWithSalt } from '../utils/authSecurity';
import { computeTopicStatistics } from '../utils/examEngine';
import { ScoreLineChart, TopicBarChart } from '../components/AnalyticsCharts';

type AdminTabId =
  | 'users'
  | 'overview'
  | 'exams'
  | 'questions'
  | 'admins'
  | 'results'
  | 'analytics'
  | 'logs'
  | 'settings';

interface AdminPortalPageProps {
  currentUser: UserAccount | null;
  exams: Exam[];
  questions: Question[];
  users: UserAccount[];
  allAttempts: ExamAttempt[];
  loginHistory: LoginHistoryEntry[];
  onSaveExams: (exams: Exam[]) => void;
  onSaveQuestions: (questions: Question[]) => void;
  onSaveUsers: (users: UserAccount[]) => void;
  onNavigateToLogin: () => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  currentUser,
  exams,
  questions,
  users,
  allAttempts,
  loginHistory,
  onSaveExams,
  onSaveQuestions,
  onSaveUsers,
  onNavigateToLogin,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabId>('users');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin';
  const hasAdminAccess = isSuperAdmin || isAdmin;

  // User Management ("QUẢN LÝ TÀI KHOẢN") State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Add Admin Form State (Super Admin Only)
  const [adminFullName, setAdminFullName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminInitialPassword, setAdminInitialPassword] = useState('');

  // New Exam Form State
  const [newExamCode, setNewExamCode] = useState('');
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDuration, setNewExamDuration] = useState(45);
  const [newExamMaxScore, setNewExamMaxScore] = useState(100);
  const [newExamDiff, setNewExamDiff] = useState<DifficultyLevel>('Trung bình');
  const [newExamQuestionCount, setNewExamQuestionCount] = useState(25);

  // New Question Form State
  const [newQContent, setNewQContent] = useState('');
  const [newQPassage, setNewQPassage] = useState('');
  const [newQOptA, setNewQOptA] = useState('');
  const [newQOptB, setNewQOptB] = useState('');
  const [newQOptC, setNewQOptC] = useState('');
  const [newQOptD, setNewQOptD] = useState('');
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQExplain, setNewQExplain] = useState('');
  const [newQTopic, setNewQTopic] = useState<QuestionTopic>('Đọc hiểu văn bản');
  const [newQDiff, setNewQDiff] = useState<DifficultyLevel>('Trung bình');
  const [jsonImportText, setJsonImportText] = useState('');

  const showToast = (msg: string) => {
    setErrorMsg(null);
    setFeedbackMsg(msg);
    window.setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const showError = (msg: string) => {
    setFeedbackMsg(null);
    setErrorMsg(msg);
    window.setTimeout(() => setErrorMsg(null), 4500);
  };

  const filteredUsers = useMemo(() => {
    const q = userSearchQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [users, userSearchQuery, roleFilter]);

  const adminOnlyUsers = useMemo(
    () => users.filter((u) => u.role === 'super_admin' || u.role === 'admin'),
    [users]
  );

  // Map userId -> attempt summary
  const attemptsByUser = useMemo(() => {
    const map = new Map<string, { count: number; avgScore: number }>();
    for (const u of users) {
      const list = allAttempts.filter((a) => a.userId === u.id);
      const count = list.length;
      const avgScore =
        count > 0
          ? Math.round((list.reduce((s, a) => s + a.score, 0) / count) * 10) / 10
          : 0;
      map.set(u.id, { count, avgScore });
    }
    return map;
  }, [users, allAttempts]);

  const examsMap = useMemo(
    () => new Map(exams.map((e) => [e.id, e])),
    [exams]
  );

  const questionsMap = useMemo(
    () => new Map(questions.map((q) => [q.id, q])),
    [questions]
  );

  const systemTopicStats = useMemo(
    () => computeTopicStatistics(allAttempts, examsMap, questionsMap),
    [allAttempts, examsMap, questionsMap]
  );

  const systemAverageScore = useMemo(() => {
    if (allAttempts.length === 0) return 0;
    return (
      Math.round(
        (allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length) * 10
      ) / 10
    );
  }, [allAttempts]);

  // Access Guard: Student or unauthenticated visitor cannot access Admin Portal
  if (!currentUser || !hasAdminAccess) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 text-[#DC2626] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="font-display text-xl font-bold text-[#10213A] dark:text-white">
            Khu Vực Giới Hạn Quyền Quản Trị (ADMIN / SUPER ADMIN)
          </h1>
          <p className="text-xs sm:text-sm text-[#77849A] dark:text-slate-400 leading-relaxed">
            {currentUser ? (
              <>
                Tài khoản hiện tại (<strong>{currentUser.fullName}</strong> –{' '}
                <code className="font-mono">@{currentUser.username}</code>) có vai trò{' '}
                <strong>Học sinh (Student)</strong> nên chỉ có quyền học tập, không được phép truy
                cập giao diện Quản trị.
              </>
            ) : (
              <>
                Bạn hiện chưa đăng nhập. Vui lòng đăng nhập bằng tài khoản Quản trị viên (Admin hoặc
                Super Admin) để truy cập phân hệ Quản trị.
              </>
            )}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="px-5 py-2.5 bg-[#10213A] hover:bg-[#142943] dark:bg-[#315EDE] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Đăng nhập tài khoản Quản trị →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Super Admin Action: Add a new Admin account
  const handleAddAdminAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showError('Chỉ Super Admin mới có quyền thêm tài khoản Admin mới.');
      return;
    }

    const cleanName = adminFullName.trim();
    const cleanUsername = adminUsername.trim();
    const cleanEmail = adminEmail.trim();
    const cleanPass = adminInitialPassword.trim();

    if (!cleanName || !cleanUsername || !cleanEmail) {
      showError('Vui lòng nhập đầy đủ Họ tên, Username và Email cho tài khoản Admin mới.');
      return;
    }

    if (cleanUsername.length < 4 || !/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      showError(
        'Username phải có ít nhất 4 ký tự và chỉ gồm chữ cái không dấu, chữ số, dấu gạch dưới hoặc dấu chấm.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showError('Địa chỉ Email không đúng định dạng hợp lệ.');
      return;
    }

    const dupUsername = users.some(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (dupUsername) {
      showError(`Username "${cleanUsername}" đã tồn tại trong hệ thống.`);
      return;
    }

    const dupEmail = users.some(
      (u) => u.email.toLowerCase() === cleanEmail.toLowerCase()
    );
    if (dupEmail) {
      showError(`Email "${cleanEmail}" đã được sử dụng cho tài khoản khác.`);
      return;
    }

    if (cleanPass && cleanPass.length < 6) {
      showError('Nếu nhập mật khẩu khởi tạo, mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    const newId = `user-admin-${Date.now()}`;
    const salt = generateSalt(newId);
    const hasInitialPassword = cleanPass.length >= 6;
    const digest = hasInitialPassword ? hashPasswordWithSalt(cleanPass, salt) : '';

    const newAdminAccount: UserAccount = {
      id: newId,
      fullName: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      passwordSalt: salt,
      passwordDigest: digest,
      requiresPasswordSetup: !hasInitialPassword,
      role: 'admin',
      className: OFFICIAL_PRODUCT_INFO.className,
      schoolName: OFFICIAL_PRODUCT_INFO.schoolName,
      academicYear: OFFICIAL_PRODUCT_INFO.academicYear,
      joinedAt: new Date().toISOString().slice(0, 10),
      status: 'active',
      preferences: { theme: 'light' },
    };

    onSaveUsers([newAdminAccount, ...users]);
    setAdminFullName('');
    setAdminUsername('');
    setAdminEmail('');
    setAdminInitialPassword('');
    showToast(
      hasInitialPassword
        ? `Đã thêm tài khoản Admin "${cleanName} (@${cleanUsername})" thành công!`
        : `Đã thêm tài khoản Admin "${cleanName} (@${cleanUsername})"! Người dùng sẽ thiết lập mật khẩu ở lần đăng nhập đầu tiên.`
    );
  };

  // Super Admin Action: Grant Admin role to a Student
  const handleGrantAdminRole = (targetUser: UserAccount) => {
    if (!isSuperAdmin) {
      showError('Chỉ Super Admin mới được phép cấp quyền Admin.');
      return;
    }
    if (targetUser.role === 'super_admin') return;

    const updated = users.map((u) =>
      u.id === targetUser.id ? { ...u, role: 'admin' as const } : u
    );
    onSaveUsers(updated);
    showToast(`Đã cấp quyền Admin cho tài khoản ${targetUser.fullName} (@${targetUser.username}).`);
  };

  // Super Admin Action: Revoke Admin role back to Student
  const handleRevokeAdminRole = (targetUser: UserAccount) => {
    if (!isSuperAdmin) {
      showError('Chỉ Super Admin mới được phép thu hồi quyền Admin.');
      return;
    }
    if (targetUser.role === 'super_admin') {
      showError('Không thể thu hồi quyền của tài khoản Super Admin.');
      return;
    }

    const updated = users.map((u) =>
      u.id === targetUser.id ? { ...u, role: 'student' as const } : u
    );
    onSaveUsers(updated);
    showToast(
      `Đã thu hồi quyền Admin của ${targetUser.fullName} (@${targetUser.username}), chuyển về quyền Học sinh (Student).`
    );
  };

  // Lock / Unlock User Account
  const handleToggleUserStatus = (targetUser: UserAccount) => {
    if (targetUser.id === currentUser.id) {
      showError('Không thể tự khóa tài khoản đang đăng nhập.');
      return;
    }
    if (targetUser.role === 'super_admin') {
      showError('Không thể khóa tài khoản Super Admin gốc của hệ thống.');
      return;
    }
    if (!isSuperAdmin && targetUser.role === 'admin') {
      showError('Admin thường không được phép khóa tài khoản của Admin khác.');
      return;
    }

    const nextStatus = targetUser.status === 'active' ? ('locked' as const) : ('active' as const);
    const updated = users.map((u) =>
      u.id === targetUser.id ? { ...u, status: nextStatus } : u
    );
    onSaveUsers(updated);
    showToast(
      nextStatus === 'locked'
        ? `Đã khóa tài khoản @${targetUser.username}.`
        : `Đã mở khóa tài khoản @${targetUser.username}.`
    );
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamCode.trim() || !newExamTitle.trim()) return;

    const selectedQIds = questions
      .slice(0, Math.min(questions.length, Math.max(5, newExamQuestionCount)))
      .map((q) => q.id);

    const created: Exam = {
      id: `EXAM-CUSTOM-${Date.now()}`,
      code: newExamCode.trim().toUpperCase(),
      title: newExamTitle.trim(),
      description:
        'Đề luyện tập được tạo từ Phân hệ Quản trị HSA MASTER – Trường THPT Yên Lãng.',
      coverImage: GENERATED_IMAGES.examCover,
      questionIds: selectedQIds,
      durationMinutes: Number(newExamDuration) || 45,
      maxScore: Number(newExamMaxScore) || 100,
      difficulty: newExamDiff,
      topic: 'Tổng hợp toàn diện',
      categoryType: 'Đề luyện tập tự biên soạn',
      isNew: true,
      knowledgeOutline: ['Tổng hợp các chuyên đề từ ngân hàng câu hỏi HSA MASTER'],
      instructions: [
        `Đề gồm ${selectedQIds.length} câu hỏi, thời gian ${newExamDuration} phút.`,
      ],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onSaveExams([created, ...exams]);
    setNewExamCode('');
    setNewExamTitle('');
    showToast(`Đã tạo đề thi mới "${created.code}" thành công!`);
  };

  const handleDeleteExam = (examId: string) => {
    if (exams.length <= 1) {
      showToast('Cần giữ lại ít nhất 1 đề thi trong hệ thống.');
      return;
    }
    onSaveExams(exams.filter((ex) => ex.id !== examId));
    showToast('Đã xóa đề thi khỏi danh sách.');
  };

  const handleExportDataJson = () => {
    const payload = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        product: OFFICIAL_PRODUCT_INFO.productName,
        examsCount: exams.length,
        questionsCount: questions.length,
        usersCount: users.length,
        exams,
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hsa-master-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file JSON cấu hình hệ thống thành công!');
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newQContent.trim() ||
      !newQOptA.trim() ||
      !newQOptB.trim() ||
      !newQOptC.trim() ||
      !newQOptD.trim()
    ) {
      return;
    }

    const nextNum = questions.length + 1;
    const created: Question = {
      id: `Q${String(nextNum).padStart(3, '0')}`,
      content: newQContent.trim(),
      passage: newQPassage.trim() || undefined,
      options: [newQOptA.trim(), newQOptB.trim(), newQOptC.trim(), newQOptD.trim()],
      correctAnswer: newQCorrect,
      explanation:
        newQExplain.trim() ||
        'Đáp án được xác thực theo chuẩn kiến thức Ngữ văn THPT.',
      relatedKnowledge: `Chuyên đề ${newQTopic}`,
      memoryTip: 'Đọc kỹ từ khóa trong câu hỏi và đối chiếu ngữ liệu.',
      topic: newQTopic,
      difficulty: newQDiff,
      sourceNote: 'Bổ sung từ Quản trị viên HSA MASTER',
    };

    onSaveQuestions([created, ...questions]);
    setNewQContent('');
    setNewQPassage('');
    setNewQOptA('');
    setNewQOptB('');
    setNewQOptC('');
    setNewQOptD('');
    setNewQExplain('');
    showToast(`Đã thêm câu hỏi ${created.id} vào Ngân hàng câu hỏi!`);
  };

  const handleDeleteQuestion = (qId: string) => {
    onSaveQuestions(questions.filter((q) => q.id !== qId));
    showToast(`Đã xóa câu hỏi ${qId}.`);
  };

  const handleImportJsonQuestions = () => {
    if (!jsonImportText.trim()) return;
    try {
      const parsed = JSON.parse(jsonImportText);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      const valid: Question[] = list
        .filter(
          (item) =>
            item &&
            item.content &&
            Array.isArray(item.options) &&
            item.options.length === 4
        )
        .map((item, idx) => ({
          id: item.id || `Q-IMP-${Date.now()}-${idx}`,
          content: String(item.content),
          passage: item.passage ? String(item.passage) : undefined,
          options: [
            String(item.options[0]),
            String(item.options[1]),
            String(item.options[2]),
            String(item.options[3]),
          ],
          correctAnswer: Number(item.correctAnswer) || 0,
          explanation: String(item.explanation || 'Giải thích từ dữ liệu JSON nhập vào.'),
          relatedKnowledge: String(item.relatedKnowledge || 'Kiến thức Ngữ văn THPT'),
          memoryTip: String(item.memoryTip || 'Ghi nhớ từ khóa trọng tâm.'),
          topic: (item.topic as QuestionTopic) || 'Đọc hiểu văn bản',
          difficulty: (item.difficulty as DifficultyLevel) || 'Trung bình',
          sourceNote: 'Nhập từ JSON Admin',
        }));

      if (valid.length === 0) {
        showError('JSON không đúng định dạng câu hỏi (cần có content và 4 options).');
        return;
      }

      onSaveQuestions([...valid, ...questions]);
      setJsonImportText('');
      showToast(`Đã nhập thành công ${valid.length} câu hỏi từ JSON!`);
    } catch {
      showError('Lỗi cú pháp JSON. Vui lòng kiểm tra lại dữ liệu nhập.');
    }
  };

  const adminSections: { id: AdminTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Tổng quan hệ thống', icon: LayoutDashboard },
    { id: 'users', label: `Quản lý tài khoản (${users.length})`, icon: Users },
    { id: 'admins', label: `Quản lý Admin (${adminOnlyUsers.length})`, icon: UserCog },
    { id: 'exams', label: `Quản lý đề thi (${exams.length})`, icon: FileText },
    { id: 'questions', label: `Quản lý câu hỏi (${questions.length})`, icon: BookOpen },
    { id: 'results', label: `Quản lý kết quả (${allAttempts.length})`, icon: ClipboardList },
    { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
    { id: 'logs', label: `Nhật ký hoạt động (${loginHistory.length})`, icon: Activity },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Admin Header displaying logged-in user's name and role */}
      <div className="bg-[#10213A] text-white rounded-3xl p-6 sm:p-7 space-y-5 border border-[#142943]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-[#D9BD79] flex flex-wrap items-center gap-2 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>HSA MASTER 2.0 · ADMIN PORTAL</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Hệ Thống Quản Trị Học Tập & Phân Quyền Tài Khoản
            </h1>
            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 pt-0.5">
              <span>
                Người đang đăng nhập:{' '}
                <strong className="text-white">{currentUser.fullName}</strong> (
                <code className="font-mono text-[#D9BD79]">@{currentUser.username}</code>)
              </span>
              <span>·</span>
              <span>
                Vai trò hiện tại:{' '}
                <strong className="text-[#D9BD79]">
                  {isSuperAdmin ? 'SUPER ADMIN (Toàn quyền quản trị)' : 'ADMIN (Quản lý học tập)'}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportDataJson}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D9BD79]" />
              <span>Sao lưu JSON</span>
            </button>
          </div>
        </div>

        {/* 9 Admin Dashboard Sections Navigation Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
          {adminSections.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#315EDE] text-white shadow-xs'
                    : 'bg-white/8 text-slate-300 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D9BD79] shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Hệ thống quản trị tập trung:</strong> Quản lý danh sách học sinh, phân quyền tài khoản, theo dõi kết quả thi và cập nhật ngân hàng đề thi trực tuyến.
          </span>
        </div>
      </div>

      {feedbackMsg && (
        <div
          role="status"
          className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 text-xs font-semibold text-[#16A34A] flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl p-3.5 text-xs font-semibold text-[#DC2626] flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SECTION 1: TỔNG QUAN HỆ THỐNG */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs text-[#77849A]">Tổng số tài khoản</div>
              <div className="text-2xl font-extrabold font-mono text-[#10213A] dark:text-white">
                {users.length}
              </div>
              <div className="text-[11px] text-[#315EDE] font-semibold">
                {adminOnlyUsers.length} Quản trị · {users.length - adminOnlyUsers.length} Học sinh
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs text-[#77849A]">Đề thi chính thức</div>
              <div className="text-2xl font-extrabold font-mono text-[#315EDE]">
                {exams.length} đề
              </div>
              <div className="text-[11px] text-[#77849A]">Sẵn sàng thi thử bấm giờ</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs text-[#77849A]">Ngân hàng câu hỏi</div>
              <div className="text-2xl font-extrabold font-mono text-[#16A34A]">
                {questions.length} câu
              </div>
              <div className="text-[11px] text-[#77849A]">
                {ALL_QUESTION_TOPICS.length} chuyên đề Ngữ văn
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs text-[#77849A]">Lượt nộp bài toàn hệ thống</div>
              <div className="text-2xl font-extrabold font-mono text-[#10213A] dark:text-[#D9BD79]">
                {allAttempts.length} lượt
              </div>
              <div className="text-[11px] text-[#77849A]">
                Điểm TB: {systemAverageScore} / 100
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
                  Lối Tắt Quản Trị Nhanh
                </h2>
                <span className="text-xs text-[#77849A]">9 phân hệ vận hành</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {adminSections
                  .filter((s) => s.id !== 'overview')
                  .map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveTab(s.id)}
                        className="p-4 rounded-xl border border-[#E4E9F1] dark:border-slate-800 hover:border-[#315EDE] text-left flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#315EDE]/10 text-[#315EDE] flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-[#17243A] dark:text-white">
                            {s.label}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#315EDE]">Mở →</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-3">
              <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
                Thông Tin Dự Án Học Tập Số
              </h2>
              <div className="space-y-2 text-xs text-[#77849A] dark:text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span>Tên sản phẩm</span>
                  <strong className="text-[#17243A] dark:text-white">
                    {OFFICIAL_PRODUCT_INFO.productName} 2.0
                  </strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span>Năm học</span>
                  <strong className="text-[#17243A] dark:text-white">
                    {OFFICIAL_PRODUCT_INFO.academicYear}
                  </strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span>Giáo viên bộ môn</span>
                  <strong className="text-[#17243A] dark:text-white">
                    {OFFICIAL_PRODUCT_INFO.subjectTeacherName}
                  </strong>
                </div>
                <div className="py-1.5 space-y-1">
                  <div className="flex justify-between">
                    <span>Học sinh thực hiện</span>
                    <strong className="text-[#17243A] dark:text-white">
                      {OFFICIAL_PRODUCT_INFO.students.join(' & ')}
                    </strong>
                  </div>
                  <div className="text-right text-[11px] text-[#77849A] dark:text-slate-400">
                    Lớp {OFFICIAL_PRODUCT_INFO.className} · Khóa {OFFICIAL_PRODUCT_INFO.cohort} ·{' '}
                    {OFFICIAL_PRODUCT_INFO.schoolName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4 & 5: QUẢN LÝ TÀI KHOẢN & QUẢN LÝ ADMIN */}
      {(activeTab === 'users' || activeTab === 'admins') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Add Admin Form (Super Admin Only) or Role Info Card (for regular Admin) */}
            <div className="lg:col-span-4 space-y-4">
              {isSuperAdmin ? (
                <form
                  onSubmit={handleAddAdminAccount}
                  className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-4"
                  noValidate
                >
                  <div className="space-y-1">
                    <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-[#315EDE]" />
                      <span>Thêm Tài Khoản Admin Mới</span>
                    </h2>
                    <p className="text-xs text-[#77849A] dark:text-slate-400">
                      Dành riêng cho Super Admin ({currentUser.fullName}). Tài khoản được tạo sẽ nhận
                      vai trò <strong>Admin</strong>.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="add-admin-fullname"
                      className="block text-xs font-semibold text-[#17243A] dark:text-slate-300"
                    >
                      Họ và tên Admin
                    </label>
                    <input
                      id="add-admin-fullname"
                      type="text"
                      value={adminFullName}
                      onChange={(e) => setAdminFullName(e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="add-admin-username"
                      className="block text-xs font-semibold text-[#17243A] dark:text-slate-300"
                    >
                      Username
                    </label>
                    <input
                      id="add-admin-username"
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Ví dụ: admin_nguvan"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="add-admin-email"
                      className="block text-xs font-semibold text-[#17243A] dark:text-slate-300"
                    >
                      Email
                    </label>
                    <input
                      id="add-admin-email"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@yenlang.edu.vn"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="add-admin-password"
                      className="block text-xs font-semibold text-[#17243A] dark:text-slate-300"
                    >
                      Mật khẩu khởi tạo (Tùy chọn)
                    </label>
                    <input
                      id="add-admin-password"
                      type="password"
                      value={adminInitialPassword}
                      onChange={(e) => setAdminInitialPassword(e.target.value)}
                      placeholder="Để trống nếu muốn Admin tự đặt lần đầu"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#315EDE] hover:bg-[#254EC7] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Thêm Tài Khoản Admin</span>
                  </button>
                </form>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#10213A] dark:text-white font-display font-bold text-base">
                    <Shield className="w-5 h-5 text-[#315EDE]" />
                    <span>Giới Hạn Phân Quyền Admin Thường</span>
                  </div>
                  <p className="text-xs text-[#77849A] dark:text-slate-400 leading-relaxed">
                    Tài khoản của bạn đang có vai trò <strong>Admin</strong>. Bạn có toàn quyền quản
                    lý đề thi, ngân hàng câu hỏi, theo dõi kết quả học sinh và khóa/mở khóa tài khoản
                    học sinh.
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-xl">
                    Chỉ <strong>Super Admin (Nguyễn Thị Thu Huyền – @thuhuyenxinhgai)</strong> mới có quyền thêm
                    tài khoản Admin mới, cấp quyền Admin hoặc thu hồi quyền Admin.
                  </p>
                </div>
              )}

              {/* Recent Login History Card */}
              <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="font-display text-sm font-bold text-[#10213A] dark:text-white">
                  Lịch Sử Đăng Nhập Gần Đây ({loginHistory.length})
                </h3>
                {loginHistory.length === 0 ? (
                  <p className="text-xs text-[#77849A]">Chưa có bản ghi lịch sử đăng nhập.</p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto pr-1">
                    {loginHistory.slice(0, 8).map((entry) => (
                      <div key={entry.id} className="py-2 text-xs space-y-0.5">
                        <div className="font-semibold text-[#10213A] dark:text-white flex items-center justify-between">
                          <span>{entry.fullName}</span>
                          <span className="font-mono text-[10px] text-[#315EDE]">
                            {entry.role.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#77849A] flex items-center justify-between">
                          <span>@{entry.username}</span>
                          <span>{new Date(entry.loggedInAt).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Search & Accounts List Table */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
                    {activeTab === 'admins'
                      ? `Danh Sách Quản Trị Viên & Phân Quyền (${filteredUsers.length} / ${users.length})`
                      : `Danh Sách Tài Khoản Hệ Thống (${filteredUsers.length} / ${users.length})`}
                  </h2>
                </div>

                {/* Search & Role Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#77849A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-user-search"
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm theo họ tên, username hoặc email..."
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-white"
                    />
                  </div>

                  <select
                    aria-label="Lọc theo vai trò"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-slate-200"
                  >
                    <option value="all">Tất cả vai trò</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student (Học sinh)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#E4E9F1] dark:border-slate-800 bg-[#F4F6FA] dark:bg-slate-800/50 text-[#77849A]">
                      <th className="py-3 px-4 font-semibold">Họ tên & Thông tin</th>
                      <th className="py-3 px-4 font-semibold">Vai trò</th>
                      <th className="py-3 px-4 font-semibold">Kết quả học tập</th>
                      <th className="py-3 px-4 font-semibold">Trạng thái</th>
                      <th className="py-3 px-4 font-semibold text-right">Thao tác quản trị</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u) => {
                      const stats = attemptsByUser.get(u.id) || { count: 0, avgScore: 0 };
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#10213A] dark:text-white">
                              {u.fullName}
                            </div>
                            <div className="font-mono text-xs text-[#77849A]">
                              @{u.username} · {u.email}
                            </div>
                            {u.requiresPasswordSetup && (
                              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                                Chờ thiết lập mật khẩu lần đầu
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-semibold">
                            {u.role === 'super_admin' ? (
                              <span className="text-[#D9BD79] bg-[#10213A] px-2.5 py-1 rounded-md font-mono text-xs inline-block">
                                SUPER ADMIN
                              </span>
                            ) : u.role === 'admin' ? (
                              <span className="text-[#315EDE] font-bold">Admin</span>
                            ) : (
                              <span className="text-[#17243A] dark:text-slate-300">
                                Student ({u.className})
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-xs">
                            {stats.count} bài · ĐTB: {stats.avgScore}
                          </td>

                          <td className="py-3.5 px-4">
                            {u.status === 'active' ? (
                              <span className="text-[#16A34A] font-semibold">Đang hoạt động</span>
                            ) : (
                              <span className="text-[#DC2626] font-semibold">Đã khóa</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {u.role !== 'super_admin' && (
                              <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                                {isSuperAdmin && u.role === 'student' && (
                                  <button
                                    type="button"
                                    onClick={() => handleGrantAdminRole(u)}
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#315EDE] hover:bg-[#315EDE] hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Cấp quyền Admin</span>
                                  </button>
                                )}

                                {isSuperAdmin && u.role === 'admin' && (
                                  <button
                                    type="button"
                                    onClick={() => handleRevokeAdminRole(u)}
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-600 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <UserMinus className="w-3.5 h-3.5" />
                                    <span>Thu hồi quyền Admin</span>
                                  </button>
                                )}

                                {u.id !== currentUser.id &&
                                  (isSuperAdmin || u.role === 'student') && (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleUserStatus(u)}
                                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      {u.status === 'active' ? (
                                        <>
                                          <Lock className="w-3.5 h-3.5 text-[#DC2626]" />
                                          <span>Khóa</span>
                                        </>
                                      ) : (
                                        <>
                                          <Unlock className="w-3.5 h-3.5 text-[#16A34A]" />
                                          <span>Mở khóa</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: QUẢN LÝ ĐỀ THI */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleCreateExam}
            className="lg:col-span-5 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-4 h-fit"
          >
            <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#315EDE]" />
              <span>Tạo Đề Thi Mới & Cấu Hình Thang Điểm</span>
            </h2>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300">
                Mã đề thi
              </label>
              <input
                type="text"
                value={newExamCode}
                onChange={(e) => setNewExamCode(e.target.value)}
                placeholder="Ví dụ: HSA-NV2026-07"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300">
                Tên đề thi
              </label>
              <input
                type="text"
                value={newExamTitle}
                onChange={(e) => setNewExamTitle(e.target.value)}
                placeholder="Đề Luyện Tập Tổng Hợp Số 07"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300">
                  Thời gian (phút)
                </label>
                <input
                  type="number"
                  value={newExamDuration}
                  onChange={(e) => setNewExamDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300">
                  Thang điểm
                </label>
                <input
                  type="number"
                  value={newExamMaxScore}
                  onChange={(e) => setNewExamMaxScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300">
                  Số câu hỏi
                </label>
                <input
                  type="number"
                  value={newExamQuestionCount}
                  onChange={(e) => setNewExamQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300">
                Độ khó
              </label>
              <select
                value={newExamDiff}
                onChange={(e) => setNewExamDiff(e.target.value as DifficultyLevel)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
              >
                {ALL_DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#315EDE] hover:bg-[#254EC7] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Tạo Đề Thi Mới
              </button>
              <button
                type="button"
                onClick={handleExportDataJson}
                className="w-full py-2.5 bg-[#F4F6FA] dark:bg-slate-800 text-[#17243A] dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất dữ liệu cấu hình JSON</span>
              </button>
            </div>
          </form>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
              Danh Sách Đề Thi Hiện Có ({exams.length} đề)
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {exams.map((ex) => (
                <div
                  key={ex.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono text-[#315EDE] font-semibold">
                      {ex.code} · {ex.questionIds.length} câu · {ex.durationMinutes} phút · Thang{' '}
                      {ex.maxScore}đ
                    </div>
                    <div className="text-sm font-bold text-[#10213A] dark:text-white">
                      {ex.title}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Xóa đề ${ex.code}`}
                    onClick={() => handleDeleteExam(ex.id)}
                    className="p-2 text-slate-400 hover:text-[#DC2626] rounded-lg cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: QUẢN LÝ CÂU HỎI */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleCreateQuestion}
              className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-3.5"
            >
              <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
                Thêm Câu Hỏi Mới Vào Ngân Hàng
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300 mb-1">
                    Chủ đề
                  </label>
                  <select
                    value={newQTopic}
                    onChange={(e) => setNewQTopic(e.target.value as QuestionTopic)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                  >
                    {ALL_QUESTION_TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300 mb-1">
                    Độ khó
                  </label>
                  <select
                    value={newQDiff}
                    onChange={(e) => setNewQDiff(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                  >
                    {ALL_DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300 mb-1">
                  Ngữ liệu đọc hiểu (tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={newQPassage}
                  onChange={(e) => setNewQPassage(e.target.value)}
                  placeholder="Nhập đoạn trích văn bản (nếu có)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300 mb-1">
                  Nội dung câu hỏi *
                </label>
                <input
                  type="text"
                  value={newQContent}
                  onChange={(e) => setNewQContent(e.target.value)}
                  placeholder="Nhập câu hỏi..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newQOptA}
                  onChange={(e) => setNewQOptA(e.target.value)}
                  placeholder="Phương án A *"
                  className="px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                />
                <input
                  type="text"
                  value={newQOptB}
                  onChange={(e) => setNewQOptB(e.target.value)}
                  placeholder="Phương án B *"
                  className="px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                />
                <input
                  type="text"
                  value={newQOptC}
                  onChange={(e) => setNewQOptC(e.target.value)}
                  placeholder="Phương án C *"
                  className="px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                />
                <input
                  type="text"
                  value={newQOptD}
                  onChange={(e) => setNewQOptD(e.target.value)}
                  placeholder="Phương án D *"
                  className="px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300 mb-1">
                    Đáp án đúng
                  </label>
                  <select
                    value={newQCorrect}
                    onChange={(e) => setNewQCorrect(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                  >
                    <option value={0}>Đáp án A</option>
                    <option value={1}>Đáp án B</option>
                    <option value={2}>Đáp án C</option>
                    <option value={3}>Đáp án D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17243A] dark:text-slate-300 mb-1">
                    Giải thích
                  </label>
                  <input
                    type="text"
                    value={newQExplain}
                    onChange={(e) => setNewQExplain(e.target.value)}
                    placeholder="Giải thích ngắn gọn..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#315EDE] hover:bg-[#254EC7] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Thêm Câu Hỏi Vào Ngân Hàng
              </button>
            </form>

            {/* JSON Import */}
            <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="font-display text-sm font-bold text-[#10213A] dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#315EDE]" />
                <span>Nhập Dữ Liệu Câu Hỏi Từ JSON</span>
              </h3>
              <textarea
                rows={3}
                value={jsonImportText}
                onChange={(e) => setJsonImportText(e.target.value)}
                placeholder='[{"content":"Câu hỏi mẫu?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]'
                className="w-full p-3 text-xs font-mono rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={handleImportJsonQuestions}
                className="w-full py-2 bg-[#10213A] dark:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Nhập JSON
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
              Danh Sách Câu Hỏi Mới Nhất ({questions.length} câu)
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[540px] overflow-y-auto pr-1">
              {questions.slice(0, 25).map((q) => (
                <div
                  key={q.id}
                  className="py-3 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono text-[#315EDE]">
                      {q.id} · {q.topic} · {q.difficulty}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#17243A] dark:text-slate-100">
                      {q.content}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Xóa câu hỏi ${q.id}`}
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-slate-400 hover:text-[#DC2626] cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: QUẢN LÝ KẾT QUẢ */}
      {activeTab === 'results' && (
        <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
                Quản Lý Kết Quả Luyện Thi Toàn Hệ Thống ({allAttempts.length} lượt làm bài)
              </h2>
              <p className="text-xs text-[#77849A]">
                Theo dõi điểm số, độ chính xác và thời gian nộp bài của toàn bộ học sinh
              </p>
            </div>
          </div>

          {allAttempts.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-[#77849A]">
              Chưa có lượt nộp bài thực tế nào được ghi nhận trên thiết bị này.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E4E9F1] dark:border-slate-800 bg-[#F4F6FA] dark:bg-slate-800/50 text-[#77849A]">
                    <th className="py-3 px-4 font-semibold">Học sinh / Tài khoản</th>
                    <th className="py-3 px-4 font-semibold">Đề thi</th>
                    <th className="py-3 px-4 font-semibold">Điểm số</th>
                    <th className="py-3 px-4 font-semibold">Đúng / Sai / Trống</th>
                    <th className="py-3 px-4 font-semibold">Thời gian nộp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allAttempts.map((att) => {
                    const student = users.find((u) => u.id === att.userId);
                    return (
                      <tr key={att.id}>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#17243A] dark:text-white">
                            {student ? student.fullName : 'Khách vãng lai (Guest)'}
                          </div>
                          <div className="text-xs font-mono text-[#77849A]">
                            {student ? `@${student.username}` : att.userId}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#17243A] dark:text-white">
                            {att.examTitle}
                          </div>
                          <div className="text-xs font-mono text-[#315EDE]">{att.examCode}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#10213A] dark:text-[#D9BD79]">
                          {att.score} / {att.maxScore} ({att.accuracyPercent}%)
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs">
                          <span className="text-[#16A34A] font-bold">{att.correctCount} Đ</span> ·{' '}
                          <span className="text-[#DC2626] font-bold">{att.wrongCount} S</span> ·{' '}
                          <span className="text-[#F59E0B] font-bold">{att.unansweredCount} T</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[#77849A]">
                          {new Date(att.completedAt).toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 7: THỐNG KÊ */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
                Biểu Đồ Diễn Biến Điểm Số Hệ Thống
              </h2>
              <p className="text-xs text-[#77849A]">
                Tổng hợp từ {allAttempts.length} lượt làm bài gần nhất
              </p>
            </div>
            <ScoreLineChart attempts={allAttempts} />
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
                Tỷ Lệ Chính Xác Theo 10 Chuyên Đề Ngữ Văn
              </h2>
              <p className="text-xs text-[#77849A]">
                Phân tích năng lực học sinh trên từng mảng kiến thức
              </p>
            </div>
            <TopicBarChart stats={systemTopicStats} />
          </div>
        </div>
      )}

      {/* SECTION 8: NHẬT KÝ HOẠT ĐỘNG */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
              Nhật Ký Đăng Nhập & Hoạt Động Quản Trị ({loginHistory.length} bản ghi)
            </h2>
            <p className="text-xs text-[#77849A]">
              Ghi nhận tự động các phiên xác thực tài khoản trên trình duyệt
            </p>
          </div>
          {loginHistory.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-[#77849A]">
              Chưa có nhật ký hoạt động nào.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loginHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#17243A] dark:text-white">
                      {item.fullName} (<span className="font-mono">@{item.username}</span>)
                    </div>
                    <div className="text-[#77849A]">
                      Mã phiên xác thực: <code className="font-mono">{item.id}</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#10213A] text-[#D9BD79] font-mono text-[10px] font-bold uppercase">
                      {item.role}
                    </span>
                    <span className="font-mono text-[#77849A]">
                      {new Date(item.loggedInAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 9: CÀI ĐẶT */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-[#10213A] dark:text-white">
              Cấu Hình Hệ Thống HSA MASTER 2.0
            </h2>
            <p className="text-xs text-[#77849A] leading-relaxed">
              Toàn bộ dữ liệu đề thi, ngân hàng câu hỏi, tài khoản người dùng và lịch sử làm bài được
              quản lý và lưu trữ an toàn trên cơ sở dữ liệu hệ thống. Bạn có thể xuất bản sao lưu JSON bất kỳ lúc nào.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportDataJson}
                className="px-4 py-2.5 bg-[#315EDE] hover:bg-[#254EC7] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải xuống bản sao lưu JSON toàn hệ thống</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="font-display text-sm font-bold text-[#10213A] dark:text-white">
              Tài Khoản Super Admin Gốc
            </h3>
            <div className="text-xs space-y-2 text-[#77849A]">
              <div>
                Họ và tên: <strong className="text-[#17243A] dark:text-white">Nguyễn Thị Thu Huyền</strong>
              </div>
              <div>
                Username: <code className="font-mono text-[#315EDE]">@thuhuyenxinhgai</code>
              </div>
              <div>
                Email: <code className="font-mono">thuhuyenxinhgai@gmail.com</code>
              </div>
              <div>
                Quyền hạn: Toàn quyền quản lý hệ thống, thêm/cấp/thu hồi quyền Admin.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
