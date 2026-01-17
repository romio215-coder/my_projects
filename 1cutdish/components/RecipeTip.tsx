
import React from 'react';

const RecipeTip: React.FC = () => {
  return (
    <div className="bg-orange-50 dark:bg-orange-950/20 p-8 rounded-3xl border border-orange-100 dark:border-orange-900/30">
      <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest mb-6">
        <span className="material-symbols-outlined">menu_book</span>
        <span>Recipe Secrets</span>
      </div>
      <ul className="space-y-5">
        <li className="flex gap-4 group">
          <span className="size-6 rounded-xl bg-primary text-[#1b160d] flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:rotate-12">1</span>
          <span className="text-text-main dark:text-gray-200 text-sm font-bold leading-relaxed">김치는 꼭 <strong className="text-primary underline decoration-primary/30 decoration-4 underline-offset-4">신김치</strong>를 사용하세요! 맛의 깊이가 다릅니다.</span>
        </li>
        <li className="flex gap-4 group">
          <span className="size-6 rounded-xl bg-primary text-[#1b160d] flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:rotate-12">2</span>
          <span className="text-text-main dark:text-gray-200 text-sm font-bold leading-relaxed">파기름을 충분히 내어 볶으면 중국집 볶음밥 향이 납니다.</span>
        </li>
        <li className="flex gap-4 group">
          <span className="size-6 rounded-xl bg-primary text-[#1b160d] flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:rotate-12">3</span>
          <span className="text-text-main dark:text-gray-200 text-sm font-bold leading-relaxed">마지막에 참기름 한 방울, 절대 잊지 마세요.</span>
        </li>
      </ul>
    </div>
  );
};

export default RecipeTip;
