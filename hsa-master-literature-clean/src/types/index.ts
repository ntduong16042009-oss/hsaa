export type QuestionTopic =
  | 'Đọc hiểu văn bản'
  | 'Tiếng Việt'
  | 'Ngữ nghĩa'
  | 'Biện pháp tu từ'
  | 'Phong cách ngôn ngữ'
  | 'Kiến thức văn học'
  | 'Phân tích văn bản'
  | 'Suy luận'
  | 'Đánh giá và liên hệ'
  | 'Đọc hiểu nâng cao';

export type DifficultyLevel = 'Dễ' | 'Trung bình' | 'Khó' | 'Vận dụng cao';

export interface Question {
  id: string;
  content: string;
  passage?: string;
  passageSource?: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, or 3
  explanation: string;
  relatedKnowledge: string;
  memoryTip: string;
  topic: QuestionTopic;
  difficulty: DifficultyLevel;
  sourceNote: string;
}

export type ExamCategoryType = 'Đề mô phỏng cấu trúc HSA' | 'Đề luyện tập tự biên soạn';

export interface Exam {
  id: string;
  code: string;
  title: string;
  description: string;
  coverImage: string;
  questionIds: string[];
  durationMinutes: number;
  maxScore: number;
  difficulty: DifficultyLevel;
  topic: QuestionTopic | 'Tổng hợp toàn diện';
  categoryType: ExamCategoryType;
  isNew?: boolean;
  knowledgeOutline: string[];
  instructions: string[];
  createdAt: string;
}

export interface ActiveExamSession {
  examId: string;
  examCode: string;
  examTitle: string;
  userId: string;
  startedAt: number; // epoch ms
  endsAt: number; // epoch ms
  currentQuestionIndex: number;
  answers: Record<string, number>; // questionId -> optionIndex
  flaggedQuestions: string[]; // questionId[]
  lastSavedAt: number; // epoch ms
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examCode: string;
  examTitle: string;
  userId: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  score: number;
  maxScore: number;
  accuracyPercent: number;
  answers: Record<string, number>; // questionId -> selected option index
  flaggedQuestions: string[];
  isDemoData?: boolean;
}

export interface WrongQuestionRecord {
  questionId: string;
  wrongCount: number;
  correctStreak: number;
  lastAttemptedAt: string;
  mastered: boolean;
  isDemoData?: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize?: 'normal' | 'large';
  autoCheckPractice?: boolean;
}

export type UserRole = 'student' | 'admin' | 'super_admin';

export interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordSalt: string;
  passwordDigest: string; // One-way salted hash digest - NEVER plain text; empty string if awaiting first-time password setup
  requiresPasswordSetup?: boolean; // True when initialized without a password (first-time setup flow)
  role: UserRole;
  className: string;
  schoolName: string;
  academicYear: string;
  joinedAt: string;
  status: 'active' | 'locked';
  avatarUrl?: string;
  preferences?: UserPreferences;
}

export interface AuthSession {
  token: string;
  userId: string;
  username: string;
  role: UserRole;
  issuedAt: number;
  expiresAt: number;
  rememberMe: boolean;
}

export interface LoginHistoryEntry {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  loggedInAt: string;
}

export type AppView =
  | 'intro'
  | 'home'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'exams'
  | 'exam-detail'
  | 'exam-room'
  | 'exam-result'
  | 'wrong-analysis'
  | 'question-bank'
  | 'practice'
  | 'wrong-practice'
  | 'history'
  | 'statistics'
  | 'profile'
  | 'about'
  | 'admin';
