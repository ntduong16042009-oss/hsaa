import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileCheck2,
  GraduationCap,
  History,
  Home,
  Info,
  KeyRound,
  Layers,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  RefreshCcw,
  Settings,
  Shield,
  Sparkles,
  Sun,
  Target,
  User,
  X,
} from 'lucide-react';
import { AppView, UserAccount, UserRole } from '../types';
import { OFFICIAL_PRODUCT_INFO } from '../data/officialInfo';

interface MainLayoutProps {
  currentView: AppView;
  currentUser: UserAccount | null;
  theme: 'light' | 'dark';
  unmasteredWrongCount: number;
  globalToastMessage: string | null;
  onDismissToast: () => void;
  onNavigate: (view: AppView) => void;
  onNavigateProfileSection: (section: 'info' | 'security' | 'settings') => void;
  onConfirmLogout: () => void;
  onSwitchAccount: () => void;
  onToggleTheme: () => void;
  children: React.ReactNode;
}

const VIEW_LABELS: Record<AppView, string> = {
  intro: 'Màn hình Triển lãm (Intro Screen)',
  home: 'Trang chủ',
  login: 'Đăng nhập',
  register: 'Đăng ký tài khoản',
  dashboard: 'Dashboard học sinh',
  exams: 'Thư viện đề thi',
  'exam-detail': 'Chi tiết đề thi',
  'exam-room': 'Phòng thi trực tuyến',
  'exam-result': 'Kết quả & Phân tích bài thi',
  'wrong-analysis': 'Phân tích câu sai',
  'question-bank': 'Ngân hàng câu hỏi (105+ câu)',
  practice: 'Luyện tập theo chủ đề',
  'wrong-practice': 'Luyện tập câu sai',
  history: 'Lịch sử làm bài',
  statistics: 'Thống kê tiến độ',
  profile: 'Hồ sơ cá nhân',
  about: 'Giới thiệu sản phẩm',
  admin: 'Quản trị hệ thống (Admin)',
};

export function formatUserRoleLabel(role: UserRole, className?: string): string {
  if (role === 'super_admin') return 'SUPER ADMIN';
  if (role === 'admin') return 'ADMIN';
  return className ? `STUDENT · ${className}` : 'STUDENT';
}

export function getRoleBadgeStyle(role: UserRole): string {
  if (role === 'super_admin') {
    return 'bg-[#10213A] text-[#D9BD79] border border-[#D9BD79]/40 dark:bg-[#142943]';
  }
  if (role === 'admin') {
    return 'bg-[#315EDE]/10 text-[#315EDE] border border-[#315EDE]/25 dark:bg-[#315EDE]/20 dark:text-blue-300';
  }
  return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
}

interface SidebarGroup {
  groupTitle: string;
  items: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeCount?: number;
  }[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentView,
  currentUser,
  theme,
  unmasteredWrongCount,
  globalToastMessage,
  onDismissToast,
  onNavigate,
  onNavigateProfileSection,
  onConfirmLogout,
  onSwitchAccount,
  onToggleTheme,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sidebarGroups: SidebarGroup[] = [
    {
      groupTitle: 'TỔNG QUAN',
      items: [
        { id: 'home', label: 'Trang chủ', icon: Home },
        { id: 'dashboard', label: 'Dashboard học sinh', icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: 'HỌC TẬP',
      items: [
        { id: 'exams', label: 'Thư viện đề thi', icon: FileCheck2 },
        { id: 'question-bank', label: 'Ngân hàng câu hỏi', icon: Layers },
        { id: 'practice', label: 'Luyện theo chủ đề', icon: Target },
        {
          id: 'wrong-practice',
          label: `Luyện câu sai (${unmasteredWrongCount})`,
          icon: RefreshCcw,
          badgeCount: unmasteredWrongCount,
        },
        { id: 'history', label: 'Lịch sử thi', icon: History },
      ],
    },
    {
      groupTitle: 'PHÂN TÍCH',
      items: [
        { id: 'statistics', label: 'Thống kê tiến độ', icon: BarChart3 },
        { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
      ],
    },
    {
      groupTitle: 'HỆ THỐNG',
      items: [
        { id: 'about', label: 'Giới thiệu sản phẩm', icon: Info },
        ...(currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin')
          ? [{ id: 'admin' as AppView, label: 'Quản trị Admin', icon: Shield }]
          : []),
        { id: 'intro', label: 'Triển lãm Intro', icon: Sparkles },
      ],
    },
  ];

  const handleNavClick = (view: AppView) => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    setNotificationOpen(false);
    onNavigate(view);
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .slice(-2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] text-[#17243A] dark:bg-[#0B1524] dark:text-slate-100">
      {/* Global Notification Toast */}
      <AnimatePresence>
        {globalToastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            role="status"
            className="fixed top-16 right-4 z-50 max-w-md bg-[#10213A] text-white border border-[#D9BD79]/50 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span className="flex-1">{globalToastMessage}</span>
            <button
              type="button"
              aria-label="Đóng thông báo"
              onClick={onDismissToast}
              className="p-1 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER 2.0: Clean Premium EdTech Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#10213A]/95 backdrop-blur-md border-b border-[#E4E9F1] dark:border-slate-800 px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand Emblem & Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#10213A] dark:bg-[#142943] border border-[#D9BD79]/40 flex items-center justify-center text-[#D9BD79] shadow-xs group-hover:border-[#D9BD79] transition-colors">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="leading-none">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-display text-sm sm:text-lg font-extrabold tracking-tight text-[#10213A] dark:text-white">
                HSA MASTER
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#D9BD79]/20 text-[#10213A] dark:text-[#D9BD79]">
                2.0
              </span>
            </div>
            <div className="text-[10px] text-[#77849A] dark:text-slate-400 font-medium hidden sm:block mt-0.5">
              Sản phẩm học tập số môn Ngữ văn
            </div>
          </div>
        </a>

        {/* Zone 2: 5 Primary Navigation Links */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#77849A] dark:text-slate-300"
        >
          {[
            { id: 'home' as AppView, label: 'Trang chủ', match: ['home'] },
            {
              id: 'exams' as AppView,
              label: 'Luyện thi',
              match: ['exams', 'exam-detail', 'exam-room', 'exam-result'],
            },
            {
              id: 'question-bank' as AppView,
              label: 'Ngân hàng câu hỏi',
              match: ['question-bank'],
            },
            {
              id: 'practice' as AppView,
              label: 'Luyện tập',
              match: ['practice', 'wrong-practice'],
            },
            { id: 'about' as AppView, label: 'Giới thiệu', match: ['about'] },
          ].map((navItem) => {
            const active = navItem.match.includes(currentView);
            return (
              <a
                key={navItem.id}
                href={`#${navItem.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(navItem.id);
                }}
                className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#10213A]/6 dark:bg-white/10 text-[#10213A] dark:text-white font-semibold'
                    : 'hover:text-[#315EDE] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {navItem.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Switcher, Notifications & Account Dropdown */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Header Theme Toggle Button */}
          <button
            type="button"
            aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#17243A] dark:text-[#D9BD79] hover:border-[#315EDE] transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Chế độ Sáng (Light)' : 'Chế độ Tối (Dark)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Header Notifications Button & Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label="Thông báo học tập"
              onClick={() => setNotificationOpen((prev) => !prev)}
              className="relative p-1.5 sm:p-2 rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#17243A] dark:text-slate-200 hover:border-[#315EDE] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unmasteredWrongCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#315EDE] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  {unmasteredWrongCount > 9 ? '9+' : unmasteredWrongCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#E4E9F1] dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-[#10213A] dark:text-white">
                      Thông báo học tập
                    </span>
                    <span className="text-[11px] font-mono text-[#77849A]">
                      Năm học {OFFICIAL_PRODUCT_INFO.academicYear}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {unmasteredWrongCount > 0 ? (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                        <div className="font-semibold text-amber-900 dark:text-amber-200">
                          Bạn có {unmasteredWrongCount} câu trả lời sai cần ôn lại
                        </div>
                        <button
                          type="button"
                          onClick={() => handleNavClick('wrong-practice')}
                          className="text-[#315EDE] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                        >
                          Vào luyện lại câu sai ngay →
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-[#F4F6FA] dark:bg-slate-800/60 text-[#77849A] dark:text-slate-300">
                        Tuyệt vời! Bạn hiện không có câu hỏi sai nào tồn đọng cần ôn lại.
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-[#F4F6FA] dark:bg-slate-800/60 text-[#77849A] dark:text-slate-300">
                      Hệ thống có sẵn <strong>6 đề thi</strong> và <strong>105 câu hỏi</strong> thuộc
                      10 chuyên đề Ngữ văn.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Account Trigger or Login CTA */}
          <div className="relative" ref={dropdownRef}>
            {currentUser ? (
              <div className="relative flex items-center">
                <button
                  type="button"
                  aria-label="Mở menu tài khoản"
                  aria-expanded={accountMenuOpen}
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800 hover:border-[#315EDE] transition-colors cursor-pointer"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-7 h-7 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-[#10213A] dark:bg-[#315EDE] text-[#D9BD79] dark:text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
                      {getInitials(currentUser.fullName)}
                    </div>
                  )}

                  <div className="hidden sm:flex items-center gap-2 text-left leading-tight">
                    <span className="text-xs font-bold text-[#10213A] dark:text-white whitespace-nowrap max-w-[130px] truncate">
                      {currentUser.fullName}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${getRoleBadgeStyle(
                        currentUser.role
                      )}`}
                    >
                      {formatUserRoleLabel(currentUser.role)}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#77849A] transition-transform ${
                      accountMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Smooth Account Dropdown Menu */}
                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      role="menu"
                      aria-label="Menu tài khoản người dùng"
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-[#E4E9F1] dark:border-slate-800">
                        <div className="text-xs font-bold text-[#10213A] dark:text-white truncate">
                          {currentUser.fullName}
                        </div>
                        <div className="text-[11px] font-mono text-[#77849A] truncate">
                          @{currentUser.username} ·{' '}
                          {formatUserRoleLabel(currentUser.role, currentUser.className)}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            onNavigateProfileSection('info');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-[#17243A] dark:text-slate-200 hover:bg-[#F4F6FA] dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                        >
                          <User className="w-4 h-4 text-[#315EDE]" />
                          <span>Hồ sơ cá nhân</span>
                        </button>

                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            onNavigateProfileSection('security');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-[#17243A] dark:text-slate-200 hover:bg-[#F4F6FA] dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                        >
                          <KeyRound className="w-4 h-4 text-[#315EDE]" />
                          <span>Tài khoản của tôi</span>
                        </button>

                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleNavClick('history')}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-[#17243A] dark:text-slate-200 hover:bg-[#F4F6FA] dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                        >
                          <History className="w-4 h-4 text-[#315EDE]" />
                          <span>Lịch sử làm bài</span>
                        </button>

                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            onNavigateProfileSection('settings');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-[#17243A] dark:text-slate-200 hover:bg-[#F4F6FA] dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-[#315EDE]" />
                          <span>Cài đặt</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-[#E4E9F1] dark:border-slate-800 space-y-0.5">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            onSwitchAccount();
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-[#17243A] dark:text-slate-200 hover:bg-[#F4F6FA] dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                        >
                          <RefreshCcw className="w-4 h-4 text-[#315EDE]" />
                          <span>Chuyển đổi tài khoản</span>
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setLogoutModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>ĐĂNG XUẤT</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('login')}
                className="px-2.5 sm:px-4 py-2 text-xs font-semibold text-white bg-[#10213A] hover:bg-[#142943] dark:bg-[#315EDE] dark:hover:bg-blue-600 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 hidden sm:inline-block" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[#E4E9F1] dark:border-slate-700 text-[#17243A] dark:text-slate-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* WORKSPACE BODY: Natural Single-Scroll Stream (Sidebar + Main Content move together) */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex items-stretch">
        {/* Desktop Sidebar: position static, NO fixed, NO sticky, NO overflow-y-auto, NO 100vh limit */}
        <aside
          aria-label="Thanh công cụ học tập"
          className={`hidden lg:flex flex-col justify-between shrink-0 border-r border-[#E4E9F1] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-200 ${
            sidebarCollapsed ? 'w-20' : 'w-68'
          }`}
        >
          <div className="space-y-5">
            {/* Collapse / Expand Toggle Row */}
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#77849A]">
                  ĐIỀU HƯỚNG HỆ THỐNG
                </span>
              )}
              <button
                type="button"
                aria-label={sidebarCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="p-1.5 rounded-lg border border-[#E4E9F1] dark:border-slate-700 text-[#77849A] hover:text-[#10213A] dark:hover:text-white hover:bg-[#F4F6FA] dark:hover:bg-slate-800 transition-colors cursor-pointer mx-auto lg:mx-0"
                title={sidebarCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* 1. User Account Summary Card at Top of Sidebar */}
            <div className="p-3 rounded-2xl bg-[#F4F6FA] dark:bg-slate-800/70 border border-[#E4E9F1] dark:border-slate-700/80 space-y-2.5">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-2.5">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.fullName}
                        className="w-9 h-9 rounded-xl object-cover shrink-0 mx-auto lg:mx-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-[#10213A] dark:bg-[#315EDE] text-[#D9BD79] dark:text-white font-display font-bold text-xs flex items-center justify-center shrink-0 mx-auto lg:mx-0">
                        {getInitials(currentUser.fullName)}
                      </div>
                    )}
                    {!sidebarCollapsed && (
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#10213A] dark:text-white truncate">
                          {currentUser.fullName}
                        </div>
                        <div className="text-[11px] font-medium text-[#16A34A] truncate">
                          ● {formatUserRoleLabel(currentUser.role, currentUser.className)}
                        </div>
                      </div>
                    )}
                  </div>

                  {!sidebarCollapsed && (
                    <div className="flex items-center justify-between pt-2 border-t border-[#E4E9F1] dark:border-slate-700/70 text-[11px]">
                      <button
                        type="button"
                        onClick={onSwitchAccount}
                        className="font-semibold text-[#315EDE] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Chuyển tài khoản
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoutModalOpen(true)}
                        className="font-semibold text-[#DC2626] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  {!sidebarCollapsed && (
                    <div className="text-xs font-semibold text-[#17243A] dark:text-slate-200">
                      Chưa đăng nhập tài khoản
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleNavClick('login')}
                    title="Đăng nhập / Đăng ký"
                    className="w-full py-2 px-2 bg-[#315EDE] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 shrink-0" />
                    {!sidebarCollapsed && <span>Đăng nhập / Đăng ký</span>}
                  </button>
                </div>
              )}
            </div>

            {/* 2. Categorized Navigation Groups: TỔNG QUAN, HỌC TẬP, PHÂN TÍCH, HỆ THỐNG */}
            <nav aria-label="Menu chức năng" className="space-y-4">
              {sidebarGroups.map((group) => (
                <div key={group.groupTitle} className="space-y-1">
                  {!sidebarCollapsed && (
                    <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#77849A] dark:text-slate-400">
                      {group.groupTitle}
                    </div>
                  )}
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      currentView === item.id ||
                      (item.id === 'exams' &&
                        (currentView === 'exam-detail' ||
                          currentView === 'exam-room' ||
                          currentView === 'exam-result'));

                    return (
                      <button
                        key={item.id}
                        type="button"
                        title={sidebarCollapsed ? item.label : undefined}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center ${
                          sidebarCollapsed ? 'justify-center' : 'justify-between'
                        } gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#10213A] text-white dark:bg-[#315EDE] shadow-xs'
                            : 'text-[#77849A] dark:text-slate-400 hover:bg-[#F4F6FA] dark:hover:bg-slate-800 hover:text-[#10213A] dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-[#D9BD79] dark:text-white' : ''
                            }`}
                          />
                          {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!sidebarCollapsed && isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D9BD79] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* 3. Theme Switcher & Academic Badge in Sidebar Footer */}
          <div className="pt-4 mt-6 border-t border-[#E4E9F1] dark:border-slate-800 space-y-3">
            <button
              type="button"
              onClick={onToggleTheme}
              title="Đổi giao diện Sáng / Tối"
              className={`w-full px-3 py-2 rounded-xl border border-[#E4E9F1] dark:border-slate-700 bg-[#F4F6FA] dark:bg-slate-800 text-xs font-semibold text-[#17243A] dark:text-slate-200 flex items-center ${
                sidebarCollapsed ? 'justify-center' : 'justify-between'
              } cursor-pointer hover:border-[#315EDE] transition-colors`}
            >
              {!sidebarCollapsed && (
                <span>Giao diện: {theme === 'dark' ? 'Tối (Dark)' : 'Sáng (Light)'}</span>
              )}
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#D9BD79] shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-[#10213A] shrink-0" />
              )}
            </button>

            {!sidebarCollapsed && (
              <div className="text-[11px] text-[#77849A] dark:text-slate-400 space-y-0.5 px-1">
                <div className="font-semibold text-[#10213A] dark:text-slate-200">
                  GV bộ môn: {OFFICIAL_PRODUCT_INFO.subjectTeacherName}
                </div>
                <div>
                  HS thực hiện: <strong className="text-[#17243A] dark:text-white">{OFFICIAL_PRODUCT_INFO.students.join(' – ')}</strong>
                </div>
                <div className="text-[10px]">
                  Lớp {OFFICIAL_PRODUCT_INFO.className} · Khóa {OFFICIAL_PRODUCT_INFO.cohort} ·{' '}
                  {OFFICIAL_PRODUCT_INFO.schoolName}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Drawer Navigation (Scrollable inside drawer on mobile) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full p-4 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E4E9F1] dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#315EDE]" />
                    <span className="font-display font-bold text-base text-[#10213A] dark:text-white">
                      HSA MASTER MENU
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Đóng menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-[#77849A]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile User Info */}
                {currentUser && (
                  <div className="p-3 rounded-xl bg-[#F4F6FA] dark:bg-slate-800/70 border border-[#E4E9F1] dark:border-slate-700 space-y-2">
                    <div className="text-xs font-bold text-[#10213A] dark:text-white">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-[#77849A]">
                      @{currentUser.username} · {formatUserRoleLabel(currentUser.role)}
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#E4E9F1] dark:border-slate-700 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onSwitchAccount();
                        }}
                        className="font-semibold text-[#315EDE]"
                      >
                        Chuyển tài khoản
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setLogoutModalOpen(true);
                        }}
                        className="font-semibold text-[#DC2626]"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {sidebarGroups.map((group) => (
                    <div key={group.groupTitle} className="space-y-1">
                      <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#77849A]">
                        {group.groupTitle}
                      </div>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                              isActive
                                ? 'bg-[#10213A] text-white dark:bg-[#315EDE]'
                                : 'text-[#17243A] dark:text-slate-300'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E4E9F1] dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E9F1] dark:border-slate-700 text-xs font-semibold flex items-center justify-between"
                >
                  <span>Đổi chế độ Sáng / Tối</span>
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLogoutModalOpen(true);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold"
                  >
                    Đăng xuất ({currentUser.fullName})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavClick('login')}
                    className="w-full px-3 py-2 rounded-xl bg-[#315EDE] text-white text-xs font-semibold"
                  >
                    Tài khoản / Đăng nhập
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEWPORT CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
            {/* Breadcrumb & Workspace Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#77849A] dark:text-slate-400 pb-2.5 border-b border-[#E4E9F1] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#315EDE]" />
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className="hover:text-[#10213A] dark:hover:text-white cursor-pointer font-medium"
                >
                  HSA MASTER
                </button>
                <span>/</span>
                <span className="font-semibold text-[#10213A] dark:text-white">
                  {VIEW_LABELS[currentView]}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className="hover:text-[#315EDE] font-medium cursor-pointer"
                >
                  Dashboard
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleNavClick('statistics')}
                  className="hover:text-[#315EDE] font-medium cursor-pointer"
                >
                  Thống kê
                </button>
                <span>·</span>
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => setLogoutModalOpen(true)}
                    className="text-[#DC2626] hover:underline font-semibold cursor-pointer"
                  >
                    Đăng xuất ({currentUser.fullName})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavClick('login')}
                    className="hover:text-[#315EDE] font-medium cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            </div>

            {children}
          </main>

          {/* OFFICIAL FOOTER */}
          <footer className="bg-white dark:bg-slate-900 border-t border-[#E4E9F1] dark:border-slate-800 px-4 sm:px-8 py-6 mt-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#77849A] dark:text-slate-400">
              <div className="space-y-1">
                <div className="font-display font-bold text-sm text-[#10213A] dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#315EDE]" />
                  <span>
                    {OFFICIAL_PRODUCT_INFO.productName} – {OFFICIAL_PRODUCT_INFO.category}{' '}
                    {OFFICIAL_PRODUCT_INFO.subject}
                  </span>
                </div>
                <div>
                  Năm học {OFFICIAL_PRODUCT_INFO.academicYear} · Giáo viên bộ môn:{' '}
                  <strong className="text-[#10213A] dark:text-white">
                    {OFFICIAL_PRODUCT_INFO.subjectTeacherName}
                  </strong>
                </div>
              </div>

              <div className="space-y-1 md:text-right">
                <div>
                  Học sinh thực hiện:{' '}
                  <strong className="text-[#10213A] dark:text-white">
                    {OFFICIAL_PRODUCT_INFO.students.join(' – ')}
                  </strong>
                </div>
                <div>
                  Lớp {OFFICIAL_PRODUCT_INFO.className} · Khóa {OFFICIAL_PRODUCT_INFO.cohort} ·{' '}
                  {OFFICIAL_PRODUCT_INFO.schoolName}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {logoutModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-slate-900 border border-[#E4E9F1] dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#DC2626] flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="logout-confirm-title"
                  className="font-display font-bold text-lg text-[#10213A] dark:text-white"
                >
                  Xác Nhận Đăng Xuất Tài Khoản
                </h3>
                <p className="text-xs text-[#77849A] dark:text-slate-400">
                  Phiên làm việc của {currentUser?.fullName} sẽ kết thúc.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#17243A] dark:text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản{' '}
              <strong>@{currentUser?.username}</strong>? Toàn bộ lịch sử làm bài, điểm số và tiến độ
              học tập của tài khoản vẫn được bảo toàn nguyên vẹn.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E4E9F1] dark:border-slate-700 text-xs font-bold text-[#17243A] dark:text-slate-300 hover:bg-[#F4F6FA] dark:hover:bg-slate-800 cursor-pointer"
              >
                HỦY
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutModalOpen(false);
                  onConfirmLogout();
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
