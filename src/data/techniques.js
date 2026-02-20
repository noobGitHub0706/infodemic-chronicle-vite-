export const TECHNIQUES = {
            fear: {
                id: 'fear',
                name: '恐怖訴求',
                description: '不安や恐怖を煽って行動を促す',
                example: '「今すぐ対策しないと手遅れに！」',
                color: '#ef4444',
                bgColor: 'bg-red-500/20',
                textColor: 'text-red-400',
                borderColor: 'border-red-500'
            },
            authority: {
                id: 'authority',
                name: '権威訴求',
                description: '専門家や著名人の権威を利用',
                example: '「有名大学の研究によると...」',
                color: '#a855f7',
                bgColor: 'bg-purple-500/20',
                textColor: 'text-purple-400',
                borderColor: 'border-purple-500'
            },
            pseudoscience: {
                id: 'pseudoscience',
                name: '疑似科学',
                description: '科学的根拠がないのに科学的装いをする',
                example: '「87.3%の患者に効果」（サンプル数不明）',
                color: '#f97316',
                bgColor: 'bg-orange-500/20',
                textColor: 'text-orange-400',
                borderColor: 'border-orange-500'
            },
            testimonial: {
                id: 'testimonial',
                name: '証言利用',
                description: '個人的な体験談を一般化',
                example: '「私の娘も効果がありました」',
                color: '#22c55e',
                bgColor: 'bg-green-500/20',
                textColor: 'text-green-400',
                borderColor: 'border-green-500'
            },
            polarization: {
                id: 'polarization',
                name: '対立煽り',
                description: '二項対立を作り出し、議論を過激化',
                example: '「信じる者vs疑う者」',
                color: '#ec4899',
                bgColor: 'bg-pink-500/20',
                textColor: 'text-pink-400',
                borderColor: 'border-pink-500'
            },
            bandwagon: {
                id: 'bandwagon',
                name: 'トレンド操作',
                description: '多数派に従うよう誘導',
                example: '「みんなやってる」「世界的ムーブメント」',
                color: '#06b6d4',
                bgColor: 'bg-cyan-500/20',
                textColor: 'text-cyan-400',
                borderColor: 'border-cyan-500'
            }
        };

        // Stage1の問題データ（10問、技法別にバランス調整）
        // 難易度: easy3, medium4, hard2, very_hard1
        // 技法: 各技法が最低1回出現、「なし」も2回;
