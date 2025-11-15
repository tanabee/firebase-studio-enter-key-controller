# Firebase Studio Enter Key Controller

Firebase Studio で Enter キーの挙動を逆転させ、誤送信を防ぐ Chrome 拡張機能です。チャットやテキスト入力欄で Enter を押しても送信されず、必要なときだけ Shift+Enter で送信できます。

## 特徴

- Firebase Studio と関連ドメインを自動検出して有効化
- iframe 内を含む全ての入力欄 (`input` / `textarea` / `contenteditable`) をサポート
- IME 変換中は Enter を無視して誤動作を回避

### キーボード挙動

| 操作             | 動作                     |
| ---------------- | ------------------------ |
| Enter            | 改行を挿入（送信しない） |
| Shift + Enter    | フォームを送信           |

## 対応サイト

- `https://studio.firebase.google.com/*`
- `https://*.cloudworkstations.dev/*`
- `https://*.cloudworkstations.googleusercontent.com/*`

## インストール

1. このリポジトリをダウンロードまたはクローンする
2. Chrome で `chrome://extensions` を開く
3. 右上の「デベロッパーモード」をオンにする
4. 「パッケージ化されていない拡張機能を読み込む」をクリックし、本リポジトリのディレクトリを選択

インストール後は対象の Firebase Studio ページを再読み込みすると拡張が有効になります。

## 動作概要

- `keydown` と `keypress` をキャプチャフェーズでフック
- 通常の Enter は `preventDefault` で抑止し、改行を手動挿入
- Shift+Enter のみフォーム送信を許可し、ループ防止用の `isSimulatingEnter` フラグでイベントの再入を防ぐ

## 開発メモ

ローカルで追加の URL に対応させたい場合は `manifest.json` の `content_scripts.matches` を編集してください。変更後は Chrome の拡張機能一覧で「再読み込み」をクリックして反映できます。
