// ============================================================
// src/data/influencer/targets.js
// インフルエンサー体験 — ターゲット層定義
// ============================================================
// 新技法ID対応:
//   bandwagon → social_proof
//   polarization/cherry_picking → fabricated_evidence
//   pseudoscience/scientific_veneer → fabricated_evidence
// ============================================================

export const TARGETS = [
    {
        id: 'anxious_parents',
        name: '不安な保護者層',
        icon: '👨‍👩‍👧‍👦',
        description: '子どもの健康に強い関心を持ち、ネガティブな情報に敏感。',
        characteristics: [
            '子どもに関する健康リスク情報を積極的に検索する',
            '「念のため」の行動を取りやすい',
            'ママ友・パパ友コミュニティの口コミを重視する',
        ],
        weaknesses: ['fear', 'testimonial'],
        resistances: ['fabricated_evidence'],
        baseFollowers: 800,
        engagementRate: 0.12,
    },
    {
        id: 'youth',
        name: '若年層（10-20代）',
        icon: '🧑‍💻',
        description: 'SNSネイティブで情報の拡散力が高い。トレンドに敏感。',
        characteristics: [
            '「みんなやってる」に影響されやすい',
            'バイラルコンテンツへの反応が速い',
            '長文より短文・ビジュアルを好む',
        ],
        weaknesses: ['social_proof', 'fabricated_evidence'],
        resistances: ['authority'],
        baseFollowers: 1200,
        engagementRate: 0.18,
    },
    {
        id: 'elderly',
        name: 'シニア層（60代以上）',
        icon: '👴',
        description: '権威ある情報源を信頼する傾向。デジタルリテラシーにばらつき。',
        characteristics: [
            '「専門家が言っている」に強く反応する',
            '科学的に見える数値やデータを信頼しやすい',
            '情報の裏取りをする習慣が薄い場合がある',
        ],
        weaknesses: ['authority', 'fabricated_evidence'],
        resistances: ['social_proof'],
        baseFollowers: 500,
        engagementRate: 0.08,
    },
];
