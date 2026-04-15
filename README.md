# Cleanup & Conversion Toolkit

非エンジニア向けの「面倒な整理・変換作業をブラウザ上で簡単に終わらせる」ための、日英対応 Web ツールサイトです。

- Next.js App Router / TypeScript / Tailwind CSS
- `next-intl` による `/ja` / `/en` ベースの言語切り替え
- できるだけローカル処理中心
- ツール単体で終わらず、ガイド記事や固定ページも含めたテーマ型サイト構成

## 現在の実装内容

### ツール

- テキスト整形
- ファイル一括リネーム
- 画像一括リサイズ / WebP変換
- CSV / Excel クリーナー
- PDFページ整理
- SRT / VTT 字幕ずらし・変換

### コンテンツ

- ホーム
- ツール一覧
- ガイド一覧
- ガイド記事詳細
- このサイトについて
- 使い方ガイド
- よくある質問
- プライバシーポリシー
- 利用規約
- お問い合わせ
- 運営者情報

## セットアップ

### 前提

- Node.js 20 以上を推奨
- npm を使用

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで以下を開きます。

- [http://localhost:3000/ja](http://localhost:3000/ja)
- [http://localhost:3000/en](http://localhost:3000/en)

### 本番ビルド確認

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## 環境変数

最低限、公開時は以下を設定してください。

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

これが未設定だと、`metadata` / `canonical` / `sitemap` / `robots` で `https://example.com` が使われます。

## 使用ライブラリ

### アプリ本体

- `next`
- `react`
- `react-dom`
- `next-intl`

### ツール処理

- `jszip`
  - 一括ダウンロード用 ZIP 生成
- `xlsx`
  - CSV / TSV / XLSX / XLS の読み込みと書き出し
- `pdf-lib`
  - PDF ページ並び替え・削除後の再生成

### 開発

- `typescript`
- `eslint`
- `eslint-config-next`
- `tailwindcss`
- `@tailwindcss/postcss`
- `@types/node`
- `@types/react`
- `@types/react-dom`

## ディレクトリ構成

```text
src/
  app/                 App Router routes
  components/          UI / layout / guide / tool components
  config/              site, operator などの設定
  content/             ツール本文、固定ページ本文、ガイド本文
  i18n/                next-intl routing / navigation
  lib/                 metadata、SEO、処理ロジック、整形ロジック
messages/              next-intl 用の翻訳辞書
```

### 役割の分け方

- `components`
  - 見た目と再利用 UI
- `lib`
  - 変換処理、metadata、structured data、共通組み立て
- `content`
  - ページ本文、ツール説明、ガイド記事本文
- `messages`
  - 翻訳辞書
- `config`
  - サイト全体設定や運営者情報

## ルーティング

### 言語

- `/ja`
- `/en`

### 主要ページ

- `/[locale]`
- `/[locale]/tools`
- `/[locale]/tools/[slug]`
- `/[locale]/guide`
- `/[locale]/guide/[slug]`
- `/[locale]/about`
- `/[locale]/faq`
- `/[locale]/privacy`
- `/[locale]/terms`
- `/[locale]/contact`
- `/[locale]/operator`

未対応 locale は 404 になります。

## SEO / 内部リンクの現状

- 各ページで `metadata` を設定
- `canonical` / `languages` alternates を設定
- `sitemap.ts` / `robots.ts` あり
- ツールページに関連ツール / 関連記事 / FAQ を表示
- ガイド一覧と記事詳細あり
- `JSON-LD` の土台あり
  - Home: `WebSite`, `CollectionPage`, `FAQPage`
  - Tool: `WebPage`, `SoftwareApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`
  - Guide: `CollectionPage`, `Article`, `HowTo`, `FAQPage`, `BreadcrumbList`
  - Fixed pages: `WebPage`, `BreadcrumbList`

## 公開前に確認したい項目

- `NEXT_PUBLIC_SITE_URL` を本番ドメインに設定
- 運営者情報と問い合わせ先を実運用値へ更新
- プライバシーポリシー / 利用規約の法的表現を最終確認
- favicon / OG画像 / SNS共有画像を本番用に整備
- 実ファイルで主要ツールの手動動作確認
- モバイル実機でアップロード UI と一覧表示を確認

## 残タスク

### 優先度高

- OGP画像の追加
- 実運営向けの運営者情報・問い合わせ先差し替え
- 大きめファイルでの手動検証
- アナリティクスや Search Console 連携の方針決定

### 優先度中

- ツールのアップロード UI 共通化
- 記事一覧のカテゴリ整理や人気導線
- OG / Twitter 画像のページ個別最適化
- ガイド本文の MDX 移行しやすさをさらに高める

### 優先度低

- 画像処理や PDF 処理のより細かなオプション追加
- 記事検索
- 更新履歴の自動化

## MVPとして公開可能か

### 判定

条件付きで公開可能です。

### 公開可能と判断できる理由

- 主要導線が揃っている
- 日英ルーティングが動いている
- ツール、固定ページ、ガイド記事の最低限の厚みがある
- metadata / sitemap / robots / JSON-LD の土台がある
- ローカル処理中心というサイト方針がページ上で明示されている

### 公開前に足りない点

- 本番ドメイン設定が未確定だと canonical / sitemap が正しくならない
- 法務・運営情報は仮情報のまま公開しないほうがよい
- OG画像や共有時の見え方はまだ改善余地が大きい
- ツールの実データでの手動検証はまだ十分とは言えない
- 一部 UI は共通化余地があり、今後ツール数が増えると保守コストが上がりやすい

## 補足

このプロジェクトは「1機能だけの薄いツールページ」ではなく、以下をセットで育てる前提です。

- ツール本体
- 使い方ガイド
- 固定ページ
- 内部リンク
- SEO基盤

そのため、今後の追加実装でも `content` / `messages` / `components` / `lib` の責務分離を維持するのが重要です。
