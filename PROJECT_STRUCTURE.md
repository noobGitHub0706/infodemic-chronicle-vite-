# プロジェクト構造ドキュメント

**インフォデミック・クロニクル（Infodemic Chronicle）**
Vite + React 実装

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [技術スタック](#2-技術スタック)
3. [ディレクトリ構造](#3-ディレクトリ構造)
4. [ファイル一覧と役割](#4-ファイル一覧と役割)
   - [設定ファイル（ルート）](#41-設定ファイルルート)
   - [エントリーポイント](#42-エントリーポイント)
   - [メインアプリケーション](#43-メインアプリケーション)
   - [コンポーネント](#44-コンポーネント)
   - [共通コンポーネント](#45-共通コンポーネント)
   - [データ層](#46-データ層)
   - [ユーティリティ・Firebase](#47-ユーティリティfirebase)
   - [スタイル](#48-スタイル)
5. [依存関係マップ](#5-依存関係マップ)
6. [ゲームフロー・画面遷移](#6-ゲームフロー画面遷移)
7. [データフロー](#7-データフロー)
8. [環境設定](#8-環境設定)
9. [開発・ビルドコマンド](#9-開発ビルドコマンド)

---

## 1. プロジェクト概要

健康情報に関するメディアリテラシー教育を目的とした、**インタラクティブなゲーム形式のシミュレーション研究プラットフォーム**。

参加者は以下を通じて、誤情報の見破り方・情報操作の仕組みを体験する：

| ステージ | 名称 | 内容 |
|---------|------|------|
| Stage 1 | 見破るステージ | SNS投稿のレトリック技法を識別 |
| Stage 2 | インフルエンサー体験 | 自分が情報発信者となり影響力を体験 |
| Stage 3 | 情報検証訓練 | Lateral Reading スキルの習得 |

研究用途のため、実験群（experimental）と対照群（control）の2条件が存在する。

---

## 2. 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|----------|
| UI フレームワーク | React | ^19.2.0 |
| ビルドツール | Vite | ^7.3.1 |
| CSS | Tailwind CSS | ^4.2.0 |
| Tailwind 統合 | @tailwindcss/vite | ^4.2.0 |
| バックエンド / DB | Firebase (Firestore) | ^12.9.0 |
| リンター | ESLint | ^9.39.1 |
| フォント | Google Fonts（Noto Sans JP、Zen Kaku Gothic New） | - |

---

## 3. ディレクトリ構造

```
infodemic-chronicle-vite-/
├── index.html                    # HTML エントリーポイント
├── vite.config.js                # Vite ビルド設定
├── package.json                  # 依存関係・スクリプト
├── eslint.config.js              # ESLint 設定
├── README.md                     # Vite テンプレート説明
├── PROJECT_STRUCTURE.md          # このファイル
├── env                           # 環境変数（.env 相当）
│
├── public/                       # 静的アセット
│
└── src/                          # ソースコード
    ├── main.jsx                  # React マウントポイント
    ├── App.jsx                   # メインオーケストレーター（全状態管理）
    ├── App.css                   # App スタイル（ほぼ未使用）
    ├── index.css                 # ベーススタイル
    ├── utils.js                  # 汎用ユーティリティ関数
    │
    ├── components/               # UI コンポーネント
    │   ├── ConsentScreen.jsx     # 同意・デモグラフィック入力画面
    │   ├── Introduction.jsx      # ゲーム説明画面
    │   ├── RhetoricStage.jsx     # 汎用レトリック識別訓練（Stage1/2/3共通）
    │   ├── RhetoricResult.jsx    # Stage1/2結果画面（共通）
    │   ├── Stage1.jsx            # Stage1ラッパー（RhetoricStage + STAGE1_QUESTIONS）
    │   ├── Stage2Rhetoric.jsx    # Stage2ラッパー（RhetoricStage + STAGE2_QUESTIONS）
    │   ├── Stage3Rhetoric.jsx    # Stage3ラッパー（RhetoricStage + STAGE3_QUESTIONS）
    │   ├── Stage2Intro.jsx       # レトリック訓練3ステージ完了 & インフルエンサー体験説明
    │   ├── Stage3.jsx            # インフルエンサー体験
    │   ├── Stage3Intro.jsx       # インフルエンサー体験結果 & 情報検証説明
    │   ├── StageCreate.jsx       # 情報検証訓練（Lateral Reading）
    │   ├── TransferTest.jsx      # 転移テスト（事前・事後共用）
    │   ├── ReadingTask.jsx       # 対照群用読解課題
    │   ├── FinalDebriefing.jsx   # 最終振り返り・称号表示
    │   ├── PostSurvey.jsx        # 事後アンケート
    │   ├── CompletionScreen.jsx  # 完了画面
    │   ├── DataExport.jsx        # データ JSON/CSV エクスポート
    │   │
    │   └── common/               # 複数コンポーネントで共有
    │       ├── TechniqueTag.jsx       # レトリック技法バッジ
    │       ├── SNSPostCard.jsx        # SNS投稿カード
    │       ├── SpreadVisualization.jsx # 情報拡散ネットワーク図
    │       └── DialogueBox.jsx        # キャラクター対話ボックス（ナラティブ表示）
    │
    ├── data/                     # 静的データ定義
    │   ├── techniques.js         # 6種レトリック技法の定義
    │   ├── targets.js            # 3種ターゲット層の定義
    │   ├── stage1Questions.js    # Stage1 問題（10問、基本的な技法）
    │   ├── stage2Questions.js    # Stage2 問題（10問、複合技法・文体トラップ）
    │   ├── stage3Questions.js    # Stage3 問題（10問、実践的・高難度）
    │   ├── stage3Posts.js        # インフルエンサー体験用投稿選択肢（5ラウンド×3）
    │   ├── transferTests.js      # 転移テスト問題（TRANSFER_TEST_SETS: A・B 各8問、サプリ・食事療法トピック）
    │   ├── readingTasks.js       # 対照群読解課題
    │   └── narrative.js          # ゲーム全体のストーリー・キャラクター・台詞データ
    │
    ├── lib/
    │   └── firebase.js           # Firebase 初期化・エクスポート
    │
    ├── hooks/
    │   └── useFirebase.js        # Firebase カスタムフック（参照用）
    │
    └── styles/
        └── index.css             # Tailwind + カスタムスタイル
```

---

## 4. ファイル一覧と役割

### 4.1 設定ファイル（ルート）

#### `package.json`
プロジェクトのメタ情報・依存関係・実行スクリプトを定義。

```json
// スクリプト
"dev"     → 開発サーバー起動
"build"   → 本番バンドル生成
"lint"    → ESLint 実行
"preview" → バンドル結果のプレビュー
```

#### `vite.config.js`
Vite のビルド設定。React プラグインと Tailwind CSS プラグインを有効化。

#### `index.html`
ブラウザが最初に読み込む HTML ファイル。

- `lang="ja"` で日本語ロケール設定
- Google Fonts を CDN から読み込み
- `<div id="root">` に React アプリをマウント
- `src/main.jsx` をエントリースクリプトとして参照

#### `eslint.config.js`
ESLint のルール設定。React Hooks と React Refresh のプラグインを使用。

---

### 4.2 エントリーポイント

#### `src/main.jsx`
React アプリケーションを起動する最小限のファイル。

```
index.html → main.jsx → App.jsx
```

`App` コンポーネントを `StrictMode` で `#root` にマウントする。

---

### 4.3 メインアプリケーション

#### `src/App.jsx`（約700行）

**全ゲームの状態管理と画面遷移を制御するオーケストレーター**。

**管理する主要な状態：**

| 状態変数 | 内容 |
|---------|------|
| `stage` | 現在表示中の画面識別子 |
| `participantInfo` | 被験者ID・デモグラフィック情報 |
| `experimentCondition` | 実験条件（experimental / control） |
| `testSetOrder` | 転移テストのセット順序（A→B / B→A） |
| `sessionId` | セッション識別子（タイムスタンプ+乱数） |
| `stage1Data` | Stage1 の結果データ |
| `stage3Data` | Stage2 の結果データ |
| `stageCreateData` | Stage3 の結果データ |
| `preTestData` / `postTestData` | 転移テストの回答データ |
| `surveyData` | 事後アンケートの回答 |
| `timestamps` | 各イベントの発生時刻 |
| `progress` | 完了済みフラグのセット |

**主要な機能：**

- **Firebase 自動保存**: 各ステージ完了時にデータを自動送信
- **ブラウザバック防止**: 同意前・完了後を除き、誤操作を防ぐ
- **実験条件の取得**: URL パラメータ `?condition=control` などを読み取る
- **転移テスト分析**: 事前・事後テストの変化量を計算
- **称号決定**: フォロワー数 × 信頼性スコアから称号を決定
- **データエクスポート**: `generateGameData()` で完全な実験データを生成

**`stage` の遷移順序（実験群）：**

```
consent → preTest → intro → stage1 → stage1result
→ stage2rhetoric → stage2result → stage3rhetoric
→ stage2intro → stage3 → stage3intro → stageCreate
→ debrief → postTest → survey → complete
```

---

### 4.4 コンポーネント

すべてのコンポーネントは `onComplete(data)` コールバックで App に結果を返す。

---

#### `ConsentScreen.jsx`
**インフォームドコンセントと被験者情報収集画面。**

収集する情報：
- 被験者ID（任意）
- 年代、性別
- SNS 利用頻度
- 健康情報の入手元

同意チェックボックスにチェックしないと進めない。

---

#### `Introduction.jsx`
**ゲームの説明と6つのレトリック技法の紹介画面。**

- **オープニングシーケンス**: 黒田のセリフ 6 エントリーを 1 つずつ読み進める（スキップ可）
- 3つのステージの概要説明
- 各技法の詳細を展開して確認できる
- 技法一覧の前後に黒田のブリーフィングセリフを表示

---

#### `RhetoricStage.jsx`
**汎用レトリック識別訓練コンポーネント。** Stage1/2/3の共通ロジックを実装。

**Props:**
- `questions`: シャッフル済み問題配列（ラッパーコンポーネント側でshuffleする）
- `feedbackLevel`: `'detailed'` / `'moderate'` / `'minimal'`
- `narrative`: ステージ固有のナラティブ設定
- `stageLabel`: ヘッダー表示ラベル
- `stageNumber`: 1 / 2 / 3（最後の問題ボタンラベルの分岐に使用）
- `onComplete(data)`: 完了コールバック

**feedbackLevel による差分:**
- `detailed`: 反駁フェーズあり + explanation全文（Stage1）
- `moderate`: 技法タグ + explanation先頭文のみ（Stage2）
- `minimal`: 技法タグのみ、explanationなし（Stage3）

`RebuttalPostPreview` もこのファイルからエクスポートする。

---

#### `RhetoricResult.jsx`
**Stage1 / Stage2 の共通結果画面。**

- 正答率・スコア・弱点技法タグを表示
- `getResultCommentFromNarrative` による黒田コメント
- `narrative.transition` の橋渡しセリフ

---

#### `Stage1.jsx`（ラッパー）
`RhetoricStage` に `STAGE1_QUESTIONS`・`feedbackLevel="detailed"`・`STAGE1_NARRATIVE` を渡すラッパー。
内部で `shuffle(STAGE1_QUESTIONS)` を行い props として渡す。
`RebuttalPostPreview` を再エクスポートして後方互換性を維持。

---

#### `Stage2Rhetoric.jsx`（ラッパー）
`RhetoricStage` に `STAGE2_QUESTIONS`・`feedbackLevel="moderate"`・`STAGE2_RHETORIC_NARRATIVE` を渡すラッパー。

---

#### `Stage3Rhetoric.jsx`（ラッパー）
`RhetoricStage` に `STAGE3_QUESTIONS`・`feedbackLevel="minimal"`・`STAGE3_RHETORIC_NARRATIVE` を渡すラッパー。

---

#### `Stage2Intro.jsx`
**レトリック識別訓練3ステージ完了後の結果表示とインフルエンサー体験の説明画面。**

Props: `rhetoricSummaryData`（3ステージの集計）、`onContinue`

- 3ステージの平均正答率・累計スコアを表示
- 見破りにくかった技法を振り返る
- インフルエンサー体験のルール説明
- ターゲット層の特徴紹介

---

#### `Stage3.jsx`
**「インフルエンサー体験ステージ」— 情報発信による影響拡散体験。**

（コンポーネント名は Stage3 だが、ゲーム内の位置づけは Stage2）

**5フェーズで1ラウンドを構成：**

1. **target**: ターゲット層を選択（不安な親 / 若者 / 高齢者）
2. **post**: 3択の投稿から1つ選んで投稿
3. **result**: フォロワー数と信頼性スコアの変化を表示
4. **criticism**: 批判への対応を選択
5. **suspended**: 倫理スコアが低い場合、アカウント凍結

5ラウンドを通じてフォロワー数と信頼性スコアがダイナミックに変化する。

---

#### `Stage3Intro.jsx`
**Stage2 完了後の結果表示と Stage3（情報検証訓練）の説明画面。**

- 最終フォロワー数と信頼性スコアを表示
- Lateral Reading の概念を解説

---

#### `StageCreate.jsx`
**「情報検証訓練ステージ」— Lateral Reading スキルの習得。**

3つのシナリオを通じて、情報の検証手順を実践的に学ぶ。

**シナリオ例：**
- 「87%」という数字の出典を確認する
- 発信者・組織の実在性を確認する
- 複数の情報源で裏付けを取る

各ステップで検証行動・情報源・解釈を選択し、スコアが記録される。

---

#### `TransferTest.jsx`
**転移テスト — 事前・事後共用のレトリック技法識別テスト。**

- 8つの SNS 投稿を 7段階リカート尺度で評価
- 事前・事後で異なるテストセット（A / B）を使用
- セットの順序はカウンターバランスされる（A→B / B→A のランダム）

---

#### `ReadingTask.jsx`
**対照群用の読解課題。** （experimentCondition === 'control' の場合のみ表示）

- 複数の一般的な記事を読む（例：印刷技術の歴史）
- 各記事に理解度確認問題がある
- メディアリテラシー訓練は含まない

---

#### `FinalDebriefing.jsx`
**最終振り返りと称号システム。**

フォロワー数と信頼性スコアの組み合わせで称号が決定される：

| 称号例 | 条件 |
|-------|------|
| 聖人インフルエンサー | 信頼性 70以上 & フォロワー 600以上 |
| グレーゾーンの覇者 | 信頼性 40〜69 & フォロワー 600以上 |
| 永久凍結の人 | アカウント凍結済み |

---

#### `PostSurvey.jsx`
**事後アンケート。**

5段階尺度の設問（楽しさ、理解度、行動変容意図、難易度、推奨度）と自由記述。

---

#### `CompletionScreen.jsx`
**完了画面。**

- 謝辞メッセージ
- 実生活で実践できることのリスト
- データ出力（`DataExport` コンポーネント）
- リスタートボタン

---

#### `DataExport.jsx`
**実験データの JSON / CSV エクスポート機能。**

エクスポートされるデータ：
- セッション情報・参加者属性
- 各ステージの結果・スコア
- 転移テストの事前・事後・変化量
- 拡散影響シミュレーション結果
- タイムスタンプ一覧

---

### 4.5 共通コンポーネント

#### `common/TechniqueTag.jsx`
**レトリック技法をバッジ（タグ）として表示するコンポーネント。**

- `techniques.js` の色定義（bg色・テキスト色・ボーダー色）を参照
- 小さなラベルとして複数の画面で使い回される

---

#### `common/SNSPostCard.jsx`（約80行）
**X（旧 Twitter）風の SNS 投稿カードを表示するコンポーネント。**

- アカウントIDのハッシュから決定論的にアバターを生成
- いいね数・リツイート数・返信数を擬似乱数で表示
- ハッシュタグを青色でハイライト
- インタラクティブなボタン（いいね・リツイート・シェア）
- `compact` プロパティでコンパクト表示にも対応

---

#### `common/SpreadVisualization.jsx`（約270行）
**情報拡散のネットワーク図をアニメーション付きで表示するコンポーネント。**

3段階の拡散を可視化：
- **1次拡散**: 新規フォロワーへの直接リーチ
- **2次拡散**: シェア × 150 × 操作度係数
- **3次拡散**: 2次の 20% × 係数

誤情報を信じた推定人数も表示する。

---

#### `common/DialogueBox.jsx`
**キャラクターの対話セリフをレンダリングするコンポーネント。**

ナラティブシステムで使用される対話オブジェクト `{ type, text }` を受け取り表示する。

| `type` | 表示スタイル |
|--------|------------|
| `boss` | ガラスカード + 🍵 アイコン + キャラクター名（黒田 真理） |
| `system` | 中央揃えのイタリック体テキスト（ト書き・場面説明） |

`dialogue` が `null` または `undefined` の場合は何も表示しない。

---

### 4.6 データ層

#### `data/techniques.js`
**6種類のレトリック技法の定義。**

```
fear              → 恐怖訴求
authority         → 権威訴求
scientific_veneer → 科学的装い（旧: pseudoscience）
testimonial       → 証言利用
cherry_picking    → 選択的提示（旧: polarization）
social_proof      → 社会的証明（旧: bandwagon）
```

各技法は説明文・具体例・`academicBasis`（学術的裏付け）・色コードを持ち、`TechniqueTag` や各コンポーネントで参照される。

---

#### `data/targets.js`
**3種類のターゲット層の定義。**

| キー | 説明 | 弱点技法 |
|-----|------|---------|
| `anxious_parents` | 30〜50代の不安な親 | fear, testimonial |
| `youth` | 10〜20代の若者 | social_proof, cherry_picking |
| `elderly` | 60代以上の高齢者 | authority, scientific_veneer |

各ターゲットは技法ごとの反応理由・効果倍率も持つ。

---

#### `data/stage1Questions.js`
**Stage1 の問題データ（10問）。**

- 難易度: easy 3問・medium 4問・hard 2問・very_hard 1問
- 各技法が複数回出現、「技法なし（正常投稿）」も2問含む
- 各問はアカウント情報・本文・技法・難易度・解説を持つ

---

#### `data/stage3Posts.js`
**Stage2（インフルエンサー体験）の投稿選択肢データ（5ラウンド × 3択）。**

各投稿は以下を持つ：
- テキスト・アカウント情報
- `influence`: 基本影響度（フォロワー増減）
- `ethics`: 信頼性スコアへの変化
- `targetEffects`: ターゲット別の効果倍率
- SNS 反応テンプレート・批判への対応テンプレート

---

#### `data/stage2Questions.js`
**Stage2（応用フェーズ）の問題データ（10問）。**

- 操作的6問（複合技法2技法まで）+ 非操作的4問
- 文体トラップあり（公的機関風でも操作的、カジュアルでも非操作的）
- 難易度: medium 9問 + hard 1問

---

#### `data/stage3Questions.js`
**Stage3（実践フェーズ）の問題データ（10問）。**

- 操作的6問（2〜3技法複合）+ 非操作的4問（紛らわしいものを含む）
- 実際のSNSに近いリアルな文体
- 難易度: hard 9問 + very_hard 1問

---

#### `data/transferTests.js`
**転移テストの問題データ（TRANSFER_TEST_SETS: セット A・B 各 8問）。**

- トピック: サプリメント・食事療法・代替医療（Stage1-3とは異なる領域）
- 各セットは操作的5問 + 非操作的3問
- 各問は `manipulative: boolean` と `techniques: string[]` を持つ（旧: `technique: string`）
- カウンターバランス: A→B / B→A のランダム割当

---

#### `data/readingTasks.js`
**対照群用の読解課題データ。**

一般的な記事（例：印刷技術の歴史）と、理解度確認問題で構成される。

---

#### `data/narrative.js`
**ゲーム全体のナラティブ・ストーリーデータ。**

ゲームに世界観・キャラクター・ストーリーを付与するすべてのテキストを集約。

**エクスポートする定数：**

| 定数名 | 対応コンポーネント | 内容 |
|-------|----------------|------|
| `WORLD_SETTING` | — | 組織・世界観設定 |
| `CHARACTERS` | DialogueBox | キャラクター情報（黒田 真理 等） |
| `STORY_ARC` | — | ストーリー章立て概要 |
| `INTRO_NARRATIVE` | Introduction.jsx | オープニングシーケンス + 技法ブリーフィング |
| `STAGE1_NARRATIVE` | Stage1.jsx / RhetoricStage | 開始セリフ・問題ごとのセリフ・正誤リアクション |
| `STAGE2INTRO_NARRATIVE` | Stage2Intro.jsx | 正答率コメント + 第2章橋渡し |
| `STAGE3_NARRATIVE` | Stage3.jsx | 開始セリフ・ラウンドつなぎ・特殊イベント |
| `STAGE3INTRO_NARRATIVE` | Stage3Intro.jsx | 体験振り返り + 第3章橋渡し |
| `STAGECREATE_NARRATIVE` | StageCreate.jsx | 開始セリフ + シナリオ間つなぎ |
| `DEBRIEF_NARRATIVE` | FinalDebriefing.jsx | エピローグクロージングシーケンス（4エントリー） |
| `STAGE2_RHETORIC_NARRATIVE` | Stage2Rhetoric.jsx | Stage2応用フェーズ用セリフ |
| `STAGE3_RHETORIC_NARRATIVE` | Stage3Rhetoric.jsx | Stage3実践フェーズ用セリフ |
| `STAGE1_RESULT_NARRATIVE` | RhetoricResult.jsx | Stage1結果画面用コメント + 橋渡し |
| `STAGE2_RESULT_NARRATIVE` | RhetoricResult.jsx | Stage2結果画面用コメント + 橋渡し |

**エクスポートするユーティリティ関数：**

| 関数名 | 用途 |
|-------|------|
| `getRandomReaction(reactions)` | リアクション配列からランダムに1つ選択 |
| `getQuestionIntro(questionIndex)` | 問題番号に対応するつなぎセリフを取得（Stage1のみ） |
| `getResultComment(accuracy)` | 正答率に応じたコメントを取得（Stage2Intro用） |
| `getResultCommentFromNarrative(accuracy, narrativeObj)` | 任意のnarrativeオブジェクトから正答率コメントを取得 |

**キャラクター：黒田 真理（IHIA 室長）**
- 元・広告代理店コピーライター（操作的表現のプロ）
- 紅茶へのこだわりが強く、口癖は「まあ、お茶でも飲みなよ」
- セリフは `type: 'boss'` のオブジェクトとして定義

---

### 4.7 ユーティリティ・Firebase

#### `src/utils.js`
汎用ユーティリティ関数。

```javascript
shuffle(array)        // Fisher-Yates シャッフルアルゴリズム
randomBetween(min, max) // 指定範囲の乱数を生成
```

#### `src/lib/firebase.js`
Firebase Firestore の初期化と設定。

- 環境変数（`VITE_FIREBASE_*`）から設定を読み込む
- `db`・`doc`・`setDoc`・`updateDoc`・`serverTimestamp` をエクスポート

#### `src/hooks/useFirebase.js`
Firebase へのカスタムフック（`useFirebase(sessionId)`）。

- `saveToFirebase(path, data, merge?)` コールバックを返す
- ※ App.jsx では直接 Firebase API を使用しており、このフックは参照用として存在

---

### 4.8 スタイル

#### `src/styles/index.css`
Tailwind CSS の読み込みとカスタムクラスの定義。

**カスタムクラス一覧：**

| クラス | 効果 |
|-------|------|
| `.glass` | ガラスモルフィズム効果（半透明背景・ぼかし） |
| `.glow-*` | 色別グロー効果 |
| `.technique-tag` | 技法バッジの基本スタイル |
| `.btn-primary` / `.btn-danger` / `.btn-success` | ボタンスタイル |
| `.progress-bar` | プログレスバー |
| `.animate-fade-in` / `.animate-pulse-once` / `.animate-slide-in` | アニメーション |

**レスポンシブ対応：**
- 480px 以下: フォントサイズ縮小、タグ圧縮
- ランドスケープ（高さ 500px 以下）: 最小高さ調整
- Safe Area Inset 対応（iOS ノッチ対応）

---

## 5. 依存関係マップ

```
index.html
  └── src/main.jsx
        └── src/App.jsx ─────────────────────── 全ステージを管理
              │
              ├── src/lib/firebase.js ← Firebase SDK
              │
              ├── ConsentScreen.jsx          (依存なし)
              │
              ├── Introduction.jsx
              │     ├── data/techniques.js
              │     ├── data/narrative.js  ← INTRO_NARRATIVE
              │     ├── common/TechniqueTag.jsx
              │     │     └── data/techniques.js
              │     └── common/DialogueBox.jsx
              │           └── data/narrative.js  ← CHARACTERS
              │
              ├── TransferTest.jsx
              │     ├── data/transferTests.js
              │     └── common/SNSPostCard.jsx
              │
              ├── ReadingTask.jsx             [対照群のみ]
              │     └── data/readingTasks.js
              │
              ├── Stage1.jsx
              │     ├── data/stage1Questions.js
              │     ├── data/techniques.js
              │     ├── data/narrative.js  ← STAGE1_NARRATIVE, getQuestionIntro, getRandomReaction
              │     ├── common/TechniqueTag.jsx
              │     ├── common/SNSPostCard.jsx
              │     ├── common/DialogueBox.jsx
              │     └── src/utils.js
              │
              ├── Stage2Intro.jsx
              │     ├── data/techniques.js
              │     ├── data/targets.js
              │     ├── data/narrative.js  ← STAGE2INTRO_NARRATIVE, getResultComment
              │     ├── common/TechniqueTag.jsx
              │     └── common/DialogueBox.jsx
              │
              ├── Stage3.jsx                  [実験群のみ]
              │     ├── data/techniques.js
              │     ├── data/stage3Posts.js
              │     ├── data/targets.js
              │     ├── data/narrative.js  ← STAGE3_NARRATIVE
              │     ├── common/TechniqueTag.jsx
              │     ├── common/SNSPostCard.jsx
              │     ├── common/SpreadVisualization.jsx
              │     │     └── data/techniques.js
              │     ├── common/DialogueBox.jsx
              │     └── src/utils.js
              │
              ├── Stage3Intro.jsx
              │     ├── data/techniques.js
              │     ├── data/narrative.js  ← STAGE3INTRO_NARRATIVE
              │     ├── common/TechniqueTag.jsx
              │     └── common/DialogueBox.jsx
              │
              ├── StageCreate.jsx             [実験群のみ]
              │     ├── data/techniques.js
              │     ├── data/targets.js
              │     ├── data/stage3Posts.js
              │     ├── data/narrative.js  ← STAGECREATE_NARRATIVE
              │     ├── common/TechniqueTag.jsx
              │     ├── common/SNSPostCard.jsx
              │     └── common/DialogueBox.jsx
              │
              ├── FinalDebriefing.jsx         [実験群のみ]
              │     ├── data/techniques.js
              │     ├── data/narrative.js  ← DEBRIEF_NARRATIVE
              │     ├── common/TechniqueTag.jsx
              │     └── common/DialogueBox.jsx
              │
              ├── PostSurvey.jsx              (依存なし)
              ├── CompletionScreen.jsx        (依存なし)
              └── DataExport.jsx              (依存なし)
```

---

## 6. ゲームフロー・画面遷移

### 実験群（`?condition=experimental`）

```
[consent] → [preTest] → [intro] → [stage1] → [stage1result]
  → [stage2rhetoric] → [stage2result] → [stage3rhetoric]
  → [stage2intro] → [stage3] → [stage3intro]
  → [stageCreate] → [debrief] → [postTest]
  → [survey] → [complete]
```

### 対照群（`?condition=control`）

```
[consent] → [preTest] → [readingTask]
  → [postTest] → [survey] → [complete]
```

### 転移テストのカウンターバランス

| testSetOrder | 事前テスト | 事後テスト |
|-------------|-----------|-----------|
| `AB` | セット A | セット B |
| `BA` | セット B | セット A |

開始時にランダムに決定される。

---

## 7. データフロー

### Firebase への保存タイミング

| タイミング | 保存パス | 保存データ |
|-----------|---------|-----------|
| 同意完了 | `sessions/{sessionId}` | セッションメタ・デモグラフィック |
| 転移テスト（事前）完了 | `sessions/{sessionId}` | preTest の回答 |
| Stage1 完了 | `sessions/{sessionId}` | stage1 結果・スコア |
| Stage2 完了 | `sessions/{sessionId}` | stage2（インフルエンサー）結果 |
| Stage3 完了 | `sessions/{sessionId}` | stage3（検証訓練）結果 |
| 転移テスト（事後）完了 | `sessions/{sessionId}` | postTest の回答・変化量 |
| アンケート完了 | `sessions/{sessionId}` | アンケート回答・完了フラグ |

### セッションメタデータ構造

```javascript
{
  sessionId,
  participantId,
  experimentCondition,  // 'experimental' | 'control'
  testSetOrder,         // 'AB' | 'BA'
  startedAt,
  completedAt,
  userAgent,
  screenSize,
  language,
  fullyCompleted        // boolean
}
```

### データエクスポート（DataExport.jsx）

`App.jsx` の `generateGameData()` が生成する完全なデータを JSON / CSV で出力。

- **JSON**: そのまま構造化データを出力
- **CSV**: 全フィールドをフラット化して1行に変換

---

## 8. 環境設定

`.env`（または `env` ファイル）に Firebase の接続情報を記載する：

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

`src/lib/firebase.js` でこれらを読み込み、Firestore を初期化する。

---

## 9. 開発・ビルドコマンド

```bash
# 開発サーバー起動（HMR 有効）
npm run dev

# 本番用バンドル生成（dist/ に出力）
npm run build

# バンドル結果をローカルでプレビュー
npm run preview

# ESLint によるコード品質チェック
npm run lint
```

### 実験条件の切り替え

URL パラメータで実験条件を指定する：

```
http://localhost:5173/?condition=experimental  # 実験群
http://localhost:5173/?condition=control       # 対照群
```

---

*このドキュメントは 2026-02-26 時点のソースコードを元に作成されました。*
*最終更新: レトリック識別訓練を1→3ステージへ拡張（RhetoricStage / RhetoricResult 新規、Stage2Rhetoric / Stage3Rhetoric 新規）、transferTests.js の TRANSFER_TEST_SETS 形式への移行、App.jsx の新ゲームフロー対応。*
