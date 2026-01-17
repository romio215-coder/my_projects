
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full px-6 pt-10 pb-6 flex justify-center">
      <div className="w-full max-w-[1200px]">
        <div className="bg-surface-light dark:bg-surface-dark rounded-[2rem] p-8 md:p-12 shadow-xl shadow-orange-500/5 border border-[#f3eee7] dark:border-[#3e3429] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center relative z-10">
            <div 
              className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-transform duration-700 hover:scale-[1.02]"
              onClick={() => navigate('/detail/hero')}
            >
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" 
                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBx1Qw7J_1d78XD6fVBDABiptwgBGQ0Q2gvB0Srmj1lLphbo96efUN_-69T9ZATc4yzZm87_bPOMThVgWf1KWNtUqVgNaNjznNwOEU1NvsTRwG2bDIJW1T-cacdOzPVcrRP-m0_kVWVng0mb2lNVYHYXyOhl6vMey7-i9_enFHe8SJJoEQRp2wbqOyxnp--BjsZ9Rfpl8QcEIPAFbyY9uidZrIVautxvv_WINTWM773-BAT8UESoLReLWcEYqDUI2T0TmyjO8OYxQ")'}}
              ></div>
            </div>
            
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              <div className="inline-flex">
                <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-black text-[#1b160d] tracking-widest uppercase">EDITOR'S PICK</span>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter">
                  심야식당의<br/><span className="text-primary italic">따뜻한 우동</span>
                </h2>
                <p className="text-lg font-medium leading-relaxed text-text-light dark:text-[#d0c0a8] max-w-lg">
                  지친 하루 끝에서 만나는 기적 같은 한 그릇. <br className="hidden md:block"/>
                  당신의 마음까지 따뜻하게 데워줄 단 하나의 레시피를 만나보세요.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/detail/hero')}
                  className="flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-black text-[#1b160d] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 active:scale-95"
                >
                  <span className="material-symbols-outlined">menu_book</span>
                  지금 읽기
                </button>
                <button className="flex items-center gap-2 rounded-2xl bg-[#f3eee7] dark:bg-[#3e3429] px-8 py-4 text-lg font-black text-text-main dark:text-white hover:bg-[#e7ded3] dark:hover:bg-[#4a3e31] transition-all">
                  <span className="material-symbols-outlined fill-1">bookmark</span>
                  서재에 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
