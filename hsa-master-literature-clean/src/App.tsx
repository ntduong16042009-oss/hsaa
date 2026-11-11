import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActiveExamSession,
  AppView,
  AuthSession,
  Exam,
  ExamAttempt,
  Question,
  UserAccount,
  WrongQuestionRecord,
} from './types';
import { storageService } from './services/storageService';
import {
  gradeExamSubmission,
  updateWrongRecordsFromAttempt,
} from './utils/examEngine';
import { MainLayout } from './layouts/MainLayout';
import { IntroScreen } from './pages/IntroScreen';
import { HomePage } from './pages/HomePage';
import { AuthPages } from './pages/AuthPages';
import { StudentDashboard } from './pages/StudentDashboard';
import { ExamDetailPage, ExamLibraryPage } from './pages/ExamLibraryPage';
import { ExamRoomPage } from './pages/ExamRoomPage';
import { ExamResultPage } from './pages/ExamResultPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { PracticeCenterPage } from './pages/PracticeCenterPage';
import { HistoryAndStatsPage, UserProfilePage } from './pages/HistoryAndStatsPage';
import { AboutProductPage } from './pages/AboutProductPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const PROTECTED_AUTH_VIEWS: AppView[] = [
  'dashboard',
  'profile',
  'exam-room',
  'practice',
  'wrong-practice',
  'history',
  'statistics',
  'admin',
];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const hash = window.location.hash.replace('#', '') as AppView;
      if (hash) return hash;
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return 'home';
    } catch {
      // ignore
    }
    return 'home';
  });

  const [users, setUsers] = useState<UserAccount[]>(() => storageService.getUsers());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    storageService.getCurrentUser()
  );
  const [authSession, setAuthSession] = useState<AuthSession | null>(() =>
    storageService.getActiveAuthSession()
  );

  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    storageService.getTheme(currentUser?.id)
  );
  const [profileSection, setProfileSection] = useState<
    'info' | 'security' | 'settings'
  >('info');
  const [globalToastMessage, setGlobalToastMessage] = useState<string | null>(
    null
  );
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const [exams, setExams] = useState<Exam[]>(() => storageService.getExams());
  const [questions, setQuestions] = useState<Question[]>(() =>
    storageService.getQuestions()
  );

  // Strict per-account data isolation key
  const activeUserId = currentUser?.id || 'guest-student';

  const [userAttempts, setUserAttempts] = useState<ExamAttempt[]>(() =>
    storageService.getUserAttempts(activeUserId)
  );
  const [wrongRecords, setWrongRecords] = useState<WrongQuestionRecord[]>(() =>
    storageService.getUserWrongRecords(activeUserId)
  );
  const [activeSession, setActiveSession] = useState<ActiveExamSession | null>(() =>
    storageService.getActiveSession(activeUserId)
  );
  const [demoModeEnabled, setDemoModeEnabled] = useState<boolean>(() =>
    storageService.isDemoModeEnabled(activeUserId)
  );

  const [selectedExamId, setSelectedExamId] = useState<string>(() => exams[0]?.id || '');
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

  const showGlobalToast = useCallback((msg: string) => {
    setGlobalToastMessage(msg);
    window.setTimeout(() => {
      setGlobalToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  // Sync Dark mode class on <html> and save per-account theme preference
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storageService.setTheme(theme, currentUser?.id);
  }, [theme, currentUser?.id]);

  // Reload isolated per-user data and theme whenever currentUser changes
  useEffect(() => {
    const uid = currentUser?.id || 'guest-student';
    setUserAttempts(storageService.getUserAttempts(uid));
    setWrongRecords(storageService.getUserWrongRecords(uid));
    setActiveSession(storageService.getActiveSession(uid));
    setDemoModeEnabled(storageService.isDemoModeEnabled(uid));
    setTheme(storageService.getTheme(currentUser?.id));
    setSelectedAttemptId(null);
  }, [currentUser]);

  // Initial cloud sync from Supabase if configured (runs quietly in background)
  useEffect(() => {
    if (storageService.isCloudDbConfigured()) {
      storageService.syncFromCloud().then((res) => {
        if (res) {
          setUsers(storageService.getUsers());
          setExams(storageService.getExams());
          setQuestions(storageService.getQuestions());
          const uid = currentUser?.id || 'guest-student';
          setUserAttempts(storageService.getUserAttempts(uid));
          setWrongRecords(storageService.getUserWrongRecords(uid));
        }
      });
    }
  }, [currentUser?.id]);

  // Guard protected views (Dashboard, Profile, Admin) when permissions are insufficient
  useEffect(() => {
    if (currentView === 'admin') {
      const role = currentUser?.role;
      if (!currentUser || (role !== 'admin' && role !== 'super_admin')) {
        setAuthNotice(
          'Khu vực này chỉ dành riêng cho Ban Quản trị (Admin / Super Admin). Vui lòng đăng nhập tài khoản Quản trị.'
        );
        setCurrentView('login');
      }
    } else if (!currentUser && PROTECTED_AUTH_VIEWS.includes(currentView)) {
      setAuthNotice(
        'Vui lòng đăng nhập tài khoản để truy cập vào Dashboard học sinh và Hồ sơ cá nhân.'
      );
      setCurrentView('login');
    }
  }, [currentUser, currentView]);

  // Sync browser hash & history state so Back/Forward and Refresh retain current view
  useEffect(() => {
    const handlePopState = () => {
      try {
        const hash = window.location.hash.replace('#', '') as AppView;
        if (hash) {
          setCurrentView(hash);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const demoAttempts = useMemo(
    () => storageService.getDemoAttempts(activeUserId),
    [activeUserId, exams, questions]
  );
  const demoWrongRecords = useMemo(() => storageService.getDemoWrongRecords(), []);

  const handleNavigate = useCallback(
    (view: AppView) => {
      // 1. Guard Admin view
      if (view === 'admin') {
        const role = currentUser?.role;
        if (!currentUser || (role !== 'admin' && role !== 'super_admin')) {
          setAuthNotice(
            'Khu vực này chỉ dành riêng cho Ban Quản trị (Admin / Super Admin). Vui lòng đăng nhập tài khoản Quản trị.'
          );
          setCurrentView('login');
          try {
            window.location.hash = 'login';
          } catch {
            // ignore
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // 2. Guard student protected views
      if (!currentUser && PROTECTED_AUTH_VIEWS.includes(view)) {
        setAuthNotice(
          'Vui lòng đăng nhập tài khoản để truy cập vào Dashboard cá nhân.'
        );
        setCurrentView('login');
        try {
          window.location.hash = 'login';
        } catch {
          // ignore
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setAuthNotice(null);
      setCurrentView(view);
      try {
        window.location.hash = view;
      } catch {
        // ignore
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentUser]
  );

  const handleNavigateProfileSection = useCallback(
    (section: 'info' | 'security' | 'settings') => {
      setProfileSection(section);
      handleNavigate('profile');
    },
    [handleNavigate]
  );

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleDemoMode = (enabled: boolean) => {
    setDemoModeEnabled(enabled);
    storageService.setDemoModeEnabled(activeUserId, enabled);
  };

  const handleAuthenticateUser = useCallback(
    (user: UserAccount, rememberMe: boolean) => {
      const session = storageService.establishUserSession(user, rememberMe);
      const refreshedUsers = storageService.getUsers();
      const refreshedCurrent =
        refreshedUsers.find((u) => u.id === user.id) || user;
      setUsers(refreshedUsers);
      setCurrentUser(refreshedCurrent);
      setAuthSession(session);
      setAuthNotice(null);
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const handleConfirmLogout = useCallback(() => {
    storageService.logoutCurrentSession();
    setCurrentUser(null);
    setAuthSession(null);
    setAuthNotice(null);
    setCurrentView('login');
    try {
      window.history.replaceState({ view: 'login' }, '', '#login');
    } catch {
      // ignore
    }
    showGlobalToast('Bạn đã đăng xuất tài khoản thành công.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showGlobalToast]);

  const handleSwitchAccount = useCallback(() => {
    storageService.logoutCurrentSession();
    setCurrentUser(null);
    setAuthSession(null);
    setAuthNotice(
      'Đã kết thúc phiên hiện tại. Vui lòng đăng nhập tài khoản bạn muốn chuyển sang.'
    );
    setCurrentView('login');
    try {
      window.history.replaceState({ view: 'login' }, '', '#login');
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Start or resume an exam (strictly requires student authentication)
  const handleStartExam = useCallback(
    (examId: string) => {
      if (!currentUser) {
        setAuthNotice(
          'Yêu cầu bắt buộc: Bạn cần đăng nhập hoặc tạo tài khoản học sinh để làm bài thi và lưu điểm số vào hệ thống.'
        );
        setCurrentView('login');
        try {
          window.location.hash = 'login';
        } catch {
          // ignore
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetExam = exams.find((e) => e.id === examId) || exams[0];
      if (!targetExam) return;

      // Check if an existing unfinished session for this exact exam & user is still within time
      if (
        activeSession &&
        activeSession.userId === activeUserId &&
        activeSession.examId === targetExam.id &&
        activeSession.endsAt > Date.now()
      ) {
        setSelectedExamId(targetExam.id);
        setCurrentView('exam-room');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const now = Date.now();
      const newSession: ActiveExamSession = {
        examId: targetExam.id,
        examCode: targetExam.code,
        examTitle: targetExam.title,
        userId: activeUserId,
        startedAt: now,
        endsAt: now + targetExam.durationMinutes * 60 * 1000,
        currentQuestionIndex: 0,
        answers: {},
        flaggedQuestions: [],
        lastSavedAt: now,
      };

      setActiveSession(newSession);
      storageService.saveActiveSession(activeUserId, newSession);
      setSelectedExamId(targetExam.id);
      setCurrentView('exam-room');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [exams, activeSession, activeUserId]
  );

  const handleUpdateActiveSession = useCallback(
    (updated: ActiveExamSession) => {
      setActiveSession(updated);
      storageService.saveActiveSession(activeUserId, updated);
    },
    [activeUserId]
  );

  // Submit & grade exam
  const handleSubmitExam = useCallback(
    (finalSession: ActiveExamSession) => {
      const targetExam =
        exams.find((e) => e.id === finalSession.examId) || exams[0];
      if (!targetExam) return;

      const questionsMap = new Map(questions.map((q) => [q.id, q]));
      const grade = gradeExamSubmission(
        targetExam,
        questionsMap,
        finalSession.answers
      );

      const nowMs = Date.now();
      const durationSecs = Math.max(
        1,
        Math.min(
          targetExam.durationMinutes * 60,
          Math.round((nowMs - finalSession.startedAt) / 1000)
        )
      );

      const completedIso = new Date(nowMs).toISOString();
      const newAttempt: ExamAttempt = {
        id: `ATT-${nowMs}`,
        examId: targetExam.id,
        examCode: targetExam.code,
        examTitle: targetExam.title,
        userId: activeUserId,
        startedAt: new Date(finalSession.startedAt).toISOString(),
        completedAt: completedIso,
        durationSeconds: durationSecs,
        totalQuestions: grade.totalQuestions,
        correctCount: grade.correctCount,
        wrongCount: grade.wrongCount,
        unansweredCount: grade.unansweredCount,
        score: grade.score,
        maxScore: grade.maxScore,
        accuracyPercent: grade.accuracyPercent,
        answers: finalSession.answers,
        flaggedQuestions: finalSession.flaggedQuestions,
      };

      storageService.saveAttempt(newAttempt);
      const nextAttempts = storageService.getUserAttempts(activeUserId);
      setUserAttempts(nextAttempts);

      // Update wrong question records isolated for activeUserId
      const updatedWrong = updateWrongRecordsFromAttempt(
        wrongRecords,
        targetExam.questionIds,
        questionsMap,
        finalSession.answers,
        completedIso
      );
      setWrongRecords(updatedWrong);
      storageService.saveUserWrongRecords(activeUserId, updatedWrong);

      // Clear active session
      setActiveSession(null);
      storageService.saveActiveSession(activeUserId, null);

      setSelectedAttemptId(newAttempt.id);
      setCurrentView('exam-result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [exams, questions, activeUserId, wrongRecords]
  );

  // Record a single-question practice answer to update wrong records
  const handleRecordPracticeAnswer = useCallback(
    (questionId: string, selectedOption: number) => {
      const questionsMap = new Map(questions.map((q) => [q.id, q]));
      const updated = updateWrongRecordsFromAttempt(
        wrongRecords,
        [questionId],
        questionsMap,
        { [questionId]: selectedOption },
        new Date().toISOString()
      );
      setWrongRecords(updated);
      storageService.saveUserWrongRecords(activeUserId, updated);
    },
    [questions, wrongRecords, activeUserId]
  );

  // Render full-bleed Intro Screen when currentView === 'intro'
  if (currentView === 'intro') {
    return <IntroScreen onNavigate={handleNavigate} />;
  }

  const selectedExam =
    exams.find((e) => e.id === selectedExamId) || exams[0];

  const allAvailableAttempts = [...userAttempts, ...demoAttempts];
  const selectedAttempt =
    allAvailableAttempts.find((a) => a.id === selectedAttemptId) ||
    userAttempts[0] ||
    demoAttempts[0];

  const unmasteredWrongCount =
    wrongRecords.filter((r) => !r.mastered).length ||
    (userAttempts.length === 0 && demoModeEnabled
      ? demoWrongRecords.filter((r) => !r.mastered).length
      : 0);

  return (
    <MainLayout
      currentView={currentView}
      currentUser={currentUser}
      theme={theme}
      unmasteredWrongCount={unmasteredWrongCount}
      globalToastMessage={globalToastMessage}
      onDismissToast={() => setGlobalToastMessage(null)}
      onNavigate={handleNavigate}
      onNavigateProfileSection={handleNavigateProfileSection}
      onConfirmLogout={handleConfirmLogout}
      onSwitchAccount={handleSwitchAccount}
      onToggleTheme={handleToggleTheme}
    >
      {currentView === 'home' && (
        <HomePage
          exams={exams}
          totalQuestionsCount={questions.length}
          userAttempts={userAttempts}
          wrongRecords={wrongRecords}
          activeSession={activeSession}
          onNavigate={handleNavigate}
          onSelectExam={(examId) => {
            setSelectedExamId(examId);
            handleNavigate('exam-detail');
          }}
          onStartExam={handleStartExam}
          onResumeActiveExam={() => {
            if (activeSession) {
              setSelectedExamId(activeSession.examId);
              handleNavigate('exam-room');
            }
          }}
          onViewAttemptResult={(attemptId) => {
            setSelectedAttemptId(attemptId);
            handleNavigate('exam-result');
          }}
        />
      )}

      {(currentView === 'login' || currentView === 'register') && (
        <AuthPages
          mode={currentView}
          users={users}
          authNotice={authNotice}
          onSwitchMode={(m) => handleNavigate(m)}
          onLoginSuccess={(loggedInUser, rememberMe) => {
            handleAuthenticateUser(loggedInUser, rememberMe);
          }}
          onRegisterSuccess={(newUser, rememberMe) => {
            const nextUsers = [...users, newUser];
            setUsers(nextUsers);
            storageService.saveUsers(nextUsers);
            handleAuthenticateUser(newUser, rememberMe);
            showGlobalToast(
              `Chào mừng ${newUser.fullName}! Tài khoản @${newUser.username} đã được khởi tạo thành công.`
            );
          }}
          onUpdateUserAccount={(updatedUser) => {
            const nextUsers = users.map((u) =>
              u.id === updatedUser.id ? updatedUser : u
            );
            setUsers(nextUsers);
            storageService.saveUsers(nextUsers);
          }}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'dashboard' && currentUser && (
        <StudentDashboard
          user={currentUser}
          exams={exams}
          questions={questions}
          realAttempts={userAttempts}
          realWrongRecords={wrongRecords}
          demoModeEnabled={demoModeEnabled}
          demoAttempts={demoAttempts}
          demoWrongRecords={demoWrongRecords}
          activeSession={activeSession}
          onToggleDemoMode={handleToggleDemoMode}
          onNavigate={handleNavigate}
          onSelectExam={(examId) => {
            setSelectedExamId(examId);
            handleNavigate('exam-detail');
          }}
          onResumeActiveExam={() => {
            if (activeSession) {
              setSelectedExamId(activeSession.examId);
              handleNavigate('exam-room');
            }
          }}
          onViewAttemptResult={(attemptId) => {
            setSelectedAttemptId(attemptId);
            handleNavigate('exam-result');
          }}
        />
      )}

      {currentView === 'exams' && (
        <ExamLibraryPage
          exams={exams}
          userAttempts={userAttempts}
          onSelectExamDetail={(examId) => {
            setSelectedExamId(examId);
            handleNavigate('exam-detail');
          }}
          onStartExamDirect={handleStartExam}
        />
      )}

      {currentView === 'exam-detail' && selectedExam && (
        <ExamDetailPage
          exam={selectedExam}
          previousAttempts={userAttempts.filter((a) => a.examId === selectedExam.id)}
          onBack={() => handleNavigate('exams')}
          onStartExam={handleStartExam}
          onViewAttemptResult={(attemptId) => {
            setSelectedAttemptId(attemptId);
            handleNavigate('exam-result');
          }}
        />
      )}

      {currentView === 'exam-room' && currentUser && selectedExam && activeSession && (
        <ExamRoomPage
          exam={selectedExam}
          questions={questions}
          session={activeSession}
          onUpdateSession={handleUpdateActiveSession}
          onSubmitExam={handleSubmitExam}
          onExitRoom={() => handleNavigate(currentUser ? 'dashboard' : 'exams')}
        />
      )}

      {(currentView === 'exam-result' || currentView === 'wrong-analysis') &&
        selectedAttempt && (
          <ExamResultPage
            attempt={selectedAttempt}
            exam={exams.find((e) => e.id === selectedAttempt.examId)}
            questions={questions}
            onNavigate={handleNavigate}
            onRetakeExam={handleStartExam}
          />
        )}

      {currentView === 'question-bank' && (
        <QuestionBankPage questions={questions} />
      )}

      {(currentView === 'practice' || currentView === 'wrong-practice') && (
        <PracticeCenterPage
          key={currentView}
          initialMode={currentView === 'wrong-practice' ? 'wrong' : 'topic'}
          questions={questions}
          wrongRecords={wrongRecords}
          demoWrongRecords={demoWrongRecords}
          isShowingDemo={userAttempts.length === 0 && demoModeEnabled}
          onRecordPracticeAnswer={handleRecordPracticeAnswer}
          onNavigate={handleNavigate}
        />
      )}

      {(currentView === 'history' || currentView === 'statistics') && (
        <HistoryAndStatsPage
          initialTab={currentView}
          exams={exams}
          questions={questions}
          realAttempts={userAttempts}
          demoAttempts={demoAttempts}
          demoModeEnabled={demoModeEnabled}
          onToggleDemoMode={handleToggleDemoMode}
          onViewAttemptResult={(attemptId) => {
            setSelectedAttemptId(attemptId);
            handleNavigate('exam-result');
          }}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'profile' && currentUser && (
        <UserProfilePage
          user={currentUser}
          initialSection={profileSection}
          theme={theme}
          realAttempts={userAttempts}
          onUpdateProfile={(updatedUser) => {
            const nextUsers = users.map((u) =>
              u.id === updatedUser.id ? updatedUser : u
            );
            setUsers(nextUsers);
            storageService.saveUsers(nextUsers);
            setCurrentUser(updatedUser);
          }}
          onToggleTheme={handleToggleTheme}
          onRequestLogout={handleConfirmLogout}
        />
      )}

      {currentView === 'about' && (
        <AboutProductPage onNavigate={handleNavigate} />
      )}

      {currentView === 'admin' && (
        <AdminPortalPage
          currentUser={currentUser}
          exams={exams}
          questions={questions}
          users={users}
          allAttempts={storageService.getAllAttempts()}
          loginHistory={storageService.getLoginHistory()}
          onSaveExams={(nextExams) => {
            setExams(nextExams);
            storageService.saveExams(nextExams);
          }}
          onSaveQuestions={(nextQuestions) => {
            setQuestions(nextQuestions);
            storageService.saveQuestions(nextQuestions);
          }}
          onSaveUsers={(nextUsers) => {
            setUsers(nextUsers);
            storageService.saveUsers(nextUsers);
            if (currentUser) {
              const updatedSelf = nextUsers.find((u) => u.id === currentUser.id);
              if (updatedSelf) setCurrentUser(updatedSelf);
            }
          }}
          onNavigateToLogin={() => handleNavigate('login')}
        />
      )}
    </MainLayout>
  );
}
