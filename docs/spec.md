## 🌐 サイト概要

**目的**
世界の国旗を表示して、ユーザーが国名を当てるクイズを提供するWebサイト。
ユーザーは「答えを見る」「次の問題」ボタンを操作しながらクイズを楽しむ。

**収益モデル**
Google AdSenseによる広告収益化

## ✅ 要件定義（確定版）

### 1. 機能要件（Next.js CSR）

| 機能         | 説明                              |
| ---------- | ------------------------------- |
| 国旗の出題      | `flagcdn.com` から取得した国旗画像をランダム表示 |
| 「答えを見る」ボタン | 国名を表示（日本語名）                     |
| 「次の問題」ボタン  | 新しい国旗に切り替え                      |
| クイズ継続      | 操作は無限にループ可能                     |
| レスポンシブ対応   | モバイル・PC両対応のUI（Tailwind CSS）     |


### 2. 非機能要件

| 項目       | 内容                                         |
| -------- | ------------------------------------------ |
| 開発技術     | **Next.js（CSR）**                           |
| 言語       | **TypeScript**                             |
| UI       | **Tailwind CSS**                           |
| ホスティング   | **Amazon S3 + CloudFront**（静的サイト）          |
| 広告ネットワーク | **Google AdSense**                         |
| 画像ソース    | [https://flagcdn.com](https://flagcdn.com) |
| SEO      | 最小限対応（metaタグ、Open Graph）                   |

### 3. UI仕様（ユーザー操作フロー）

```plaintext
[ 国旗画像表示（中央） ]
      ▼
[ 答えを見る ] ← 押すと国名が表示される
      ▼
[ 答え：アルゼンチン ]
      ▼
[ 次の問題 ]
```

* UI構成は1画面で完結
* 操作はすべてボタンで制御

### 4. データ仕様

#### 国名リスト（取得元）

* URL: [https://flagcdn.com/ja/codes.json](https://flagcdn.com/ja/codes.json)
* 形式:

```json
{
  "af": "アフガニスタン",
  "al": "アルバニア",
  ...
}
```

#### 国旗画像URL

* URL形式: `https://flagcdn.com/w320/{code}.png`

  * 例: `https://flagcdn.com/w320/jp.png`


### 5. 広告仕様（Google AdSense）

| 項目        | 内容                        |
| --------- | ------------------------- |
| ネットワーク    | **Google AdSense**        |
| 導入方法      | `next/script` によるスクリプト設置  |
| 広告タイプ（初期） | ページ下部バナー広告 or インフィード広告    |
| 将来的な拡張    | 操作回数に応じたインタースティシャル広告も検討可能 |

**例: AdSenseスニペット**

```tsx
import Script from 'next/script';

<Script
  id="adsense-script"
  async
  strategy="afterInteractive"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_CLIENT_ID"
  crossOrigin="anonymous"
/>
```

### 6. ディレクトリ構成 （Next.js App Router）

```
/app/
  └ page.tsx              ← クイズメイン画面（クライアントコンポーネント）
  └ layout.tsx            ← ルートレイアウト（metaタグ、AdSenseスクリプト等）
/components/
  └ FlagQuiz.tsx          ← クイズのUI＆ロジック（クライアントコンポーネント）
/lib/
  └ getCountryData.ts     ← codes.json取得・整形ロジック
/public/
  └ favicon.ico           ← サイトアイコン（任意）
/styles/
  └ globals.css           ← Tailwind CSSスタイル
  └ tailwind.config.ts    ← Tailwind 設定
  └ postcss.config.js     ← PostCSS 設定
```


#### 🔧 ファイルごとの役割

| ファイル                      | 内容                                         |
| ------------------------- | ------------------------------------------ |
| `app/page.tsx`            | トップページでクイズを表示（CSR）                         |
| `app/layout.tsx`          | HTML構造全体と `<head>`、Google AdSense用のスクリプト挿入 |
| `components/FlagQuiz.tsx` | ボタン操作、国旗表示、国名表示のロジックとUI                    |
| `lib/getCountryData.ts`   | `codes.json` を取得し、`{ code, name }[]` に変換   |
| `styles/globals.css`      | Tailwind CSS 初期スタイル                        |
| `tailwind.config.ts`      | Tailwind のカスタマイズ設定                         |
| `postcss.config.js`       | PostCSSの基本設定                               |

#### 💡 App RouterでのCSR構成ポイント

* `FlagQuiz.tsx` と `page.tsx` は両方とも `"use client"` を指定（CSRのため）
* `layout.tsx` に AdSense スクリプトを挿入（`<Script>`）
* `fetch` によるデータ取得もクライアントで完結
* `next export` で静的出力可能（App Router対応）


### 7. 実装ステップ

1. `codes.json` をフロントエンドから取得・整形
2. 国旗画像をランダムに表示
3. ユーザー操作で答えを表示・次の問題へ
4. Tailwind CSS でレスポンシブUI構築
5. AdSense スクリプト挿入＆動作確認
6. `next export` で静的生成 → S3 & CloudFrontにデプロイ
7. AdSenseの審査申請 & 公開
