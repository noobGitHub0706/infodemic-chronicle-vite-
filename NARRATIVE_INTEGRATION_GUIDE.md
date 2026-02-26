# narrative.js 統合ガイド

## 概要
`src/data/narrative.js` は、ゲーム全体のストーリーライン・キャラクター・ナラティブテキストを定義するデータファイルです。
既存の各コンポーネントにインポートして使用します。

## 配置
```
src/data/narrative.js   ← このファイル
```

## 各コンポーネントでの使用方法

### Introduction.jsx
```javascript
import { INTRO_NARRATIVE, CHARACTERS } from '../data/narrative';

// 既存のゲーム説明の前にオープニングシーケンスを表示
// INTRO_NARRATIVE.opening を順番に表示（type: 'system' はシステムメッセージ風、type: 'boss' は黒田のセリフ）
// 技法説明の前に INTRO_NARRATIVE.techniqueBriefingIntro を表示
// 技法説明の後に INTRO_NARRATIVE.techniqueBriefingOutro を表示
```

### Stage1.jsx
```javascript
import {
    STAGE1_NARRATIVE,
    getQuestionIntro,
    getRandomReaction,
} from '../data/narrative';

// ステージ開始時: STAGE1_NARRATIVE.stageStart
// 各問題の前: getQuestionIntro(questionIndex)  ← 問題番号に対応するセリフ
// 正解時: getRandomReaction(STAGE1_NARRATIVE.correctReactions)
// 不正解時: getRandomReaction(STAGE1_NARRATIVE.incorrectReactions)
// 非操作的投稿を正しく判定: getRandomReaction(STAGE1_NARRATIVE.correctNoTechniqueReactions)
// 非操作的投稿に誤フラグ: getRandomReaction(STAGE1_NARRATIVE.falseFlagReactions)
```

### Stage2Intro.jsx
```javascript
import { STAGE2INTRO_NARRATIVE, getResultComment } from '../data/narrative';

// Stage1の正答率に応じたコメント: getResultComment(accuracy)
// 第2章への橋渡し: STAGE2INTRO_NARRATIVE.transition を順番に表示
```

### Stage3.jsx（インフルエンサー体験）
```javascript
import { STAGE3_NARRATIVE, CHARACTERS } from '../data/narrative';

// ステージ開始: STAGE3_NARRATIVE.stageStart
// 各ラウンドの前: STAGE3_NARRATIVE.roundIntros[roundIndex]
// フォロワー急増時: STAGE3_NARRATIVE.followerSurge
// 信頼性低下時: STAGE3_NARRATIVE.trustDrop
// アカウント凍結時: STAGE3_NARRATIVE.accountSuspended
```

### Stage3Intro.jsx
```javascript
import { STAGE3INTRO_NARRATIVE } from '../data/narrative';

// 振り返り: STAGE3INTRO_NARRATIVE.reflection
// 第3章への橋渡し: STAGE3INTRO_NARRATIVE.transition を順番に表示
```

### StageCreate.jsx
```javascript
import { STAGECREATE_NARRATIVE } from '../data/narrative';

// ステージ開始: STAGECREATE_NARRATIVE.stageStart
// 各シナリオの前: STAGECREATE_NARRATIVE.scenarioIntros[scenarioIndex]
```

### FinalDebriefing.jsx
```javascript
import { DEBRIEF_NARRATIVE } from '../data/narrative';

// 称号表示の前後: DEBRIEF_NARRATIVE.closing を順番に表示
```

## セリフ表示コンポーネントの実装例

黒田のセリフを表示する共通コンポーネントを `src/components/common/` に作成すると便利です:

```jsx
// src/components/common/DialogueBox.jsx
import { CHARACTERS } from '../../data/narrative';

export default function DialogueBox({ dialogue }) {
    if (dialogue.type === 'system') {
        return (
            <div className="text-center text-gray-400 text-sm my-4 whitespace-pre-line">
                {dialogue.text}
            </div>
        );
    }

    if (dialogue.type === 'boss') {
        return (
            <div className="glass p-4 rounded-xl my-3 flex gap-3">
                <div className="text-2xl shrink-0">🍵</div>
                <div>
                    <div className="text-xs text-purple-400 font-bold mb-1">
                        {CHARACTERS.boss.name}
                    </div>
                    <div className="text-gray-200 text-sm whitespace-pre-line leading-relaxed">
                        {dialogue.text}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
```

## 注意事項

- ナラティブテキストにはゲームのヒント（技法名や正答）を含めていません
- 正解/不正解のリアクションは動機づけ目的であり、教育的解説は stage1Questions.js の explanation で提供します
- ナラティブの表示はオプショナルとし、スキップ可能にすることを推奨します（研究の所要時間への配慮）
