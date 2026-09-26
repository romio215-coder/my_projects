/* All guestbook values are untrusted, including imported legacy dates. */
(function (root) {
    'use strict';
    const boards = [];
    function element(tag, className, text) {
        const node = document.createElement(tag);
        node.className = className;
        if (text !== undefined) node.textContent = String(text ?? '');
        return node;
    }
    function render(list, rows, theme = {}) {
        list.replaceChildren();
        if (!rows.length) {
            list.appendChild(element('p', 'text-center text-gray-500 p-4', '아직 남겨진 추억이 없습니다. 첫 번째 추억을 남겨보세요!'));
        }
        for (const row of rows) {
            const card = element('div', theme.card || 'bg-white p-3 rounded shadow-sm border border-gray-100 mb-3');
            const header = element('div', 'flex justify-between items-center mb-1');
            header.appendChild(element('span', theme.name || 'font-bold text-green-800 text-sm', row.name));
            const date = row.legacy_date || new Date(row.created_at).toLocaleDateString('ko-KR');
            header.appendChild(element('span', 'text-xs text-gray-400', date));
            card.appendChild(header);
            card.appendChild(element('p', (theme.text || 'text-gray-700 text-sm') + ' whitespace-pre-wrap break-words', row.text));
            list.appendChild(card);
        }
    }
    function register(config) { boards.push(config); }
    async function start(client, settings = {}) {
        for (const board of boards) {
            const list = document.getElementById(board.list);
            const name = document.getElementById(board.name);
            const message = document.getElementById(board.message);
            const button = document.querySelector(`[onclick="${board.handler}()"]`);
            if (!list || !name || !message || !button) continue;
            name.maxLength = 20;
            message.maxLength = 1000;
            button.removeAttribute('onclick');
            const status = element('p', 'text-sm py-2', '');
            status.setAttribute('role', 'status');
            message.insertAdjacentElement('afterend', status);
            const refresh = async () => {
                try {
                    if (!client) throw new Error('Unavailable');
                    const { data, error } = await client.from('guestbook_entries')
                        .select('id,name,text,created_at,legacy_date').eq('board', board.board)
                        .order('created_at', { ascending: false }).order('id', { ascending: false }).limit(50);
                    if (error) throw error;
                    render(list, data || [], board.theme);
                } catch {
                    list.replaceChildren(element('p', 'text-center p-4', '추억을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'));
                }
            };
            // Observe only visible boards instead of opening 29 persistent subscriptions.
            const reload = element('button', 'text-sm underline mb-2', '새로고침');
            reload.type = 'button';
            reload.addEventListener('click', refresh);
            list.insertAdjacentElement('beforebegin', reload);
            if (root.IntersectionObserver) {
                const observer = new IntersectionObserver(entries => {
                    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void refresh(); }
                });
                observer.observe(list);
            } else { void refresh(); }
            let busy = false;
            let widget;
            let token = '';
            const captcha = element('div', 'my-2');
            status.insertAdjacentElement('beforebegin', captcha);
            const ensureCaptcha = () => {
                if (widget !== undefined || !settings.sitekey || !root.turnstile) return;
                widget = root.turnstile.render(captcha, {
                    sitekey: settings.sitekey, action: 'guestbook',
                    callback: value => { token = value; status.textContent = '확인이 완료되었습니다. 남기기를 눌러주세요.'; },
                    'expired-callback': () => { token = ''; },
                    'error-callback': () => { token = ''; status.textContent = '자동 입력 방지 확인을 다시 시도해주세요.'; }
                });
            };
            message.addEventListener('focus', ensureCaptcha);
            button.addEventListener('click', async () => {
                if (busy) return;
                const payload = { board: board.board, name: name.value.trim(), text: message.value.trim(), token };
                if (!payload.name || !payload.text || [...payload.name].length > 20 || [...payload.text].length > 1000) {
                    status.textContent = '이름은 1~20자, 내용은 1~1,000자로 입력해주세요.'; return;
                }
                if (!client || !settings.sitekey || !root.turnstile) {
                    status.textContent = '지금은 글을 저장할 수 없습니다. 잠시 후 다시 시도해주세요.'; return;
                }
                if (!token) { ensureCaptcha(); status.textContent = '자동 입력 방지 확인을 완료한 뒤 다시 눌러주세요.'; return; }
                busy = true; button.disabled = true; status.textContent = '저장 중…';
                try {
                    const { error } = await client.functions.invoke('guestbook-submit', { body: payload });
                    if (error) throw error;
                    // Keep edits made while the request was in flight.
                    if (name.value.trim() === payload.name) name.value = '';
                    if (message.value.trim() === payload.text) message.value = '';
                    status.textContent = '추억을 남겼습니다.';
                    await refresh();
                } catch {
                    status.textContent = '저장 여부를 확인하지 못했습니다. 새로고침으로 확인한 뒤 다시 시도해주세요.';
                } finally {
                    token = ''; if (widget !== undefined) root.turnstile.reset(widget);
                    busy = false; button.disabled = false;
                }
            });
        }
    }
    root.RetroGuestbook = { register, start, render };
})(typeof window === 'undefined' ? globalThis : window);
