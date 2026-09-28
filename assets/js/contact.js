/* 送信を行わないお問い合わせデモ。入力内容はsessionStorage内だけで扱います。 */
(() => {
  "use strict";
  const key = "soken.contact.demo.v1";
  const completedKey = "soken.contact.demo.completed";
  const types = { business: "工事・事業に関するご相談", recruit: "採用に関するご相談", other: "その他" };
  const labels = { type: "お問い合わせ種別", name: "お名前", email: "メールアドレス", company: "会社名", phone: "電話番号", message: "お問い合わせ内容" };
  const limits = { name: 80, email: 254, company: 120, phone: 30, message: 3000 };
  const form = document.querySelector("[data-contact-form]");
  const read = () => {
    try { return JSON.parse(sessionStorage.getItem(key) || "null"); } catch { return null; }
  };
  const valid = data => data && Object.hasOwn(types, data.type) &&
    ["name", "email", "message"].every(k => typeof data[k] === "string" && data[k].trim()) &&
    Object.keys(limits).every(k => typeof data[k] === "string" && data[k].length <= limits[k]) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && data.consent === true;

  if (form) {
    const summary = document.querySelector("[data-error-summary]");
    const restore = () => {
      const data = read();
      if (valid(data)) {
        Object.keys(labels).forEach(k => { form.elements[k].value = data[k]; });
        form.elements.consent.checked = true;
      } else {
        form.reset();
        const type = new URL(location.href).searchParams.get("type");
        if (Object.hasOwn(types, type)) form.elements.type.value = type;
      }
    };
    restore();
    window.addEventListener("pageshow", event => { if (event.persisted) restore(); });
    form.querySelector('button[type="submit"]').disabled = false;
    form.addEventListener("submit", event => {
      event.preventDefault();
      summary.hidden = true;
      summary.replaceChildren();
      const data = {};
      const errors = [];
      Object.keys(labels).forEach(k => { data[k] = form.elements[k].value.trim(); });
      data.consent = form.elements.consent.checked;
      const check = (k, message) => {
        const input = form.elements[k];
        const error = document.getElementById(k + "-error");
        error.hidden = !message;
        error.textContent = message || "";
        input.setAttribute("aria-invalid", String(Boolean(message)));
        if (message) errors.push({ k, message });
      };
      check("type", Object.hasOwn(types, data.type) ? "" : "お問い合わせ種別を選択してください。");
      check("name", !data.name ? "お名前を入力してください。" : data.name.length > limits.name ? "お名前は80文字以内で入力してください。" : "");
      check("email", !data.email ? "メールアドレスを入力してください。" : data.email.length > limits.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? "メールアドレスの形式を確認してください。" : "");
      check("company", data.company.length > limits.company ? "会社名は120文字以内で入力してください。" : "");
      check("phone", data.phone.length > limits.phone ? "電話番号は30文字以内で入力してください。" : "");
      check("message", !data.message ? "お問い合わせ内容を入力してください。" : data.message.length > limits.message ? "お問い合わせ内容は3,000文字以内で入力してください。" : "");
      check("consent", data.consent ? "" : "プライバシーポリシーとデモの説明を確認し、チェックしてください。");
      if (errors.length) {
        const title = document.createElement("p");
        title.textContent = "入力内容を確認してください。";
        const list = document.createElement("ul");
        errors.forEach(({ k, message }) => {
          const item = document.createElement("li");
          const link = document.createElement("a");
          link.href = "#" + k;
          link.textContent = message;
          link.addEventListener("click", () => form.elements[k].focus());
          item.append(link);
          list.append(item);
        });
        summary.append(title, list);
        summary.hidden = false;
        summary.focus();
        return;
      }
      try {
        sessionStorage.setItem(key, JSON.stringify(data));
        sessionStorage.removeItem(completedKey);
        location.assign("./contact-confirm.html");
      } catch {
        summary.textContent = "ブラウザの一時保存が利用できません。サイトデータの保存設定をご確認ください。入力内容は送信されていません。";
        summary.hidden = false;
        summary.focus();
      }
    });
  }

  const confirm = document.querySelector("[data-contact-confirm]");
  const complete = document.querySelector("[data-contact-complete]");
  const update = () => {
    if (confirm) {
      const data = read();
      const ready = valid(data);
      confirm.hidden = !ready;
      // 案内ボックス削除後は、確認できるデータがなければ入力画面へ戻す。
      if (!ready) { location.replace("./contact.html"); return; }
      const dl = document.querySelector("[data-confirm-values]");
      dl.replaceChildren();
      if (ready) Object.entries(labels).forEach(([k, label]) => {
        const row = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = label;
        dd.textContent = k === "type" ? types[data[k]] : data[k] || "未入力";
        row.append(dt, dd);
        dl.append(row);
      });
    }
    if (complete) {
      let ready = false;
      try { ready = sessionStorage.getItem(completedKey) === "true"; } catch {}
      complete.hidden = !ready;
      if (!ready) { location.replace("./contact.html"); return; }
    }
  };
  update();
  window.addEventListener("pageshow", update);
  document.querySelector("[data-demo-complete]")?.addEventListener("click", () => {
    if (!valid(read())) { update(); return; }
    try {
      sessionStorage.removeItem(key);
      sessionStorage.setItem(completedKey, "true");
      location.assign("./contact-complete.html");
    } catch {
      let error = document.querySelector("[data-contact-storage-error]");
      if (!error) {
        error = document.createElement("p");
        error.className = "p-sub-error";
        error.setAttribute("data-contact-storage-error", "");
        error.setAttribute("role", "alert");
        confirm.append(error);
      }
      error.textContent = "一時保存の削除に失敗しました。ブラウザのサイトデータを消去してください。送信は行われていません。";
    }
  });
})();
