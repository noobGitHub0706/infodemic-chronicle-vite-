export const TARGETS = {
            anxious_parents: {
                id: 'anxious_parents',
                name: '不安な親',
                icon: '👨‍👩‍👧‍👦',
                description: '子供のスマホ使用を心配している30-50代の親',
                traits: '恐怖訴求と証言利用に弱い',
                weaknesses: ['fear', 'testimonial'],
                resistances: ['bandwagon'],
                // 技法別の効果解説
                techniqueReasons: {
                    fear: '子供の健康や将来への不安を抱えているため、危険を強調するメッセージに強く反応します。「手遅れになる前に」という言葉が特に効果的です。',
                    testimonial: '同じ親としての体験談に共感しやすく、「うちの子も同じかも」と自分の状況に重ね合わせる傾向があります。',
                    authority: '専門家の意見は参考にしますが、子供の健康に関しては感情的な判断も大きく影響します。',
                    pseudoscience: '科学的な数字には一定の信頼を置きますが、内容の精査よりも結論を重視する傾向があります。',
                    polarization: '極端な主張には警戒心を持つことが多く、子供のために慎重な判断をしようとします。',
                    bandwagon: '「みんながやっている」より「我が子に本当に必要か」を重視するため、流行には流されにくいです。'
                }
            },
            youth: {
                id: 'youth',
                name: '若者',
                icon: '🧑‍🎓',
                description: 'SNSを日常的に使う10-20代',
                traits: 'トレンド操作に弱く、権威訴求には懐疑的',
                weaknesses: ['bandwagon', 'polarization'],
                resistances: ['authority'],
                techniqueReasons: {
                    fear: '将来への漠然とした不安はありますが、具体性のない脅しには「またか」と冷めた反応をすることも。',
                    testimonial: '同世代の体験談には共感しますが、親世代の体験談は「自分とは違う」と距離を置きがちです。',
                    authority: '「偉い人が言っている」だけでは響きません。むしろ権威に対する反発心から、疑ってかかることも多いです。',
                    pseudoscience: '数字やデータには一定の関心がありますが、深く検証するより直感で判断する傾向があります。',
                    polarization: 'SNSで「どちら側か」を明確にする文化に慣れており、対立構造に引き込まれやすいです。仲間意識を刺激されると反応します。',
                    bandwagon: 'トレンドに敏感で、「乗り遅れたくない」という気持ちが強いです。インフルエンサーや友人の行動に影響されやすいです。'
                }
            },
            elderly: {
                id: 'elderly',
                name: '高齢者',
                icon: '👴👵',
                description: 'デジタルに不慣れな60代以上',
                traits: '権威訴求に弱く、科学的情報を信頼しやすい',
                weaknesses: ['authority', 'pseudoscience'],
                resistances: ['bandwagon'],
                techniqueReasons: {
                    fear: '健康への関心は高いですが、過度な煽りには「大げさだ」と感じることもあります。',
                    testimonial: '身近な人の体験談は信頼しますが、SNS上の知らない人の話には慎重です。',
                    authority: '「教授」「博士」「大学」といった肩書きを重視する傾向が強く、権威ある人の発言を信頼しやすいです。',
                    pseudoscience: '科学的なデータや数字を「きちんとした研究」と捉えやすく、サンプル数や調査方法の問題点に気づきにくいです。',
                    polarization: '社会経験から極端な主張には警戒心を持つことが多いですが、「正義」を強調されると揺らぐことも。',
                    bandwagon: '「若者の流行」には関心が薄く、自分には関係ないと感じることが多いです。'
                }
            }
        };

        // Stage3の投稿選択肢;
