import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ActiveExamSession,
  AuthSession,
  Exam,
  ExamAttempt,
  LoginHistoryEntry,
  Question,
  UserAccount,
  WrongQuestionRecord,
} from '../types';
import { INITIAL_EXAMS, INITIAL_QUESTIONS } from '../data/examsData';
import {
  createAuthSession,
  generateSalt,
  isAuthSessionValid,
} from '../utils/authSecurity';

const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] || '';
    }
  } catch {
    // ignore
  }
  return '';
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const STORAGE_KEYS = {
  THEME_GLOBAL: 'hsa_master_theme_v1',
  USERS: 'hsa_master_users_v2',
  SUPER_ADMIN_BOOTSTRAPPED: 'hsa_master_super_admin_init_v1',
  LOGIN_HISTORY: 'hsa_master_login_history_v1',
  PERSISTENT_SESSION: 'hsa_master_persistent_session_v2',
  TAB_SESSION: 'hsa_master_tab_session_v2',
  LEGACY_REMEMBERED_V2: 'hsa_master_remembered_accounts_v2',
  LEGACY_REMEMBERED_V1: 'hsa_master_remembered_accounts_v1',
  LEGACY_EXPLICIT_LOGOUT: 'hsa_master_explicit_logout_v2',
  EXAMS: 'hsa_master_exams_v1',
  QUESTIONS: 'hsa_master_questions_v1',
  ATTEMPTS: 'hsa_master_attempts_v1',
  WRONG_RECORDS: 'hsa_master_wrong_records_v1',
  ACTIVE_EXAM_SESSION: 'hsa_master_active_session_v1',
  DEMO_MODE_ENABLED: 'hsa_master_demo_stats_enabled_v1',
};

const LEGACY_DEMO_USER_IDS = new Set([
  'user-student-loi',
  'user-student-huyen',
  'user-admin-hsa',
  'user-super-admin-dat',
]);

// Initial Super Admin Account (Nguyễn Thị Thu Huyền - thuhuyenxinhgai)
export const INITIAL_SUPER_ADMIN_ACCOUNT: UserAccount = {
  id: 'user-super-admin-huyen',
  fullName: 'Nguyễn Thị Thu Huyền',
  username: 'thuhuyenxinhgai',
  email: 'thuhuyenxinhgai@gmail.com',
  passwordSalt: 'hsa_salt_super_admin_thuhuyen',
  passwordDigest: 'hsa256$0d2b1523d7201df45b76bc0fc284755b',
  requiresPasswordSetup: false,
  role: 'super_admin',
  className: '12A03',
  schoolName: 'Trường THPT Yên Lãng',
  academicYear: '2026–2027',
  joinedAt: '2026-09-01',
  status: 'active',
  preferences: { theme: 'light' },
};

function safeGetLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSetLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

function safeGetSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSetSession<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export const storageService = {
  isCloudDbConfigured(): boolean {
    return Boolean(supabase);
  },

  /**
   * Cleans up legacy remembered-account lists and ensures Super Admin exists.
   */
  cleanupAndEnsureSuperAdmin(): UserAccount[] {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEGACY_REMEMBERED_V2);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_REMEMBERED_V1);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_EXPLICIT_LOGOUT);

      const rawStored = safeGetLocal<UserAccount[] | null>(STORAGE_KEYS.USERS, null);
      const filtered = (rawStored || []).filter(
        (u) => u && !LEGACY_DEMO_USER_IDS.has(u.id)
      );

      // Deduplicate by username/email
      const seenUsernames = new Set<string>();
      const seenEmails = new Set<string>();
      const deduplicated: UserAccount[] = [];

      for (const acc of filtered) {
        const uKey = acc.username.trim().toLowerCase();
        const eKey = acc.email.trim().toLowerCase();
        if (seenUsernames.has(uKey) || seenEmails.has(eKey)) continue;
        seenUsernames.add(uKey);
        seenEmails.add(eKey);
        deduplicated.push({
          ...acc,
          passwordSalt: acc.passwordSalt || generateSalt(acc.id),
          passwordDigest: acc.passwordDigest || '',
          requiresPasswordSetup:
            acc.requiresPasswordSetup ?? !acc.passwordDigest,
          preferences: acc.preferences || { theme: 'light' },
        });
      }

      // Ensure Super Admin account exists
      const hasSuperAdmin = deduplicated.some(
        (u) =>
          u.username.toLowerCase() ===
            INITIAL_SUPER_ADMIN_ACCOUNT.username.toLowerCase() ||
          u.email.toLowerCase() ===
            INITIAL_SUPER_ADMIN_ACCOUNT.email.toLowerCase() ||
          u.id === INITIAL_SUPER_ADMIN_ACCOUNT.id
      );

      let finalUsers = deduplicated;
      if (!hasSuperAdmin) {
        finalUsers = [INITIAL_SUPER_ADMIN_ACCOUNT, ...deduplicated];
      } else {
        finalUsers = deduplicated.map((u) => {
          if (
            u.username.toLowerCase() ===
              INITIAL_SUPER_ADMIN_ACCOUNT.username.toLowerCase() ||
            u.email.toLowerCase() ===
              INITIAL_SUPER_ADMIN_ACCOUNT.email.toLowerCase()
          ) {
            return {
              ...u,
              role: 'super_admin' as const,
              status: 'active' as const,
            };
          }
          return u;
        });
      }

      safeSetLocal(STORAGE_KEYS.USERS, finalUsers);
      localStorage.setItem(STORAGE_KEYS.SUPER_ADMIN_BOOTSTRAPPED, 'true');

      // Remove any stale session belonging to old demo accounts
      const persistent = safeGetLocal<AuthSession | null>(
        STORAGE_KEYS.PERSISTENT_SESSION,
        null
      );
      if (persistent && LEGACY_DEMO_USER_IDS.has(persistent.userId)) {
        localStorage.removeItem(STORAGE_KEYS.PERSISTENT_SESSION);
      }

      const tabSess = safeGetSession<AuthSession | null>(
        STORAGE_KEYS.TAB_SESSION,
        null
      );
      if (tabSess && LEGACY_DEMO_USER_IDS.has(tabSess.userId)) {
        sessionStorage.removeItem(STORAGE_KEYS.TAB_SESSION);
      }

      return finalUsers;
    } catch {
      return [INITIAL_SUPER_ADMIN_ACCOUNT];
    }
  },

  // Per-account Theme & Global Fallback
  getTheme(userId?: string): 'light' | 'dark' {
    try {
      if (userId) {
        const userTheme = localStorage.getItem(
          `${STORAGE_KEYS.THEME_GLOBAL}_${userId}`
        );
        if (userTheme === 'dark' || userTheme === 'light') return userTheme;
      }
      const saved = localStorage.getItem(STORAGE_KEYS.THEME_GLOBAL);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light';
  },

  setTheme(theme: 'light' | 'dark', userId?: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_GLOBAL, theme);
      if (userId) {
        localStorage.setItem(`${STORAGE_KEYS.THEME_GLOBAL}_${userId}`, theme);
      }
    } catch {
      // ignore
    }
  },

  // Users Database (Local Cache + Async Cloud DB sync)
  getUsers(): UserAccount[] {
    return this.cleanupAndEnsureSuperAdmin();
  },

  saveUsers(users: UserAccount[]): void {
    const clean = users.filter((u) => !LEGACY_DEMO_USER_IDS.has(u.id));
    safeSetLocal(STORAGE_KEYS.USERS, clean);
    if (supabase) {
      const records = clean.map((u) => ({
        id: u.id,
        full_name: u.fullName,
        username: u.username,
        email: u.email,
        password_salt: u.passwordSalt,
        password_digest: u.passwordDigest,
        requires_password_setup: u.requiresPasswordSetup ?? false,
        role: u.role,
        class_name: u.className || '12A03',
        school_name: u.schoolName || 'Trường THPT Yên Lãng',
        academic_year: u.academicYear || '2026–2027',
        joined_at: u.joinedAt || new Date().toISOString().slice(0, 10),
        status: u.status || 'active',
        preferences: u.preferences || { theme: 'light' },
      }));
      supabase.from('users').upsert(records, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('[Supabase] sync users error:', error.message);
      });
    }
  },

  // Login History in LocalStorage
  getLoginHistory(userId?: string): LoginHistoryEntry[] {
    const all = safeGetLocal<LoginHistoryEntry[]>(STORAGE_KEYS.LOGIN_HISTORY, []);
    if (!userId) return all;
    return all.filter((entry) => entry.userId === userId);
  },

  recordLoginHistory(user: UserAccount): void {
    const all = safeGetLocal<LoginHistoryEntry[]>(STORAGE_KEYS.LOGIN_HISTORY, []);
    const newEntry: LoginHistoryEntry = {
      id: `LOGIN-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      loggedInAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...all].slice(0, 100);
    safeSetLocal(STORAGE_KEYS.LOGIN_HISTORY, updated);
  },

  // Session Management
  getActiveAuthSession(): AuthSession | null {
    const tabSession = safeGetSession<AuthSession | null>(
      STORAGE_KEYS.TAB_SESSION,
      null
    );
    if (tabSession && isAuthSessionValid(tabSession)) {
      return tabSession;
    }

    const persistentSession = safeGetLocal<AuthSession | null>(
      STORAGE_KEYS.PERSISTENT_SESSION,
      null
    );
    if (persistentSession && isAuthSessionValid(persistentSession)) {
      return persistentSession;
    }

    return null;
  },

  getCurrentUser(): UserAccount | null {
    const users = this.getUsers();
    const session = this.getActiveAuthSession();

    if (session) {
      const matched = users.find(
        (u) => u.id === session.userId && u.status === 'active'
      );
      if (matched) return matched;
    }

    return null;
  },

  establishUserSession(user: UserAccount, rememberMe: boolean): AuthSession {
    const session = createAuthSession(user, rememberMe);
    try {
      if (rememberMe) {
        safeSetLocal(STORAGE_KEYS.PERSISTENT_SESSION, session);
        sessionStorage.removeItem(STORAGE_KEYS.TAB_SESSION);
      } else {
        safeSetSession(STORAGE_KEYS.TAB_SESSION, session);
        localStorage.removeItem(STORAGE_KEYS.PERSISTENT_SESSION);
      }
      this.recordLoginHistory(user);
    } catch {
      // ignore
    }
    return session;
  },

  logoutCurrentSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PERSISTENT_SESSION);
      sessionStorage.removeItem(STORAGE_KEYS.TAB_SESSION);
    } catch {
      // ignore
    }
  },

  // Questions & Exams
  getQuestions(): Question[] {
    const stored = safeGetLocal<Question[] | null>(STORAGE_KEYS.QUESTIONS, null);
    if (!stored || stored.length < INITIAL_QUESTIONS.length) {
      safeSetLocal(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
      return INITIAL_QUESTIONS;
    }
    return stored;
  },

  saveQuestions(questions: Question[]): void {
    safeSetLocal(STORAGE_KEYS.QUESTIONS, questions);
    if (supabase && questions.length > 0) {
      const payload = questions.map((q) => ({
        id: q.id,
        content: q.content,
        passage: q.passage || '',
        passage_source: q.passageSource || '',
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || '',
        related_knowledge: q.relatedKnowledge || '',
        memory_tip: q.memoryTip || '',
        topic: q.topic,
        difficulty: q.difficulty,
        source_note: q.sourceNote || '',
      }));
      supabase.from('questions').upsert(payload, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('[Supabase] sync questions error:', error.message);
      });
    }
  },

  getExams(): Exam[] {
    const stored = safeGetLocal<Exam[] | null>(STORAGE_KEYS.EXAMS, null);
    if (!stored || stored.length === 0) {
      safeSetLocal(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
      return INITIAL_EXAMS;
    }
    return stored;
  },

  saveExams(exams: Exam[]): void {
    safeSetLocal(STORAGE_KEYS.EXAMS, exams);
    if (supabase && exams.length > 0) {
      const payload = exams.map((e) => ({
        id: e.id,
        code: e.code,
        title: e.title,
        description: e.description || '',
        cover_image: e.coverImage || '',
        question_ids: e.questionIds,
        duration_minutes: e.durationMinutes,
        max_score: e.maxScore,
        difficulty: e.difficulty,
        topic: e.topic,
        category_type: e.categoryType,
        instructions: e.instructions || [],
        knowledge_outline: e.knowledgeOutline || [],
      }));
      supabase.from('exams').upsert(payload, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('[Supabase] sync exams error:', error.message);
      });
    }
  },

  // Active Exam Session (Strictly Scoped by userId)
  getActiveSession(userId: string): ActiveExamSession | null {
    if (!userId) return null;
    return safeGetLocal<ActiveExamSession | null>(
      `${STORAGE_KEYS.ACTIVE_EXAM_SESSION}_${userId}`,
      null
    );
  },

  saveActiveSession(userId: string, session: ActiveExamSession | null): void {
    if (!userId) return;
    try {
      if (!session) {
        localStorage.removeItem(
          `${STORAGE_KEYS.ACTIVE_EXAM_SESSION}_${userId}`
        );
      } else {
        safeSetLocal(`${STORAGE_KEYS.ACTIVE_EXAM_SESSION}_${userId}`, session);
      }
    } catch {
      // ignore
    }
  },

  // Exam Attempts
  getAllAttempts(): ExamAttempt[] {
    return safeGetLocal<ExamAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
  },

  getUserAttempts(userId: string): ExamAttempt[] {
    if (!userId) return [];
    return this.getAllAttempts()
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  },

  saveAttempt(attempt: ExamAttempt): void {
    const all = this.getAllAttempts();
    const updated = [attempt, ...all.filter((a) => a.id !== attempt.id)];
    safeSetLocal(STORAGE_KEYS.ATTEMPTS, updated);
    if (supabase) {
      supabase.from('exam_attempts').upsert({
        id: attempt.id,
        exam_id: attempt.examId,
        exam_code: attempt.examCode,
        exam_title: attempt.examTitle,
        user_id: attempt.userId,
        started_at: attempt.startedAt,
        completed_at: attempt.completedAt,
        duration_seconds: attempt.durationSeconds,
        total_questions: attempt.totalQuestions,
        correct_count: attempt.correctCount,
        wrong_count: attempt.wrongCount,
        unanswered_count: attempt.unansweredCount,
        score: attempt.score,
        max_score: attempt.maxScore,
        accuracy_percent: attempt.accuracyPercent,
        answers: attempt.answers,
        flagged_questions: attempt.flaggedQuestions,
      }, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('[Supabase] sync attempt error:', error.message);
      });
    }
  },

  // Wrong Question Records
  getUserWrongRecords(userId: string): WrongQuestionRecord[] {
    if (!userId) return [];
    return safeGetLocal<WrongQuestionRecord[]>(
      `${STORAGE_KEYS.WRONG_RECORDS}_${userId}`,
      []
    );
  },

  saveUserWrongRecords(userId: string, records: WrongQuestionRecord[]): void {
    if (!userId) return;
    safeSetLocal(`${STORAGE_KEYS.WRONG_RECORDS}_${userId}`, records);
    if (supabase && records.length > 0) {
      const dbRecords = records.map((r) => ({
        id: `${userId}_${r.questionId}`,
        user_id: userId,
        question_id: r.questionId,
        wrong_count: r.wrongCount,
        correct_streak: r.correctStreak,
        last_attempted_at: r.lastAttemptedAt,
        mastered: r.mastered,
      }));
      supabase.from('wrong_records').upsert(dbRecords, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('[Supabase] sync wrong_records error:', error.message);
      });
    }
  },

  // Sync from Cloud Database on startup
  async syncFromCloud(): Promise<{
    usersCount: number;
    examsCount: number;
    questionsCount: number;
    attemptsCount: number;
  } | null> {
    if (!supabase) return null;
    try {
      // 1. Fetch Users
      const { data: cloudUsers } = await supabase.from('users').select('*');
      if (cloudUsers && cloudUsers.length > 0) {
        const mappedUsers: UserAccount[] = cloudUsers.map((u: any) => ({
          id: u.id,
          fullName: u.full_name,
          username: u.username,
          email: u.email,
          passwordSalt: u.password_salt,
          passwordDigest: u.password_digest,
          requiresPasswordSetup: u.requires_password_setup,
          role: u.role,
          className: u.class_name,
          schoolName: u.school_name,
          academicYear: u.academic_year,
          joinedAt: u.joined_at,
          status: u.status,
          preferences: u.preferences,
        }));
        safeSetLocal(STORAGE_KEYS.USERS, mappedUsers);
      } else {
        this.saveUsers(this.getUsers());
      }

      // 2. Fetch Attempts
      const { data: cloudAttempts } = await supabase.from('exam_attempts').select('*');
      if (cloudAttempts && cloudAttempts.length > 0) {
        const mappedAttempts: ExamAttempt[] = cloudAttempts.map((a: any) => ({
          id: a.id,
          examId: a.exam_id,
          examCode: a.exam_code,
          examTitle: a.exam_title,
          userId: a.user_id,
          startedAt: a.started_at,
          completedAt: a.completed_at,
          durationSeconds: a.duration_seconds,
          totalQuestions: a.total_questions,
          correctCount: a.correct_count,
          wrongCount: a.wrong_count,
          unansweredCount: a.unanswered_count,
          score: Number(a.score),
          maxScore: Number(a.max_score),
          accuracyPercent: Number(a.accuracy_percent),
          answers: a.answers || {},
          flaggedQuestions: a.flagged_questions || [],
        }));
        safeSetLocal(STORAGE_KEYS.ATTEMPTS, mappedAttempts);
      }

      // 3. Fetch Questions
      const { data: cloudQuestions } = await supabase.from('questions').select('*');
      if (cloudQuestions && cloudQuestions.length > 0) {
        const mappedQuestions: Question[] = cloudQuestions.map((q: any) => ({
          id: q.id,
          content: q.content,
          passage: q.passage,
          passageSource: q.passage_source,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          relatedKnowledge: q.related_knowledge,
          memoryTip: q.memory_tip,
          topic: q.topic,
          difficulty: q.difficulty,
          sourceNote: q.source_note,
        }));
        safeSetLocal(STORAGE_KEYS.QUESTIONS, mappedQuestions);
      } else {
        this.saveQuestions(this.getQuestions());
      }

      // 4. Fetch Exams
      const { data: cloudExams } = await supabase.from('exams').select('*');
      if (cloudExams && cloudExams.length > 0) {
        const mappedExams: Exam[] = cloudExams.map((e: any) => ({
          id: e.id,
          code: e.code,
          title: e.title,
          description: e.description,
          coverImage: e.cover_image,
          questionIds: e.question_ids,
          durationMinutes: e.duration_minutes,
          maxScore: Number(e.max_score),
          difficulty: e.difficulty,
          topic: e.topic,
          categoryType: e.category_type,
          instructions: e.instructions,
          knowledgeOutline: e.knowledge_outline,
          createdAt: e.created_at,
        }));
        safeSetLocal(STORAGE_KEYS.EXAMS, mappedExams);
      } else {
        this.saveExams(this.getExams());
      }

      return {
        usersCount: cloudUsers?.length || 0,
        examsCount: cloudExams?.length || 0,
        questionsCount: cloudQuestions?.length || 0,
        attemptsCount: cloudAttempts?.length || 0,
      };
    } catch (err) {
      console.warn('[Supabase] Initial sync failed:', err);
      return null;
    }
  },

  // Demo Mode
  isDemoModeEnabled(userId: string): boolean {
    if (!userId) return false;
    return safeGetLocal<boolean>(
      `${STORAGE_KEYS.DEMO_MODE_ENABLED}_${userId}`,
      false
    );
  },

  setDemoModeEnabled(userId: string, enabled: boolean): void {
    if (!userId) return;
    safeSetLocal(`${STORAGE_KEYS.DEMO_MODE_ENABLED}_${userId}`, enabled);
  },

  getDemoAttempts(userId: string): ExamAttempt[] {
    const questions = this.getQuestions();
    const qMap = new Map(questions.map((q) => [q.id, q]));
    const exams = this.getExams();

    const buildDemoAttempt = (
      exam: Exam,
      idSuffix: string,
      completedAt: string,
      durationSeconds: number,
      targetCorrectRatio: number
    ): ExamAttempt => {
      const answers: Record<string, number> = {};
      let correctCount = 0;
      let wrongCount = 0;
      const total = exam.questionIds.length;
      const targetCorrect = Math.round(total * targetCorrectRatio);

      exam.questionIds.forEach((qId, idx) => {
        const q = qMap.get(qId);
        if (!q) return;
        if (idx < targetCorrect) {
          answers[qId] = q.correctAnswer;
          correctCount++;
        } else {
          answers[qId] = (q.correctAnswer + 1) % 4;
          wrongCount++;
        }
      });

      const score =
        Math.round((correctCount / total) * exam.maxScore * 10) / 10;
      const accuracyPercent = Math.round((correctCount / total) * 1000) / 10;

      return {
        id: `DEMO-ATTEMPT-${idSuffix}`,
        examId: exam.id,
        examCode: exam.code,
        examTitle: `${exam.title} [DEMO]`,
        userId,
        startedAt: completedAt,
        completedAt,
        durationSeconds,
        totalQuestions: total,
        correctCount,
        wrongCount,
        unansweredCount: 0,
        score,
        maxScore: exam.maxScore,
        accuracyPercent,
        answers,
        flaggedQuestions: [],
        isDemoData: true,
      };
    };

    return [
      buildDemoAttempt(exams[4] || exams[0], '01', '2026-10-02T14:30:00.000Z', 1620, 0.68),
      buildDemoAttempt(exams[2] || exams[0], '02', '2026-10-09T15:10:00.000Z', 1750, 0.76),
      buildDemoAttempt(exams[3] || exams[0], '03', '2026-10-16T09:20:00.000Z', 1680, 0.80),
      buildDemoAttempt(exams[0], '04', '2026-10-24T20:00:00.000Z', 2140, 0.87),
    ].reverse();
  },

  getDemoWrongRecords(): WrongQuestionRecord[] {
    return [
      {
        questionId: 'Q017',
        wrongCount: 2,
        correctStreak: 0,
        lastAttemptedAt: '2026-10-24T20:00:00.000Z',
        mastered: false,
        isDemoData: true,
      },
      {
        questionId: 'Q038',
        wrongCount: 1,
        correctStreak: 1,
        lastAttemptedAt: '2026-10-24T20:00:00.000Z',
        mastered: false,
        isDemoData: true,
      },
      {
        questionId: 'Q069',
        wrongCount: 2,
        correctStreak: 0,
        lastAttemptedAt: '2026-10-24T20:00:00.000Z',
        mastered: false,
        isDemoData: true,
      },
    ];
  },
};
