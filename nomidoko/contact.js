// 飲みドコ サポートページの「不具合・ご要望を送る」(返信はしない。データ・アカウント削除の依頼だけ、本人確認のため返信先を受け取る): 匿名でサインインして contacts に1件書く(誰も読めない。運営が Firebase コンソールで見る)
(function () {
  // 飲みドコ(Firebase プロジェクト sakabazu)の公開設定。この値は公開して問題ない(データはルールで守る)
  const CONFIG = { apiKey: 'AIzaSyDWN7YFaE0_UOtvp17wwX9FjrPTxY1_qX4', authDomain: 'sakabazu.firebaseapp.com', projectId: 'sakabazu', storageBucket: 'sakabazu.firebasestorage.app', messagingSenderId: '775299935947', appId: '1:775299935947:web:b4b16acda8cc3a4600b54e' };
  const $ = id => document.getElementById(id);
  const form = $('cf'), msg = $('msg'), btn = $('send');
  // データ・アカウント削除のときだけ、返信先を出す(本人を確かめるため。ほかは返信しない)
  const kindSel = $('kind'), box = $('replyBox');
  const sync = () => { box.hidden = kindSel.value !== 'data'; };
  kindSel.addEventListener('change', sync); sync();
  const say = (t, ok) => { msg.textContent = t; msg.className = 'msg ' + (ok ? 'ok' : 'ng'); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = $('text').value.trim(), data = kindSel.value === 'data', reply = data ? $('reply').value.trim() : '';
    if (!text) { say('内容を書いてください', false); return; }
    if (data && !reply) { say('データ・アカウント削除の依頼は、返信先を書いてください', false); return; }
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
        by: u.uid, kind: $('kind').value, text: text.slice(0, 2000), ...(reply ? { reply: reply.slice(0, 200) } : {}), from: 'web', ver: '', at: Date.now(),
      });
      form.reset(); sync(); say('送りました。ありがとうございます。', true);
    } catch (err) {
      console.warn(err); say('送れませんでした。通信状態を確かめて、もう一度お試しください', false);
    }
    btn.disabled = false;
  });
})();
