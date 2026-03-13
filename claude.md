## プロジェクト再設計について

このプロジェクトは再設計中です。
設計の全体像は `NEW_PROJECT_STRUCTURE.md` を参照してください。

### 重要な設計原則
- 研究レイヤー（research/）とゲームレイヤー（game/）を分離する
- ゲームは3章+エピローグ構成。各章内で「識別→実践→検証」のミニサイクルを回す
- 活動コンポーネント（RhetoricQuiz, InfluencerSim, FactCheck）はpropsで章ごとに設定を変える汎用設計
- ナラティブにゲームのヒント（技法名や正答）を含めない
- 研究手続き画面（consent, transferTest, survey, complete）にナラティブを入れない

### 技法ID変更
- pseudoscience → scientific_veneer
- polarization → cherry_picking  
- bandwagon → social_proof

### データファイル配置
- src/data/techniques.js — 6技法定義
- src/data/narrative.js — ストーリー・セリフ
- src/data/organization.js — 組織図・ボス・マイルストーン
- src/data/questions/chapter1.js — 第1章問題
- src/data/questions/chapter2.js — 第2章問題
- src/data/questions/chapter3.js — 第3章問題
- src/data/transfer/tests.js — 転移テスト