
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Comic } from '../types';

interface ProductCardProps {
  comic: Comic;
}

const ProductCard: React.FC<ProductCardProps> = ({ comic }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/detail/${comic.id}`)}
      className="group cursor-pointer bg-surface-light dark:bg-surface-dark rounded-3xl overflow-hidden border border-[#f3eee7] dark:border-[#3e3429] hover:border-primary/50 hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
          style={{backgroundImage: `url("${comic.img}")`}}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <span className="text-white font-black text-lg">보러가기</span>
        </div>
        {comic.rating && (
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-xl">
            <span className="material-symbols-outlined text-[16px] text-primary fill-1">star</span>
            {comic.rating}
          </div>
        )}
        <div className="absolute top-4 left-4">
           <span className="px-3 py-1.5 rounded-xl bg-primary text-[#1b160d] text-[10px] font-black uppercase tracking-wider">{comic.category}</span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-black leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">{comic.title}</h3>
          <p className="text-sm text-text-light dark:text-[#a89885] line-clamp-2 leading-relaxed font-medium">
            {comic.desc}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-[#f3eee7] dark:border-[#3e3429]">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px] text-primary">person</span>
            </div>
            <span className="text-xs font-bold text-text-light">{comic.author}</span>
          </div>
          <span className="text-[11px] font-bold text-text-light/60 uppercase">{comic.date}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
