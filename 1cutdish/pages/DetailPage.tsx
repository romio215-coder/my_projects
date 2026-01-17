
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import RecipeTip from '../components/RecipeTip';
import { generateChefTip } from '../services/geminiService';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [comment, setComment] = useState("");
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  const fetchAiTip = async () => {
    setIsLoadingTip(true);
    const tip = await generateChefTip("김치볶음밥");
    setAiTip(tip);
    setIsLoadingTip(false);
  };

  useEffect(() => {
    fetchAiTip();
  }, []);

  return (
    <main className="flex-grow bg-[#fcfaf8] dark:bg-[#150f08]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 py-8 lg:py-12">
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-black text-text-light uppercase tracking-widest mb-10">
          <Link className="hover:text-primary transition-colors" to="/">HOME</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-primary transition-colors" href="#">ONE-SHOT</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-text-main dark:text-white">KIMCHI FRIED RICE</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          {/* Left Panel: Info & Sidebar */}
          <aside className="w-full lg:w-[360px] lg:sticky lg:top-24 space-y-8 order-2 lg:order-1">
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-xl shadow-orange-900/5 border border-[#f3eee7] dark:border-[#3e3429]">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Recipe Toon</span>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest">Completed</span>
              </div>
              
              <h1 className="text-4xl font-black leading-[1.1] text-text-main dark:text-white mb-4 tracking-tighter">
                오늘의 야식:<br/><span className="text-primary italic">김치볶음밥</span>
              </h1>
              
              <div className="flex items-center gap-3 text-sm font-bold text-text-light mb-8">
                <span>BY <strong className="text-text-main dark:text-gray-200">LEE WRITER</strong></span>
                <span className="opacity-30">|</span>
                <span>2023.10.27</span>
              </div>
              
              <p className="text-text-light dark:text-gray-400 leading-relaxed text-sm mb-10 font-medium">
                간단하게 만들 수 있는 매콤달콤한 김치볶음밥 레시피 만화입니다. 냉장고에 남은 재료로 10분 만에 완성할 수 있어요. 지친 자취생들을 위한 최고의 솔루션!
              </p>
              
              <div className="flex gap-4">
                <button className="flex-1 bg-[#f3eee7] hover:bg-[#e9e1d6] dark:bg-[#3e3429] dark:hover:bg-[#4a3e31] text-text-main dark:text-white py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">favorite</span> 찜하기
                </button>
                <button className="flex-1 bg-[#f3eee7] hover:bg-[#e9e1d6] dark:bg-[#3e3429] dark:hover:bg-[#4a3e31] text-text-main dark:text-white py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">share</span> 공유
                </button>
              </div>
            </div>

            {/* AI Chef Tip Section */}
            <div className="bg-gradient-to-br from-primary to-orange-600 p-8 rounded-3xl shadow-2xl shadow-primary/20 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 size-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <span className="material-symbols-outlined text-[120px]">restaurant</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest">
                    <span className="material-symbols-outlined">smart_toy</span>
                    <span>AI Chef Gemini Tip</span>
                  </div>
                  <button 
                    onClick={fetchAiTip}
                    disabled={isLoadingTip}
                    className="p-1 hover:rotate-180 transition-transform duration-500 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                  </button>
                </div>
                {isLoadingTip ? (
                   <div className="animate-pulse space-y-2">
                     <div className="h-4 bg-white/20 rounded w-full"></div>
                     <div className="h-4 bg-white/20 rounded w-2/3"></div>
                   </div>
                ) : (
                  <p className="text-white font-bold leading-relaxed italic">
                    "{aiTip}"
                  </p>
                )}
              </div>
            </div>

            <RecipeTip />

            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-[#f3eee7] dark:border-[#3e3429] flex gap-5 items-start">
              <div className="size-12 rounded-2xl bg-primary/20 bg-cover bg-center shrink-0 border-2 border-primary/30" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuATBHygIhzwCsTsyd6caSOyNiuDR1lnQ37jBRmlwOGlAyaWcAxGq2bBcuQWpYTsLL-pwdyUAVnGmBAEaMn2oz7fVt5CJ75tU9rOt_CG3oeeSB01i8055OBDhCHl26H0pyyj-v6xuhcAWOSzIbkwZPmMzqTUfhLOuk-zbRg7wKVh0gLe83bLzl2WRtTAn6DPlSOtWHvB_bonUyu8HfVuxCdAckMeoWKuN8ukAZCGEoxIOEqSfAWlaHDjGxA7eaUADeJI5Ludtj0wWA")'}}></div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Author's Note</p>
                <p className="text-sm text-text-light dark:text-gray-300 italic font-medium leading-relaxed">"배고픈 밤에 그렸습니다... 그리다가 결국 저도 해먹고 잤네요 😂 다들 맛야하세요!"</p>
              </div>
            </div>
          </aside>

          {/* Right Panel: Manga Viewer & Comments */}
          <div className="flex-1 w-full lg:max-w-4xl order-1 lg:order-2">
            <div className="bg-surface-light dark:bg-surface-dark rounded-[2.5rem] shadow-2xl border border-[#f3eee7] dark:border-[#3e3429] overflow-hidden mb-12">
              <div className="p-6 border-b border-[#f3eee7] dark:border-[#3e3429] flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                <h2 className="font-black text-text-main dark:text-gray-300 uppercase tracking-widest text-sm">Chapter 01: The Beginning</h2>
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-text-light hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                  </button>
                  <button className="flex items-center gap-1 text-text-light hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                  </button>
                </div>
              </div>

              {/* Reader Image Area */}
              <div className="flex flex-col w-full bg-[#111] items-center py-10 min-h-[800px] gap-1 select-none">
                <img className="max-w-full lg:w-[800px] shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKFv41u-lcWz9DuG-3LIkzFxh-xT12pc3rT5Vnfb8jwtju_6BkNinx6m19TLewq2BMBweJVQgIL9F2EZs-tM7I23-dxinC6AUp-C0_T_2o38BFDcJBhSvrNOhHhlQ7ONOLHHKuWYMgXxSMiKQzPkfuBWpB1APgLUjDVB6pX73BujQp3u1lhpe1Y-8CcF7QIiAFxBIEPI6zTxv5_iYNjg2OX6SQDpYm4SHNtzYlxh9d-xUV9L4xyV6rGQ8bE63cvqs1I8FRQKp9iw" alt="Manga Panel 1"/>
                <img className="max-w-full lg:w-[800px] shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6NBelXmvE5aWnGMnvzd6eNoOoiYqQjhOy3iXqt9ttvs71wxw38LSXpKejVKRXDflZY9jbv0zakONW8z00gop_hMH3bdZO-yKIry6yPZNed4WM195r1Lhh6FNCNIgd1-HB-Zhrw-G-XM5vM_VPTZq1fJrmy_JtB1wvjD3IvoTfNthDZuH_X30iOE8o8aRGJU2oJKdWZe0jfWbvSr4UlXJqzRauwpBLuO7V08eRdEzf9-XQNfKfs0bmQe8QgiCLodnqMFMlQQAD0w" alt="Manga Panel 2"/>
                <img className="max-w-full lg:w-[800px] shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfx57aqAiEgtlvtKDaTnW1anuyZLJZw92uMUFqie-BbGWsG7EpB2WmQywBgSncFj2ebBXZwkN1uwkbDUgb5v2adpU48c85PKAaDQgv3BCoDTGGEdpnHFv9YLKiJTarrDIcopNFbCBY0pEc3g2KMifMtMNKNL9JPGrVm5HXjyZdmGqreuAJPKR-Re7Cqvv0ea86c64ztohhQCG1Ia__OD9tuYjO9qYlbpAGkVqqq91sR4I1yjvP4ZNY6t0E4jAkHRI0xWbap0fbQA" alt="Manga Panel 3"/>
              </div>

              {/* Reader Navigation */}
              <div className="p-8 border-t border-[#f3eee7] dark:border-[#3e3429] bg-surface-light dark:bg-surface-dark">
                <div className="flex justify-between items-center max-w-2xl mx-auto">
                  <button className="flex items-center gap-2 px-6 py-3 text-text-light hover:text-text-main font-black transition-all disabled:opacity-30" disabled>
                    <span className="material-symbols-outlined">arrow_back</span>
                    이전화
                  </button>
                  <Link to="/" className="flex items-center gap-2 px-6 py-3 text-text-light hover:text-primary font-black transition-all">
                    <span className="material-symbols-outlined">grid_view</span>
                    목록
                  </Link>
                  <button className="flex items-center gap-2 px-10 py-4 bg-primary hover:bg-orange-600 text-[#1b160d] rounded-2xl shadow-lg shadow-primary/20 font-black transition-all transform active:scale-95">
                    다음화
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            <CommentSection />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetailPage;
