(function () {
    const groups = {
        '80s': [
            ['놀이·학교', [['playground','골목놀이'],['school','국민학교'],['store','문방구'],['arcade','오락실']]],
            ['생활·거리', [['eating','졸업식 외식'],['street','거리풍경'],['fashion','패션']]],
            ['음악·영화', [['media','TV·미디어'],['culture-sound','음악·롤러'],['culture-visual','만화·극장'],['culture-noir','홍콩영화']]],
            ['역사·뉴스', [['timeline','역사·뉴스'],['reunion','이산가족']]],
            ['추억갤러리', [['prompts','추억갤러리']]]
        ],
        '90s': [
            ['놀이·학교', [['playground','골목놀이'],['school','학교생활'],['store','문방구'],['basketball','농구대잔치'],['hobbies','추억의 놀이']]],
            ['생활·유행', [['trends','유행과 수집']]],
            ['음악·방송', [['sitcom','시트콤'],['indie','인디밴드']]],
            ['역사·뉴스', [['timeline','역사·뉴스'],['society','사회·이슈']]],
            ['추억갤러리', [['prompts','추억갤러리']]]
        ]
    };
    let era = '80s', selected = 'playground';
    const customLabels = new Map();
    function button(label, active, action) {
        const node = document.createElement('button');
        node.type = 'button'; node.textContent = label;
        node.setAttribute('aria-pressed', String(active));
        node.addEventListener('click', action);
        return node;
    }
    function render(nextEra = era, section = selected) {
        if (!groups[nextEra]) return;
        era = nextEra; selected = section;
        const nav = document.getElementById('dynamic-nav');
        const sub = document.getElementById('section-nav');
        if (!nav || !sub) return;
        const focus = document.activeElement;
        const focusGroup = focus?.dataset.group;
        const focusSection = focus?.dataset.section;
        const current = groups[era].findIndex(group => group[1].some(item => item[0] === selected));
        nav.replaceChildren(); sub.replaceChildren();
        groups[era].forEach(([label, items], index) => {
            const li = document.createElement('li');
            const parent = button(label, index === current, () => window.navTo(items[0][0]));
            parent.dataset.group = String(index);
            parent.setAttribute('aria-controls', 'section-nav');
            li.appendChild(parent); nav.appendChild(li);
        });
        const items = groups[era][current]?.[1] || [];
        // A single-item category is already a direct link; don't repeat its label.
        sub.hidden = items.length <= 1;
        if (items.length > 1) for (const [id, label] of items) {
            const child = button(customLabels.get(id) || label, id === selected, () => window.navTo(id));
            child.id = 'btn-' + id; child.dataset.section = id;
            child.className = 'nav-btn' + (id === selected ? ' tab-active' : '');
            sub.appendChild(child);
        }
        // Keep keyboard focus when a selection rebuilds the menu.
        if (focusGroup !== undefined) nav.querySelector(`[data-group="${focusGroup}"]`)?.focus({ preventScroll: true });
        else if (focusSection !== undefined) {
            Array.from(sub.children).find(node => node.dataset.section === focusSection)?.focus({ preventScroll: true });
        }
    }
    function updateMenu(menu) {
        customLabels.clear();
        for (const item of menu || []) {
            if (item.is_active === false || typeof item.action_id !== 'string' || typeof item.label !== 'string') continue;
            const id = item.action_id;
            // Custom DB destinations must point to an existing section in that era.
            for (const key of ['80s', '90s']) {
                const target = document.getElementById(id + (key === '90s' ? '-90s' : ''));
                if (!target?.classList.contains(key === '90s' ? 'section-content-90s' : 'section-content')) continue;
                if (!groups[key].some(group => group[1].some(entry => entry[0] === id))) {
                    let extra = groups[key].find(group => group[0] === '더보기');
                    if (!extra) { extra = ['더보기', []]; groups[key].push(extra); }
                    extra[1].push([id, item.label]);
                }
                customLabels.set(id, item.label.replace(/^\S+\s+(?=[가-힣])/, match => /[a-zA-Z가-힣]/.test(match) ? match : ''));
            }
        }
        render();
    }
    window.RetroNavigation = { render, updateMenu };
})();
