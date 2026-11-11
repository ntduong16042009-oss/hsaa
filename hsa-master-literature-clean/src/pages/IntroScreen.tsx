import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, GraduationCap, Compass } from 'lucide-react';
import { AppView } from '../types';
import { GENERATED_IMAGES, OFFICIAL_PRODUCT_INFO } from '../data/officialInfo';
import { ResilientImage } from '../components/ResilientImage';

interface IntroScreenProps {
  onNavigate: (view: AppView) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#10243A] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Subtle ambient illumination */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background:
            'radial-gradient(circle at 18% 22%, rgba(214, 185, 120, 0.22), transparent 45%), radial-gradient(circle at 82% 75%, rgba(37, 99, 235, 0.25), transparent 50%)',
        }}
      />

      {/* Top exhibition header following 3-zone Top Bar Contract */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between gap-8 border-b border-white/10">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="font-display font-extrabold tracking-tight text-lg text-white whitespace-nowrap shrink-0"
        >
          HSA MASTER
        </a>

        <nav
          aria-label="Điều hướng triển lãm"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Trang chủ
          </a>
          <a
            href="#exams"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('exams');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Luyện thi
          </a>
          <a
            href="#question-bank"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('question-bank');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Ngân hàng câu hỏi
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('about');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Giới thiệu
          </a>
        </nav>

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="px-4 py-2 text-xs font-semibold text-[#10243A] bg-[#D6B978] hover:bg-[#e2c98d] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Vào Trang Chủ
        </button>
      </header>

      {/* Main exhibition stage */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left column: Academic exhibition typography & official dossier */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#D6B978]">
              {OFFICIAL_PRODUCT_INFO.category} · {OFFICIAL_PRODUCT_INFO.subject}
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              {OFFICIAL_PRODUCT_INFO.productName}
            </h1>
            <p className="text-sm sm:text-base font-semibold tracking-wider text-sky-200 pt-1">
              {OFFICIAL_PRODUCT_INFO.tagline}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Nền tảng học tập số môn Ngữ văn tích hợp luyện tập chuyên đề, phòng thi thử trực tuyến,
            phân tích câu sai chuyên sâu và đánh giá năng lực đọc hiểu – tư duy ngôn ngữ dành cho học
            sinh trung học phổ thông.
          </p>

          {/* Official Institutional & Creator Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/15">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <div className="text-xs text-[#D6B978] font-medium">
                THÔNG TIN BỘ MÔN & NĂM HỌC
              </div>
              <div className="space-y-1.5 text-sm text-slate-200">
                <p>
                  <span className="text-slate-400">Sản phẩm:</span>{' '}
                  <strong className="font-semibold text-white">
                    {OFFICIAL_PRODUCT_INFO.productName} ({OFFICIAL_PRODUCT_INFO.subject})
                  </strong>
                </p>
                <p>
                  <span className="text-slate-400">Năm học:</span>{' '}
                  <strong className="font-semibold text-white font-mono tabular-nums">
                    {OFFICIAL_PRODUCT_INFO.academicYear}
                  </strong>
                </p>
                <p>
                  <span className="text-slate-400">Giáo viên bộ môn:</span>{' '}
                  <strong className="font-semibold text-[#D6B978]">
                    {OFFICIAL_PRODUCT_INFO.subjectTeacherName}
                  </strong>
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#D6B978] font-medium">
                  HỌC SINH THỰC HIỆN
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-[#D6B978] shrink-0" />
                    <span className="text-base font-bold tracking-wide text-white">
                      1. NGUYỄN KHẮC LỢI
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-[#D6B978] shrink-0" />
                    <span className="text-base font-bold tracking-wide text-white">
                      2. NGUYỄN THỊ THU HUYỀN
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-300 pt-2 border-t border-white/10 space-y-1">
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

          {/* Primary CTA actions */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-6 py-3.5 bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-950/50 flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>KHÁM PHÁ SẢN PHẨM</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('exams')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-[#D6B978]" />
              <span>Vào Thư Viện Đề Thi</span>
            </button>
          </div>
        </motion.div>

        {/* Right column: Editorial Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0B1524]">
            <div className="aspect-[16/10] sm:aspect-[4/3] w-full relative">
              <ResilientImage
                src={GENERATED_IMAGES.introHero}
                alt="Không gian học thuật Ngữ văn HSA MASTER - Sách mở, bút mực và thư viện tri thức"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10243A] via-[#10243A]/35 to-transparent" />
            </div>

            <div className="p-5 sm:p-6 bg-[#10243A]/95 border-t border-white/10 space-y-3">
              <div className="text-xs text-[#D6B978] font-medium">
                TRIỂN LÃM HỌC THUẬT SỐ · MÔN NGỮ VĂN
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                Kết hợp tinh hoa văn bản văn học Việt Nam với công nghệ đánh giá năng lực trực tuyến:
                105 câu hỏi biên soạn công phu, 10 chuyên đề trọng tâm và phòng thi thử chuẩn xác.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10 text-center">
                <div>
                  <div className="text-lg font-bold font-mono tabular-nums text-white">06</div>
                  <div className="text-[11px] text-slate-400">Đề thi toàn diện</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono tabular-nums text-[#D6B978]">105</div>
                  <div className="text-[11px] text-slate-400">Câu hỏi phân loại</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono tabular-nums text-white">10</div>
                  <div className="text-[11px] text-slate-400">Chuyên đề cốt lõi</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom academic exhibition footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span>
          {OFFICIAL_PRODUCT_INFO.productName} – {OFFICIAL_PRODUCT_INFO.category}{' '}
          {OFFICIAL_PRODUCT_INFO.subject} · Năm học {OFFICIAL_PRODUCT_INFO.academicYear}
        </span>
        <span>
          Giáo viên bộ môn: {OFFICIAL_PRODUCT_INFO.subjectTeacherName} · Học sinh thực hiện:{' '}
          {OFFICIAL_PRODUCT_INFO.students.join(' – ')} (Lớp {OFFICIAL_PRODUCT_INFO.className} · Khóa{' '}
          {OFFICIAL_PRODUCT_INFO.cohort} · {OFFICIAL_PRODUCT_INFO.schoolName})
        </span>
      </footer>
    </div>
  );
};
