export const TECHNIQUES = {
    fear: {
        id: 'fear',
        name: '恐怖訴求',
        description: '不安や恐怖を煽って判断力を低下させ、特定の行動を促す',
        example: '「今すぐ対策しないと手遅れに！」',
        academicBasis: 'Witte (1992) Extended Parallel Process Model',
        color: '#ef4444',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500'
    },
    authority: {
        id: 'authority',
        name: '権威訴求',
        description: '専門家・機関・肩書きの権威を利用して信頼性を演出する',
        example: '「有名大学の教授が推奨」',
        academicBasis: 'Cialdini (2001) Authority Principle',
        color: '#a855f7',
        bgColor: 'bg-purple-500/20',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-500'
    },
    scientific_veneer: {
        id: 'scientific_veneer',
        name: '科学的装い',
        description: '科学的な数値・用語・グラフを用いて根拠があるように見せかける',
        example: '「87.3%の被験者に効果」（調査方法不明）',
        academicBasis: 'Garrett & Weeks (2017); Tal & Wansink (2016) sciency-ness effect',
        color: '#f97316',
        bgColor: 'bg-orange-500/20',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500'
    },
    testimonial: {
        id: 'testimonial',
        name: '証言利用',
        description: '個人の体験談を根拠として提示し、一般化して信じさせる',
        example: '「私はこれで治りました」',
        academicBasis: 'Winterbottom et al. (2008); Graesser et al. anecdotal evidence',
        color: '#22c55e',
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400',
        borderColor: 'border-green-500'
    },
    cherry_picking: {
        id: 'cherry_picking',
        name: '選択的提示',
        description: '都合の良いデータや事実だけを選んで提示し、全体像を歪める',
        example: '「副作用の報告が○件も！」（全体の母数を隠す）',
        academicBasis: 'Schmid & Betsch (2019) denialism rhetoric; FLICC framework (Cook, 2020)',
        color: '#ec4899',
        bgColor: 'bg-pink-500/20',
        textColor: 'text-pink-400',
        borderColor: 'border-pink-500'
    },
    social_proof: {
        id: 'social_proof',
        name: '社会的証明',
        description: '多数派の行動や流行を示して同調を促す',
        example: '「みんなやってる」「世界的ムーブメント」',
        academicBasis: 'Cialdini (2001) Social Proof Principle',
        color: '#06b6d4',
        bgColor: 'bg-cyan-500/20',
        textColor: 'text-cyan-400',
        borderColor: 'border-cyan-500'
    }
};

// 選定基準:
// 1. 健康誤情報における出現頻度が先行研究で実証されている
// 2. 修辞的技法（how）として同じ抽象度に統一
// 3. 教育的に識別可能な粒度（被験者が区別できる）
// 4. 認知負荷を考慮した6技法上限
//
// 変更履歴:
// - pseudoscience → scientific_veneer: コンテンツの性質ではなく修辞的戦略として再定義
// - polarization → cherry_picking: 健康誤情報文脈での出現頻度を優先
// - bandwagon → social_proof: 学術的に標準的な用語に統一
//
// Stage1: 各技法1問 + 非操作的投稿3問 = 計9問
// 難易度: easy中心（学習フェーズ）
// 文体: 操作的/非操作的ともにカジュアル・フォーマル混在（交絡排除）
