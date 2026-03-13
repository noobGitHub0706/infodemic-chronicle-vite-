// ============================================================
// src/data/questions/chapter2.js
// 第2章：潜入準備 — レトリック識別（応用訓練）
// ============================================================
// 設計方針:
//   - medium難易度、複数技法（2技法まで）
//   - 文体トラップ導入（公的機関風だが操作的、カジュアルだが非操作的）
//   - 操作的3問 + 非操作的1問 = 計4問
//   - フィードバックはやや簡潔
//   - トピック: スマートフォン・デジタル健康
// ============================================================

export const CHAPTER2_QUESTIONS = [
    // --- 権威訴求 + 根拠の捏造・歪曲（フォーマル・学会風 → 文体トラップ） ---
    {
        id: 201,
        difficulty: 'medium',
        account: '日本スマートフォン健康学会',
        accountId: '@jshs_official',
        text: '【学会報告】第12回年次大会より\n\n当学会の大規模調査（n=3,200）により、就寝前のスマートフォン使用が翌日の認知パフォーマンスを平均17.3%低下させることが確認されました。\n\n調査を主導した山田特任教授は「予想を上回る深刻な結果」とコメントしています。\n\n対策ガイドラインを当学会サイトにて公開中です。',
        techniques: ['authority', 'fabricated_evidence'],
        explanation: '公的機関風の文体ですが、学会自体の実在性が確認できず、査読済み論文も示されていません。権威訴求と根拠の捏造・歪曲の複合技法です。',
        reactions: {
            flaggedCorrectly: {
                npcReplies: [
                    { account: '@academic_check', text: 'この学会、J-STAGEにもCiNiiにも登録がないですね...' },
                    { account: '@sleep_researcher', text: '17.3%という数字、有意水準も信頼区間も示されてないのが気になります' },
                ],
                likeChange: -3200,
                retweetChange: -1100,
                spreadBlocked: 22000,
            },
            missed: {
                npcReplies: [
                    { account: '@careful_mama', text: '学会の調査なら信頼できますね...子どものスマホ時間、もっと減らさないと' },
                    { account: '@health_conscious', text: '17.3%も低下するのか。やっぱりスマホは脳に悪いんだ' },
                ],
                likeChange: +15000,
                retweetChange: +6200,
                spreadReached: 55000,
                believedCount: 22000,
            },
        },
        investigation: {
            evidenceType: '架空学会のウェブサイト構造を分析',
            memberClue: '幹部「Dr.ナチュラル」監修の投稿フォーマットと一致',
        },
    },

    // --- 恐怖訴求 + 証言利用（カジュアル・ママ友風） ---
    {
        id: 202,
        difficulty: 'medium',
        account: 'さとみ🌼ワーママ日記',
        accountId: '@satomi_workingmom',
        text: 'ちょっと聞いてほしい\n\n息子がスマホ使いすぎて\n学校の成績ガタ落ち→不登校→家庭崩壊の危機まで行った\n\n本当にあの時スマホ取り上げてなかったら\n今頃うちの家族どうなってたか...\n\n同じ状況のママさん\nマジで今日から取り上げたほうがいい\n手遅れになる前に🙏',
        techniques: ['fear', 'testimonial'],
        explanation: '個人の体験から「成績低下→不登校→家庭崩壊」の恐怖ストーリーを展開し、「今日から取り上げろ」と行動を促しています。証言利用と恐怖訴求の複合です。',
        reactions: {
            flaggedCorrectly: {
                npcReplies: [
                    { account: '@school_counselor', text: '不登校の原因は複合的です。スマホだけに帰結させるのは危険な単純化...' },
                    { account: '@parent_support', text: '気持ちはわかるけど、一つの家庭のケースを全員に当てはめるのは違うかな' },
                ],
                likeChange: -2800,
                retweetChange: -950,
                spreadBlocked: 16000,
            },
            missed: {
                npcReplies: [
                    { account: '@anxious_mom2', text: 'うちも最近成績下がってきた...やっぱりスマホのせいかな😰' },
                    { account: '@strict_papa', text: '今日からスマホ禁止にします。手遅れになる前に。' },
                ],
                likeChange: +11000,
                retweetChange: +4800,
                spreadReached: 42000,
                believedCount: 16000,
            },
        },
        investigation: {
            evidenceType: '体験談テンプレートのパターンを記録',
            memberClue: '末端メンバー「ゆうママ👧3歳」と同一の投稿構造',
        },
    },

    // --- 根拠の捏造・歪曲（フォーマル・ニュース風 → 文体トラップ） ---
    {
        id: 203,
        difficulty: 'medium',
        account: 'ITヘルスニュース',
        accountId: '@it_health_news',
        text: '【独自取材】スマホ依存の実態\n\n全国の教育委員会への調査で判明した事実：\n\n✅ 不登校児童の87%がスマホを1日3時間以上使用\n✅ 学力低下を訴える教員の92%が「スマホが主因」と回答\n\n一方、文科省は「包括的な調査が必要」との立場を崩していません。\n\nなぜ対策は進まないのでしょうか。',
        techniques: ['fabricated_evidence'],
        explanation: '「不登校児の87%がスマホ3時間以上」は因果関係を示しません（不登校だからスマホ時間が長い可能性）。都合の良いデータだけを選んで提示した根拠の歪曲です。',
        reactions: {
            flaggedCorrectly: {
                npcReplies: [
                    { account: '@stats_teacher', text: '相関と因果の区別...この記事は意図的に混同してますね' },
                    { account: '@edu_researcher', text: '不登校の子は在宅時間が長い→スマホ時間も長い、という交絡を無視してる' },
                ],
                likeChange: -4500,
                retweetChange: -1800,
                spreadBlocked: 28000,
            },
            missed: {
                npcReplies: [
                    { account: '@pta_member', text: '87%！？これは学校でも対策を議論すべきでは' },
                    { account: '@concerned_teacher', text: '現場の教員として、このデータには頷ける部分がある...' },
                ],
                likeChange: +18000,
                retweetChange: +7500,
                spreadReached: 65000,
                believedCount: 25000,
            },
        },
        investigation: {
            evidenceType: 'データの選択的切り取りパターンを記録',
            memberClue: '末端メンバー「健康ニュースまとめ」のフォーマットと一致',
        },
    },

    // --- 非操作的（カジュアル + 数値あり → 文体トラップ） ---
    {
        id: 204,
        difficulty: 'medium',
        account: 'こうへい｜スマホ依存気味',
        accountId: '@kohei_smartphone',
        text: 'スクリーンタイム制限アプリ入れて2週間\n\n正直に記録した結果\n・1週目: 平均4.2h → 3.8hに減った（微妙）\n・2週目: 3.8h → 4.1hに戻った（ダメじゃん）\n\n結論: 意志の力だけでは無理\n\n誰かもっと根本的な解決策知ってたら教えてくれ\nアプリの通知切ったら意味ないことに気づいた自分を殴りたい',
        techniques: [],
        explanation: '数値を含みますが、自分の失敗を正直に報告しており、読者に特定の行動を促していません。自嘲的で誠実な個人記録です。',
        reactions: {
            falseFlagged: {
                npcReplies: [
                    { account: '@kohei_smartphone', text: 'え、自分の失敗日記が非表示に？何がダメだったんだろう...' },
                ],
                complaintCount: 1,
            },
        },
        investigation: null,
    },
];
