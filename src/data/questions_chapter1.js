// ============================================================
// src/data/questions/chapter1.js
// 第1章：配属初日 — レトリック識別（基礎訓練）
// ============================================================
// 設計方針:
//   - easy難易度、1投稿1技法
//   - 文体の交絡を排除（フォーマル/カジュアルを均等配置）
//   - 操作的3問 + 非操作的1問 = 計4問
//   - トピック: スマートフォン・デジタル健康
// ============================================================

export const CHAPTER1_QUESTIONS = [
    // --- 権威訴求（フォーマル） ---
    {
        id: 101,
        difficulty: 'easy',
        account: '国際デジタル健康研究所',
        accountId: '@intl_digital_health',
        text: '【緊急レポート】当研究所の最新調査により、1日4時間以上のスマートフォン使用が前頭葉の活動を最大23%低下させることが判明しました。\n\n主任研究員の田中博士は「想定を超える深刻な結果」とコメント。\n\n詳細レポートは当研究所サイトで公開中です。',
        techniques: ['authority'],
        explanation: '「国際デジタル健康研究所」は実在が確認できない架空の機関であり、「田中博士」も同様です。権威ある機関名と研究者名を使うことで、内容に信頼性があるように見せかけています。実在の機関かどうかを確認することが重要です。',
        reactions: {
            flaggedCorrectly: {
                npcReplies: [
                    { account: '@tanaka_dad', text: 'この研究所、検索しても出てこないですね。検証ありがとうございます' },
                    { account: '@info_literacy', text: '架空の機関名を使うパターン、最近増えてますよね' },
                ],
                likeChange: -1800,
                retweetChange: -650,
                spreadBlocked: 12000,
            },
            missed: {
                npcReplies: [
                    { account: '@worried_mama', text: '23%も低下するの!? 子どものスマホ、今すぐ取り上げなきゃ...' },
                    { account: '@kenichi_ojisan', text: 'やっぱりスマホは脳に悪いんだ。孫に見せるのやめよう' },
                ],
                likeChange: +8500,
                retweetChange: +3200,
                spreadReached: 35000,
                believedCount: 12000,
            },
        },
        investigation: {
            evidenceType: '架空の研究機関名リストを更新',
            memberClue: '末端メンバー「健康ライフ@医療情報」の投稿テンプレートと一致',
        },
    },

    // --- 恐怖訴求（カジュアル） ---
    {
        id: 102,
        difficulty: 'easy',
        account: 'まさき🧠ブレインケア',
        accountId: '@masaki_braincare',
        text: 'マジでやばいこと知った\n\nスマホの電磁波って\n脳の神経細胞を直接破壊するらしい\n\n10年後には取り返しのつかないことになるって\n知り合いの医者が言ってた\n\n特に子どもは頭蓋骨が薄いから\nダメージが大人の3倍だって\n\n拡散希望🙏',
        techniques: ['fear'],
        explanation: '「神経細胞を直接破壊」「取り返しのつかない」「ダメージ3倍」と、根拠のない恐怖を煽る表現が連続しています。「知り合いの医者」という匿名の権威に頼り、「拡散希望」で感情的な拡散を促しています。',
        reactions: {
            flaggedCorrectly: {
                npcReplies: [
                    { account: '@science_check', text: 'WHOの見解では、スマホの電磁波が脳細胞を破壊するエビデンスはありません' },
                    { account: '@nurse_yuki', text: '看護師ですが、この手のデマで不安になる患者さんが増えてて困ってます...' },
                ],
                likeChange: -2200,
                retweetChange: -900,
                spreadBlocked: 18000,
            },
            missed: {
                npcReplies: [
                    { account: '@anxious_parent', text: 'え...うちの子、毎日2時間スマホ見てるんだけど...怖すぎる😰' },
                    { account: '@grandma_tanaka', text: '孫にスマホ与えるの反対してたけど、やっぱり正しかったのね' },
                ],
                likeChange: +12000,
                retweetChange: +5500,
                spreadReached: 48000,
                believedCount: 18000,
            },
        },
        investigation: {
            evidenceType: '恐怖訴求の典型パターンを記録',
            memberClue: '末端メンバー「しぐれ🌧️育児垢」と同じテンプレート構造',
        },
    },

    // --- 社会的証明（カジュアル） ---
    {
        id: 103,
        difficulty: 'easy',
        account: 'ひなた✨朝活で人生変わった',
        accountId: '@hinata_morning',
        text: '朝のスマホ断ちチャレンジ\n始めてから人生変わった\n\n最初は私だけだったけど\n今ではフォロワー5万人のうち\n1万2000人以上が参加中！\n\nシリコンバレーのCEOたちも\nみんなやってるらしいよ\n\nまだやってないの？\n乗り遅れるよ？😏',
        techniques: ['social_proof'],
        explanation: '「1万2000人が参加」「CEOもやってる」で「みんなやっている」という印象を作り、「乗り遅れるよ？」で同調圧力をかけています。参加者数の根拠は不明であり、CEOの実践例も「らしい」と伝聞です。',
        reactions: {
            flaggedCorrectly: {
                npcReplies: [
                    { account: '@data_skeptic', text: '1万2000人って数字、どこから来てるんだろう。自己申告？' },
                    { account: '@morning_runner', text: '朝の過ごし方は人それぞれでいいと思うけどなー' },
                ],
                likeChange: -1500,
                retweetChange: -600,
                spreadBlocked: 9000,
            },
            missed: {
                npcReplies: [
                    { account: '@fomo_student', text: 'みんなやってるのか...自分も始めなきゃ' },
                    { account: '@trend_follower', text: 'CEOもやってるなら効果あるんだろうね！' },
                ],
                likeChange: +9500,
                retweetChange: +4000,
                spreadReached: 32000,
                believedCount: 11000,
            },
        },
        investigation: {
            evidenceType: 'フォロワー数水増しの形跡を検出',
            memberClue: '末端メンバー「トレンドウォッチャー📊」の拡散パターンと一致',
        },
    },

    // --- 非操作的（フォーマル + データあり → 文体トラップ） ---
    {
        id: 104,
        difficulty: 'easy',
        account: 'NHK健康チャンネル',
        accountId: '@nhk_health_ch',
        text: '【スマホと睡眠の関係】専門家に聞きました\n\n睡眠医学の専門家によると、寝る前のスマホ使用が睡眠に与える影響は「人によって大きく異なる」とのこと。\n\nブルーライトの影響を気にするよりも、就寝時刻の規則性や寝室の環境整備のほうが睡眠の質への影響が大きいという研究もあります。\n\n詳しくは番組サイトで。',
        techniques: [],
        explanation: '専門家のコメントを引用していますが、「人によって大きく異なる」と断定を避け、ブルーライト以外の要因にも触れるバランスの取れた情報提供です。特定の結論に誘導しておらず、適切な報道姿勢です。',
        reactions: {
            falseFlagged: {
                npcReplies: [
                    { account: '@nhk_viewer', text: 'NHKの記事が非表示にされたんですが...普通の報道なのに😢' },
                ],
                complaintCount: 1,
            },
        },
        investigation: null,
    },
];
