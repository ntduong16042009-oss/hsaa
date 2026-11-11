import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers,
  Lightbulb,
  Sparkles,
  Target,
} from 'lucide-react';
import { AppView } from '../types';
import { GENERATED_IMAGES, OFFICIAL_PRODUCT_INFO } from '../data/officialInfo';
import { ResilientImage } from '../components/ResilientImage';

interface AboutProductPageProps {
  onNavigate: (view: AppView) => void;
}

export const AboutProductPage: React.FC<AboutProductPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pb-10">
      {/* Official Hero Dossier */}
      <section className="bg-[#10243A] text-white rounded-2xl overflow-hidden border border-slate-800">
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-widest text-[#D6B978]">
                GIỚI THIỆU SẢN PHẨM HỌC TẬP SỐ
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {OFFICIAL_PRODUCT_INFO.category} – {OFFICIAL_PRODUCT_INFO.subject}:{' '}
                <span className="text-[#D6B978]">{OFFICIAL_PRODUCT_INFO.productName}</span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-sky-200 tracking-wide">
                {OFFICIAL_PRODUCT_INFO.tagline}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/15 text-sm">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
                <div className="text-xs font-semibold text-[#D6B978]">
                  THÔNG TIN CHÍNH THỨC
                </div>
                <p>
                  <span className="text-slate-400">Sản phẩm:</span>{' '}
                  <strong className="text-white">
                    {OFFICIAL_PRODUCT_INFO.productName} ({OFFICIAL_PRODUCT_INFO.subject})
                  </strong>
                </p>
                <p>
                  <span className="text-slate-400">Năm học:</span>{' '}
                  <strong className="font-mono">{OFFICIAL_PRODUCT_INFO.academicYear}</strong>
                </p>
                <p>
                  <span className="text-slate-400">Giáo viên bộ môn:</span>{' '}
                  <strong className="text-[#D6B978]">
                    {OFFICIAL_PRODUCT_INFO.subjectTeacherName}
                  </strong>
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#D6B978]">
                    HỌC SINH THỰC HIỆN
                  </div>
                  <div className="mt-2.5 space-y-2">
                    {OFFICIAL_PRODUCT_INFO.students.map((studentName, idx) => (
                      <div key={studentName} className="flex items-center gap-2.5">
                        <GraduationCap className="w-4 h-4 text-[#D6B978] shrink-0" />
                        <span className="font-bold text-white">
                          {idx + 1}. {studentName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-200 pt-2.5 border-t border-white/10 space-y-1">
                  <div>
                    <span className="text-slate-400">Lớp:</span>{' '}
                    <strong className="text-white">{OFFICIAL_PRODUCT_INFO.className}</strong>{' '}
                    <span className="text-slate-400">· Khóa:</span>{' '}
                    <strong className="font-mono text-white">{OFFICIAL_PRODUCT_INFO.cohort}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Trường:</span>{' '}
                    <strong className="text-white">{OFFICIAL_PRODUCT_INFO.schoolName}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('intro')}
                className="px-4 py-2.5 bg-[#D6B978] hover:bg-[#e3c789] text-[#10243A] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Mở lại màn hình Triển lãm Giới thiệu (Intro Screen)
              </button>
              <button
                type="button"
                onClick={() => onNavigate('exams')}
                className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Trải nghiệm Phòng thi trực tuyến
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-white/15">
              <ResilientImage
                src={GENERATED_IMAGES.introHero}
                alt="Hình ảnh biểu trưng sản phẩm học tập số môn Ngữ văn HSA MASTER"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Required Content Sections per Section XVIII */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Ý tưởng xây dựng */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#10243A]/5 dark:bg-white/5 text-[#2563EB] flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white">
            1. Ý Tưởng Xây Dựng
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Ứng dụng công nghệ để hỗ trợ học sinh học tập và rèn luyện môn Ngữ văn thông qua môi
            trường trực tuyến. Thay vì chỉ tiếp cận văn bản trên trang giấy tĩnh, học sinh có thể
            tương tác trực tiếp với hệ thống câu hỏi phân loại, làm bài thi thử có kiểm soát thời
            gian và nhận phản hồi giải thích tức thì.
          </p>
        </div>

        {/* 2. Mục tiêu */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#10243A]/5 dark:bg-white/5 text-[#16A34A] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white">
            2. Mục Tiêu Của Sản Phẩm
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {[
              'Tạo môi trường luyện tập thuận tiện.',
              'Hỗ trợ đánh giá năng lực.',
              'Tăng khả năng đọc hiểu.',
              'Rèn luyện tư duy phân tích.',
              'Giúp học sinh nhận biết điểm mạnh và nội dung cần cải thiện.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Ý nghĩa giáo dục */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#10243A]/5 dark:bg-white/5 text-[#D6B978] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white">
            3. Ý Nghĩa Giáo Dục
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Khuyến khích ứng dụng công nghệ trong giáo dục, nâng cao tính chủ động và khả năng tự
            học của học sinh. Sản phẩm góp phần lan tỏa tinh thần học tập tích cực, kết hợp hài hòa
            giữa vẻ đẹp nhân văn của bộ môn Ngữ văn với tư duy logic, khoa học của thời đại số.
          </p>
        </div>

        {/* 4. Định hướng phát triển */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#10243A]/5 dark:bg-white/5 text-[#2563EB] flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#10243A] dark:text-white">
            4. Định Hướng Phát Triển
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {[
              'Mở rộng ngân hàng câu hỏi.',
              'Bổ sung đề luyện tập.',
              'Nâng cao hệ thống thống kê.',
              'Tích hợp công nghệ hỗ trợ học tập.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Summary Banner */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#10243A] text-[#D6B978] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-base text-[#10243A] dark:text-white">
              {OFFICIAL_PRODUCT_INFO.productName} – {OFFICIAL_PRODUCT_INFO.schoolName}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Năm học {OFFICIAL_PRODUCT_INFO.academicYear} · Giáo viên bộ môn:{' '}
              {OFFICIAL_PRODUCT_INFO.subjectTeacherName} · Học sinh thực hiện:{' '}
              {OFFICIAL_PRODUCT_INFO.students.join(' – ')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
