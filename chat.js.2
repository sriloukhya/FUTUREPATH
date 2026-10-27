// Chat widget. Talks to the Netlify Function at /.netlify/functions/chat
(function () {
  const box = document.getElementById('chat'), cm = document.getElementById('cm'), ci = document.getElementById('ci'),
        cs = document.getElementById('cs'), cc = document.getElementById('cc'), cl = document.getElementById('cl'), cx = document.getElementById('cx');
  const add = (c, t) => { const d = document.createElement('div'); d.className = c; d.textContent = t; cm.appendChild(d); cm.scrollTop = cm.scrollHeight; return d; };
  const setOpen = (o) => { box.classList.toggle('open', o); cl.setAttribute('aria-expanded', o); cl.textContent = o ? 'Close chat' : '\uD83D\uDCAC Ask FuturePath'; if (o) ci.focus(); };
  cl.onclick = () => setOpen(!box.classList.contains('open')); cx.onclick = () => setOpen(false);
  box.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  add('b', 'Hi! I\u2019m FuturePath\u2019s guide. What do you enjoy doing most? For example: solving puzzles, biology, money and business, stories and people, or building things.');
  ['I like computers and solving problems', 'My family has a low budget. What can I do?', 'Which scholarships can I apply for?', 'Which exams do I need for B.Tech?']
    .forEach((t) => { const b = document.createElement('button'); b.textContent = t; b.onclick = () => send(t); cc.appendChild(b); });
  const hist = []; let busy = false;
  async function send(q) {
    q = (q || ci.value).trim(); if (!q || busy) return;
    busy = true; cc.style.display = 'none'; cs.disabled = true; ci.value = '';
    add('u', q); const bub = add('b', 'Thinking\u2026');
    try {
      const res = await fetch('/.netlify/functions/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: hist.slice(-8).concat([{ r: 'u', c: q }]) }) });
      if (res.status === 404) throw new Error('local');
      if (res.status === 429) throw new Error('rate');
      if (!res.ok) throw new Error('fail');
      const j = await res.json(); bub.textContent = j.reply; hist.push({ r: 'u', c: q }, { r: 'b', c: j.reply });
    } catch (e) {
      bub.textContent = e.message === 'local' ? 'The guide works on the deployed website. It is not available in the local preview.'
        : e.message === 'rate' ? 'Too many questions at once. Please wait a moment and try again.'
        : 'Sorry, I could not answer that. Please try again.';
    }
    busy = false; cs.disabled = false; ci.focus();
  }
  cs.onclick = () => send(); ci.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
})();
