# 蒼建株式会社：制作開始用ひな形

道路・橋梁・排水設備の3分野を扱う架空企業の自主制作サイトです。
Codexがデザインを作成し、制作者自身がコーディングとWordPress化を進めます。

## ファイル構成

```text
蒼建株式会社/
├── index.html
├── assets/
│   ├── css/
│   │   ├── reset.css
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       └── .gitkeep
├── README.md
└── soken-website-production-plan.pdf
```

- `index.html`：ポートフォリオと同じ読み込み方法とクラス名を使った基本構造です。ヘッダー、空のmain、フッターを用意しています。各セクションとh1はデザイン確定後に追加します。
- `reset.css`：ポートフォリオのリセットCSSを引き継いでいます。
- `style.css`：FLOCSSの区分ごとにCSSを追加するファイルです。共通の文字設定、余白変数、コンテナーを用意しています。
- `main.js`：必要なJavaScriptを追加するファイルです。メニューなどの処理は対応するHTMLができてから追加します。
- `images/`：このサイトで使う画像を保存します。`.gitkeep`は空フォルダーをGitで残すためのファイルです。
- `soken-website-production-plan.pdf`：既存の制作書です。

## FLOCSSの書き分け

ポートフォリオと同様に、CSSはまず`style.css`の1ファイルで管理します。
Sassやビルド環境は不要です。

| 区分 | 用途 | クラス名の例 |
| --- | --- | --- |
| Foundation | リセット・変数・サイト全体の基本設定 | `:root`、`body` |
| Layout | ヘッダー・本文・フッターなどの大枠 | `.l-header`、`.l-main`、`.l-footer` |
| Object / Component | 繰り返し使う共通部品 | `.c-button` |
| Object / Project | ナビゲーション・各エリア固有の部品 | `.p-global-nav` |
| Object / Utility | 補助的な指定 | `.u-visually-hidden` |

部品の中の要素は`__`、種類の違いは`--`で表します。
例：`.l-header__inner`、`.c-button--primary`。

共通・SP用のCSSを先に書き、PC用の変更を末尾のメディアクエリに書きます。
配色、書体、コンテナー幅、1024pxの切り替え幅は初期値です。デザインに合わせて調整します。

## 制作の始め方

1. VS Codeでこのフォルダーを開きます。
2. `index.html`をLive Serverなどで開きます。直接ブラウザーで開いても基本表示を確認できます。
3. デザイン確定後、`main`内に見出しと各セクションを追加します。
4. CSSと必要なJavaScriptを記述し、PC・SPの表示を確認します。
5. 静的サイトができた後、WordPress化を進めます。

現時点では会社名とフッターの文字が表示されます。
ヘッダーとフッターは`main`の外に置いてあります。
WordPress化の際に、それぞれ`header.php`・`footer.php`に分けやすい構造です。
CSS・JavaScriptの読み込みは、その段階でWordPressの読み込み方法へ変更します。
