export const TECHNIQUES = {
    fear: {
        id: 'fear',
        name: '恐怖訴求',
        description: '不安や恐怖を煽って判断力を低下させ、特定の行動を促す',
        mechanism: '感情への訴え — 恐怖により合理的判断を迂回させる',
        example: '「今すぐ対策しないと手遅れに！」',
        identificationTip: '「危険」「取り返しがつかない」「手遅れ」など、恐怖を煽る表現が主軸',
        academicBasis: 'Witte (1992) Extended Parallel Process Model',
        color: '#ef4444',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500',
    },
    authority: {
        id: 'authority',
        name: '権威訴求',
        description: '専門家・機関・肩書きの権威を利用して信頼性を演出する',
        mechanism: '人物の信頼性への訴え — 「誰が言っているか」で判断させる',
        example: '「有名大学の教授が推奨」「WHOが公式に認めた」',
        identificationTip: '説得力の主軸が「人物の肩書・所属・地位」にある。データや数値ではなく、発言者の権威に依存',
        academicBasis: 'Cialdini (2001) Authority Principle',
        color: '#a855f7',
        bgColor: 'bg-purple-500/20',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-500',
    },
    fabricated_evidence: {
        id: 'fabricated_evidence',
        name: '根拠の捏造・歪曲',
        description: 'データ、統計、研究結果を捏造・歪曲・選択的に提示して、科学的根拠があるように見せかける',
        mechanism: 'データの信頼性への訴え — 「数字がある」「研究で証明」で判断させる',
        example: '「87%に効果が確認」（出典不明）、「実践者500人中78%が改善」（途中離脱者を除外）',
        identificationTip: '説得力の主軸が「数値・データ・研究結果」にある。出典不明の数字、検証できない統計、都合の良い部分だけの提示',
        academicBasis: 'Garrett & Weeks (2017) sciency-ness effect; Tal & Wansink (2016); Schmid & Betsch (2019) denialism rhetoric; Cook (2020) FLICC framework',
        color: '#f97316',
        bgColor: 'bg-orange-500/20',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500',
    },
    testimonial: {
        id: 'testimonial',
        name: '証言利用',
        description: '個人の体験談を根拠として提示し、一般化して信じさせる',
        mechanism: '経験への共感 — 個人のストーリーに感情移入させて判断させる',
        example: '「私はこれで治りました」「友人の医者が言ってた」',
        identificationTip: '説得力の主軸が「個人の体験・伝聞」にある。「私は」「知人が」「体験者の声」など',
        academicBasis: 'Winterbottom et al. (2008); anecdotal evidence effect',
        color: '#22c55e',
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400',
        borderColor: 'border-green-500',
    },
    social_proof: {
        id: 'social_proof',
        name: '社会的証明',
        description: '多数派の行動や流行を示して同調を促す',
        mechanism: '集団同調圧力 — 「みんながやっている」で判断させる',
        example: '「5000万人が実践中」「世界的ムーブメント」',
        identificationTip: '説得力の主軸が「集団の行動・人数・トレンド」にある。「○万人」「みんな」「世界中で」など',
        academicBasis: 'Cialdini (2001) Social Proof Principle',
        color: '#06b6d4',
        bgColor: 'bg-cyan-500/20',
        textColor: 'text-cyan-400',
        borderColor: 'border-cyan-500',
    },
};

// ============================================================
// 技法選定の理論的根拠
// ============================================================
//
// 1. 健康誤情報における出現頻度が先行研究で実証されている
// 2. 説得メカニズムが相互に独立している:
//      fear         = 感情への訴え
//      authority    = 人物の信頼性への訴え
//      fabricated_evidence = データの信頼性への訴え
//      testimonial  = 経験への共感
//      social_proof = 集団同調圧力
// 3. 弁別ルール:
//      主たる説得の軸が「人物の肩書」→ authority
//      主たる説得の軸が「数値・データ」→ fabricated_evidence
//      この基準により authority と fabricated_evidence の overlap を解消
// 4. 認知負荷を考慮した5技法（6技法から1削減）
//
// 変更履歴:
// v1: pseudoscience, polarization, bandwagon を含む6技法
// v2: scientific_veneer, cherry_picking, social_proof に改名した6技法
// v3: scientific_veneer + cherry_picking → fabricated_evidence に統合した5技法
//     理由: scientific_veneer と cherry_picking は構造的に共起する
//           （選択的に提示されたデータ = 科学的装い）
//           参加者がどちらを選んでも部分的に正解になり、測定のノイズとなるため統合
//
// 先行研究との差別化:
//   Bad News / GoViral! / Harmony Square は「行為レベル」（impersonation, trolling等）の分類
//   本研究は「健康誤情報に特化した説得メカニズムレベル」の分類
//   このカテゴリ体系自体が理論的貢献の一部となる
