// Enterキーのイベントを制御
function setupEnterKeyPrevention() {

  // ループ防止フラグ
  let isSimulatingEnter = false;

  // キーダウンイベントをキャプチャフェーズで捕捉（window レベルで最優先）
  window.addEventListener('keydown', function(e) {
    // ループ防止：シミュレート中のイベントは無視
    if (isSimulatingEnter) {
      return;
    }

    if ((e.key === 'Enter' || e.keyCode === 13)) {
      const target = e.target;

      // Shift+Enter の場合は通常のEnterとしてSubmitさせる
      if (e.shiftKey) {
        if (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable) {

          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // ループ防止フラグを立てる
          isSimulatingEnter = true;

          // 通常のEnterキーイベントをシミュレート（shiftKeyなし）
          const simulatedEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            shiftKey: false
          });

          target.dispatchEvent(simulatedEvent);

          // keypressイベントもシミュレート
          const simulatedKeypress = new KeyboardEvent('keypress', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            shiftKey: false
          });

          target.dispatchEvent(simulatedKeypress);

          // フォームがある場合は直接submit
          const form = target.closest('form');
          if (form) {
            form.submit();
          }

          // フラグをリセット
          setTimeout(() => {
            isSimulatingEnter = false;
          }, 100);

          return false;
        }
      }

      // 通常のEnter（shiftKeyなし）の場合は防止
      if (!e.shiftKey) {
        if (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable) {

          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // IME変換中でない場合のみ改行を挿入
          if (!e.isComposing) {
            // contenteditable要素の場合、改行を挿入
            if (target.isContentEditable) {
              const selection = window.getSelection();
              const range = selection.getRangeAt(0);
              range.deleteContents();

              const br = document.createElement('br');
              range.insertNode(br);

              // カーソルを改行の後に移動
              range.setStartAfter(br);
              range.setEndAfter(br);
              selection.removeAllRanges();
              selection.addRange(range);

              // inputイベントを発火してアプリケーションに変更を通知
              target.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // TEXTAREA要素の場合、改行を挿入
            else if (target.tagName === 'TEXTAREA') {
              const start = target.selectionStart;
              const end = target.selectionEnd;
              const value = target.value;

              target.value = value.substring(0, start) + '\n' + value.substring(end);
              target.selectionStart = target.selectionEnd = start + 1;

              // inputイベントを発火
              target.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // INPUTの場合はpreventDefaultのみ（改行不可）
          }

          return false;
        }
      }
    }
  }, true);

  // キープレスイベントも念のため制御
  document.addEventListener('keypress', function(e) {
    if (isSimulatingEnter) {
      return;
    }
    if ((e.key === 'Enter' || e.keyCode === 13)) {
      const target = e.target;
      // Shift+Enterはスルー（シミュレート処理で対応済み）
      if (e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      // 通常のEnterは防止
      if (!e.shiftKey) {
        if (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      }
    }
  }, true);

}

// ページ読み込み時に初期化
setupEnterKeyPrevention();
