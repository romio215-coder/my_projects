
import React, { useState } from 'react';

const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: '요리왕비룡',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHKJBUK7Q1_K4I0IDTute5ZUhar5QFbm68IweqcMLCjQMFqhfle_ysmoPJO7gTuHdChLl_jryt1mZ2sicsfFpyiof8bNKojoHPBsH5JKPwZSqRSvBJUfPwzdT2qtSmqLWl7jCWiiC0cBph617sY2v8YvXzmRO2gwdi2WM_ac_gZMXqUux15QClAqvwAY4DHubu9boldRlzQSJq8olGPqV3sOEQOSiE_vEoxVSKD8qwbR3aqtcj500gD_5bU-TKUzAD_c3Znrn9Zw',
    text: '진짜 신김치가 포인트네요! 설탕 조금 넣으니까 감칠맛이 폭발합니다. 오늘 저녁 해결했어요 감사합니다!',
    time: '2시간 전',
    likes: 12
  },
  {
    id: 'c2',
    author: '배고픈자취생',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqA_SLxp7JPJHPUGUiR37Nuz6bq4YJo8qaTkeRIIDZHEwNRU63vsG1MwyMpovmP2J1IvzrBIKWVCSzn4pbrvHl9lr4lsCFrOVbSYGpNlyjjmMOBscGiDdy7cpQERcdJlQpoRy67ku6wfWlCtbJ-rMiwEandj4oBKgEeUb3NhwQ-W8UO6-B7DcbqHL_uktbEk-Dw9f2txzK2npL3UNsEjpPw4RMMyuSXmAt0IL9_tFkuDLjSAfZc5ZRHTffzmV89QgY1tByUzr1ig',
    text: '그림 너무 귀여워요ㅠㅠ 다음 화는 떡볶이 해주세요!',
    time: '5시간 전',
    likes: 8
  }
];

const CommentSection: React.FC = () => {
  const [comment, setComment] = useState("");

  return (
    <div className="max-w-3xl mx-auto mt-20">
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#f3eee7] dark:border-[#3e3429]">
        <h3 className="text-2xl font-black flex items-center gap-3">
          댓글 <span className="text-primary tracking-tighter">24</span>
        </h3>
        <div className="flex items-center gap-6 text-sm font-bold text-text-light uppercase tracking-widest">
          <button className="text-text-main dark:text-white">Recent</button>
          <button className="hover:text-primary transition-colors">Popular</button>
        </div>
      </div>

      <div className="flex gap-6 mb-12">
        <div className="size-14 rounded-2xl bg-primary/20 bg-cover bg-center shrink-0 shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVhrtLaIchi9iX4iPiqxoQh2PaxqBvxPOi-up6B4nAuoxFOGygZ3VQFkfIIOKGZ8Ms2KFrCL9U6QJC1Ohdfg5hF_C8yIkYRiPYYSWOS1gihmi95hWlEq5ATFu5-iTAXQHouKQPuStZsXjKJjREBCPuC8HTLdvLS06gZvf_CmaJA5Is24vN_9oqNagkBDxwG-Rmrf6gswihP-YEDfsPv3HEYjyC3pLYMS-HXtfdpPU_rbABCW278KzQjCrxaXvd8J8ACD3a9o0MOw")'}}></div>
        <div className="flex-1 relative">
          <textarea 
            className="w-full bg-white dark:bg-[#1a130a] border-2 border-[#f3eee7] dark:border-[#3e3429] rounded-[1.5rem] p-6 pr-24 min-h-[140px] resize-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-text-main dark:text-white font-medium" 
            placeholder="만화에 대한 감상이나 요리 후기를 남겨주세요!"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button className="absolute bottom-6 right-6 bg-primary text-[#1b160d] px-6 py-2.5 rounded-xl text-sm font-black hover:bg-orange-600 transition-all shadow-lg active:scale-95">등록</button>
        </div>
      </div>

      <div className="space-y-10">
        {MOCK_COMMENTS.map(item => (
          <div key={item.id} className="flex gap-6 group">
            <div className="size-12 rounded-2xl bg-gray-200 bg-cover bg-center shrink-0 border-2 border-transparent group-hover:border-primary transition-all" style={{backgroundImage: `url("${item.avatar}")`}}></div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-black text-text-main dark:text-white text-sm">{item.author}</span>
                <span className="text-[10px] font-black text-text-light uppercase tracking-widest opacity-60">{item.time}</span>
              </div>
              <p className="text-text-main dark:text-gray-300 text-[15px] font-medium leading-relaxed mb-4">{item.text}</p>
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1.5 text-xs font-black text-text-light hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-[18px]">thumb_up</span> {item.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-black text-text-light hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-[18px]">chat_bubble</span> 답글
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <button className="text-text-light hover:text-primary font-black text-xs uppercase tracking-[0.2em] transition-all py-3 px-8 rounded-full border border-transparent hover:border-primary/20 bg-primary/5">
          Load More Comments
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
