
import React from 'react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { Comic } from '../types';

const MOCK_COMICS: Comic[] = [
  {
    id: '1',
    title: "엄마의 김치찌개",
    desc: "오래 묵은 김치와 돼지고기의 환상적인 조화. 어머니의 손맛을 그대로 담은 레시피 만화입니다.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuATXy0fRfh18x9ByrZpF7LklPbErBMV60iMmvgh5nW-GPtgdBhE6F7JaFpdEMo0gEdx3bkJWYYjjCpoiPrc9UnCRMiZDVnH30p9AwfxOUPASLDt_Q0Flz75ZH2O9OvHWuHGDwxEifQ9miJeVgF9SsuCVcQiKCovaSic8AxQjXycnSRK4wighs-kKxwuziH7Ji0kYqmOImrUQZn-yABPJgmhgcT-zOxa1deM7YA3NIEquCLkvZTmEWgkGIzbIpYmQwk4r8Epl7OrwQ",
    rating: 4.8,
    author: "이작가",
    date: "2023.10.27",
    category: "한식"
  },
  {
    id: '2',
    title: "폭신폭신 오므라이스",
    desc: "입안에서 사르르 녹는 반숙 계란과 새콤달콤 소스. 실패 없는 오므라이스 만드는 법!",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyWyJ-ghZss6UCWx2MUSVdvgdeXmhh14g7yOPAVtnGiLsLtGHDgYRGWnip9I15eMlKCEpclcdWQmwN_dEJ8jC3L5alSG52WrGPHfFqUB1LyY-SxQ6b0POmaB8qxUcQzNdhdF1C-H86kfcHKXelBGx18WXErbxthLks6n0mYYQiR86KeGyA-lxN9zNbHgWPwrQ35lVmGcQOtXcZKAcj0criii1tzujZEkWO4hJe89ywbJ9iDhKkD3XwxqJphRJYYhiyLY6aDWDPbw",
    rating: 4.9,
    author: "김작가",
    date: "2023.11.02",
    category: "일식"
  },
  {
    id: '3',
    title: "소풍가는 날 샌드위치",
    desc: "봄 소풍에 딱 어울리는 형형색색 샌드위치. 예쁘게 포장하는 꿀팁까지 알려드려요.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCL3-M_lF-B_CRUJdkzrbBS0-iOccitR1PFmS2P6SQKDXLys2CrNgtvj_0j4G_Oa0_R79_gPImXMfL3ofpFd2tAYiJcstAmYna3JiJFBthML-FeEYGJ_QZHCpcFJFotYalg7ySblVDyWmpYGNftQlNPPFYo08ApkaDhisRWb1Y1J-7WuavROy2lWkaZN5tkTfFSBV2mJgYqg3ZBrVkdyvcc7zoU_AJ-VrFx7TWCujVnGUeowogiBQ-Q2Ft9kt4g_sfHnmlDt0dAw",
    rating: 4.5,
    author: "박작가",
    date: "2023.11.15",
    category: "브런치"
  },
  {
    id: '4',
    title: "자취생의 5분 파스타",
    desc: "냉장고 파먹기 대작전! 최소한의 재료로 최고의 맛을 내는 초간단 파스타.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8BCvdGEznQKxOcMnAyIymOARM_TS1MAqw3eaBhPkY0VcJ0viXkhgRxaVIVF8jzVc4Adw6hVtUjGIbWZG3JditIALbkaetLahDUvzK7XxYurjFKgN_UDXaY3RrwT1TbRm-b_nrkIEQ7bTksWvGATH-Zw86Qks7OUVWcNW7SD4DsHiu7s6N5YgfwLdrXnf6dCYGc9ricuQ8t7jYSQtqdlCAPlvBWmZVlehb4c5GTs0TMoVr_6bALEviYGeOSa2OH1qODfb4w7734w",
    rating: 4.7,
    author: "한작가",
    date: "2023.11.20",
    category: "양식"
  },
  {
    id: '5',
    title: "달콤한 오후의 팬케이크",
    desc: "나른한 오후, 커피 한 잔과 함께 즐기는 달콤한 브런치 타임.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYX8KOyhPU7w5K9s4H-9uTg1eA1-zcebguZshYnkRFyBvV91FqmAkMaopIhqO86Vfy5xzo3LChxR-p5tZ7UW58NJ1knJ7ilE1HXt0dMs5cmQNRZt3aJbWFAChnQeVa-RWKrALioagD-TG1hFlcLM1MIGgK6t2YfPTjSQwGYNk8uzjPaVpw-igomSeymRbzgLr6UTiekFT34RWjyOMlPG1ECan5L7FqlUit5HLxTA3j4rkjWtyWSSc0gANIxK4YDH9SFJNFB2bvnQ",
    rating: 4.6,
    author: "최작가",
    date: "2023.12.01",
    category: "디저트"
  },
  {
    id: '6',
    title: "비 오는 날의 해물파전",
    desc: "빗소리를 들으며 부쳐먹는 바삭바삭한 파전. 막걸리가 생각나는 맛.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKMXK07PNtmLP6u2l7jwM5y7mqiKMfJpTS1AmIxWkZ8g1VOmAgA0pbOpJO3BK_6q1ELUp3BmTKWlsq90Cp-wrlr5Px39Og727-aXpfuooSQKbafarRxfoxmAehcaiU8-N_TA8VVohED3rHNA790Czvo4XXOd9tMt61EYOA0IDuOIHrJvO49bKjC0j-cFSqWfkNlBjt4n6iNgUtJV2fnOmyHsf-625WOx-BIpncko_dYK6NCaEPaUPiepERZ1fcHndyTQ72CbLqMg",
    rating: 4.9,
    author: "정작가",
    date: "2023.12.10",
    category: "한식"
  },
  {
    id: '7',
    title: "할머니의 된장국",
    desc: "깊은 구수함이 느껴지는 시골 밥상. 할머니의 비밀 레시피를 공개합니다.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQV1y9J3G3x7KfI0nI1vE0WBI30SmT-9bbCvfqAFIIdsrEaJAxJiGkzg_ccEv49WCMhEDrnJLdtMc8N-zfWaJb06wx-VUKdn_TvR_8KKJdOLEsajCZK93O70-g_YnlndR4fZeQ3F_bBtPguM8J9Mu7ikrqcKyVDT-7vS1Bj5b5oJgThUwX8dUVkItwaNyBGizVUTkBkla0LScvlP8VzUSRc4YfrYP_S6JRrH2I0mMbtW2BfATkPSMa6UGN9t2tuCvFEkJlMuxd1g",
    rating: 4.8,
    author: "임작가",
    date: "2023.12.15",
    category: "한식"
  },
  {
    id: '8',
    title: "캠핑장의 바베큐 파티",
    desc: "야외에서 먹으면 더 맛있는 고기! 캠핑 요리의 낭만을 즐겨보세요.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJicIjj6gsXLvp2101fPJ7fJINTYeBtvnyQdDDKpELxlhRU_Cu8i7r7TuVbc9f1By-IEELquHYxYkkyLsqXCwrlsTPAm73ER-0YAqr07k3oWH-qgudgrdyF5db1liqFSAf_KWujs5TCq47RMoWiXEYhFv8gtXfuGaYmYZYSJ15mC96z0eiHhn2VDBE8FPRIXgMnmEnPP2xuOjVc1wvZwRHe6nAq6UoThkNqnSgg2oC-2cl1aRnpehFXmixVSFeJc1LhRqwqIL-Ew",
    rating: 4.7,
    author: "조작가",
    date: "2023.12.24",
    category: "아웃도어"
  }
];

const HomePage: React.FC = () => {
  return (
    <main className="flex-1 pb-20">
      <HeroSection />
      
      <section className="max-w-[1200px] mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#f3eee7] dark:border-[#3e3429]">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">local_fire_department</span>
            따끈따끈한 신작
          </h2>
          <div className="flex gap-4">
            <button className="text-sm font-bold text-primary">최신순</button>
            <button className="text-sm font-bold text-text-light hover:text-text-main transition-colors">인기순</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {MOCK_COMICS.map(comic => (
            <ProductCard key={comic.id} comic={comic} />
          ))}
        </div>
        
        {/* Pagination placeholder */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="size-10 rounded-xl bg-surface-light dark:bg-surface-dark border border-[#f3eee7] dark:border-[#3e3429] flex items-center justify-center hover:border-primary transition-all">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="size-10 rounded-xl bg-primary text-[#1b160d] font-bold shadow-md">1</button>
            <button className="size-10 rounded-xl bg-surface-light dark:bg-surface-dark border border-[#f3eee7] dark:border-[#3e3429] font-bold hover:border-primary transition-all">2</button>
            <button className="size-10 rounded-xl bg-surface-light dark:bg-surface-dark border border-[#f3eee7] dark:border-[#3e3429] font-bold hover:border-primary transition-all">3</button>
            <div className="text-text-light px-2">...</div>
            <button className="size-10 rounded-xl bg-surface-light dark:bg-surface-dark border border-[#f3eee7] dark:border-[#3e3429] font-bold hover:border-primary transition-all">12</button>
            <button className="size-10 rounded-xl bg-surface-light dark:bg-surface-dark border border-[#f3eee7] dark:border-[#3e3429] flex items-center justify-center hover:border-primary transition-all">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
