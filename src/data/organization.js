// ============================================================
// src/data/organization.js
// ウェルネス・サークル組織データ
// ============================================================

export const ORGANIZATION = {
    name: 'ウェルネス・サークル',
    description: 'SNS上で健康誤情報を組織的に拡散するインフルエンサーネットワーク',

    // ========================================
    // 末端メンバー（第1章で特定）
    // ========================================
    footSoldiers: [
        {
            id: 'fs_fear',
            name: 'しぐれ🌧️育児垢',
            realName: '（本名不明・投稿テンプレ使用）',
            specialty: 'fear',
            description: '子育て不安を煽る投稿を量産。テンプレートに沿った恐怖訴求が特徴。',
            unlockedBy: { technique: 'fear', count: 2 },
        },
        {
            id: 'fs_authority',
            name: '健康ライフ@医療情報',
            realName: '（本名不明・架空の肩書を多数使用）',
            specialty: 'authority',
            description: '「医学博士」「研究チーム」等の架空の権威を使い回す。',
            unlockedBy: { technique: 'authority', count: 2 },
        },
        {
            id: 'fs_scientific',
            name: '🧬ヘルスケアラボ',
            realName: '（本名不明・データ捏造担当）',
            specialty: 'fabricated_evidence',
            description: '独自調査と称した捏造データを作成。n=やp値など科学的な装いで根拠をでっち上げる。',
            unlockedBy: { technique: 'fabricated_evidence', count: 2 },
        },
        {
            id: 'fs_testimonial',
            name: 'ゆうママ👧3歳',
            realName: '（本名不明・体験談テンプレ使用）',
            specialty: 'testimonial',
            description: '複数の「ママ垢」を運用し、やらせ体験談を投稿。人格を使い分ける。',
            unlockedBy: { technique: 'testimonial', count: 2 },
        },
        {
            id: 'fs_cherry',
            name: '健康ニュースまとめ',
            realName: '（本名不明・ニュース風投稿担当）',
            specialty: 'fear',
            description: 'ニュース風の恐怖煽り見出しを量産。実在の統計から最悪のケースだけを抜き出し「〇〇の危険が判明」系の投稿を流す。個人感情系のしぐれとは異なり、報道形式で信憑性を演出する。',
            unlockedBy: { technique: 'fear', count: 3 },
        },
        {
            id: 'fs_social',
            name: 'トレンドウォッチャー📊',
            realName: '（本名不明・トレンド操作担当）',
            specialty: 'social_proof',
            description: '「みんなやってる」系の投稿で同調圧力を作る。再生数やフォロワー数を水増し。',
            unlockedBy: { technique: 'social_proof', count: 2 },
        },
    ],

    // ========================================
    // 幹部（第2章で特定）
    // ========================================
    officers: [
        {
            id: 'of_healthy_taro',
            name: 'ヘルシー太郎',
            realName: '田村 幸太（元フィットネストレーナー）',
            role: '中堅・新人教育担当',
            specialty: ['fear', 'testimonial'],
            description: '表向きは爽やかな健康アカウント。裏で新人メンバーに投稿テンプレートを配布し、組織の「マニュアル」を作成している。',
            unlockedBy: 'chapter1_boss',
            bossChapter: 1,
        },
        {
            id: 'of_dr_natural',
            name: 'Dr.ナチュラル',
            realName: '中村 恵子（元薬剤師・薬剤師免許は失効）',
            role: '幹部・コンテンツ監修',
            specialty: ['authority', 'fabricated_evidence'],
            description: '元薬剤師の肩書を利用し、投稿に「科学的信頼性」を付与する役割。言っていることの7割は正しいため、残り3割の操作が見抜きにくい。',
            unlockedBy: 'chapter2_boss',
            bossChapter: 2,
        },
        {
            id: 'of_expansion',
            name: 'バズマスターK',
            realName: '加藤 隆（元SNSマーケティング会社勤務）',
            role: '幹部・拡散戦略担当',
            specialty: ['social_proof', 'fear'],
            description: 'SNSのアルゴリズムを熟知し、投稿の拡散戦略を設計。フォロワー購入やハッシュタグ操作も担当。',
            unlockedBy: 'chapter2_quiz_complete',
            bossChapter: null,
        },
    ],

    // ========================================
    // リーダー（第3章で特定）
    // ========================================
    leader: {
        id: 'leader',
        name: 'ウェルネス・ライフ公式',
        realName: '鈴木 一馬（元大手広告代理店 クリエイティブディレクター）',
        role: '代表・全体統括',
        specialty: ['authority', 'fabricated_evidence', 'fear'],
        description: '大手広告代理店で15年間コピーライティングを手掛けた後、独立。マーケティングの専門知識を悪用し、公的機関と見分けがつかないほど洗練された操作的投稿を作成する。フォロワー50万人。組織の全収益（サプリ販売・オンライン講座）を管理。',
        unlockedBy: 'chapter3_boss',
        bossChapter: 3,
    },
};

// ========================================
// 調査進捗マイルストーン
// ========================================

export const MILESTONES = [
    {
        progress: 10,
        intel: '末端メンバーの投稿パターンに共通点を発見',
        bossComment: 'パターンが見えてきたね。テンプレートを使い回してるっぽい。',
    },
    {
        progress: 20,
        intel: '投稿テンプレートの存在を確認',
        bossComment: 'やっぱり。マニュアル化されてるわ。これは組織的にやってる証拠。',
    },
    {
        progress: 30,
        intel: '組織の資金源を特定（サプリメント販売サイト）',
        bossComment: 'リンク先を辿ったら全部同じ販売サイトに繋がってた。金の匂いがする。',
    },
    {
        progress: 40,
        intel: '幹部「ヘルシー太郎」のネットワークを可視化',
        bossComment: 'こいつが末端に指示を出してるハブだね。次はこの上を狙おう。',
    },
    {
        progress: 50,
        intel: '幹部間の連絡チャンネルを特定',
        bossComment: 'ここから先は慎重にいこう。向こうも対策してくるかもしれない。',
    },
    {
        progress: 60,
        intel: 'Dr.ナチュラルの薬剤師免許が失効していることを確認',
        bossComment: '免許失効してるのに「元薬剤師」って...嘘ではないけどね。巧妙だわ。',
    },
    {
        progress: 70,
        intel: 'リーダーの存在を示す証拠を入手',
        bossComment: '幹部の上にまだ誰かいる。元広告代理店の人間...なるほどね。',
    },
    {
        progress: 80,
        intel: 'リーダー「鈴木一馬」の経歴を特定',
        bossComment: '大手代理店のクリエイティブディレクター出身か。道理で投稿のクオリティが高いわけだ。...私の元同業者かもしれない。',
    },
    {
        progress: 90,
        intel: '組織の全体構造と資金の流れを解明',
        bossComment: '全体像が見えた。あとは代表アカウントを特定するだけ。',
    },
    {
        progress: 100,
        intel: '調査完了。ウェルネス・サークルの全容を解明。',
        bossComment: 'やったね。全部揃った。...さ、やるか。',
    },
];

// ========================================
// ボス投稿データ
// ========================================

export const BOSS_QUESTIONS = {
    chapter1: {
        id: 'boss_1',
        difficulty: 'medium',
        account: 'ヘルシー太郎🏃‍♂️',
        accountId: '@healthy_taro',
        isBoss: true,
        bossName: 'ヘルシー太郎',
        bossIntro: {
            type: 'boss',
            text: 'お、来たわ。ウェルネス・サークルの中堅、ヘルシー太郎。\n表向きは爽やかな健康アカウントだけど、裏で新人メンバーに投稿テンプレを配ってるの。\n\n今まで学んだこと全部使って分析してみて。',
        },
        text: '僕も去年まで毎晩スマホ見ながら寝落ちしてたんだけど\nある日、目の奥がズキズキ痛くて眼科に行ったら\n「このまま続けたら網膜に影響が出かねない」って言われて\n\n本気でやめた\n\n今は寝る1時間前にスマホをリビングに置くルール\n最初の3日はキツかったけど\n1週間で慣れて、今は朝の目覚めが全然違う\n\n同じ悩みの人、まずは3日だけ試してみて\n人生変わるから。マジで。',
        techniques: ['fear', 'testimonial'],
        explanation: '一見、素朴な体験談に見えますが、「網膜に影響」という医師の発言で恐怖を煽り、自身の体験を「人生変わる」と大きく一般化しています。語り口が自然なため技法が見えにくく、これがウェルネス・サークルの「テンプレート」の完成形です。',
        investigation: {
            memberUnlocked: 'of_healthy_taro',
            evidenceType: '投稿テンプレートの原本を入手',
        },
    },

    chapter2: {
        id: 'boss_2',
        difficulty: 'hard',
        account: 'Dr.ナチュラル🌿薬と自然の専門家',
        accountId: '@dr_natural_health',
        isBoss: true,
        bossName: 'Dr.ナチュラル',
        bossIntro: {
            type: 'boss',
            text: '出た。Dr.ナチュラル。連中の幹部の一人で、元薬剤師の肩書を使って活動してる。\n\n一番厄介なのは、言ってることの7割は正しいこと。\n残り3割に操作を仕込んでくるのよ。\n\nこれは私でも一瞬迷う。全力でいきなよ。',
        },
        text: '薬剤師としてお伝えします。\n\nスマートフォンのブルーライトについて、2024年のAMA（米国医師会）のレビューでは「直接的な網膜障害のエビデンスは限定的」とされています。これは事実です。\n\nしかし、私が10年以上の臨床経験で見てきた患者さんの中で、夜間のスマホ使用を控えた方の89%が睡眠の質の改善を報告しています。\n\n学術論文だけでは見えない「現場の真実」があります。\n\n当アカウント監修の睡眠改善プログラムでは、この知見を体系化しています。詳細はプロフのリンクから。',
        techniques: ['authority', 'fabricated_evidence'],
        explanation: 'AMAのレビューの引用は正確ですが、それを「事実です」と認めた上で「しかし現場の真実がある」と個人的な臨床データ（89%）を対置しています。正しい情報で信頼を得てから操作的な主張に誘導する高度な手法です。薬剤師免許は実は失効しています。',
        investigation: {
            memberUnlocked: 'of_dr_natural',
            evidenceType: '薬剤師免許失効の証拠 + 収益構造の解明',
        },
    },

    chapter3: {
        id: 'boss_3',
        difficulty: 'very_hard',
        account: 'ウェルネス・ライフ公式',
        accountId: '@wellness_life_official',
        isBoss: true,
        bossName: 'ウェルネス・ライフ公式',
        bossIntro: {
            type: 'boss',
            text: '...これ、ついに見つけた。ウェルネス・サークルの代表アカウント。\n\n見て、フォロワー50万人。\n投稿の作り方が教科書的に完璧。\n私が広告代理店時代に書いてた手法の、さらに上をいってる。\n\n全力でいきなよ。',
        },
        text: '【ウェルネス・ライフが目指す社会】\n\n私たちは「デジタルと健康の共存」を研究するコミュニティです。\n\n国立健康研究センターの報告（2024）では、適切なスクリーンタイム管理が心身の健康に寄与することが示唆されています。\n\n当コミュニティでは、12,000人の会員データをもとに独自のスクリーンタイム最適化プログラムを開発。参加者の93%が「生活の質が向上した」と回答しています（2024年度会員調査）。\n\n厚生労働省の「健康日本21」の理念に賛同し、エビデンスに基づいた情報発信を心がけています。\n\n活動の詳細・会員登録はプロフィールのリンクからご確認ください。',
        techniques: ['authority', 'fabricated_evidence', 'social_proof'],
        explanation: '公的機関の報告や政策名を引用して権威を装い、「12,000人」「93%」で根拠の捏造・歪曲と社会的証明を二重に構成しています。文体が極めて洗練されており、一般的な企業アカウントと見分けがつきにくい構成です。「独自のプログラム」への誘導が最終目的であり、これがウェルネス・サークルの全収益の入口です。',
        investigation: {
            memberUnlocked: 'leader',
            evidenceType: '代表アカウントの運営者を特定 → 調査完了',
        },
    },
};
