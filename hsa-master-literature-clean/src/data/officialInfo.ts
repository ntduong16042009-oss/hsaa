import { QuestionTopic, DifficultyLevel } from '../types';

export const OFFICIAL_PRODUCT_INFO = {
  category: 'SẢN PHẨM HỌC TẬP SỐ',
  subject: 'MÔN NGỮ VĂN',
  productName: 'HSA MASTER',
  tagline: 'KHÁM PHÁ TRI THỨC – RÈN LUYỆN TƯ DUY – CHINH PHỤC THỬ THÁCH',
  academicYear: '2026–2027',
  subjectTeacherRole: 'Giáo viên bộ môn',
  subjectTeacherName: 'Võ Thị Mỹ Ngà',
  className: '12A03',
  cohort: '2024–2027',
  schoolName: 'Trường THPT Yên Lãng',
  students: ['Nguyễn Khắc Lợi', 'Nguyễn Thị Thu Huyền'] as const,
} as const;

export const GENERATED_IMAGES = {
  introHero: '/images/intro_exhibition_hero_1794368033717.jpg',
  homeHero: '/images/home_hero_academic_1794368035198.jpg',
  examCover: '/images/exam_cover_literature_1794368034775.jpg',
} as const;

export const ALL_QUESTION_TOPICS: QuestionTopic[] = [
  'Đọc hiểu văn bản',
  'Tiếng Việt',
  'Ngữ nghĩa',
  'Biện pháp tu từ',
  'Phong cách ngôn ngữ',
  'Kiến thức văn học',
  'Phân tích văn bản',
  'Suy luận',
  'Đánh giá và liên hệ',
  'Đọc hiểu nâng cao',
];

export const ALL_DIFFICULTIES: DifficultyLevel[] = [
  'Dễ',
  'Trung bình',
  'Khó',
  'Vận dụng cao',
];
