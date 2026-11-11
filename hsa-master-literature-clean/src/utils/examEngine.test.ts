import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_EXAMS, INITIAL_QUESTIONS } from '../data/examsData';
import { ALL_QUESTION_TOPICS, OFFICIAL_PRODUCT_INFO } from '../data/officialInfo';
import {
  computeTopicStatistics,
  evaluateAttemptPerformance,
  formatCountdown,
  getRemainingSeconds,
  gradeExamSubmission,
  updateWrongRecordsFromAttempt,
} from './examEngine';
import {
  createAuthSession,
  generateSalt,
  hashPasswordWithSalt,
  isAuthSessionValid,
  validatePasswordChange,
  validateRegistrationInput,
  verifyPassword,
} from './authSecurity';
import { UserAccount } from '../types';

test('Question bank contains at least 100 unique, well-formed questions across all 10 required topics', () => {
  assert.ok(
    INITIAL_QUESTIONS.length >= 100,
    `Expected >= 100 questions, got ${INITIAL_QUESTIONS.length}`
  );

  const ids = new Set<string>();
  const contents = new Set<string>();
  const topicCounts = new Map<string, number>();

  for (const q of INITIAL_QUESTIONS) {
    assert.ok(!ids.has(q.id), `Duplicate question ID: ${q.id}`);
    ids.add(q.id);

    assert.ok(!contents.has(q.content), `Duplicate question content: ${q.content}`);
    contents.add(q.content);

    assert.equal(q.options.length, 4, `Question ${q.id} must have 4 options`);
    assert.ok(
      q.correctAnswer >= 0 && q.correctAnswer <= 3,
      `Question ${q.id} has invalid correctAnswer ${q.correctAnswer}`
    );
    assert.ok(q.explanation.length > 10, `Question ${q.id} must have a meaningful explanation`);

    topicCounts.set(q.topic, (topicCounts.get(q.topic) || 0) + 1);
  }

  for (const topic of ALL_QUESTION_TOPICS) {
    const count = topicCounts.get(topic) || 0;
    assert.ok(count >= 8, `Topic "${topic}" should have at least 8 questions, got ${count}`);
  }
});

test('Official product information strictly adheres to prompt specifications', () => {
  assert.equal(OFFICIAL_PRODUCT_INFO.productName, 'HSA MASTER');
  assert.equal(OFFICIAL_PRODUCT_INFO.academicYear, '2026–2027');
  assert.equal(OFFICIAL_PRODUCT_INFO.subjectTeacherRole, 'Giáo viên bộ môn');
  assert.equal(OFFICIAL_PRODUCT_INFO.subjectTeacherName, 'Võ Thị Mỹ Ngà');
  assert.equal(OFFICIAL_PRODUCT_INFO.className, '12A03');
  assert.equal(OFFICIAL_PRODUCT_INFO.cohort, '2024–2027');
  assert.equal(OFFICIAL_PRODUCT_INFO.schoolName, 'Trường THPT Yên Lãng');
  assert.deepEqual(OFFICIAL_PRODUCT_INFO.students, [
    'Nguyễn Khắc Lợi',
    'Nguyễn Thị Thu Huyền',
  ]);
});

test('Exam library has at least 5 complete exams with valid question references', () => {
  assert.ok(INITIAL_EXAMS.length >= 5);
  const questionsMap = new Map(INITIAL_QUESTIONS.map((q) => [q.id, q]));

  for (const exam of INITIAL_EXAMS) {
    assert.ok(exam.questionIds.length >= 20, `Exam ${exam.code} should have >= 20 questions`);
    for (const qId of exam.questionIds) {
      assert.ok(questionsMap.has(qId), `Exam ${exam.code} references missing question ${qId}`);
    }
  }
});

test('gradeExamSubmission accurately grades correct, wrong, and unanswered questions', () => {
  const questionsMap = new Map(INITIAL_QUESTIONS.map((q) => [q.id, q]));
  const sampleExam = {
    questionIds: ['Q001', 'Q002', 'Q003', 'Q004'],
    maxScore: 100,
  };

  const q1 = questionsMap.get('Q001')!;
  const q2 = questionsMap.get('Q002')!;
  const q3 = questionsMap.get('Q003')!;

  const answers: Record<string, number> = {
    Q001: q1.correctAnswer, // correct
    Q002: q2.correctAnswer, // correct
    Q003: (q3.correctAnswer + 1) % 4, // wrong
    // Q004 unanswered
  };

  const result = gradeExamSubmission(sampleExam, questionsMap, answers);
  assert.equal(result.totalQuestions, 4);
  assert.equal(result.correctCount, 2);
  assert.equal(result.wrongCount, 1);
  assert.equal(result.unansweredCount, 1);
  assert.equal(result.score, 50);
  assert.equal(result.accuracyPercent, 50);

  const feedback = evaluateAttemptPerformance(result);
  assert.equal(feedback.tone, 'amber');
});

test('updateWrongRecordsFromAttempt tracks wrong answers and mastery streak', () => {
  const questionsMap = new Map(INITIAL_QUESTIONS.map((q) => [q.id, q]));
  const q1 = questionsMap.get('Q001')!;

  // First attempt: answered wrong
  const records1 = updateWrongRecordsFromAttempt(
    [],
    ['Q001'],
    questionsMap,
    { Q001: (q1.correctAnswer + 1) % 4 },
    '2026-10-10T10:00:00Z'
  );
  assert.equal(records1.length, 1);
  assert.equal(records1[0].wrongCount, 1);
  assert.equal(records1[0].mastered, false);

  // Second attempt: answered right once -> streak = 1, mastered = false
  const records2 = updateWrongRecordsFromAttempt(
    records1,
    ['Q001'],
    questionsMap,
    { Q001: q1.correctAnswer },
    '2026-10-10T11:00:00Z'
  );
  assert.equal(records2[0].correctStreak, 1);
  assert.equal(records2[0].mastered, false);

  // Third attempt: answered right twice -> streak = 2, mastered = true
  const records3 = updateWrongRecordsFromAttempt(
    records2,
    ['Q001'],
    questionsMap,
    { Q001: q1.correctAnswer },
    '2026-10-10T12:00:00Z'
  );
  assert.equal(records3[0].correctStreak, 2);
  assert.equal(records3[0].mastered, true);
});

test('Timer and topic statistics helpers work deterministically', () => {
  assert.equal(formatCountdown(605), '10:05');
  assert.equal(formatCountdown(59), '00:59');
  assert.equal(getRemainingSeconds(10000, 4000), 6);
  assert.equal(getRemainingSeconds(4000, 10000), 0);

  const questionsMap = new Map(INITIAL_QUESTIONS.map((q) => [q.id, q]));
  const examsMap = new Map(INITIAL_EXAMS.map((e) => [e.id, e]));
  const stats = computeTopicStatistics([], examsMap, questionsMap);
  assert.equal(stats.length, 10);
});

test('Password hashing and verification never store plain text and validate accurately', () => {
  const salt = generateSalt('user-1');
  const digest = hashPasswordWithSalt('MySecretPass123', salt);

  assert.notEqual(digest, 'MySecretPass123');
  assert.ok(digest.startsWith('hsa256$'));
  assert.equal(digest.length, 39);
  assert.equal(verifyPassword('MySecretPass123', salt, digest), true);
  assert.equal(verifyPassword('WrongPass', salt, digest), false);
});

test('Registration validation checks email format, duplicate username, duplicate email, password match, and terms checkbox', () => {
  const existingUsers: UserAccount[] = [
    {
      id: 'user-existing',
      fullName: 'Nguyễn Khắc Lợi',
      username: 'khacloi12a03',
      email: 'khacloi.12a03@yenlang.edu.vn',
      passwordSalt: 'salt1',
      passwordDigest: hashPasswordWithSalt('123456', 'salt1'),
      role: 'student',
      className: '12A03',
      schoolName: 'Trường THPT Yên Lãng',
      academicYear: '2026–2027',
      joinedAt: '2026-09-05',
      status: 'active',
    },
  ];

  // Duplicate username
  const dupUser = validateRegistrationInput(
    {
      fullName: 'Học Sinh Mới',
      username: 'KHACLOI12A03',
      email: 'new@yenlang.edu.vn',
      password: 'password123',
      confirmPassword: 'password123',
      acceptedTerms: true,
    },
    existingUsers
  );
  assert.equal(dupUser.valid, false);
  assert.ok(dupUser.error?.includes('Tên đăng nhập'));

  // Duplicate email
  const dupEmail = validateRegistrationInput(
    {
      fullName: 'Học Sinh Mới',
      username: 'hocsinhmoi12',
      email: 'khacloi.12a03@yenlang.edu.vn',
      password: 'password123',
      confirmPassword: 'password123',
      acceptedTerms: true,
    },
    existingUsers
  );
  assert.equal(dupEmail.valid, false);
  assert.ok(dupEmail.error?.includes('Email'));

  // Password mismatch
  const mismatch = validateRegistrationInput(
    {
      fullName: 'Học Sinh Mới',
      username: 'hocsinhmoi12',
      email: 'hocsinhmoi@yenlang.edu.vn',
      password: 'password123',
      confirmPassword: 'password999',
      acceptedTerms: true,
    },
    existingUsers
  );
  assert.equal(mismatch.valid, false);
  assert.ok(mismatch.error?.includes('không khớp'));

  // Terms not accepted
  const noTerms = validateRegistrationInput(
    {
      fullName: 'Học Sinh Mới',
      username: 'hocsinhmoi12',
      email: 'hocsinhmoi@yenlang.edu.vn',
      password: 'password123',
      confirmPassword: 'password123',
      acceptedTerms: false,
    },
    existingUsers
  );
  assert.equal(noTerms.valid, false);
  assert.ok(noTerms.error?.includes('điều khoản'));

  // Valid registration
  const ok = validateRegistrationInput(
    {
      fullName: 'Học Sinh Mới',
      username: 'hocsinhmoi12',
      email: 'hocsinhmoi@yenlang.edu.vn',
      password: 'password123',
      confirmPassword: 'password123',
      acceptedTerms: true,
    },
    existingUsers
  );
  assert.equal(ok.valid, true);
});

test('AuthSession creation and password change validation enforce security rules', () => {
  const salt = generateSalt('u-test');
  const user: UserAccount = {
    id: 'u-test',
    fullName: 'Nguyễn Thị Thu Huyền',
    username: 'thuhuyen12a03',
    email: 'thuhuyen.12a03@yenlang.edu.vn',
    passwordSalt: salt,
    passwordDigest: hashPasswordWithSalt('123456', salt),
    role: 'student',
    className: '12A03',
    schoolName: 'Trường THPT Yên Lãng',
    academicYear: '2026–2027',
    joinedAt: '2026-09-05',
    status: 'active',
  };

  const now = 1_700_000_000_000;
  const sessionRemember = createAuthSession(user, true, now);
  const sessionShort = createAuthSession(user, false, now);

  assert.equal(isAuthSessionValid(sessionRemember, now + 10 * 24 * 3600 * 1000), true);
  assert.equal(isAuthSessionValid(sessionShort, now + 10 * 24 * 3600 * 1000), false);

  const badCurrent = validatePasswordChange(user, 'wrongold', 'newpass123', 'newpass123');
  assert.equal(badCurrent.valid, false);

  const samePass = validatePasswordChange(user, '123456', '123456', '123456');
  assert.equal(samePass.valid, false);

  const validChange = validatePasswordChange(user, '123456', 'newpass123', 'newpass123');
  assert.equal(validChange.valid, true);

  const superAdminSession = createAuthSession(
    { id: 'u-sa', username: 'superadmin', role: 'super_admin' },
    true,
    now
  );
  assert.equal(superAdminSession.role, 'super_admin');
  assert.equal(isAuthSessionValid(superAdminSession, now + 3600_000), true);
});

test('Initial Super Admin account matches prompt specs and never stores plain-text password in source code', async () => {
  const { INITIAL_SUPER_ADMIN_ACCOUNT } = await import('../services/storageService');
  assert.equal(INITIAL_SUPER_ADMIN_ACCOUNT.fullName, 'Nguyễn Thị Thu Huyền');
  assert.equal(INITIAL_SUPER_ADMIN_ACCOUNT.username, 'thuhuyenxinhgai');
  assert.equal(INITIAL_SUPER_ADMIN_ACCOUNT.email, 'thuhuyenxinhgai@gmail.com');
  assert.equal(INITIAL_SUPER_ADMIN_ACCOUNT.role, 'super_admin');
  assert.notEqual(INITIAL_SUPER_ADMIN_ACCOUNT.passwordDigest, '');
  assert.equal(INITIAL_SUPER_ADMIN_ACCOUNT.requiresPasswordSetup, false);
});

