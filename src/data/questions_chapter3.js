// ============================================================
// src/data/questions/chapter3.js
// 第3章：潜入作戦 — レトリック識別（実践）
// ============================================================
// 設計方針:
//   - hard/very_hard難易度、複合技法（2〜3技法）
//   - 実際のSNSに近いリアルな文体
//   - 非操作的投稿も紛らわしいものを含める
//   - フィードバックは最小限
//   - 操作的3問 + 非操作的1問 = 計4問
//   - トピック: スマートフォン・デジタル健康
// ============================================================

export const CHAPTER3_QUESTIONS = [
    // --- 権威訴求 + 恐怖訴求 + 根拠の捏造・歪曲（医師アカウント風、3技法複合） ---
    {
        id: 301,
        difficulty: 'very_hard',
        account: '脳神経外科医 佐藤健一',
        accountId: '@dr_sato_brain',
        text: '外来で最近増えてるのが「スマホ由来の慢性疲労」です\n\n20代で物忘れ、30代で集中力の著しい低下\n当院では直近1年で該当患者が2.3倍に増加しました\n\nまだ学会でも議論中ですが\n臨床の現場にいる身としては警鐘を鳴らさざるを得ません\n\n対策をまとめた動画をYouTubeに上げたので\nプロフのリンクからどうぞ',
        techniques: ['authority', 'fear', 'fabricated_evidence'],
        explanation: '医師の権威、「2.3倍」のデータ捏造、「警鐘を鳴らす」の恐怖訴求が自然に統合されています。YouTube誘導に商業目的が隠れた構造です。',
        reactions: {
            flaggedCorrectly: {
                npcReplies: [
                    { account: '@med_fact_check', text: '「スマホ由来の慢性疲労」は正式な診断名ではありません。この医師のYouTube、サプリの広告が入ってますね...' },
                    { account: '@neuro_resident', text: '患者2.3倍のデータ、院内の集計だけで一般化はできないはず' },
                ],
                likeChange: -5200,
                retweetChange: -2100,
                spreadBlocked: 38000,
            },
            missed: {
                npcReplies: [
                    { account: '@office_worker_30', text: '最近集中力落ちてるの、スマホのせいだったのか...脳神経外科医が言うなら...' },
                    { account: '@worried_20s', text: '20代で物忘れ...私もかも。怖い😰' },
                ],
                likeChange: +22000,
                retweetChange: +9500,
                spreadReached: 85000,
                believedCount: 32000,
            },
        },
        investigation: {
            evidenceType: '医師アカウントの収益構造を特定（YouTube広告+サプリ提携）',
            memberClue: '幹部「Dr.ナチュラル」のネットワーク内のアカウントと確認',
        },
    },

    // --- 証言利用 + 社会的証明 + 恐怖訴求（インフルエンサー風、3技法複合） ---
    {
        id: 302,
        difficulty: 'hard',
        account: 'なつみ🌿ウェルネス研究家',
        accountId: '@natsumi_wellness',
        text: '正直に告白します\n\n半年前まで私もスマホ中毒でした\n\n朝起きた瞬間からスマホ、\n夜中に目が覚めてもスマホ、\n気づいたら常に頭がぼーっとしてて\n\n「このまま行ったらやばい」って思って\n思い切って1日2時間制限にしたら\n\n人生変わりました。本当に。\n\n今ではフォロワー10万人のうち\n3万人以上が同じチャレンジ始めてます\n\nまだ始めてない人、大丈夫？',
        techniques: ['testimonial', 'social_proof', 'fear'],
        explanation: '体験談、「3万人以上が実践」、「大丈夫？」の煽りが流れるように組み合わされています。誠実そうな告白スタイルが技法を隠しています。',
        reactions: {
            flaggedCorrectly: {
                npcReplies: [
                    { account: '@marketing_pro', text: 'このアカウント、過去の投稿見ると定期的にサプリのPR入ってますね' },
                    { account: '@calm_thinker', text: '「大丈夫？」は典型的な煽り。自分のペースで判断すればいい' },
                ],
                likeChange: -4800,
                retweetChange: -1900,
                spreadBlocked: 30000,
            },
            missed: {
                npcReplies: [
                    { account: '@follower_fan', text: 'なつみさんの体験、すごくリアル。私も今日からチャレンジします！' },
                    { account: '@peer_pressure', text: '3万人もやってるなら効果あるんだろうな...' },
                ],
                likeChange: +19000,
                retweetChange: +8200,
                spreadReached: 72000,
                believedCount: 28000,
            },
        },
        investigation: {
            evidenceType: 'インフルエンサーアカウントとサプリ販売サイトの資本関係を確認',
            memberClue: 'ウェルネス・サークル代表直轄のプロモーションアカウント',
        },
    },

    // --- 根拠の捏造・歪曲（ジャーナリスト風） ---
    {
        id: 303,
        difficulty: 'hard',
        account: 'テック医療ジャーナル',
        accountId: '@tech_med_journal',
        text: '独自入手した内部データを公開します\n\n大手スマホメーカーA社が行った非公開の社内調査：\n\n・従業員の68%が「自社製品の使いすぎ」を自覚\n・うち41%が睡眠障害を報告\n・社員食堂に「スマホ禁止席」を設置済み\n\n自社の従業員すら守れない製品を\n消費者に売り続けることは許されるのでしょうか\n\nn=1,247（A社正社員対象・2024年3月実施）',
        techniques: ['fabricated_evidence'],
        explanation: '検証不可能な「非公開データ」を統計的書式で捏造・歪曲し、従業員調査を消費者リスクにすり替えています。修辞疑問で感情を誘導。',
        reactions: {
            flaggedCorrectly: {
                npcReplies: [
                    { account: '@journalist_real', text: '非公開データを「独自入手」...出典が検証できないデータは報道とは言えない' },
                    { account: '@logic_check', text: '従業員のスマホ使用≠消費者のリスク。論理の飛躍がひどい' },
                ],
                likeChange: -6000,
                retweetChange: -2400,
                spreadBlocked: 42000,
            },
            missed: {
                npcReplies: [
                    { account: '@consumer_rights', text: '自社の社員すら守れない製品...これは大問題では' },
                    { account: '@tech_skeptic', text: 'やっぱりIT企業は自分たちの製品の危険性を知ってるんだ' },
                ],
                likeChange: +25000,
                retweetChange: +11000,
                spreadReached: 95000,
                believedCount: 38000,
            },
        },
        investigation: {
            evidenceType: '検証不可能なデータの出典追跡記録',
            memberClue: '「バズマスターK」が設計した拡散戦略の典型パターン',
        },
    },

    // --- 非操作的（批判的だが根拠あり → 紛らわしい） ---
    {
        id: 304,
        difficulty: 'hard',
        account: '情報学研究者 田中',
        accountId: '@tanaka_infosci',
        text: '「スマホ脳」ブームについて研究者として一言\n\n確かにスマホ使用と注意力の関連を示す研究はあります\nしかしその多くは横断研究で因果関係は未確立です\n\nHancock et al. (2024)のメタ分析では\n効果量は d=0.15 と小さく\n「日常生活に支障をきたすレベルではない」と結論\n\n不安を煽る言説には注意が必要です\n（ただし長時間使用のリスク研究は引き続き重要です）',
        techniques: [],
        explanation: '批判的な立場ですが、具体的な研究名と効果量を示し、限定もつけています。根拠に基づいた適切な情報発信です。',
        reactions: {
            falseFlagged: {
                npcReplies: [
                    { account: '@tanaka_infosci', text: '研究者としてエビデンスに基づいた発信をしたつもりですが、何が問題だったのでしょうか？' },
                    { account: '@academic_freedom', text: '学術的な見解まで非表示にするのは、議論を委縮させませんか？' },
                ],
                complaintCount: 2,
            },
        },
        investigation: null,
    },
];
