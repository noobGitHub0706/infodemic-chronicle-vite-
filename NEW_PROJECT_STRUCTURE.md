# Infodemic Chronicle — 再設計プロジェクト構造

## 1. 設計思想

### 2層アーキテクチャ

```
┌──────────────────────────────────────────────┐
│  研究レイヤー（ResearchFlow）                    │
│  同意 → 事前テスト → [ゲーム] → 事後テスト → 調査 → 完了 │
└───────────────────┬──────────────────────────┘
                    │ onGameComplete(gameData)
       ┌────────────▼─────────────────┐
       │  ゲームレイヤー（GameEngine）     │
       │  3章 + エピローグ                │
       │  ナラティブ・操作・フィードバック    │
       │  調査ファイル・壊滅ストーリー      │
       └──────────────────────────────┘
```

**研究レイヤー**はデータ収集・実験条件管理に徹する。ゲームの内部構造を知らない。
**ゲームレイヤー**は没入体験を提供する。研究手続きの存在を知らない。
両者は`onGameComplete(gameData)`のインターフェースで接続される。

---

## 2. ディレクトリ構造

```
infodemic-chronicle/
├── index.html
├── vite.config.js
├── package.json
│
└── src/
    ├── main.jsx                        # Reactマウントポイント
    ├── App.jsx                         # 最上位ルーター（研究 or ゲーム）
    │
    ├── research/                       # ===== 研究レイヤー =====
    │   ├── ResearchFlow.jsx            # 研究手続きオーケストレーター
    │   ├── ConsentScreen.jsx           # 同意・デモグラフィック
    │   ├── TransferTest.jsx            # 転移テスト（事前・事後共用）
    │   ├── PostSurvey.jsx              # 事後アンケート
    │   ├── CompletionScreen.jsx        # 完了画面
    │   └── DataExport.jsx              # JSON/CSVエクスポート
    │
    ├── game/                           # ===== ゲームレイヤー =====
    │   ├── GameEngine.jsx              # ゲーム全体の状態管理
    │   │
    │   ├── chapters/                   # --- 章の制御 ---
    │   │   ├── Chapter1.jsx            # 第1章：配属初日
    │   │   ├── Chapter2.jsx            # 第2章：潜入準備
    │   │   ├── Chapter3.jsx            # 第3章：潜入作戦
    │   │   └── Epilogue.jsx            # エピローグ：壊滅
    │   │
    │   ├── activities/                 # --- 再利用可能なゲーム活動 ---
    │   │   ├── RhetoricQuiz.jsx        # レトリック識別（全章共通）
    │   │   ├── InfluencerSim.jsx       # インフルエンサー体験
    │   │   └── FactCheck.jsx           # 情報検証演習
    │   │
    │   ├── narrative/                  # --- ナラティブUI ---
    │   │   ├── DialogueBox.jsx         # セリフ表示（単体）
    │   │   ├── DialogueSequence.jsx    # 連続セリフの制御
    │   │   └── ChapterTransition.jsx   # 章間の演出
    │   │
    │   ├── systems/                    # --- ゲームシステム ---
    │   │   ├── InvestigationFile.jsx   # 調査ファイルUI
    │   │   ├── PostReaction.jsx        # 投稿の動的反応
    │   │   ├── NPCReplyFeed.jsx        # NPCリプライ表示
    │   │   ├── SpreadAnimation.jsx     # 拡散/遮断アニメーション
    │   │   ├── ComboSystem.jsx         # コンボ・ストリーク演出
    │   │   └── TimelineMeter.jsx       # タイムライン浄化度メーター
    │   │
    │   └── hud/                        # --- 常時表示UI ---
    │       ├── GameHUD.jsx             # HUDコンテナ
    │       ├── ProgressBar.jsx         # 調査進捗バー
    │       ├── ScoreDisplay.jsx        # スコア表示
    │       └── ChapterIndicator.jsx    # 現在の章表示
    │
    ├── common/                         # ===== 共通UI =====
    │   ├── SNSPostCard.jsx             # SNS投稿カード
    │   ├── TechniqueTag.jsx            # 技法バッジ
    │   └── SpreadVisualization.jsx     # 拡散ネットワーク図
    │
    ├── data/                           # ===== 静的データ =====
    │   ├── techniques.js               # 6技法定義
    │   ├── narrative.js                # ストーリー・キャラ・セリフ
    │   ├── organization.js             # ウェルネス・サークル組織図
    │   │
    │   ├── questions/                  # 章別のレトリック識別問題
    │   │   ├── chapter1.js             # 第1章（easy, 1技法, 4問）
    │   │   ├── chapter2.js             # 第2章（medium, 2技法, 4問）
    │   │   ├── chapter3.js             # 第3章（hard, 2-3技法, 4問）
    │   │   └── bosses.js              # 章末ボス（各章1問）
    │   │
    │   ├── influencer/                 # インフルエンサー体験
    │   │   ├── posts.js                # 投稿選択肢
    │   │   └── targets.js              # ターゲット層定義
    │   │
    │   ├── factcheck/                  # 情報検証
    │   │   └── scenarios.js            # 検証シナリオ
    │   │
    │   ├── reactions/                  # 動的反応データ
    │   │   ├── npcReplies.js           # NPCリプライテンプレート
    │   │   └── spreadData.js           # 拡散シミュレーション数値
    │   │
    │   └── transfer/                   # 転移テスト
    │       └── tests.js                # セットA・B（サプリ/食事療法）
    │
    ├── hooks/                          # ===== カスタムフック =====
    │   ├── useGameState.js             # ゲーム状態管理
    │   ├── useInvestigation.js         # 調査ファイル状態
    │   ├── useResearchData.js          # 研究データ収集
    │   └── useFirebase.js              # Firebase操作
    │
    ├── lib/
    │   └── firebase.js                 # Firebase初期化
    │
    └── styles/
        └── index.css                   # Tailwind + カスタムスタイル
```

---

## 3. 画面遷移フロー

### 実験群

```
研究レイヤー:
  [consent] → [preTest]
                 ↓
ゲームレイヤー:  [GameEngine] ─────────────────────────────┐
                 │                                         │
                 ├── Chapter 1: 配属初日                     │
                 │    ├─ Opening Narrative                  │
                 │    ├─ Technique Briefing                 │
                 │    ├─ RhetoricQuiz ×4問 (easy)           │
                 │    ├─ Mini InfluencerSim ×1ラウンド       │
                 │    ├─ Boss Battle: ヘルシー太郎            │
                 │    └─ Chapter Transition                 │
                 │                                         │
                 ├── Chapter 2: 潜入準備                     │
                 │    ├─ Narrative (内部資料入手)             │
                 │    ├─ RhetoricQuiz ×4問 (medium)         │
                 │    ├─ InfluencerSim ×2ラウンド            │
                 │    ├─ FactCheck ×1シナリオ               │
                 │    ├─ Boss Battle: Dr.ナチュラル           │
                 │    └─ Chapter Transition                 │
                 │                                         │
                 ├── Chapter 3: 潜入作戦                     │
                 │    ├─ Narrative (潜入開始)                │
                 │    ├─ RhetoricQuiz ×4問 (hard)           │
                 │    ├─ InfluencerSim ×2ラウンド            │
                 │    ├─ FactCheck ×2シナリオ               │
                 │    ├─ Boss Battle: 代表アカウント          │
                 │    └─ Chapter Transition                 │
                 │                                         │
                 └── Epilogue: 壊滅                         │
                      ├─ 調査完了演出                        │
                      ├─ 壊滅演出                           │
                      ├─ 称号 + 振り返り                     │
                      └─ return gameData ──────────────────┘
                                                           ↓
研究レイヤー:                                     [postTest] → [survey] → [complete]
```

### 対照群

```
[consent] → [preTest] → [readingTask] → [postTest] → [survey] → [complete]
```

---

## 4. 状態管理設計

### App.jsx（最上位）

```javascript
// 管理するのは「研究手続きのどの段階か」のみ
const [phase, setPhase] = useState('consent');
// 'consent' | 'preTest' | 'game' | 'postTest' | 'survey' | 'complete'

const [experimentCondition, setExperimentCondition] = useState(null);
const [sessionId] = useState(generateSessionId());
const [researchData, setResearchData] = useState({});
```

### GameEngine.jsx（ゲームレイヤー）

```javascript
// ゲーム内の全状態を管理
const [chapter, setChapter] = useState(1);        // 1 | 2 | 3 | 'epilogue'
const [activity, setActivity] = useState('narrative');
// 'narrative' | 'briefing' | 'quiz' | 'influencer' | 'factcheck' | 'boss' | 'transition'

const [investigation, dispatch] = useReducer(investigationReducer, initialInvestigation);
const [score, setScore] = useState({ total: 0, streak: 0, maxStreak: 0 });
const [timeline, setTimeline] = useState({ purity: 50 }); // 0(汚染)〜100(浄化)
```

### useInvestigation.js（調査ファイル状態）

```javascript
const initialInvestigation = {
    // 技法ごとの解明度
    techniques: {
        fear:              { identified: 0, required: 3, mastered: false },
        authority:         { identified: 0, required: 3, mastered: false },
        scientific_veneer: { identified: 0, required: 3, mastered: false },
        testimonial:       { identified: 0, required: 3, mastered: false },
        cherry_picking:    { identified: 0, required: 3, mastered: false },
        social_proof:      { identified: 0, required: 3, mastered: false },
    },

    // 組織メンバーの特定状況
    members: {
        footSoldiers: [],   // 末端（第1章で特定）
        officers: [],       // 幹部（第2章で特定）
        leader: null,       // リーダー（第3章で特定）
    },

    // ボス攻略状況
    bosses: {
        chapter1: { defeated: false, name: 'ヘルシー太郎' },
        chapter2: { defeated: false, name: 'Dr.ナチュラル' },
        chapter3: { defeated: false, name: 'ウェルネス・ライフ公式' },
    },

    // 全体進捗 (0-100)
    progress: 0,

    // 解放済みインテリジェンス
    unlockedIntel: [],

    // エンディング分岐用フラグ
    endingFlags: {
        allBossesDefeated: false,
        highEthics: false,     // インフルエンサー体験で倫理維持
        perfectChapter: false, // いずれかの章で全問正解
    },
};

function investigationReducer(state, action) {
    switch (action.type) {
        case 'IDENTIFY_TECHNIQUE':
            // 技法識別成功時: カウントアップ、mastered判定、progress更新
        case 'DEFEAT_BOSS':
            // ボス撃破: メンバー特定、インテル解放
        case 'ADD_INTEL':
            // ストーリー情報の解放
        case 'UPDATE_PROGRESS':
            // 全体進捗の再計算
        case 'SET_ENDING_FLAG':
            // エンディングフラグの設定
    }
}
```

---

## 5. コンポーネント設計

### 5.1 活動コンポーネント（activities/）

#### RhetoricQuiz.jsx
全章で共通のレトリック識別コンポーネント。propsで難易度・問題データ・ナラティブ・フィードバックレベルを変える。

```
Props:
  questions: Array          - 問題データ（章別）
  feedbackLevel: string     - 'detailed' | 'moderate' | 'minimal'
  narrativeIntros: Array    - 問題前の黒田セリフ
  onCorrect: Function       - 正解時コールバック（調査ファイル更新等）
  onIncorrect: Function     - 不正解時コールバック
  onComplete: Function      - 全問完了時コールバック

内部状態:
  currentQuestion: number
  phase: 'intro' | 'question' | 'rebuttal' | 'reaction' | 'feedback'
  streak: number
  score: number

3フェーズ構成（既存Stage1.jsxと同様）:
  1. question: 投稿を見て「問題なし」or「レトリック検出」
  2. rebuttal: 検出した場合、具体的な技法を選択
  3. feedback: 動的反応 → NPCリプライ → 調査ファイル更新 → 解説

動的反応の統合:
  - 正解時: PostReaction（いいね減少）→ NPCReplyFeed（安堵）→ SpreadAnimation（遮断）
  - 不正解時: PostReaction（いいね増加）→ NPCReplyFeed（不安）→ SpreadAnimation（拡散）
  - 誤フラグ時: PostReaction（復元）→ NPCReplyFeed（苦情）
```

#### InfluencerSim.jsx
インフルエンサー体験コンポーネント。ラウンド数をpropsで制御。

```
Props:
  rounds: number            - ラウンド数（章による: 1, 2, 2）
  posts: Array              - 投稿選択肢データ
  targets: Array            - ターゲット層データ
  narrativeIntros: Array    - ラウンド前のセリフ
  onComplete: Function

内部状態:
  currentRound: number
  followers: number
  trustScore: number
  ethicsScore: number
  suspended: boolean
```

#### FactCheck.jsx
情報検証訓練コンポーネント。

```
Props:
  scenarios: Array          - 検証シナリオ（章による: 0, 1, 2個）
  narrativeIntros: Array
  onComplete: Function
```

### 5.2 ゲームシステム（systems/）

#### InvestigationFile.jsx
調査ファイルのUI。画面端にオーバーレイとして常時アクセス可能。

```
表示内容:
  - 組織図（特定済みメンバーのみ表示、未特定は???）
  - 技法別解明度ゲージ（6本）
  - 全体進捗バー
  - 解放済みインテリジェンス一覧
  - ボス攻略状況

インタラクション:
  - ファイルアイコンをクリックでスライドイン表示
  - 新情報解放時に自動でハイライト表示
```

#### PostReaction.jsx
投稿判定後の動的反応アニメーション。

```
Props:
  type: 'flagged' | 'missed' | 'cleared' | 'falseFlagged'
  reactionData: Object      - いいね変動、拡散数等
  onAnimationComplete: Function

アニメーション:
  flagged:     「⚠️検証中」→ いいね減少 → グレーアウト → 「非表示」
  missed:      いいね急増 → RT急増 → 拡散数カウントアップ
  cleared:     いいね微増 → 「正常配信中」（控えめ）
  falseFlagged: 「非表示」→ 「異議申し立て」→ 「復元」
```

#### NPCReplyFeed.jsx
NPCリプライの表示。投稿カードの下に順次表示。

```
Props:
  replies: Array<{ account, text }>
  animationDelay: number    - 各リプライの表示間隔（ms）

表示:
  投稿カードの直下にSNSリプライ風のUIで順次表示
  各リプライがフェードインで出現
```

### 5.3 章コンポーネント（chapters/）

各章は活動コンポーネントを組み合わせるオーケストレーター。

```javascript
// Chapter1.jsx の構造例
export default function Chapter1({ investigation, dispatch, onComplete }) {
    const [activity, setActivity] = useState('opening');

    const activities = [
        'opening',         // オープニングナラティブ
        'briefing',        // 技法ブリーフィング
        'quiz',            // RhetoricQuiz ×4問
        'mini_influencer', // InfluencerSim ×1ラウンド
        'boss_intro',      // ボス前ナラティブ
        'boss',            // ボス戦（ヘルシー太郎）
        'boss_result',     // ボス結果 + 調査ファイル更新
        'transition',      // 次章への橋渡し
    ];

    const advanceActivity = () => {
        const currentIndex = activities.indexOf(activity);
        if (currentIndex < activities.length - 1) {
            setActivity(activities[currentIndex + 1]);
        } else {
            onComplete(chapterData);
        }
    };

    // activityに応じたコンポーネントを返す
    switch (activity) {
        case 'opening':
            return <DialogueSequence dialogues={INTRO_NARRATIVE.opening} onComplete={advanceActivity} />;
        case 'quiz':
            return <RhetoricQuiz questions={chapter1Questions} feedbackLevel="detailed" ... />;
        case 'mini_influencer':
            return <InfluencerSim rounds={1} ... />;
        case 'boss':
            return <RhetoricQuiz questions={[chapter1Boss]} feedbackLevel="detailed" isBoss={true} ... />;
        // ...
    }
}
```

---

## 6. データフロー

### ゲーム内データの流れ

```
プレイヤーの操作
    ↓
活動コンポーネント（RhetoricQuiz, InfluencerSim, FactCheck）
    ↓ コールバック
章コンポーネント（Chapter1, Chapter2, Chapter3）
    ↓ dispatch(action)
GameEngine
    ├→ useInvestigation: 調査ファイル更新
    ├→ useGameState: スコア・ストリーク更新
    └→ useResearchData: 研究データ記録（バックグラウンド）
```

### Firebaseへの保存タイミング

| タイミング | 保存データ |
|-----------|-----------|
| 同意完了 | セッションメタ + デモグラフィック |
| 事前テスト完了 | preTest回答 |
| 各章完了 | 章内の全活動データ + 調査ファイル状態 |
| ゲーム全体完了 | 最終スコア + エンディング + 調査ファイル最終状態 |
| 事後テスト完了 | postTest回答 + 変化量 |
| アンケート完了 | アンケート回答 + 完了フラグ |

---

## 7. 所要時間の見積もり

| 要素 | 時間（分） |
|------|-----------|
| 同意 + デモグラフィック | 2-3 |
| 事前テスト（8問） | 4-5 |
| **第1章** | **8-10** |
| 　├ ナラティブ + ブリーフィング | 2-3 |
| 　├ レトリック識別 ×4問 | 4-5 |
| 　├ ミニインフルエンサー ×1 | 1-2 |
| 　└ ボス戦 + 演出 | 1-2 |
| **第2章** | **10-12** |
| 　├ ナラティブ | 1 |
| 　├ レトリック識別 ×4問 | 4-5 |
| 　├ インフルエンサー ×2 | 3-4 |
| 　├ 情報検証 ×1 | 2 |
| 　└ ボス戦 + 演出 | 1-2 |
| **第3章** | **12-15** |
| 　├ ナラティブ | 1 |
| 　├ レトリック識別 ×4問 | 4-5 |
| 　├ インフルエンサー ×2 | 3-4 |
| 　├ 情報検証 ×2 | 3-4 |
| 　└ ボス戦 + 演出 | 1-2 |
| **エピローグ** | **2-3** |
| 事後テスト（8問） | 4-5 |
| アンケート | 3-4 |
| **合計** | **約45-55分** |

---

## 8. エンディング分岐

| 条件 | エンディング名 | 壊滅演出 |
|------|--------------|---------|
| ボス3体撃破 + 高スコア | 完全壊滅 | 全アカウント凍結 + 黒田「パーフェクト」 |
| ボス2体以上撃破 | 壊滅 | 主要アカウント凍結 + 黒田「十分よ」 |
| ボス1体以下 | 壊滅（代表逃走） | 代表のみ逃走 + 黒田「続きはまた今度」 |
| インフルエンサー体験高倫理 | 追加称号「清廉潜入者」 | 上記に加算 |
| いずれかの章で全問正解 | 追加称号「鷹の目」 | 上記に加算 |

---

## 9. 現行プロジェクトからの移行マップ

| 現行ファイル | → 移行先 | 変更内容 |
|------------|---------|---------|
| App.jsx (700行) | App.jsx (100行) + ResearchFlow.jsx + GameEngine.jsx | 状態管理を3分割 |
| Stage1.jsx (518行) | activities/RhetoricQuiz.jsx | 汎用化、動的反応統合 |
| Stage3.jsx | activities/InfluencerSim.jsx | ラウンド数をprops化 |
| StageCreate.jsx | activities/FactCheck.jsx | シナリオ数をprops化 |
| Stage2Intro.jsx | chapters/Chapter1.jsx 内の transition | ナラティブに統合 |
| Stage3Intro.jsx | chapters/Chapter2.jsx 内の transition | ナラティブに統合 |
| Introduction.jsx | chapters/Chapter1.jsx 内の opening + briefing | ナラティブに統合 |
| FinalDebriefing.jsx | chapters/Epilogue.jsx | 壊滅演出を追加 |
| ConsentScreen.jsx | research/ConsentScreen.jsx | 移動のみ |
| TransferTest.jsx | research/TransferTest.jsx | 移動のみ |
| PostSurvey.jsx | research/PostSurvey.jsx | 移動のみ |
| CompletionScreen.jsx | research/CompletionScreen.jsx | 移動のみ |
| DataExport.jsx | research/DataExport.jsx | 移動のみ |
| common/SNSPostCard.jsx | common/SNSPostCard.jsx | 移動のみ |
| common/TechniqueTag.jsx | common/TechniqueTag.jsx | 移動のみ |
| common/SpreadVisualization.jsx | common/SpreadVisualization.jsx | 移動のみ |
| data/techniques.js | data/techniques.js | 技法ID更新済み |
| data/stage1Questions.js | data/questions/chapter1.js | 分割 |
| *(新規)* | data/questions/chapter2.js | Stage2問題 |
| *(新規)* | data/questions/chapter3.js | Stage3問題 |
| *(新規)* | data/questions/bosses.js | ボス問題 |
| data/stage3Posts.js | data/influencer/posts.js | 移動 + 技法ID更新 |
| data/targets.js | data/influencer/targets.js | 移動 + 技法ID更新 |
| data/transferTests.js | data/transfer/tests.js | サプリ/食事療法に変更済み |
| data/readingTasks.js | research/data/readingTasks.js | 対照群用、研究レイヤーへ |
| *(新規)* | data/narrative.js | ストーリーライン |
| *(新規)* | data/organization.js | 組織図・メンバー情報 |
| *(新規)* | data/reactions/npcReplies.js | NPCリプライ |
| *(新規)* | data/reactions/spreadData.js | 拡散数値 |
| *(新規)* | hooks/useGameState.js | ゲーム状態管理 |
| *(新規)* | hooks/useInvestigation.js | 調査ファイル |
| *(新規)* | hooks/useResearchData.js | 研究データ収集 |

---

## 10. 実装の優先順序

### Phase 1: 骨格（最優先）
1. ディレクトリ構造の作成
2. App.jsx の分割 → ResearchFlow.jsx + GameEngine.jsx
3. GameEngine.jsx の章遷移ロジック
4. Chapter1/2/3.jsx の活動遷移ロジック（中身は仮実装）

### Phase 2: 活動コンポーネント
5. RhetoricQuiz.jsx（Stage1.jsxから汎用化）
6. InfluencerSim.jsx（Stage3.jsxから汎用化）
7. FactCheck.jsx（StageCreate.jsxから汎用化）

### Phase 3: ゲームシステム
8. useInvestigation.js + InvestigationFile.jsx（調査ファイル）
9. PostReaction.jsx + NPCReplyFeed.jsx（動的反応）
10. ComboSystem.jsx（コンボ演出）
11. ボスデータ + ボス戦演出

### Phase 4: ナラティブ・演出
12. DialogueBox/Sequence の実装
13. ChapterTransition の実装
14. Epilogue.jsx（壊滅演出）
15. エンディング分岐

### Phase 5: データ・研究
16. 問題データの章別配置
17. NPCリプライ・拡散数値データ
18. 組織図データ
19. Firebase保存の再接続
20. 転移テスト更新
