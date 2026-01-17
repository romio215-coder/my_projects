
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f3eee7] dark:border-[#3e3429] bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md transition-all">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 text-text-main dark:text-white group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-[#1b160d] transition-all duration-300">
              <span className="material-symbols-outlined text-2xl">skillet</span>
            </div>
            <h1 className="text-xl font-black leading-tight tracking-tighter">한컷요리</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-bold text-text-light hover:text-primary transition-colors">홈</Link>
            <a href="#" className="text-sm font-bold text-text-light hover:text-primary transition-colors">인기</a>
            <a href="#" className="text-sm font-bold text-text-light hover:text-primary transition-colors">카테고리</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex relative w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="만화 검색..." 
              className="w-full bg-[#f3eee7] dark:bg-[#2f261f] border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
            />
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="flex size-10 items-center justify-center rounded-xl bg-surface-light dark:bg-surface-dark border border-[#f3eee7] dark:border-[#3e3429] text-text-light hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button className="hidden sm:block rounded-xl bg-primary px-5 py-2 text-sm font-bold text-[#1b160d] hover:bg-primary/90 transition-all shadow-sm">
            로그인
          </button>
          
          <button className="sm:hidden text-text-main dark:text-white">
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
