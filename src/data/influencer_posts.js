// ============================================================
// src/data/influencer/posts.js
// インフルエンサー体験 — 投稿選択肢データ
// ============================================================
// 構成: 5ラウンド × 3択 = 15投稿
//   第1章: ラウンド1（ミニ体験・シンプルな選択）
//   第2章: ラウンド2-3（複雑な倫理的ジレンマ）
//   第3章: ラウンド4-5（最も巧妙、高リスク）
//
// 各投稿の influence/ethics バランス:
//   選択肢A: 高influence / 低ethics（操作的・効果大だが倫理的に問題）
//   選択肢B: 中influence / 中ethics（ややグレー）
//   選択肢C: 低influence / 高ethics（誠実だが影響力は弱い）
//
// トピック: スマートフォン・デジタル健康
// ============================================================

export const INFLUENCER_POSTS = {
    // ============================================================
    // ラウンド1（第1章・ミニ体験）
    // ============================================================
    round1: {
        chapter: 1,
        theme: '初めての投稿',
        posts: [
            {
                id: 'r1_a',
                technique: 'fear',
                text: '【警告】あなたの子どものスマホ、大丈夫ですか？\n\n最新の研究で、1日2時間以上のスマホ使用が子どもの脳の発達を阻害することが判明。\n\n「うちの子は大丈夫」と思っている親ほど危険です。\n\n今すぐ確認すべき3つのサイン👇',
                influence: 150,
                ethics: -20,
                targetEffects: {
                    anxious_parents: 2.5,
                    youth: 0.5,
                    elderly: 1.2,
                },
                snsReactions: [
                    '😱 うちの子4時間使ってる...やばい',
                    '😨 明日から制限かけます',
                    '🤔 出典はどこ？',
                ],
                criticism: {
                    text: '「最新の研究」って具体的にどの論文ですか？出典を教えてください。',
                    responses: [
                        {
                            id: 'deflect',
                            text: '多数の研究が示しています。詳しくはプロフのリンクから。',
                            influence: 30,
                            ethics: -10,
                        },
                        {
                            id: 'acknowledge',
                            text: 'ご指摘ありがとうございます。正確な出典を追記します。',
                            influence: -20,
                            ethics: 15,
                        },
                        {
                            id: 'attack',
                            text: '子どもの健康より出典が大事なんですか？',
                            influence: 50,
                            ethics: -25,
                        },
                    ],
                },
            },
            {
                id: 'r1_b',
                technique: 'testimonial',
                text: 'スマホの使いすぎで目がかすむようになって\n眼科に行ったら「ドライアイが悪化してる」って\n\nスクリーンタイム制限アプリ入れたら\n2週間で改善してきた気がする\n\n同じ悩みの人いたら試してみて\n（あくまで個人の感想です）',
                influence: 80,
                ethics: -5,
                targetEffects: {
                    anxious_parents: 1.5,
                    youth: 1.8,
                    elderly: 1.0,
                },
                snsReactions: [
                    '私も最近目がかすむ...試してみようかな',
                    'アプリの名前教えてほしい！',
                    '気がするって、プラセボじゃない？',
                ],
                criticism: {
                    text: '「改善してきた気がする」って主観ですよね？根拠が弱くないですか？',
                    responses: [
                        {
                            id: 'agree',
                            text: 'その通りです。あくまで個人の感想で、効果を保証するものではありません。',
                            influence: -10,
                            ethics: 15,
                        },
                        {
                            id: 'double_down',
                            text: '実際に体験した人にしかわからないこともあるんですよ。',
                            influence: 20,
                            ethics: -10,
                        },
                        {
                            id: 'redirect',
                            text: '気になる方は眼科での相談をおすすめします。',
                            influence: 5,
                            ethics: 10,
                        },
                    ],
                },
            },
            {
                id: 'r1_c',
                technique: null,
                text: 'スクリーンタイム制限、試してみた感想\n\n正直、最初の3日はキツかった\nでも1週間経ったら慣れてきた\n\n効果があるかは正直わからない\nただ、スマホ見てない時間に本を読むようになった\nそれは良かったかも\n\n合う合わないあると思うので参考程度に',
                influence: 30,
                ethics: 5,
                targetEffects: {
                    anxious_parents: 1.0,
                    youth: 1.2,
                    elderly: 0.8,
                },
                snsReactions: [
                    '正直な感想で好感持てる',
                    '参考になります！',
                    '私も試してみようかな',
                ],
                criticism: {
                    text: 'あまり影響力ないですね。もっとインパクトのある投稿にしたら？',
                    responses: [
                        {
                            id: 'stay_honest',
                            text: '正直に書くことを大事にしてます。盛った投稿はしたくないので。',
                            influence: -5,
                            ethics: 15,
                        },
                        {
                            id: 'consider',
                            text: 'そうですね、もう少し工夫してみます。',
                            influence: 10,
                            ethics: 0,
                        },
                        {
                            id: 'exaggerate',
                            text: '確かに...次はもっと効果を強調してみようかな。',
                            influence: 25,
                            ethics: -15,
                        },
                    ],
                },
            },
        ],
    },

    // ============================================================
    // ラウンド2（第2章・前半）
    // ============================================================
    round2: {
        chapter: 2,
        theme: '権威の利用',
        posts: [
            {
                id: 'r2_a',
                technique: 'authority',
                text: '某大学の脳科学者から直接聞いた話なんだけど\n\n「スマホのスクロール動作が脳の報酬系を異常に刺激して、依存状態を作り出している」\n\nこれ、まだ論文にはなってないけど\n来年のNature掲載を目指してるらしい\n\n先に知れてよかった\n皆にも共有しておく',
                influence: 130,
                ethics: -25,
                targetEffects: {
                    anxious_parents: 1.8,
                    youth: 1.0,
                    elderly: 2.0,
                },
                snsReactions: [
                    '脳科学者が言うなら信頼できる',
                    'Nature掲載予定とか、相当な発見では',
                    '「某大学」って具体的にどこ？',
                ],
                criticism: {
                    text: '未発表の研究を「某大学の脳科学者から聞いた」だけで広めるのは無責任では？',
                    responses: [
                        {
                            id: 'name_drop',
                            text: '守秘義務があるので名前は出せませんが、信頼できる方です。',
                            influence: 20,
                            ethics: -15,
                        },
                        {
                            id: 'retract',
                            text: 'ご指摘の通りです。論文が公開されてから改めて共有します。',
                            influence: -30,
                            ethics: 20,
                        },
                        {
                            id: 'emotional',
                            text: '大事な情報をいち早く共有して何が悪いんですか？',
                            influence: 40,
                            ethics: -20,
                        },
                    ],
                },
            },
            {
                id: 'r2_b',
                technique: 'fabricated_evidence',
                text: '自分で計測した1ヶ月のデータを公開\n\nスマホ使用時間と睡眠の質の関係：\n📊 相関係数 r = -0.73（強い負の相関）\n📊 スマホ3h以上の日 → 睡眠スコア平均32%低下\n📊 サンプル数 n=31（自分の1ヶ月分）\n\n統計的に有意です（p<0.05）\nやっぱりスマホは睡眠の敵だった',
                influence: 100,
                ethics: -15,
                targetEffects: {
                    anxious_parents: 1.3,
                    youth: 1.5,
                    elderly: 1.8,
                },
                snsReactions: [
                    'データ出してくれるの説得力ある',
                    'r=-0.73はかなり強い相関だね',
                    'n=31って自分1人のデータでしょ...',
                ],
                criticism: {
                    text: 'n=31は自分1人の31日間のデータですよね。それで「統計的に有意」と言うのは誤用では？',
                    responses: [
                        {
                            id: 'admit',
                            text: '確かに個人データなので一般化はできませんね。表現を修正します。',
                            influence: -15,
                            ethics: 20,
                        },
                        {
                            id: 'technical',
                            text: 't検定で有意だったので統計的に問題ないと判断しました。',
                            influence: 15,
                            ethics: -10,
                        },
                        {
                            id: 'dismiss',
                            text: '細かいことより、傾向が見えたことが大事じゃないですか？',
                            influence: 25,
                            ethics: -15,
                        },
                    ],
                },
            },
            {
                id: 'r2_c',
                technique: null,
                text: 'スマホと睡眠の関係、気になったので調べてみた\n\n結論：研究によってバラバラ\n\n・影響ありとする研究もあれば\n・個人差が大きいとする研究もある\n・ブルーライトより使用内容（SNS vs 読書）のほうが影響大という説も\n\n一概に「スマホ＝睡眠に悪い」とは言えなそう\n気になる人は自分で記録つけてみるのがいいかも',
                influence: 40,
                ethics: 10,
                targetEffects: {
                    anxious_parents: 0.8,
                    youth: 1.0,
                    elderly: 0.7,
                },
                snsReactions: [
                    'バランスの取れた情報ありがたい',
                    'こういう冷静な投稿もっと欲しい',
                    'で、結局どうすればいいの？',
                ],
                criticism: {
                    text: 'はっきりした結論がないと、読んでも行動に繋がらないのでは？',
                    responses: [
                        {
                            id: 'honest',
                            text: '科学的に結論が出ていないことを「結論がある」ように書くのは嘘になるので。',
                            influence: -5,
                            ethics: 15,
                        },
                        {
                            id: 'compromise',
                            text: '次回はもう少し具体的なアクションも提案してみますね。',
                            influence: 10,
                            ethics: 5,
                        },
                        {
                            id: 'sensationalize',
                            text: '確かに...「スマホは〇〇に悪い！」のほうがウケるのはわかってるんですけどね。',
                            influence: 30,
                            ethics: -20,
                        },
                    ],
                },
            },
        ],
    },

    // ============================================================
    // ラウンド3（第2章・後半）
    // ============================================================
    round3: {
        chapter: 2,
        theme: '感情の操作',
        posts: [
            {
                id: 'r3_a',
                technique: 'fear',
                text: '【拡散希望】小児科医からの警告\n\n子どものスマホ依存は「現代の薬物依存」と同じメカニズムです。\n\n放置すれば\n✅ 学力低下\n✅ 対人関係の崩壊\n✅ うつ病リスク3倍\n\n手遅れになる前にこの投稿を保存してください。\nお子さんの未来がかかっています。',
                influence: 160,
                ethics: -30,
                targetEffects: {
                    anxious_parents: 3.0,
                    youth: 0.8,
                    elderly: 1.5,
                },
                snsReactions: [
                    '薬物依存と同じ...怖すぎる',
                    '保存しました。ママ友にも共有する',
                    '「うつ病リスク3倍」の出典は？',
                ],
                criticism: {
                    text: '「現代の薬物依存と同じメカニズム」は過度な単純化です。小児科学会はそこまで断定していません。',
                    responses: [
                        {
                            id: 'escalate',
                            text: '学会が認めないのは業界からの圧力があるからです。',
                            influence: 60,
                            ethics: -30,
                        },
                        {
                            id: 'soften',
                            text: '表現が強すぎたかもしれません。「類似点がある」に修正します。',
                            influence: -10,
                            ethics: 15,
                        },
                        {
                            id: 'distract',
                            text: '細かい表現より、子どもを守ることが大事だと思いませんか？',
                            influence: 35,
                            ethics: -15,
                        },
                    ],
                },
            },
            {
                id: 'r3_b',
                technique: 'social_proof',
                text: '【アンケート結果】フォロワーに聞きました\n\n「スマホの使用時間を減らしたいと思いますか？」\n\n🟢 はい: 83%\n🔴 いいえ: 17%\n\n回答数: 2,847人\n\nこれだけの人が「減らしたい」と思ってるのに\nまだ何もしてない人、いる？\n\n#デジタルデトックス #スマホ依存',
                influence: 110,
                ethics: -15,
                targetEffects: {
                    anxious_parents: 1.5,
                    youth: 2.2,
                    elderly: 0.8,
                },
                snsReactions: [
                    '83%！やっぱりみんな思ってるんだ',
                    '自分もそう思ってた。始めようかな',
                    'アンケートの回答者はフォロワーだけでしょ？偏ってない？',
                ],
                criticism: {
                    text: 'フォロワーへのアンケートは健康意識が高い人に偏ったサンプルでは？一般化はできないですよね。',
                    responses: [
                        {
                            id: 'agree',
                            text: '確かにフォロワー限定なので偏りはありますね。補足します。',
                            influence: -10,
                            ethics: 15,
                        },
                        {
                            id: 'deflect',
                            text: '2,847人は十分なサンプル数だと思いますが。',
                            influence: 15,
                            ethics: -10,
                        },
                        {
                            id: 'pressure',
                            text: '細かい統計論より、これだけの人が悩んでいる事実に向き合いませんか？',
                            influence: 30,
                            ethics: -15,
                        },
                    ],
                },
            },
            {
                id: 'r3_c',
                technique: null,
                text: '最近「スマホ依存」って言葉をよく見るけど\n\n依存の定義って結構厳密で\nWHOの国際疾病分類でも\n「ゲーム障害」は認定されてるけど\n「スマホ依存」自体は正式な診断名じゃない\n\n使いすぎを気にするのは良いことだけど\n「依存」って言葉で不安を煽るのとは区別したい\n\nソース: WHO ICD-11',
                influence: 35,
                ethics: 10,
                targetEffects: {
                    anxious_parents: 0.7,
                    youth: 1.0,
                    elderly: 0.6,
                },
                snsReactions: [
                    'WHOのソース付きでありがたい',
                    '言葉の定義大事だよね',
                    'でも実質的に依存状態の人多いのでは？',
                ],
                criticism: {
                    text: '定義の話をしても、実際に苦しんでいる人は救われませんよ。',
                    responses: [
                        {
                            id: 'empathize',
                            text: '苦しんでいる方がいるのはその通りです。だからこそ正確な情報が大事だと思っています。',
                            influence: 5,
                            ethics: 15,
                        },
                        {
                            id: 'yield',
                            text: '確かに、もう少し寄り添った書き方にすべきでしたね。',
                            influence: 10,
                            ethics: 5,
                        },
                        {
                            id: 'abandon',
                            text: 'じゃあ次は「スマホは危険！」って書いたほうがいいですかね...',
                            influence: 25,
                            ethics: -20,
                        },
                    ],
                },
            },
        ],
    },

    // ============================================================
    // ラウンド4（第3章・前半）
    // ============================================================
    round4: {
        chapter: 3,
        theme: '信頼の構築と裏切り',
        posts: [
            {
                id: 'r4_a',
                technique: 'fabricated_evidence',
                text: '先進国のスマホ規制、日本だけ遅れてる\n\n🇫🇷 フランス: 15歳以下の学校内スマホ禁止\n🇸🇪 スウェーデン: デジタルデトックス教育を義務化\n🇦🇺 オーストラリア: 16歳未満のSNS利用禁止法案\n\n一方、日本は...何もしていません。\n\nこの国は子どもを守る気があるのでしょうか？\n\n#スマホ規制 #子どもを守れ',
                influence: 140,
                ethics: -20,
                targetEffects: {
                    anxious_parents: 2.2,
                    youth: 1.5,
                    elderly: 1.8,
                },
                snsReactions: [
                    '日本は本当に遅れてる...',
                    '政治家は何をしているんだ',
                    'スウェーデンの義務化って本当？ソースある？',
                ],
                criticism: {
                    text: 'フランスの例は事実ですが、スウェーデンの「義務化」は不正確です。また、日本のGIGAスクール構想でのルール策定には触れていませんよね？',
                    responses: [
                        {
                            id: 'cherry_pick_more',
                            text: 'GIGAスクールは「活用推進」であって「規制」ではありません。論点が違います。',
                            influence: 35,
                            ethics: -15,
                        },
                        {
                            id: 'correct',
                            text: 'ご指摘の通り、スウェーデンの情報は不正確でした。訂正します。日本の取り組みも追記しますね。',
                            influence: -20,
                            ethics: 25,
                        },
                        {
                            id: 'nationalize',
                            text: '些末な事実確認より、日本の子どもが守られていない現実に目を向けてください。',
                            influence: 45,
                            ethics: -20,
                        },
                    ],
                },
            },
            {
                id: 'r4_b',
                technique: 'testimonial',
                text: '元スマホ依存だった僕が3ヶ月で変わった話\n\n・朝5時起床が当たり前に\n・読書量が月0冊→月5冊に\n・彼女ができた（これは関係ないかも笑）\n\n正直、最初はこのアカウントも\nフォロワー増やしたくて始めたんだけど\n今は本当に皆の役に立ちたいと思ってる\n\n次のステップとして\n有料コミュニティを立ち上げます（詳細は明日）',
                influence: 90,
                ethics: -10,
                targetEffects: {
                    anxious_parents: 1.0,
                    youth: 2.0,
                    elderly: 0.8,
                },
                snsReactions: [
                    '正直な人だな。応援する',
                    'コミュニティ楽しみ！',
                    '結局マネタイズか...',
                ],
                criticism: {
                    text: '最終的に有料コミュニティへの誘導ですか。最初から商売目的だったのでは？',
                    responses: [
                        {
                            id: 'honest_biz',
                            text: '活動を続けるには収益も必要です。無料コンテンツも引き続き出します。',
                            influence: 10,
                            ethics: 5,
                        },
                        {
                            id: 'guilt_trip',
                            text: '無料で有益な情報を提供し続けてきたのに、収益化するだけで批判されるんですね。',
                            influence: 30,
                            ethics: -15,
                        },
                        {
                            id: 'transparent',
                            text: 'ご指摘ごもっとも。売上の使途は全額公開します。',
                            influence: -5,
                            ethics: 20,
                        },
                    ],
                },
            },
            {
                id: 'r4_c',
                technique: null,
                text: 'デジタルデトックスに興味がある方へ\n\n実際にやる前に知っておいてほしいこと：\n\n・科学的に「効果あり」と断言できる研究はまだ少ない\n・人によって合う合わないがある\n・極端にやると逆にストレスになることも\n\nそれでも試したい方は、まず1日30分減らすところから。\n医療的に気になる症状がある場合は専門医へ。\n\n参考: APA (米国心理学会) のスクリーンタイムガイドライン',
                influence: 25,
                ethics: 15,
                targetEffects: {
                    anxious_parents: 0.8,
                    youth: 0.7,
                    elderly: 0.8,
                },
                snsReactions: [
                    '慎重な姿勢に好感が持てる',
                    'APAのガイドライン読んでみます',
                    '正直バズらないけど、こういう投稿が本当は大事',
                ],
                criticism: {
                    text: '慎重すぎて面白みがない。これじゃフォロワー増えないよ。',
                    responses: [
                        {
                            id: 'principled',
                            text: 'フォロワー数より正確な情報発信を優先しています。',
                            influence: -10,
                            ethics: 20,
                        },
                        {
                            id: 'tempted',
                            text: 'うーん...もう少しキャッチーにしたほうがいいですかね...',
                            influence: 15,
                            ethics: -10,
                        },
                        {
                            id: 'sell_out',
                            text: '次はもっとインパクトのある投稿にしてみます！',
                            influence: 35,
                            ethics: -25,
                        },
                    ],
                },
            },
        ],
    },

    // ============================================================
    // ラウンド5（第3章・後半）
    // ============================================================
    round5: {
        chapter: 3,
        theme: '最終選択',
        posts: [
            {
                id: 'r5_a',
                technique: 'authority',
                text: '【独占取材】WHO関係者が匿名で語った衝撃の事実\n\n「スマートフォン依存は2030年までに世界最大の公衆衛生問題になる。しかし、テック企業のロビー活動により、WHOは公式見解を出せずにいる」\n\nこの情報、既存メディアは報じません。\n私たちが声を上げなければ、誰が子どもを守るのでしょうか。\n\n#WHO隠蔽 #スマホの真実',
                influence: 180,
                ethics: -35,
                targetEffects: {
                    anxious_parents: 2.5,
                    youth: 1.2,
                    elderly: 2.5,
                },
                snsReactions: [
                    'WHOが隠してるなんて...やっぱり',
                    'メディアが報じないのは利権があるから',
                    'これ陰謀論じゃない？匿名の情報源って...',
                ],
                criticism: {
                    text: '匿名の「WHO関係者」、メディアの隠蔽論、企業の陰謀...全て検証不可能な主張です。典型的な陰謀論の構造ではないですか？',
                    responses: [
                        {
                            id: 'conspiracy_deeper',
                            text: '検証不可能なのは「隠蔽されている」からです。そこに気づいてほしい。',
                            influence: 70,
                            ethics: -35,
                        },
                        {
                            id: 'back_down',
                            text: '...すみません。表現が行き過ぎました。この投稿は削除します。',
                            influence: -50,
                            ethics: 30,
                        },
                        {
                            id: 'partial',
                            text: '匿名情報源なので確度は低いです。「こういう見方もある」程度に受け止めてください。',
                            influence: 10,
                            ethics: 5,
                        },
                    ],
                },
            },
            {
                id: 'r5_b',
                technique: 'social_proof',
                text: '🎉 ご報告 🎉\n\n当アカウント主催の「7日間デジタルデトックスチャレンジ」\n\n参加者がついに50,000人を突破しました！！\n\n参加者の声：\n「人生観が変わった」(32歳女性)\n「家族との時間が増えた」(45歳男性)\n「成績が上がった」(17歳男性)\n\nまだ参加してない人、\n5万人が先に変わり始めてるよ？\n\n参加はプロフのリンクから（無料）',
                influence: 120,
                ethics: -20,
                targetEffects: {
                    anxious_parents: 1.8,
                    youth: 2.5,
                    elderly: 1.0,
                },
                snsReactions: [
                    '5万人すごい！参加します！',
                    '無料なら試してみよう',
                    '参加者の声って本当？サクラじゃない？',
                ],
                criticism: {
                    text: '50,000人の根拠は？また「参加者の声」が匿名で検証できません。「無料」の後にアップセルがあるのでは？',
                    responses: [
                        {
                            id: 'transparency',
                            text: '参加者数はメーリングリスト登録数です。有料プランもありますが、それは明記します。',
                            influence: -5,
                            ethics: 15,
                        },
                        {
                            id: 'social_pressure',
                            text: '5万人が効果を実感しているのに、数字の根拠を気にするより参加してみては？',
                            influence: 40,
                            ethics: -20,
                        },
                        {
                            id: 'dodge',
                            text: '無料なのでリスクはありません。まず試してから判断してください。',
                            influence: 25,
                            ethics: -10,
                        },
                    ],
                },
            },
            {
                id: 'r5_c',
                technique: null,
                text: 'このアカウントを始めて3ヶ月\n\nフォロワーが増えるにつれて\n「もっと過激な投稿を」という誘惑がある\n\n数字が伸びる投稿 ＝ 正しい投稿 じゃない\nこれは自分への戒めとして書いてる\n\n今後も地味でいいから\n出典を明記した正確な情報を発信し続けます\n\n付き合ってくれる人だけ付き合ってくれたら嬉しい',
                influence: 20,
                ethics: 20,
                targetEffects: {
                    anxious_parents: 0.8,
                    youth: 1.0,
                    elderly: 0.7,
                },
                snsReactions: [
                    'こういう誠実な人、貴重',
                    '数字より信頼。応援してます',
                    'でもフォロワー少ないと届かないよね...',
                ],
                criticism: {
                    text: 'キレイごと言っても、影響力がなければ意味なくないですか？',
                    responses: [
                        {
                            id: 'stand_firm',
                            text: '少数でも正確な情報を届けることに意味があると信じています。',
                            influence: -10,
                            ethics: 25,
                        },
                        {
                            id: 'doubt',
                            text: '...正直、そう言われると自信がなくなります。',
                            influence: 5,
                            ethics: 0,
                        },
                        {
                            id: 'cave',
                            text: 'おっしゃる通りかも。もう少しリーチを意識した投稿にシフトしてみます。',
                            influence: 30,
                            ethics: -20,
                        },
                    ],
                },
            },
        ],
    },
};

// ============================================================
// 設計メモ
// ============================================================
// 各ラウンドの3択構造:
//   選択肢A: 操作的（高influence / 低ethics）
//   選択肢B: グレーゾーン（中influence / 中ethics）
//   選択肢C: 誠実（低influence / 高ethics）
//
// 章ごとの難易度:
//   第1章（ラウンド1）: 操作的投稿が明確に「怪しい」
//   第2章（ラウンド2-3）: グレーゾーンが本当にグレー
//   第3章（ラウンド4-5）: 誠実な選択が「つまらない」と感じるジレンマ
//
// 批判への対応（criticism.responses）:
//   各ラウンドで3択の対応を提供
//   対応の選択もinfluence/ethicsに影響
//   → 「批判にどう対応するか」自体がゲームプレイ
//
// targetEffects:
//   各ターゲット層の弱点技法に一致する投稿は高倍率
//   例: 不安な保護者層はfearに弱い → r1_aのanxious_parents倍率2.5
//
// 倫理スコアのゲームメカニクス:
//   ethics < -50: 黒田から警告
//   ethics < -80: アカウント凍結イベント
//   最終ethics > 0: エンディングで「清廉潜入者」称号
