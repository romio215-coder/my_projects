
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#f3eee7] dark:border-[#3e3429] bg-surface-light dark:bg-surface-dark py-12 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2 text-text-main dark:text-white">
              <span className="material-symbols-outlined text-primary text-2xl">skillet</span>
              <span className="font-black text-xl tracking-tight">한컷요리</span>
            </div>
            <p className="text-sm text-text-light dark:text-[#8b7965] font-medium text-center md:text-left">
              매일 만나는 따뜻한 한 끼의 감동.<br/>
              © 2024 한컷요리. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a href="#" className="text-sm font-bold text-text-light hover:text-primary transition-colors">이용약관</a>
            <a href="#" className="text-sm font-bold text-text-light hover:text-primary transition-colors">개인정보처리방침</a>
            <a href="#" className="text-sm font-bold text-text-light hover:text-primary transition-colors">고객센터</a>
            <a href="#" className="text-sm font-bold text-text-light hover:text-primary transition-colors">광고문의</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
