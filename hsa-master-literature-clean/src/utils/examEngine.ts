import {
  Exam,
  ExamAttempt,
  Question,
  QuestionTopic,
  WrongQuestionRecord,
} from '../types';
import { ALL_QUESTION_TOPICS } from '../data/officialInfo';

export interface GradeResult {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  score: number;
  maxScore: number;
  accuracyPercent: number;
}

/**
 * Pure grading function: computes score, correct/wrong/unanswered counts, and accuracy
 * strictly from the exam configuration and question bank.
 */
export function gradeExamSubmission(
  exam: Pick<Exam, 'questionIds' | 'maxScore'>,
  questionsMap: Map<string, Question>,
  answers: Record<string, number>
): GradeResult {
  const totalQuestions = exam.questionIds.length;
  if (totalQuestions === 0) {
    return {
      totalQuestions: 0,
      correctCount: 0,
      wrongCount: 0,
      unansweredCount: 0,
      score: 0,
      maxScore: exam.maxScore,
      accuracyPercent: 0,
    };
  }

  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  for (const qId of exam.questionIds) {
    const question = questionsMap.get(qId);
    const userSelected = answers[qId];

    if (userSelected === undefined || userSelected === null || userSelected < 0) {
      unansweredCount += 1;
    } else if (question && userSelected === question.correctAnswer) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }
  }

  const rawScore = (correctCount / totalQuestions) * exam.maxScore;
  const score = Math.round(rawScore * 10) / 10;
  const accuracyPercent = Math.round((correctCount / totalQuestions) * 1000) / 10;

  return {
    totalQuestions,
    correctCount,
    wrongCount,
    unansweredCount,
    score,
    maxScore: exam.maxScore,
    accuracyPercent,
  };
}

/**
 * Generates data-driven pedagogical feedback strictly based on actual exam performance.
 */
export function evaluateAttemptPerformance(result: GradeResult): {
  levelLabel: string;
  headline: string;
  detailedAdvice: string;
  tone: 'emerald' | 'blue' | 'amber' | 'red';
} {
  const { accuracyPercent, unansweredCount, wrongCount, totalQuestions } = result;

  if (accuracyPercent >= 85) {
    return {
      levelLabel: 'Năng lực Xuất sắc',
      headline: `Bạn đạt độ chính xác ${accuracyPercent}% (${result.correctCount}/${totalQuestions} câu đúng).`,
      detailedAdvice:
        unansweredCount > 0
          ? `Bạn nắm rất vững kiến thức cốt lõi và kỹ năng đọc hiểu nâng cao, tuy nhiên vẫn còn ${unansweredCount} câu bỏ trống. Hãy phân bổ thời gian hợp lý hơn để tối ưu hóa điểm tuyệt đối.`
          : wrongCount > 0
          ? `Nền tảng kiến thức Ngữ văn và tư duy phân tích của bạn rất vững vàng. Hãy xem lại ${wrongCount} câu chưa chính xác ở bên dưới để hoàn thiện kỹ năng xử lý câu hỏi vận dụng cao.`
          : 'Bạn đã trả lời chính xác tuyệt đối toàn bộ câu hỏi trong đề. Hãy tiếp tục thử sức với các đề mức độ Vận dụng cao để duy trì phong độ.',
      tone: 'emerald',
    };
  }

  if (accuracyPercent >= 70) {
    return {
      levelLabel: 'Năng lực Khá – Vững',
      headline: `Bạn đạt độ chính xác ${accuracyPercent}% (${result.correctCount}/${totalQuestions} câu đúng).`,
      detailedAdvice: `Bạn đã nắm được kiến thức nền tảng môn Ngữ văn nhưng còn ${wrongCount} câu trả lời sai và ${unansweredCount} câu chưa trả lời. Hãy tập trung phân tích kỹ phần giải thích của ${wrongCount} câu sai để tránh nhầm lẫn ở các phương án nhiễu.`,
      tone: 'blue',
    };
  }

  if (accuracyPercent >= 50) {
    return {
      levelLabel: 'Đạt yêu cầu cơ bản – Cần củng cố',
      headline: `Bạn đạt độ chính xác ${accuracyPercent}% (${result.correctCount}/${totalQuestions} câu đúng).`,
      detailedAdvice: `Kết quả cho thấy bạn đã giải quyết được nhóm câu hỏi nhận biết - thông hiểu, nhưng còn lúng túng ở ${wrongCount} câu hỏi phân tích, suy luận và bỏ trống ${unansweredCount} câu. Hãy sử dụng chế độ “Luyện lại câu sai” và “Luyện theo chủ đề” để bổ sung kiến thức.`,
      tone: 'amber',
    };
  }

  return {
    levelLabel: 'Cần rèn luyện thêm nền tảng',
    headline: `Bạn đạt độ chính xác ${accuracyPercent}% (${result.correctCount}/${totalQuestions} câu đúng, ${wrongCount} câu sai, ${unansweredCount} câu bỏ trống).`,
    detailedAdvice:
      'Bạn cần ôn tập lại hệ thống kiến thức Tiếng Việt, Biện pháp tu từ và kỹ năng xác định thông tin trong ngữ liệu đọc hiểu. Hãy bắt đầu từ việc đọc kỹ lời giải chi tiết của từng câu sai ngay dưới đây và luyện tập từng câu theo chuyên đề.',
    tone: 'red',
  };
}

/**
 * Updates the wrong-question record bank based on a completed exam or practice attempt.
 */
export function updateWrongRecordsFromAttempt(
  existingRecords: WrongQuestionRecord[],
  questionIds: string[],
  questionsMap: Map<string, Question>,
  answers: Record<string, number>,
  timestampIso: string
): WrongQuestionRecord[] {
  const map = new Map<string, WrongQuestionRecord>();
  for (const rec of existingRecords) {
    map.set(rec.questionId, { ...rec });
  }

  for (const qId of questionIds) {
    const q = questionsMap.get(qId);
    if (!q) continue;
    const selected = answers[qId];
    if (selected === undefined || selected === null || selected < 0) {
      continue;
    }
    const isCorrect = selected === q.correctAnswer;

    const current = map.get(qId);
    if (!isCorrect) {
      // Answered wrong -> add/update in wrong questions bank
      if (current) {
        current.wrongCount += 1;
        current.correctStreak = 0;
        current.mastered = false;
        current.lastAttemptedAt = timestampIso;
      } else {
        map.set(qId, {
          questionId: qId,
          wrongCount: 1,
          correctStreak: 0,
          lastAttemptedAt: timestampIso,
          mastered: false,
        });
      }
    } else if (current) {
      // Previously wrong, now answered right!
      current.correctStreak += 1;
      current.lastAttemptedAt = timestampIso;
      if (current.correctStreak >= 2) {
        current.mastered = true;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    b.lastAttemptedAt.localeCompare(a.lastAttemptedAt)
  );
}

/**
 * Computes topic-by-topic accuracy statistics from real exam attempts.
 */
export interface TopicAccuracyStat {
  topic: QuestionTopic;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  accuracyPercent: number;
}

export function computeTopicStatistics(
  attempts: ExamAttempt[],
  examsMap: Map<string, Exam>,
  questionsMap: Map<string, Question>
): TopicAccuracyStat[] {
  const counts = new Map<QuestionTopic, { total: number; correct: number; wrong: number }>();
  for (const t of ALL_QUESTION_TOPICS) {
    counts.set(t, { total: 0, correct: 0, wrong: 0 });
  }

  for (const attempt of attempts) {
    const exam = examsMap.get(attempt.examId);
    const qIds = exam ? exam.questionIds : Object.keys(attempt.answers);
    for (const qId of qIds) {
      const q = questionsMap.get(qId);
      if (!q) continue;
      const bucket = counts.get(q.topic);
      if (!bucket) continue;
      bucket.total += 1;
      const ans = attempt.answers[qId];
      if (ans !== undefined && ans === q.correctAnswer) {
        bucket.correct += 1;
      } else {
        bucket.wrong += 1;
      }
    }
  }

  return ALL_QUESTION_TOPICS.map((topic) => {
    const b = counts.get(topic) || { total: 0, correct: 0, wrong: 0 };
    const accuracyPercent = b.total > 0 ? Math.round((b.correct / b.total) * 1000) / 10 : 0;
    return {
      topic,
      totalAnswered: b.total,
      correctCount: b.correct,
      wrongCount: b.wrong,
      accuracyPercent,
    };
  });
}

/**
 * Computes remaining seconds from an exam session's endsAt timestamp.
 */
export function getRemainingSeconds(endsAtMs: number, nowMs: number = Date.now()): number {
  const diff = Math.floor((endsAtMs - nowMs) / 1000);
  return Math.max(0, diff);
}

/**
 * Formats seconds into MM:SS with leading zeros.
 */
export function formatCountdown(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
