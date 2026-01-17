/**
 * App State and Routing
 */
const DEFAULT_RECIPES = [
    {
        "id": 1,
        "title": "가을 무를 넣어 시원한 소고기 뭇국",
        "author": "궁극의 주방",
        "thumbnail": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800",
        "rating": 4.9,
        "reviewCount": 156,
        "difficulty": "중급",
        "time": "40분",
        "servings": "3인분",
        "category": "한식",
        "ingredients": [
            { "name": "소고기", "amount": "200g" },
            { "name": "무", "amount": "1/4개" },
            { "name": "대파", "amount": "1대" }
        ],
        "seasoning": [
            { "name": "국간장", "amount": "1큰술" },
            { "name": "다진 마늘", "amount": "0.5큰술" }
        ],
        "steps": [
            { "img": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=400", "desc": "소고기와 무를 먹기 좋은 크기로 썰어 준비합니다." },
            { "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400", "desc": "냄비에 참기름을 두르고 고기를 볶다가 무를 넣고 더 볶아줍니다." }
        ]
    },
    {
        "id": 2,
        "title": "바질 향 가득한 정통 카프레제 샐러드",
        "author": "Chef Mario",
        "thumbnail": "https://images.unsplash.com/photo-1592417817098-8fd3d9ebc4a5?auto=format&fit=crop&q=80&w=800",
        "rating": 4.7,
        "reviewCount": 92,
        "difficulty": "초급",
        "time": "15분",
        "servings": "2인분",
        "category": "양식",
        "ingredients": [
            { "name": "토마토", "amount": "2개" },
            { "name": "모짜렐라 치즈", "amount": "1팩" },
            { "name": "생바질", "amount": "약간" }
        ],
        "seasoning": [
            { "name": "발사믹 글레이즈", "amount": "적당량" },
            { "name": "올리브 오일", "amount": "1큰술" }
        ],
        "steps": [
            { "img": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400", "desc": "토마토와 치즈를 일정한 두께로 슬라이스 합니다." },
            { "img": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400", "desc": "접시에 교차하여 담은 후 바질과 드레싱을 곁들입니다." }
        ]
    }
];

const loadRecipes = () => {
    try {
        const saved = localStorage.getItem('user_recipes');
        return saved ? JSON.parse(saved) : DEFAULT_RECIPES;
    } catch (e) {
        console.error('Failed to load recipes:', e);
        return DEFAULT_RECIPES;
    }
};

const saveRecipes = (recipes) => {
    try {
        localStorage.setItem('user_recipes', JSON.stringify(recipes));
    } catch (e) {
        console.error('Failed to save recipes:', e);
        if (e.name === 'QuotaExceededError') {
            alert('저장 공간이 부족합니다! 오래된 레시피를 삭제하거나 이미지를 더 작게 올려주세요.');
        } else {
            alert('저장 중 오류가 발생했습니다: ' + e.message);
        }
    }
};

const loadBookmarks = () => {
    try {
        const saved = localStorage.getItem('user_bookmarks');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
};

const saveBookmarks = (bookmarks) => {
    localStorage.setItem('user_bookmarks', JSON.stringify(bookmarks));
};

const state = {
    currentView: 'home',
    recipes: loadRecipes(),
    bookmarks: loadBookmarks(),
    comments: JSON.parse(localStorage.getItem('user_comments') || '{}'),
    selectedRecipe: null,
    currentCategory: '전체'
};

/**
 * Navigation Logic
 */
window.navigateTo = (view, params = {}) => {
    state.currentView = view;
    if (view === 'detail' && params.id) {
        state.selectedRecipe = state.recipes.find(r => r.id === parseInt(params.id));
    }

    // Update active nav state
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (view === 'home' && link.id === 'nav-home') link.classList.add('active');
        if (view === 'create' && link.id === 'nav-create') link.classList.add('active');
        if (view === 'mypage' && link.id === 'nav-mypage') link.classList.add('active');
    });

    render();
    window.scrollTo(0, 0);
};

/**
 * Rendering Logic
 */
const render = () => {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    switch (state.currentView) {
        case 'home':
            renderHome(appContent);
            break;
        case 'detail':
            renderDetail(appContent);
            break;
        case 'create':
            renderCreate(appContent);
            break;
        case 'mypage':
            renderMyPage(appContent);
            break;
        default:
            appContent.innerHTML = '<h1>Page Not Found</h1>';
    }
};

/**
 * Components
 */
const RecipeCard = (recipe) => {
    const isBookmarked = state.bookmarks.includes(recipe.id);
    return `
        <div class="recipe-card">
            <div class="img-container" onclick="navigateTo('detail', {id: ${recipe.id}})">
                <img src="${recipe.thumbnail}" alt="${recipe.title}" class="card-img">
                <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleBookmark(${recipe.id})">
                    <i class="fa-${isBookmarked ? 'solid' : 'regular'} fa-heart"></i>
                </button>
            </div>
            <div class="card-content" onclick="navigateTo('detail', {id: ${recipe.id}})">
                <span class="card-category">${recipe.category}</span>
                <h3>${recipe.title}</h3>
                <div class="card-meta">
                    <span>${recipe.author}</span>
                    <span>/</span>
                    <span>${recipe.time}</span>
                </div>
                <div class="card-footer">
                    <span class="rating">★ ${recipe.rating}</span>
                    <span class="review-count">리뷰 ${recipe.reviewCount}</span>
                </div>
            </div>
        </div>
    `;
};

window.toggleBookmark = (id) => {
    const index = state.bookmarks.indexOf(id);
    if (index === -1) {
        state.bookmarks.push(id);
    } else {
        state.bookmarks.splice(index, 1);
    }
    saveBookmarks(state.bookmarks);
    render();
};

/**
 * Home Page Component
 */
const renderHome = (container) => {
    const categories = ['전체', '한식', '양식', '일식', '중식', '디저트'];
    const filteredRecipes = state.currentCategory === '전체'
        ? state.recipes
        : state.recipes.filter(r => r.category === state.currentCategory);

    container.innerHTML = `
        <section class="banner">
            <div class="container banner-content">
                <h2>궁극의 레시피</h2>
                <p>당신의 식탁을 바꿀 단 하나의 레시피를 만나보세요.</p>
                
                <div class="category-tabs">
                    ${categories.map(cat => `
                        <button class="cat-tab ${state.currentCategory === cat ? 'active' : ''}" 
                                onclick="filterByCategory('${cat}')">${cat}</button>
                    `).join('')}
                </div>

                <div class="search-bar">
                    <input type="text" id="search-input" placeholder="관심 있는 요리를 검색해보세요" onkeyup="handleSearch(this.value)">
                    <button onclick="handleSearch(document.getElementById('search-input').value)">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>
        </section>
        <div class="container main-container">
            <div class="section-title">
                <h2>${state.currentCategory} 레시피</h2>
                <p>${state.currentCategory === '전체' ? '궁극의 레시피에서 추천하는 요리들' : `${state.currentCategory}의 향연을 느껴보세요`}</p>
            </div>
            <div id="recipe-list" class="recipe-grid">
                ${filteredRecipes.length > 0 ?
            filteredRecipes.map(recipe => RecipeCard(recipe)).join('') :
            '<p class="empty-msg">해당하는 레시피가 아직 없습니다. 첫 번째 주인공이 되어보세요!</p>'}
            </div>
        </div>
    `;
    injectHomeStyles();
};

window.filterByCategory = (category) => {
    state.currentCategory = category;
    render();
};

const renderDetail = (container) => {
    if (!state.selectedRecipe) {
        container.innerHTML = '<div class="container"><h1>Recipe not found</h1></div>';
        return;
    }
    const recipe = state.selectedRecipe;
    container.innerHTML = `
        <article class="container recipe-detail">
            <header class="detail-header">
                <div class="category-badge">${recipe.category}</div>
                <h2>${recipe.title}</h2>
                <div class="recipe-meta">
                    <span>${recipe.author}</span>
                    <span>/</span>
                    <span>${recipe.servings}</span>
                    <span>/</span>
                    <span>${recipe.time}</span>
                </div>
                <img src="${recipe.thumbnail}" alt="${recipe.title}" class="detail-img">
                <p class="detail-desc">"${recipe.title}"를 완성하기 위한 가장 쉽고 맛있는 방법을 소개합니다.</p>
            </header>

            <section class="grid-2">
                <div class="ingredients-card">
                    <h3>Ingredients</h3>
                    <ul class="ing-list">
                        ${recipe.ingredients.map(i => `<li><span>${i.name}</span> <span>${i.amount}</span></li>`).join('')}
                    </ul>
                </div>
                <div class="steps-card">
                    <h3>Cooking Steps</h3>
                    <div class="step-list">
                        ${recipe.steps.map((step, idx) => `
                            <div class="step-item">
                                <div class="step-num">Step ${idx + 1}</div>
                                <img src="${step.img}" alt="Step ${idx + 1}" class="step-img">
                                <div class="step-desc">${step.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <section class="comments-section">
                <h3>Reviews</h3>
                <form class="comment-form" onsubmit="handleCommentSubmit(event, ${recipe.id})">
                    <textarea id="comment-input" placeholder="맛있는 후기나 팁을 남겨주세요!"></textarea>
                    <button type="submit" class="btn-primary">등록</button>
                </form>
                <div class="comment-list">
                    ${(state.comments[recipe.id] || []).length > 0 ?
            state.comments[recipe.id].map(c => `
                        <div class="comment-item">
                            <div class="comment-header">
                                <span class="comment-user">익명의 미식가</span>
                                <span class="comment-date">${c.date}</span>
                            </div>
                            <p class="comment-text">${c.text}</p>
                        </div>
                    `).join('') : '<p class="empty-msg">아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!</p>'}
                </div>
            </section>
        </article>
    `;
    injectDetailStyles();
};

window.handleCommentSubmit = (event, recipeId) => {
    event.preventDefault();
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (!text) return;

    if (!state.comments[recipeId]) state.comments[recipeId] = [];
    state.comments[recipeId].unshift({
        text,
        date: new Date().toLocaleDateString('ko-KR')
    });

    localStorage.setItem('user_comments', JSON.stringify(state.comments));
    render();
};

const renderCreate = (container) => {
    container.innerHTML = `
        <div class="container create-recipe">
            <h2>레시피 등록</h2>
            <form id="recipe-form" class="recipe-form" onsubmit="handleRecipeSubmit(event)">
                <section class="form-section">
                    <h3>레시피 정보</h3>
                    <div class="input-group">
                        <label>레시피 제목</label>
                        <input type="text" name="title" id="form-title" placeholder="예) 매콤 달콤 제육볶음">
                    </div>
                    <div class="input-group">
                        <label>대표 이미지</label>
                        <div class="img-upload-container">
                            <input type="file" id="main-image-input" accept="image/*" style="display:none" onchange="handleImageChange(event, 'main-preview')">
                            <div class="img-upload-placeholder" id="main-preview" onclick="triggerUpload('main-image-input')">
                                <i class="fa-solid fa-camera"></i>
                                <span>사진 업로드</span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>소개글</label>
                        <textarea name="intro" id="form-intro" placeholder="레시피에 대한 간단한 설명을 입력해 주세요."></textarea>
                    </div>
                    <div class="input-row">
                        <div class="input-group">
                            <label>카테고리</label>
                            <select name="category" id="form-category">
                                <option value="한식">한식</option>
                                <option value="양식">양식</option>
                                <option value="일식">일식</option>
                                <option value="중식">중식</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>인원</label>
                            <select name="servings" id="form-servings">
                                <option>1인분</option><option>2인분</option><option>3인분</option><option>4인분</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>시간</label>
                            <select name="time" id="form-time">
                                <option>10분</option><option>20분</option><option>30분</option><option>60분</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="form-section">
                    <div class="section-header">
                        <h3>재료 등록</h3>
                        <button type="button" class="btn-outline btn-sm" onclick="addIngredientRow()">+ 추가</button>
                    </div>
                    <div id="ingredient-list" class="dynamic-list">
                        <div class="dynamic-row">
                            <input type="text" class="ing-name" placeholder="재료명">
                            <input type="text" class="ing-amount" placeholder="용량">
                            <button type="button" class="btn-remove" onclick="removeRow(this)"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                </section>

                <section class="form-section">
                    <div class="section-header">
                        <h3>조리 순서</h3>
                        <button type="button" class="btn-outline btn-sm" onclick="addStepRow()">+ 단계 추가</button>
                    </div>
                    <div id="step-list" class="dynamic-list steps">
                        <div class="dynamic-row step">
                            <div class="step-num">1</div>
                            <textarea class="step-desc-input" placeholder="조리 설명을 입력하세요."></textarea>
                            <div class="step-img-upload">
                                <input type="file" class="step-img-input" accept="image/*" style="display:none" onchange="handleImageChange(event, this.nextElementSibling)">
                                <div class="img-upload-placeholder small" onclick="triggerUpload(this.previousElementSibling)">
                                    <i class="fa-solid fa-camera"></i>
                                </div>
                            </div>
                            <button type="button" class="btn-remove" onclick="removeRow(this, true)"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                </section>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="navigateTo('home')">취소</button>
                    <button type="button" class="btn-outline" style="border-color: #7f8c8d; color: #7f8c8d;" onclick="if(confirm('모든 등록 데이터가 삭제됩니다. 초기화할까요?')) { localStorage.removeItem('user_recipes'); location.reload(); }">저장소 데이터 초기화</button>
                    <button type="submit" class="btn-primary">레시피 등록하기</button>
                </div>
            </form>
        </div>
    `;
    injectCreateStyles();
};

/**
 * Form Actions
 */
window.triggerUpload = (idOrElement) => {
    if (typeof idOrElement === 'string') {
        document.getElementById(idOrElement).click();
    } else {
        idOrElement.click();
    }
};

window.handleImageChange = (event, previewTarget) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const max_size = 800;

                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Compress to 70% quality jpeg
                const preview = typeof previewTarget === 'string' ? document.getElementById(previewTarget) : previewTarget;
                preview.style.backgroundImage = `url(${dataUrl})`;
                preview.style.backgroundSize = 'cover';
                preview.style.backgroundPosition = 'center';
                preview.innerHTML = '';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

window.addIngredientRow = () => {
    const list = document.getElementById('ingredient-list');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <input type="text" class="ing-name" placeholder="재료명">
        <input type="text" class="ing-amount" placeholder="용량">
        <button type="button" class="btn-remove" onclick="removeRow(this)"><i class="fa-solid fa-xmark"></i></button>
    `;
    list.appendChild(row);
};

window.addStepRow = () => {
    const list = document.getElementById('step-list');
    const stepCount = list.querySelectorAll('.dynamic-row').length + 1;
    const row = document.createElement('div');
    row.className = 'dynamic-row step';
    row.innerHTML = `
        <div class="step-num">${stepCount}</div>
        <textarea class="step-desc-input" placeholder="조리 설명을 입력하세요."></textarea>
        <div class="step-img-upload">
            <input type="file" class="step-img-input" accept="image/*" style="display:none" onchange="handleImageChange(event, this.nextElementSibling)">
            <div class="img-upload-placeholder small" onclick="triggerUpload(this.previousElementSibling)">
                <i class="fa-solid fa-camera"></i>
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removeRow(this, true)"><i class="fa-solid fa-xmark"></i></button>
    `;
    list.appendChild(row);
};

window.removeRow = (btn, renumber = false) => {
    const row = btn.parentElement;
    row.remove();
    if (renumber) {
        document.querySelectorAll('#step-list .step-num').forEach((num, idx) => {
            num.textContent = idx + 1;
        });
    }
};

window.handleRecipeSubmit = (event) => {
    console.log('Submission started');
    event.preventDefault();

    try {
        const title = document.getElementById('form-title').value;
        console.log('Title:', title);
        if (!title) {
            alert('레시피 제목을 입력해 주세요!');
            document.getElementById('form-title').focus();
            return;
        }

        const ingredients = [];
        document.querySelectorAll('#ingredient-list .dynamic-row').forEach((row, idx) => {
            const name = row.querySelector('.ing-name').value;
            const amount = row.querySelector('.ing-amount').value;
            console.log(`Ingredient ${idx}:`, name, amount);
            if (name) ingredients.push({ name, amount });
        });

        if (ingredients.length === 0) {
            alert('최소 하나 이상의 재료를 입력해 주세요!');
            return;
        }

        const steps = [];
        document.querySelectorAll('#step-list .dynamic-row.step').forEach((row, idx) => {
            const desc = row.querySelector('.step-desc-input').value;
            const preview = row.querySelector('.img-upload-placeholder');
            console.log(`Step ${idx} desc:`, desc);
            let img = 'https://images.unsplash.com/photo-1495195129352-aec325b55b65?auto=format&fit=crop&q=80&w=400';
            if (preview.style.backgroundImage) {
                const bg = preview.style.backgroundImage;
                img = bg.startsWith('url("') ? bg.slice(5, -2) : bg.slice(4, -1);
            }
            if (desc) steps.push({ desc, img });
        });

        if (steps.length === 0) {
            alert('최소 하나 이상의 조리 순서를 입력해 주세요!');
            return;
        }

        const mainPreview = document.getElementById('main-preview');
        let thumbnail = 'https://images.unsplash.com/photo-1495195129352-aec325b55b65?auto=format&fit=crop&q=80&w=600';
        if (mainPreview.style.backgroundImage) {
            const bg = mainPreview.style.backgroundImage;
            thumbnail = bg.startsWith('url("') ? bg.slice(5, -2) : bg.slice(4, -1);
        }

        const newRecipe = {
            id: Date.now(),
            title: title,
            author: "나그네",
            thumbnail: thumbnail,
            rating: 5.0,
            reviewCount: 0,
            difficulty: "초급",
            time: document.getElementById('form-time').value,
            servings: document.getElementById('form-servings').value,
            category: document.getElementById('form-category').value,
            ingredients: ingredients,
            seasoning: [],
            steps: steps
        };
        console.log('New Recipe Object:', newRecipe);

        state.recipes.unshift(newRecipe);
        saveRecipes(state.recipes);
        console.log('Saved to state and localStorage');

        alert('레시피가 등록되었습니다!');
        navigateTo('home');
    } catch (error) {
        console.error('Submission failed with error:', error);
        alert('등록 중 오류가 발생했습니다: ' + error.message);
    }
};

window.handleSearch = (query) => {
    state.filteredRecipes = state.recipes.filter(r => r.title.includes(query) || r.category.includes(query));
    const list = document.getElementById('recipe-list');
    if (list) {
        list.innerHTML = state.filteredRecipes.map(r => RecipeCard(r)).join('');
    }
};

/**
 * Theme Styles Injection
 */
const injectHomeStyles = () => {
    const styleId = 'home-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
        .banner {
            padding: 2rem 0 6rem;
            text-align: center;
        }
        .banner-content h2 { 
            font-size: 4rem; 
            color: var(--primary-color); 
            margin-bottom: 1.5rem; 
            font-style: italic;
        }
        .banner-content p { 
            font-size: 1.2rem; 
            margin-bottom: 3rem; 
            color: var(--secondary-color); 
            font-family: var(--font-heading);
            font-style: italic;
        }
        .search-bar {
            max-width: 500px; margin: 0 auto; display: flex;
            background: white; border: 1px solid var(--border-color); padding: 5px;
            border-radius: 4px;
        }
        .search-bar input { 
            flex: 1; border: none; padding: 1rem; outline: none; font-size: 1rem; 
            font-family: var(--font-body);
        }
        .search-bar button { 
            background: transparent; color: var(--primary-color); border: none; 
            padding: 0 1.5rem; cursor: pointer; font-size: 1.2rem; 
        }

        .category-tabs { display: flex; justify-content: center; gap: 15px; margin-bottom: 3rem; flex-wrap: wrap; }
        .cat-tab { 
            background: white; border: 1px solid var(--border-color); padding: 0.6rem 1.5rem; 
            border-radius: 30px; cursor: pointer; font-family: var(--font-heading); transition: 0.3s;
            color: var(--secondary-color); font-size: 1rem;
        }
        .cat-tab:hover, .cat-tab.active { 
            border-color: var(--primary-color); color: var(--primary-color);
            background: #fff8f6;
        }
        
        .section-title { margin: 6rem 0 3rem; text-align: center; }
        .section-title h2 { 
            color: var(--text-color); font-size: 2.5rem; 
            position: relative; display: inline-block; padding-bottom: 1rem;
        }
        .section-title h2::after {
            content: ''; position: absolute; bottom: 0; left: 25%; width: 50%; height: 1px; background: var(--border-color);
        }
        .section-title p { color: var(--secondary-color); font-size: 1.1rem; margin-top: 1rem; font-style: italic; }
        
        .recipe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 4rem; }
        
        .recipe-card {
            background: transparent; border: none; overflow: hidden;
            transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); cursor: pointer;
            position: relative;
        }
        .recipe-card:hover .card-img { transform: scale(1.05); }
        .img-container { overflow: hidden; border-radius: 4px; margin-bottom: 1.5rem; position: relative; }
        .card-img { 
            width: 100%; height: 350px; object-fit: cover; 
            transition: 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .bookmark-btn {
            position: absolute; top: 15px; right: 15px; width: 40px; height: 40px;
            background: rgba(255, 255, 255, 0.9); border: none; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 1.2rem; color: #ccc; transition: 0.3s;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .bookmark-btn:hover { transform: scale(1.1); }
        .bookmark-btn.active { color: #e74c3c; }
        .card-content { text-align: center; }
        .card-category { 
            display: inline-block; color: var(--primary-color); 
            font-family: var(--font-heading); font-style: italic;
            font-size: 0.9rem; margin-bottom: 0.5rem;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .card-content h3 { font-size: 1.8rem; color: var(--text-color); margin-bottom: 1rem; font-weight: 500; }
        .card-meta { 
            display: flex; justify-content: center; gap: 20px;
            font-size: 0.9rem; color: var(--secondary-color); font-family: var(--font-heading); font-style: italic;
        }
        .card-footer { 
            margin-top: 1rem; display: flex; justify-content: center; gap: 15px;
            color: var(--primary-color); font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
};

const injectDetailStyles = () => {
    const styleId = 'detail-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
        .recipe-detail { padding-top: 5rem; padding-bottom: 8rem; }
        .detail-header { 
            text-align: center; margin-bottom: 6rem; 
        }
        .detail-img { 
            width: 100%; max-width: 900px; height: 500px; object-fit: cover; 
            margin-bottom: 4rem; border-radius: 4px;
        }
        .detail-info { max-width: 800px; margin: 0 auto; }
        .category-badge { 
            color: var(--primary-color); font-weight: 500; font-size: 1rem; 
            margin-bottom: 1.5rem; display: block; letter-spacing: 3px;
            font-family: var(--font-heading); font-style: italic;
        }
        .detail-info h2 { font-size: 4rem; color: var(--text-color); margin-bottom: 2rem; line-height: 1.2; }
        .detail-desc { 
            font-size: 1.2rem; line-height: 2; margin-bottom: 4rem; color: var(--secondary-color); 
            font-family: var(--font-heading); font-style: italic;
            padding: 2rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);
        }
        .recipe-meta { 
            display: flex; justify-content: center; gap: 60px; font-weight: 500; 
            color: var(--text-color); font-size: 1.1rem; margin-bottom: 4rem;
            font-family: var(--font-heading); font-style: italic;
        }
        
        .grid-2 { display: grid; grid-template-columns: 1fr; gap: 6rem; max-width: 800px; margin: 0 auto; }
        .ingredients-card h3, .steps-card h3 { 
            font-size: 2rem; margin-bottom: 3rem; text-align: center;
            color: var(--primary-color);
        }
        .ing-list { list-style: none; border-top: 1px solid var(--border-color); }
        .ing-list li { 
            display: flex; justify-content: space-between; padding: 1.5rem 0; 
            border-bottom: 1px dashed var(--border-color);
            font-size: 1.1rem;
        }
        .step-item { margin-bottom: 6rem; }
        .step-num { 
            font-size: 1.5rem; color: var(--primary-color); margin-bottom: 1.5rem; 
            font-family: var(--font-heading); font-weight: 700; font-style: italic;
            border-bottom: 1px solid var(--primary-color); display: inline-block;
        }
        .step-img { width: 100%; height: 450px; object-fit: cover; margin-bottom: 2rem; border-radius: 4px; }
        .step-desc { font-size: 1.15rem; line-height: 2; color: var(--text-color); }

        .comments-section { max-width: 800px; margin: 8rem auto 0; border-top: 2px solid var(--text-color); padding-top: 4rem; }
        .comments-section h3 { font-size: 2rem; margin-bottom: 3rem; text-align: center; }
        .comment-form { margin-bottom: 4rem; display: flex; flex-direction: column; gap: 1rem; }
        .comment-form textarea { width: 100%; height: 120px; padding: 1.5rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-color); resize: none; font-size: 1rem; }
        .comment-form button { align-self: flex-end; }
        .comment-item { border-bottom: 1px solid var(--border-color); padding: 2rem 0; }
        .comment-header { display: flex; justify-content: space-between; margin-bottom: 1rem; font-family: var(--font-heading); font-style: italic; }
        .comment-user { font-weight: 600; color: var(--text-color); }
        .comment-date { color: var(--secondary-color); font-size: 0.9rem; }
        .comment-text { line-height: 1.8; color: var(--text-color); }
    `;
    document.head.appendChild(style);
};

const injectCreateStyles = () => {
    const styleId = 'create-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
        .create-recipe { padding-top: 3rem; padding-bottom: 8rem; max-width: 900px; margin: 0 auto; }
        .create-recipe h2 { 
            margin-bottom: 5rem; text-align: center; font-size: 3.5rem; 
            color: var(--primary-color); font-style: italic;
        }
        .form-section { background: white; padding: 4rem; border: 1px solid var(--border-color); margin-bottom: 4rem; border-radius: 4px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
        .section-header h3 { font-size: 1.8rem; color: var(--text-color); font-family: var(--font-heading); }
        .input-group { margin-bottom: 3rem; }
        .input-group label { display: block; font-weight: 600; margin-bottom: 1.2rem; color: var(--text-color); font-size: 1.1rem; }
        .input-group input, .input-group select, .input-group textarea { 
            width: 100%; padding: 1.2rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-color); outline: none; transition: 0.3s; font-size: 1.1rem;
        }
        .input-group input:focus, .input-group select:focus, .input-group textarea:focus { background: white; border-color: var(--primary-color); }
        .input-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        .dynamic-row { display: grid; grid-template-columns: 2fr 1fr 50px; gap: 20px; margin-bottom: 1.5rem; }
        .btn-remove { background: #fdf2f2; color: #c0392b; border: 1px solid #fecaca; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border-radius: 4px; }
        .dynamic-row.step { display: grid; grid-template-columns: 50px 1fr 120px 50px; gap: 20px; align-items: start; }
        .step textarea { height: 120px; resize: none; }
        .img-upload-placeholder { 
            width: 100%; height: 350px; background: var(--bg-color); border: 1px dashed var(--border-color); border-radius: 4px; 
            display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--secondary-color); cursor: pointer; transition: 0.3s; gap: 1rem;
        }
        .img-upload-placeholder:hover { border-color: var(--primary-color); color: var(--primary-color); }
        .img-upload-placeholder.small { height: 120px; }
        .img-upload-placeholder i { font-size: 1.8rem; }
        
        .form-actions { display: flex; justify-content: center; gap: 20px; margin-top: 4rem; }
        .form-actions button {
            border: none; padding: 1rem 3rem; font-family: var(--font-heading); font-size: 1.1rem; cursor: pointer; transition: 0.3s;
        }
        .btn-secondary { background: #eee; color: #777; }
        .btn-outline { background: transparent; border: 1px solid var(--border-color) !important; color: var(--secondary-color); }
        .btn-primary { background: var(--primary-color); color: white; }
    `;
    document.head.appendChild(style);
};

/**
 * Initial Load
 */
const renderMyPage = (container) => {
    const myRecipes = state.recipes.filter(r => r.author === 'Yummy Kitchen' || r.author === '궁극의 주방' || r.author === '요리왕');
    const bookmarkedRecipes = state.recipes.filter(r => state.bookmarks.includes(r.id));

    container.innerHTML = `
        <div class="container mypage-view">
            <header class="mypage-header">
                <h2>마이 페이지</h2>
                <p>내가 기록한 맛의 기억들과 찜한 레시피들을 만나보세요.</p>
            </header>

            <section class="mypage-section">
                <div class="section-header">
                    <h3>찜한 레시피 (${bookmarkedRecipes.length})</h3>
                </div>
                <div class="recipe-grid">
                    ${bookmarkedRecipes.length > 0 ?
            bookmarkedRecipes.map(r => RecipeCard(r)).join('') :
            '<p class="empty-msg">아직 찜한 레시피가 없습니다. 마음에 드는 요리를 찜해보세요!</p>'}
                </div>
            </section>

            <section class="mypage-section">
                <div class="section-header">
                    <h3>내가 등록한 레시피 (${myRecipes.length})</h3>
                    <button class="btn-outline" onclick="navigateTo('create')">새 레시피 등록</button>
                </div>
                <div class="recipe-grid">
                    ${myRecipes.length > 0 ?
            myRecipes.map(r => RecipeCard(r)).join('') :
            '<p class="empty-msg">직접 등록한 레시피가 없습니다.</p>'}
                </div>
            </section>
        </div>
    `;
    injectMyPageStyles();
};

const injectMyPageStyles = () => {
    const styleId = 'mypage-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
        .mypage-view { padding-top: 5rem; padding-bottom: 8rem; }
        .mypage-header { text-align: center; margin-bottom: 6rem; }
        .mypage-header h2 { font-size: 3.5rem; color: var(--primary-color); font-style: italic; margin-bottom: 1rem; }
        .mypage-header p { color: var(--secondary-color); font-family: var(--font-heading); font-style: italic; font-size: 1.1rem; }
        .mypage-section { margin-bottom: 6rem; }
        .mypage-section .section-header { 
            display: flex; justify-content: space-between; align-items: center; 
            margin-bottom: 3rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;
        }
        .mypage-section h3 { font-size: 1.8rem; color: var(--text-color); font-family: var(--font-heading); }
        .empty-msg { text-align: center; grid-column: 1 / -1; padding: 4rem; color: var(--secondary-color); font-style: italic; }
    `;
    document.head.appendChild(style);
};

document.addEventListener('DOMContentLoaded', () => {
    render();
});
