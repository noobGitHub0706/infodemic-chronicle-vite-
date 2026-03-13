import { useState, useEffect } from 'react';
import { DialogueSequence } from '../narrative/DialogueSequence';
import { DialogueBox } from '../narrative/DialogueBox';
import { EPILOGUE_NARRATIVE } from '../../data/narrative';

// ============================================================
// エンディングタイプ判定
// ============================================================

const getEndingType = (investigation) => {
    if (!investigation) return 'partial';
    const defeated = Object.values(investigation.bosses).filter(b => b.defeated).length;
    if (defeated >= 3) return 'perfect';
    if (defeated >= 2) return 'good';
    return 'partial';
};

const ENDING_STYLE = {
    perfect: { icon: '🏆', color: 'text-yellow-400', border: 'border-yellow-500/50', bg: 'bg-yellow-500/5' },
    good:    { icon: '⭐', color: 'text-green-400',  border: 'border-green-500/50',  bg: 'bg-green-500/5'  },
    partial: { icon: '🌟', color: 'text-blue-400',   border: 'border-blue-500/50',   bg: 'bg-blue-500/5'   },
};

// ============================================================
// 壊滅演出シーン
// ============================================================

const FrozenAccountCard = () => (
    <div className="relative glass rounded-2xl p-5 max-w-sm w-full mx-auto border-2 border-red-500/60 overflow-hidden animate-fade-in">
        {/* 凍結オーバーレイ */}
        <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center z-10 rounded-2xl">
            <div className="text-center p-4">
                <div className="text-5xl mb-3">🔒</div>
                <p className="text-red-300 font-bold text-base">このアカウントは凍結されました</p>
                <p className="text-gray-400 text-xs mt-1">利用規約 第18条（虚偽情報の拡散）違反</p>
            </div>
        </div>
        {/* 背景: 薄いアカウントプレビュー */}
        <div className="opacity-25 select-none">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center font-bold text-white shrink-0">
                    W
                </div>
                <div>
                    <p className="font-bold text-sm">ウェルネス・ライフ公式</p>
                    <p className="text-xs text-gray-400">@wellness_life_official · フォロワー50.2万</p>
                </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                私たちは「デジタルと健康の共存」を研究するコミュニティです。国立健康研究センターの報告（2024）では、適切なスクリーンタイム管理が…
            </p>
        </div>
    </div>
);

const DismantlingScene = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    // 0: "3日後" テキスト → 1: 凍結カード → 2: ボスセリフ + ボタン

    useEffect(() => {
        const t1 = setTimeout(() => setStep(1), 1800);
        const t2 = setTimeout(() => setStep(2), 3600);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-6">
            {/* ステップ0: タイムスタンプ */}
            <div className={`transition-all duration-700 ${step >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <DialogueBox dialogue={EPILOGUE_NARRATIVE.dismantling[0]} />
            </div>

            {/* ステップ1: 凍結カード */}
            {step >= 1 && <FrozenAccountCard />}

            {/* ステップ2: ボスセリフ + 続けるボタン */}
            {step >= 2 && (
                <div className="max-w-2xl w-full animate-fade-in">
                    <div className="glass rounded-3xl p-6 md:p-8">
                        <DialogueBox dialogue={EPILOGUE_NARRATIVE.dismantling[1]} />
                        <button
                            onClick={onComplete}
                            className="w-full mt-4 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                        >
                            続ける
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================
// エンディングタイトルカード
// ============================================================

const EndingTitleCard = ({ endingType, ending, onContinue }) => {
    const style = ENDING_STYLE[endingType];
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div
                className={`text-center transition-all duration-700 ${
                    visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
            >
                <div className="text-7xl mb-6">{style.icon}</div>
                <p className="text-gray-400 text-sm mb-2 tracking-wider uppercase">エンディング</p>
                <h1 className={`text-4xl font-bold mb-8 ${style.color}`}>
                    {ending.title}
                </h1>
                <button
                    onClick={onContinue}
                    className="btn-primary text-white font-bold py-4 px-10 rounded-2xl text-lg"
                >
                    続ける
                </button>
            </div>
        </div>
    );
};

// ============================================================
// 完了画面
// ============================================================

const CompletionScreen = ({ endingType, ending, onComplete }) => {
    const style = ENDING_STYLE[endingType];

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div className={`glass rounded-3xl p-8 max-w-xl w-full text-center border-2 ${style.border} ${style.bg} animate-fade-in`}>
                <div className="text-6xl mb-4">{style.icon}</div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    ウェルネス・サークル壊滅
                </h1>
                <p className={`text-xl font-bold mb-2 ${style.color}`}>
                    {ending.title}
                </p>
                <p className="text-gray-400 text-sm mb-8">
                    ─── 調査完了 ───
                </p>
                <button
                    onClick={onComplete}
                    className="btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg w-full"
                >
                    完了 → 事後テストへ
                </button>
            </div>
        </div>
    );
};

// ============================================================
// メイン Epilogue コンポーネント
// ============================================================

/**
 * @param {Function} onComplete      - 完了コールバック
 * @param {object}   investigation   - useInvestigation().investigation
 */
export default function Epilogue({ onComplete, investigation }) {
    const [scene, setScene] = useState('investigation_complete');

    const endingType = getEndingType(investigation);
    const ending = EPILOGUE_NARRATIVE.endings[endingType];

    const hasBonusHighEthics    = investigation?.endingFlags?.highEthics;
    const hasBonusPerfectChapter = investigation?.endingFlags?.perfectChapter;
    const hasBonus = hasBonusHighEthics || hasBonusPerfectChapter;

    const bonusDialogues = [
        ...(hasBonusHighEthics     ? [EPILOGUE_NARRATIVE.bonusTitles.highEthics]      : []),
        ...(hasBonusPerfectChapter ? [EPILOGUE_NARRATIVE.bonusTitles.perfectChapter]  : []),
    ];

    const handleFinalComplete = () => {
        const defeatedCount = Object.values(investigation?.bosses ?? {}).filter(b => b.defeated).length;
        onComplete({
            ending: endingType,
            bossesDefeated: defeatedCount,
        });
    };

    switch (scene) {
        case 'investigation_complete':
            return (
                <DialogueSequence
                    dialogues={EPILOGUE_NARRATIVE.investigation_complete}
                    onComplete={() => setScene('dismantling')}
                    buttonLabel="続ける"
                />
            );

        case 'dismantling':
            return (
                <DismantlingScene onComplete={() => setScene('ending_title')} />
            );

        case 'ending_title':
            return (
                <EndingTitleCard
                    endingType={endingType}
                    ending={ending}
                    onContinue={() => setScene('ending_dialogues')}
                />
            );

        case 'ending_dialogues':
            return (
                <DialogueSequence
                    dialogues={ending.dialogues}
                    onComplete={() => hasBonus ? setScene('bonus') : setScene('closing')}
                    buttonLabel="続ける"
                />
            );

        case 'bonus':
            return (
                <DialogueSequence
                    dialogues={bonusDialogues}
                    onComplete={() => setScene('closing')}
                    buttonLabel="続ける"
                />
            );

        case 'closing':
            return (
                <DialogueSequence
                    dialogues={EPILOGUE_NARRATIVE.closing}
                    onComplete={() => setScene('complete')}
                    buttonLabel="調査完了へ"
                    showSkip={false}
                />
            );

        case 'complete':
            return (
                <CompletionScreen
                    endingType={endingType}
                    ending={ending}
                    onComplete={handleFinalComplete}
                />
            );

        default:
            return null;
    }
}
