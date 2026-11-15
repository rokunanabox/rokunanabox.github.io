// 飲みドコ サポートページのお問い合わせ: 匿名でサインインして contacts に1件書く(誰も読めない。運営が Firebase コンソールで見る)
(function () {
  // 飲みドコ(Firebase プロジェクト sakabazu)の公開設定。この値は公開して問題ない(データはルールで守る)
  const CONFIG = { apiKey: 'AIzaSyDWN7YFaE0_UOtvp17wwX9FjrPTxY1_qX4', authDomain: 'sakabazu.firebaseapp.com', projectId: 'sakabazu', storageBucket: 'sakabazu.firebasestorage.app', messagingSenderId: '775299935947', appId: '1:775299935947:web:b4b16acda8cc3a4600b54e' };
  const $ = id => document.getElementById(id);
  const form = $('cf'), msg = $('msg'), btn = $('send');
  const say = (t, ok) => { msg.textContent = t; msg.className = 'msg ' + (ok ? 'ok' : 'ng'); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = $('text').value.trim(), reply = $('reply').value.trim();
    if (!text) { say('内容を書いてください', false); return; }
    if (!window.firebase) { say('送れませんでした。時間をおいて、もう一度お試しください', false); return; }
    btn.disabled = true; say('送っています…', true);
    try {
      const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(CONFIG);
      const auth = app.auth(), db = app.firestore();
      if (/[?&]emu\b/.test(location.search) && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !window._emu) {
        window._emu = 1; auth.useEmulator('http://localhost:9099'); db.useEmulator('localhost', 8085);
      }
      const u = auth.currentUser || (await auth.signInAnonymously()).user;
      await db.collection('contacts').add({
        by: u.uid, kind: $('kind').value, text: text.slice(0, 2000), reply: reply.slice(0, 200), from: 'web', ver: '', at: Date.now(),
      });
      form.reset(); say('送りました。ありがとうございます。', true);
    } catch (err) {
      console.warn(err); say('送れませんでした。通信状態を確かめて、もう一度お試しください', false);
    }
    btn.disabled = false;
  });
})();
