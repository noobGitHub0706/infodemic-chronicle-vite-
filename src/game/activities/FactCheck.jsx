import { useState } from 'react';
import { DialogueBox } from '../../common/DialogueBox';

/**
 * 汎用情報検証訓練コンポーネント
 *
 * @param {Array}    scenarios      - シナリオ配列 (FACTCHECK_SCENARIOS.filter(s => s.chapter === n))
 * @param {Object}   narrativeIntros - FACTCHECK_NARRATIVE { start, scenarioIntros[] }
 * @param {string}   stageLabel     - ヘッダー表示用ラベル
 * @param {Function} onComplete     - 完了コールバック
 */

const DIFFICULTY_LABEL = {
    basic:        '基本',
    intermediate: '中級',
    advanced:     '上級',
};

const DIFFICULTY_COLOR = {
    basic:        'bg-green-500/20 text-green-300 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    advanced:     'bg-red-500/20 text-red-300 border-red-500/30',
};

// スコア判定ヘルパー
const scoreLevel = (score) => {
    if (score >= 15) return 'correct';
    if (score >= 5)  return 'partial';
    return 'wrong';
};

export const FactCheck = ({
    scenarios,
    narrativeIntros,
    stageLabel = '情報検証訓練',
    onComplete,
}) => {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState(0); // 0=intro, 1-3=steps, 4=complete
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [stepAnswers, setStepAnswers] = useState([]); // 現シナリオの各ステップ回答
    const [allResults, setAllResults] = useState([]);
    const [showFullPost, setShowFullPost] = useState(false);

    const scenario = scenarios?.[scenarioIndex];
    const steps = scenario ? [scenario.step1, scenario.step2, scenario.step3] : [];
    const currentStepData = (currentStep >= 1 && currentStep <= 3) ? steps[currentStep - 1] : null;
    const totalScore = stepAnswers.reduce((sum, a) => sum + a.score, 0);
    const MAX_SCORE = 45; // 15点 × 3ステップ

    const progress = ((scenarioIndex * 4 + currentStep) / (scenarios.length * 4)) * 100;

    if (!scenario) return null;

    const handleOptionSelect = (option) => {
        if (showFeedback) return;
        setSelectedAnswer(option);
        setStepAnswers(prev => [...prev, option]);
        setShowFeedback(true);
    };

    const handleNext = () => {
        setShowFeedback(false);
        setSelectedAnswer(null);
        setShowFullPost(false);
        setCurrentStep(prev => (prev < 3 ? prev + 1 : 4));
    };

    const handleNextScenario = () => {
        const result = { scenario, answers: stepAnswers, totalScore, maxScore: MAX_SCORE };

        if (scenarioIndex < scenarios.length - 1) {
            setAllResults(prev => [...prev, result]);
            setScenarioIndex(prev => prev + 1);
            setCurrentStep(0);
            setStepAnswers([]);
            setSelectedAnswer(null);
            setShowFeedback(false);
        } else {
            onComplete({ scenarios: [...allResults, result] });
        }
    };

    return (
        <div className="min-h-screen p-4 flex flex-col">

            {/* ── ヘッダー ─────────────────────── */}
            <div className="max-w-2xl w-full mx-auto mb-4">
                <div className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">{stageLabel}</span>
                        <span className="text-sm text-gray-400">
                            シナリオ {scenarioIndex + 1} / {scenarios.length}
                        </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="progress-bar h-full rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── メインコンテンツ ──────────────── */}
            <div className="flex-1 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    <div className="animate-fade-in">
                        <div className="glass rounded-3xl p-6 md:p-8">

                            {/* ── イントロ（step 0） ── */}
                            {currentStep === 0 && (
                                <>
                                    <div className="text-center mb-4">
                                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 border ${
                                            DIFFICULTY_COLOR[scenario.difficulty] ?? DIFFICULTY_COLOR.basic
                                        }`}>
                                            {DIFFICULTY_LABEL[scenario.difficulty] ?? scenario.difficulty}
                                        </div>
                                        <h2 className="text-xl font-bold mb-1">🔍 {scenario.title}</h2>
                                        <p className="text-gray-400 text-sm">以下の投稿を検証してください</p>
                                    </div>

                                    {/* グローバルイントロ（FACTCHECK_NARRATIVE.scenarioIntros） */}
                                    {narrativeIntros?.scenarioIntros?.[scenarioIndex] && (
                                        <DialogueBox dialogue={narrativeIntros.scenarioIntros[scenarioIndex]} />
                                    )}

                                    {/* シナリオ固有イントロ */}
                                    <DialogueBox dialogue={scenario.narrative.intro} />

                                    {/* 検証対象投稿カード */}
                                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shrink-0">
                                                {scenario.targetPost.account.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{scenario.targetPost.account}</p>
                                                <p className="text-xs text-gray-500">{scenario.targetPost.accountId}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm whitespace-pre-line leading-relaxed">
                                            {scenario.targetPost.text}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                    >
                                        検証を始める
                                    </button>
                                </>
                            )}

                            {/* ── ステップ1-3 ── */}
                            {currentStep >= 1 && currentStep <= 3 && currentStepData && (
                                <>
                                    {/* ステップヘッダー */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold">Step {currentStep} / 3</h3>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(s => (
                                                <div
                                                    key={s}
                                                    className={`w-8 h-2 rounded-full ${
                                                        s < currentStep  ? 'bg-cyan-500' :
                                                        s === currentStep ? 'bg-cyan-500/50' : 'bg-white/10'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* 投稿縮小表示（タップで全文モーダル） */}
                                    <div
                                        className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                                        onClick={() => setShowFullPost(true)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500 mb-1">検証対象:</p>
                                                <p className="text-sm line-clamp-2 truncate">
                                                    {scenario.targetPost.text.split('\n')[0]}...
                                                </p>
                                            </div>
                                            <span className="text-xs text-cyan-400 ml-2 shrink-0">👆 全文</span>
                                        </div>
                                    </div>

                                    {/* 投稿全文モーダル */}
                                    {showFullPost && (
                                        <div
                                            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                                            onClick={() => setShowFullPost(false)}
                                        >
                                            <div
                                                className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-bold text-lg">検証対象の投稿</h3>
                                                    <button
                                                        onClick={() => setShowFullPost(false)}
                                                        className="text-gray-400 hover:text-white text-2xl"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <div className="bg-white/5 rounded-2xl p-5">
                                                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shrink-0">
                                                            {scenario.targetPost.account.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">{scenario.targetPost.account}</p>
                                                            <p className="text-xs text-gray-500">{scenario.targetPost.accountId}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm leading-relaxed whitespace-pre-line">
                                                        {scenario.targetPost.text}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setShowFullPost(false)}
                                                    className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all"
                                                >
                                                    閉じる
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* 質問文 */}
                                    <p className="text-gray-200 mb-4 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                        {currentStepData.question}
                                    </p>

                                    {/* 選択肢 */}
                                    <div className="space-y-2 mb-4">
                                        {currentStepData.options.map(option => {
                                            const isSelected = showFeedback && selectedAnswer?.id === option.id;
                                            const level = scoreLevel(option.score);
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleOptionSelect(option)}
                                                    disabled={showFeedback}
                                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
                                                        isSelected
                                                            ? level === 'correct' ? 'border-green-500 bg-green-500/20'
                                                            : level === 'partial' ? 'border-yellow-500 bg-yellow-500/20'
                                                            :                       'border-red-500 bg-red-500/20'
                                                        : showFeedback && option.isCorrect
                                                            ? 'border-green-500/30 bg-green-500/5 opacity-60'
                                                            : 'border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                                                    } ${showFeedback ? 'cursor-default' : ''}`}
                                                >
                                                    {option.text}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* フィードバック */}
                                    {showFeedback && selectedAnswer && (
                                        <div className={`rounded-xl p-4 mb-4 border ${
                                            scoreLevel(selectedAnswer.score) === 'correct'
                                                ? 'bg-green-500/10 border-green-500/30'
                                                : scoreLevel(selectedAnswer.score) === 'partial'
                                                    ? 'bg-yellow-500/10 border-yellow-500/30'
                                                    : 'bg-red-500/10 border-red-500/30'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-sm font-bold ${
                                                    scoreLevel(selectedAnswer.score) === 'correct'  ? 'text-green-400' :
                                                    scoreLevel(selectedAnswer.score) === 'partial' ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                    {scoreLevel(selectedAnswer.score) === 'correct'  ? '✓ 正解' :
                                                     scoreLevel(selectedAnswer.score) === 'partial' ? '△ 部分正解' : '✗ 不正解'}
                                                    （+{selectedAnswer.score}点）
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                {selectedAnswer.feedback}
                                            </p>
                                        </div>
                                    )}

                                    {showFeedback && (
                                        <button
                                            onClick={handleNext}
                                            className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                        >
                                            {currentStep < 3 ? '次のステップへ' : '結果を見る'}
                                        </button>
                                    )}
                                </>
                            )}

                            {/* ── シナリオ完了（step 4） ── */}
                            {currentStep === 4 && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="text-5xl mb-3">
                                            {totalScore >= 38 ? '🎉' : totalScore >= 23 ? '👍' : '📚'}
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">検証完了！</h2>
                                        <p className="text-gray-400 text-sm">{scenario.title}</p>
                                    </div>

                                    {/* スコア */}
                                    <div className="bg-white/5 rounded-xl p-6 mb-4 text-center">
                                        <p className="text-sm text-gray-400 mb-2">検証スコア</p>
                                        <p className={`text-4xl font-bold ${
                                            totalScore >= 38 ? 'text-green-400' :
                                            totalScore >= 23 ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                            {totalScore} <span className="text-lg text-gray-500">/ {MAX_SCORE}</span>
                                        </p>
                                    </div>

                                    {/* ステップ別スコア */}
                                    <div className="space-y-2 mb-4">
                                        {stepAnswers.map((answer, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                                                <span className="text-sm text-gray-400">Step {idx + 1}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-bold ${
                                                        scoreLevel(answer.score) === 'correct'  ? 'text-green-400' :
                                                        scoreLevel(answer.score) === 'partial' ? 'text-yellow-400' : 'text-red-400'
                                                    }`}>
                                                        +{answer.score}点
                                                    </span>
                                                    <span>
                                                        {scoreLevel(answer.score) === 'correct' ? '✓' :
                                                         scoreLevel(answer.score) === 'partial' ? '△' : '✗'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* シナリオ完了コメント */}
                                    <DialogueBox dialogue={scenario.narrative.complete} />

                                    <button
                                        onClick={handleNextScenario}
                                        className="w-full mt-4 btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                    >
                                        {scenarioIndex < scenarios.length - 1 ? '次のシナリオへ' : '完了'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
