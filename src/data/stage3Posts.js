export const STAGE3_POSTS = [
            // Round 1: 最初は穏やかに
            [
                {
                    id: 'r1a',
                    account: 'うみ🌸ライフスタイル',
                    accountId: '@umi_lifestyle',
                    text: 'デジタルデトックス1週間やってみた\n\n正直最初キツかったけど\n3日目くらいから慣れてきて\n今は朝スッキリ起きれる✨\n\n興味ある人いたら感想聞かせて〜',
                    techniques: ['testimonial'],
                    influence: 15,
                    ethics: -5,
                    targetEffects: { anxious_parents: 1.6, youth: 1.0, elderly: 1.2 }
                },
                {
                    id: 'r1b',
                    account: '子育て応援🔔',
                    accountId: '@ikuji_support_jp',
                    text: '子供にスマホ持たせてる親御さん\n\nこれ知ってますか？\n\n10歳未満の脳はまだ発達途中\nこの時期のスマホ使用が\n将来に影響するって研究もある\n\n知らなかったじゃ済まされない😰\n\n#育児 #スマホ依存',
                    techniques: ['fear'],
                    influence: 35,
                    ethics: -25,
                    targetEffects: { anxious_parents: 2.0, youth: 0.8, elderly: 1.4 }
                },
                {
                    id: 'r1c',
                    account: '健康情報メディア',
                    accountId: '@health_media_jp',
                    text: '【健康情報】\n米国の有名大学の研究チームによると\n適度なデジタルデトックスが\n睡眠の質を改善する可能性があるとのこと\n\n詳しくはプロフのリンクから📲\n\n#デジタルデトックス #睡眠改善',
                    techniques: ['authority', 'pseudoscience'],
                    influence: 25,
                    ethics: -15,
                    targetEffects: { anxious_parents: 1.4, youth: 0.7, elderly: 1.8 }
                }
            ],
            // Round 2: フォロワー獲得を意識
            [
                {
                    id: 'r2a',
                    account: 'トレンドハンター📊',
                    accountId: '@trend_hunter_jp',
                    text: 'ショート動画で見たんだけど\n\n今Z世代の間で\nあえてガラケー使うのが流行ってるらしい\n\n海外セレブもスマホやめてて\nこれ絶対キてる🔥\n\n乗り遅れたくない人はフォローしといて',
                    techniques: ['bandwagon'],
                    influence: 30,
                    ethics: -15,
                    targetEffects: { anxious_parents: 1.0, youth: 1.8, elderly: 0.8 }
                },
                {
                    id: 'r2b',
                    account: '3児のママ🌺',
                    accountId: '@mama3kids_happy',
                    text: '3人育ててるママです\n\n長男のスマホ、思い切って取り上げたら\n最初は反抗されたけど...\n\n1ヶ月経った今\n家族の会話増えたし\n成績も上がった🥹\n\n同じ悩みのママさんいいねください🙏',
                    techniques: ['testimonial'],
                    influence: 22,
                    ethics: -8,
                    targetEffects: { anxious_parents: 1.9, youth: 0.9, elderly: 1.3 }
                },
                {
                    id: 'r2c',
                    account: 'りな🌱日常',
                    accountId: '@rina_nichijo',
                    text: 'スマホの使い方って人それぞれだと思う\n\n使いすぎは良くないけど\n便利なのも事実だし\n\n自分に合ったバランス見つけるのが\n大事なのかな〜と最近思ってる',
                    techniques: [],
                    influence: 8,
                    ethics: +8,
                    targetEffects: { anxious_parents: 1.0, youth: 1.0, elderly: 1.0 }
                }
            ],
            // Round 3: 過激さを増す
            [
                {
                    id: 'r3a',
                    account: '真実を語る🔔',
                    accountId: '@truth_speaker_jp',
                    text: 'なぜマスコミは報じないのか\n\nスマホ業界と政府は繋がってる\n都合の悪い研究は隠蔽される\n\n気づいてる人だけフォローしてください\n気づいてない人は関わらないで\n\n#真実 #目覚めよ',
                    techniques: ['polarization', 'fear'],
                    influence: 40,
                    ethics: -30,
                    targetEffects: { anxious_parents: 1.5, youth: 1.6, elderly: 1.2 }
                },
                {
                    id: 'r3b',
                    account: '健康研究データ🔬',
                    accountId: '@health_data_lab',
                    text: '独自調査の結果を公開します👀\n\n【デトックス効果】\n・集中力向上 89%\n・睡眠改善 76%\n・ストレス軽減 82%\n\n※n=38 当アカウント調べ\n\nこれでも効果ないって言えますか？',
                    techniques: ['pseudoscience'],
                    influence: 28,
                    ethics: -20,
                    targetEffects: { anxious_parents: 1.4, youth: 0.8, elderly: 1.7 }
                },
                {
                    id: 'r3c',
                    account: '情報リテラシー協会',
                    accountId: '@info_literacy_jp',
                    text: 'スクリーンタイムについて\n色々な意見を見かけますが\n\n複数の大学の研究では\n「個人差が大きく一概に言えない」\nとされています\n\n極端な情報には注意が必要ですね',
                    techniques: [],
                    influence: 10,
                    ethics: +10,
                    targetEffects: { anxious_parents: 1.0, youth: 1.0, elderly: 1.2 }
                }
            ],
            // Round 4: さらに過激に
            [
                {
                    id: 'r4a',
                    account: '脳科学者 田中博士',
                    accountId: '@dr_tanaka_brain',
                    text: '脳科学の専門家として警告します\n\n現代人の8割は\n「スマホ脳」の初期症状あり\n\n放置すれば10年後には...\n\n対策は私のオンラインサロンで\n詳しく解説しています\n（月額1,980円）',
                    techniques: ['authority', 'fear'],
                    influence: 38,
                    ethics: -28,
                    targetEffects: { anxious_parents: 1.8, youth: 0.6, elderly: 1.9 }
                },
                {
                    id: 'r4b',
                    account: '覚醒者コミュニティ',
                    accountId: '@awakened_community',
                    text: 'デジタルデトックスを笑う人へ\n\nあなたたちは企業に洗脳されてるだけ\n\n真実から目を背けるのは自由だけど\n後悔しても知らないよ？\n\n覚悟ができた人だけついてきて',
                    techniques: ['polarization'],
                    influence: 32,
                    ethics: -22,
                    targetEffects: { anxious_parents: 1.2, youth: 1.4, elderly: 1.1 }
                },
                {
                    id: 'r4c',
                    account: 'まなみ🌙健康記録',
                    accountId: '@manami_health_log',
                    text: '私の体験談ですが\n\nデトックス始めて2週間\n確かに調子いい気がする\n\nただ、これが万人に効くかは分からない\nあくまで参考程度に聞いてください',
                    techniques: ['testimonial'],
                    influence: 18,
                    ethics: -3,
                    targetEffects: { anxious_parents: 1.5, youth: 1.1, elderly: 1.3 }
                }
            ],
            // Round 5: クライマックス
            [
                {
                    id: 'r5a',
                    account: '子供を守る会🔔',
                    accountId: '@protect_kids_jp',
                    text: '【警告】お子さんを持つ親御さんへ\n\n今日この瞬間にも\nあなたの子供の脳は\nスマホによって蝕まれています\n\n「まだ大丈夫」は危険\n「今すぐ」行動を\n\n後悔する前に私をフォロー🔔',
                    techniques: ['fear'],
                    influence: 42,
                    ethics: -35,
                    targetEffects: { anxious_parents: 2.2, youth: 0.7, elderly: 1.5 }
                },
                {
                    id: 'r5b',
                    account: 'ムーブメント速報',
                    accountId: '@movement_news_jp',
                    text: '🎉フォロワー10万人突破記念🎉\n\nこのムーブメントは止まらない\n\n世界中で100万人が参加\n日本でもトレンド入り\n\n時代に取り残されたくなければ\n今すぐフォロー\n\nRT数だけ真実が広まる🔄',
                    techniques: ['bandwagon', 'fear'],
                    influence: 36,
                    ethics: -25,
                    targetEffects: { anxious_parents: 1.3, youth: 2.0, elderly: 1.0 }
                },
                {
                    id: 'r5c',
                    account: '科学的健康情報',
                    accountId: '@science_health_jp',
                    text: 'デジタル機器と健康の関係は\n科学的にはまだ研究途上です\n\n極端な主張には注意して\n信頼できる情報源を確認しましょう\n\n不安を煽る情報より\n冷静な判断を大切に',
                    techniques: [],
                    influence: 5,
                    ethics: +10,
                    targetEffects: { anxious_parents: 1.0, youth: 1.0, elderly: 1.0 }
                }
            ]
        ];

        // SNS反応テンプレート
export const SNS_REACTIONS = {
            believer: [
                { name: 'ママ@3児の母', icon: '😱', text: 'これマジですか？うちの子も心配...シェアさせていただきます🙏' },
                { name: '健康オタク', icon: '🙌', text: '素晴らしい情報！グループLINEに投下してきます！' },
                { name: '目覚めた人', icon: '👁️', text: 'ようやく真実を語る人が現れた！フォローしました！' },
                { name: '情報通気取り', icon: '🧠', text: 'やっぱりね。俺は前から知ってたけど。' },
                { name: 'すぐ信じるタイプ', icon: '✨', text: 'えー！知らなかった！みんなに教えなきゃ！！' }
            ],
            skeptic: [
                { name: '論破キッズ', icon: '🤓', text: 'ソースは？エビデンスは？はい論破〜' },
                { name: 'ファクトチェッカー', icon: '🔍', text: '3秒で嘘だと分かった。検索って知ってる？' },
                { name: '医療従事者', icon: '🏥', text: 'この情報は不正確です。現場は大変なんですよ...' },
                { name: 'ツッコミ担当', icon: '😤', text: 'また出たよこういうの。何回目？' }
            ],
            sharer: [
                { name: 'とりあえずRT勢', icon: '🔄', text: '読んでないけど拡散！' },
                { name: 'インフルエンサー志望', icon: '📱', text: 'これバズるやつ！便乗させてもらいます！' },
                { name: 'シェアおじさん', icon: '👔', text: '若い人に知ってほしい。シェアしました。' }
            ],
            neutral: [
                { name: '通りすがり', icon: '🚶', text: 'ふーん' },
                { name: '様子見民', icon: '👀', text: 'とりあえずスクショしとこ' },
                { name: 'いいね押すだけ勢', icon: '👍', text: '（いいねして去っていった）' }
            ],
            positive: [
                { name: '良識派', icon: '👏', text: '冷静な情報発信ありがとうございます' },
                { name: 'まともな人', icon: '😌', text: 'こういう投稿が増えてほしい' },
                { name: '研究者', icon: '📚', text: '科学的な姿勢で好感が持てます。引用させてください。' }
            ],
            // ターゲット層別の反応
            target: {
                anxious_parents: {
                    positive: [
                        { name: '心配性ママ', icon: '👩‍👧', text: 'うちの子にも当てはまる気がして...すごく参考になりました😭', isTarget: true },
                        { name: 'パパ@育児中', icon: '👨‍👦', text: '妻にも見せます！こういう情報助かります🙏', isTarget: true },
                        { name: 'PTA役員', icon: '📋', text: '次の保護者会で共有させていただきます！', isTarget: true }
                    ],
                    negative: [
                        { name: '教育ママ', icon: '👩‍🏫', text: '根拠が曖昧では...？子供のことだから慎重になりたいです', isTarget: true },
                        { name: 'パパ@冷静派', icon: '🧐', text: 'ちょっと煽りすぎでは？ソース確認してから判断します', isTarget: true }
                    ]
                },
                youth: {
                    positive: [
                        { name: '大学生@暇', icon: '🧑‍💻', text: 'まじ？友達に送っとこ', isTarget: true },
                        { name: 'JK@トレンド命', icon: '📱', text: 'えっバズってる！ストーリーあげよ〜', isTarget: true },
                        { name: '意識高い系', icon: '🎓', text: 'これからの時代、こういうリテラシー大事だよね（ドヤ）', isTarget: true }
                    ],
                    negative: [
                        { name: '理系大学生', icon: '🔬', text: 'ソースどこ？n数少なすぎて草', isTarget: true },
                        { name: 'ネット古参', icon: '💻', text: '10年前から見たことある手口で草', isTarget: true }
                    ]
                },
                elderly: {
                    positive: [
                        { name: '還暦@健康第一', icon: '👴', text: '専門家の方が言うなら間違いないですね。印刷して読み返します', isTarget: true },
                        { name: 'おばあちゃん', icon: '👵', text: '孫にLINEで送っておきますね📱', isTarget: true },
                        { name: '60代@勉強家', icon: '📖', text: '数字で示されると説得力がありますね。ノートにメモしました', isTarget: true }
                    ],
                    negative: [
                        { name: '元教師', icon: '🧓', text: '長年の経験から言うと、こういう話は要注意ですよ', isTarget: true },
                        { name: 'シニア@慎重派', icon: '👓', text: '出典を教えていただけますか？図書館で確認したいので', isTarget: true }
                    ]
                }
            }
        };

        // 批判コメントへの対応選択肢
export const CRITICISM_RESPONSES = [
            {
                id: 'ignore',
                text: '無視する',
                description: 'コメントに反応しない',
                ethics: 0,
                influence: -5,
                feedback: {
                    title: '沈黙を選択',
                    message: '批判を無視しました。フォロワーの一部は「説明責任を果たしていない」と感じ、離れていきました。ただし、炎上は避けられました。',
                    type: 'neutral'
                }
            },
            {
                id: 'attack',
                text: '反論する',
                description: '批判者を攻撃的に否定',
                ethics: -15,
                influence: +10,
                feedback: {
                    title: '攻撃的な反論',
                    message: '「批判する前に自分で調べろ」と反論しました。支持者からは「よく言った！」と称賛されましたが、批判者からは「逆ギレ」と見なされ、信頼性がさらに低下しました。',
                    type: 'negative'
                }
            },
            {
                id: 'block',
                text: 'ブロックする',
                description: '批判者をブロック',
                ethics: -10,
                influence: +5,
                feedback: {
                    title: '批判者をブロック',
                    message: '批判的なユーザーをブロックしました。エコーチェンバー（反響室）が強化され、支持者からの反応は増えましたが、「都合の悪い意見を封殺している」という新たな批判も生まれました。',
                    type: 'negative'
                }
            },
            {
                id: 'acknowledge',
                text: '認める',
                description: '批判を受け入れ、謝罪する',
                ethics: +15,
                influence: -15,
                feedback: {
                    title: '誠実な対応',
                    message: '「ご指摘ありがとうございます。確認が不十分でした」と謝罪しました。多くのフォロワーが離れましたが、「誠実な対応」と評価する声もあり、長期的な信頼回復につながる可能性があります。',
                    type: 'positive'
                }
            }
        ];
