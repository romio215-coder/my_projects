const translations = {
    ko: {skip:'서비스 바로가기',headline:'건강한 오늘, 반가운 어제.',intro:'건강부터 식단, 추억까지. 지금 끌리는 곳에서 시작해보세요.',health_title:'건강 연구소',health_desc:'더 활기찬 일상을 위한 건강 이야기와 생활 속 작은 습관.',health_btn:'건강 이야기 살펴보기',medidiet_title:'메디다이어트',medidiet_desc:'시니어를 위한 맞춤 식단 보좌관. 매일의 식사를 조금 더 건강하게.',medidiet_btn:'식단 관리 시작하기',retro_title:'응답하라 1980',retro_desc:'골목길 놀이부터 그 시절 음악까지. 오래된 추억을 다시 만나는 곳.',retro_btn:'추억 속으로 떠나기',footer:'오늘의 나와 어제의 우리를 잇는 곳'},
    en: {skip:'Skip to services',headline:'A healthier today. A familiar yesterday.',intro:'Wellness, nutrition, and nostalgia. Start with what speaks to you.',health_title:'Health Lab',health_desc:'Health stories and everyday habits for a more energetic life.',health_btn:'Explore wellness',medidiet_title:'MediDiet',medidiet_desc:'A nutrition companion for seniors. Make everyday meals a little healthier.',medidiet_btn:'Plan your meals',retro_title:'Retro 1980',retro_desc:'From neighborhood games to favorite songs. Rediscover the moments you remember.',retro_btn:'Take a trip back',footer:'Connecting who we are with where we’ve been'},
    jp: {skip:'サービスへ移動',headline:'健やかな今日、懐かしいあの日。',intro:'健康、食事、そして思い出。気になる場所から始めましょう。',health_title:'健康研究所',health_desc:'健やかな毎日のための健康情報と、暮らしの中の小さな習慣。',health_btn:'健康のヒントを見る',medidiet_title:'メディダイエット',medidiet_desc:'シニアのための食事サポート。毎日の食事を少しずつ健やかに。',medidiet_btn:'食事管理を始める',retro_title:'レトロ 1980',retro_desc:'路地裏の遊びから懐かしい音楽まで。あの日の思い出に再会する場所。',retro_btn:'思い出の旅へ',footer:'今日の私と、あの日の私たちをつなぐ場所'}
};
function changeLanguage(language) {
    const lang = Object.hasOwn(translations, language) ? language : 'ko';
    document.documentElement.lang = lang === 'jp' ? 'ja' : lang;
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = translations[lang][node.dataset.i18n]; });
    document.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === lang)); });
    try { localStorage.setItem('preferredLanguage', lang); } catch { /* Storage can be unavailable in private browsing. */ }
}
document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => changeLanguage(button.dataset.language)));
let initialLanguage = 'ko';
try { initialLanguage = localStorage.getItem('preferredLanguage') || 'ko'; } catch { /* Use Korean by default. */ }
changeLanguage(initialLanguage);
