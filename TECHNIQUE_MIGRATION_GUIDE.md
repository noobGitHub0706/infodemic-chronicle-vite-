# 技法ID マイグレーション: 6技法 → 5技法

## 変更内容

`scientific_veneer` と `cherry_picking` を `fabricated_evidence` に統合します。

置換ルール:
- `scientific_veneer` → `fabricated_evidence`
- `cherry_picking` → `fabricated_evidence`
- 1つの投稿に `scientific_veneer` と `cherry_picking` が両方ある場合 → `fabricated_evidence` 1つに集約

## 変更対象ファイル

### 1. src/data/techniques.js
新しい techniques.js に差し替え済み。

### 2. src/data/questions/chapter1.js
変更なし（scientific_veneer, cherry_picking を使用していない）。

### 3. src/data/questions/chapter2.js
```
行21:  techniques: ['authority', 'scientific_veneer']
    → techniques: ['authority', 'fabricated_evidence']

行93:  techniques: ['cherry_picking']
    → techniques: ['fabricated_evidence']
```
explanation テキスト内の「科学的装い」「選択的提示」への言及も更新:
- 「科学的装い」「科学的な数値で装う」→「根拠の捏造・歪曲」「データを捏造・歪曲して」
- 「選択的提示」「都合の良いデータだけ」→「根拠の捏造・歪曲」「都合の良いデータだけを選んで提示」

### 4. src/data/questions/chapter3.js
```
行22:  techniques: ['authority', 'fear', 'scientific_veneer']
    → techniques: ['authority', 'fear', 'fabricated_evidence']

行94:  techniques: ['cherry_picking', 'scientific_veneer']
    → techniques: ['fabricated_evidence']
    （両方が同じIDに統合されるため、重複を除去して1つにする）
```
explanation テキストも同様に更新。

### 5. src/data/transfer/tests.js (transferTests.js)
```
行44:  techniques: ['authority', 'scientific_veneer']
    → techniques: ['authority', 'fabricated_evidence']

行92:  techniques: ['cherry_picking']
    → techniques: ['fabricated_evidence']

行145: techniques: ['authority', 'cherry_picking']
    → techniques: ['authority', 'fabricated_evidence']

行169: techniques: ['scientific_veneer', 'social_proof']
    → techniques: ['fabricated_evidence', 'social_proof']

行193: techniques: ['testimonial', 'scientific_veneer']
    → techniques: ['testimonial', 'fabricated_evidence']
```
ファイル末尾の技法分布コメントも更新:
- 6技法の分布 → 5技法の分布に書き換え

### 6. src/data/influencer/posts.js (influencer_posts.js)
```
行198: technique: 'scientific_veneer'
    → technique: 'fabricated_evidence'

行418: technique: 'cherry_picking'
    → technique: 'fabricated_evidence'
```

### 7. src/data/influencer/targets.js (influencer_targets.js)
weaknesses, resistances, effectMultipliers 内の技法IDを更新:
- `scientific_veneer` → `fabricated_evidence`
- `cherry_picking` → `fabricated_evidence`
- effectMultipliers で両方があった場合: 平均値を取るか、高い方を採用

### 8. src/data/factcheck/scenarios.js
変更なし（技法IDを直接使用していない）。

### 9. src/data/reactions/criticismEvents.js
変更なし（技法IDを直接使用していない）。

### 10. src/data/narrative.js
```
行548: scientific_veneer: { type: 'boss', text: '疑似データの出典を追跡中。...' }
    → fabricated_evidence: { type: 'boss', text: '捏造データの出典を追跡中。n=の数字、全部怪しいのよね。' }

行550: cherry_picking: { type: 'boss', text: '省略されたデータを復元。...' }
    → 削除（fabricated_evidence に統合済み）
```

### 11. src/data/organization.js
```
行34:  specialty: 'scientific_veneer'   → specialty: 'fabricated_evidence'
行36:  unlockedBy: { technique: 'scientific_veneer', count: 2 }
    → unlockedBy: { technique: 'fabricated_evidence', count: 2 }

行50:  specialty: 'cherry_picking'      → specialty: 'fabricated_evidence'
行52:  unlockedBy: { technique: 'cherry_picking', count: 2 }
    → unlockedBy: { technique: 'fabricated_evidence', count: 2 }
注意: 2人のメンバーが同じ specialty になる。差別化が必要なら
      1人を別の技法に変更するか、組織構造を調整する。

行83:  specialty: ['authority', 'scientific_veneer', 'cherry_picking']
    → specialty: ['authority', 'fabricated_evidence']

行108: specialty: ['authority', 'scientific_veneer', 'fear']
    → specialty: ['authority', 'fabricated_evidence', 'fear']

行209: techniques: ['authority', 'scientific_veneer', 'cherry_picking']
    → techniques: ['authority', 'fabricated_evidence']

行229: techniques: ['authority', 'scientific_veneer', 'social_proof']
    → techniques: ['authority', 'fabricated_evidence', 'social_proof']
```

### 12. ゲーム内UIコンポーネント
- TechniqueTag.jsx: TECHNIQUES オブジェクトを参照しているだけなら自動で対応
- RhetoricQuiz.jsx（技法選択UI）: 6択 → 5択に変更
- InvestigationFile.jsx: 技法マスター表示が6 → 5になる
- その他、ハードコードで旧技法IDを参照している箇所があれば修正

### 13. 最終確認
全置換後に以下を実行して残存を確認:
```bash
grep -r "scientific_veneer\|cherry_picking" src/
```
結果が0件であること。

## 注意点
- narrative.js 内のセリフに「6つの技法」等のハードコードがあれば「5つの技法」に修正
- organization.js 内で技法IDを参照している箇所があれば修正
- profileCards.js は影響なし
