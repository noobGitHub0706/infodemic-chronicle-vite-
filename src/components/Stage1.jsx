import { useState, useCallback } from 'react';
import { TECHNIQUES } from '../data/techniques';
import { STAGE1_QUESTIONS } from '../data/stage1Questions';
import { TechniqueTag } from './common/TechniqueTag';
import { SNSPostCard } from './common/SNSPostCard';
import { SpreadVisualization } from './common/SpreadVisualization';
import { shuffle } from '../utils';

export const RebuttalPostPreview = ({ account, accountId, text }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongText = text.length > 100 || text.split('\n').length > 4;

    return (
        <div className="mb-6">
            <div className={`overflow-hidden transition-all duration-300 ${!isExpanded && isLongText ? 'max-h-48' : ''}`}>
                <SNSPostCard
                    account={account}
                    accountId={accountId}
                    text={text}
                    isInteractive={false}
                    compact={true}
                />
            </div>
            {isLongText && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-1 text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <span>▲</span>
                            <span>折りたたむ</span>
                        </>
                    ) : (
                        <>
                            <span>▼</span>
                            <span>全文を表示</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

// Stage1: 見破る

export const Stage1 = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questions] = useState(() => shuffle(STAGE1_QUESTIONS));
    const [answers, setAnswers] = useState([]);
    const [phase, setPhase] = useState('question'); // 'question' | 'rebuttal' | 'feedback'
    const [lastAnswer, setLastAnswer] = useState(null);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [showTechniqueHelp, setShowTechniqueHelp] = useState(false);
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [rebuttalResult, setRebuttalResult] = useState(null);

    const currentQuestion = questions[currentIndex];
    const hasTechnique = currentQuestion.techniques.length > 0;

    // 問題点の選択肢
    const PROBLEM_OPTIONS = [
        { id: 'fear', label: '不安や恐怖を煽っている', icon: '😰' },
        { id: 'authority', label: '権威や肩書きを利用している', icon: '👔' },
        { id: 'pseudoscience', label: '科学的に見せかけているが根拠が曖昧', icon: '🔬' },
        { id: 'testimonial', label: '個人の体験談を一般化している', icon: '💬' },
        { id: 'bandwagon', label: '「みんながやっている」という同調圧力', icon: '🌊' },
        { id: 'polarization', label: '敵vs味方の二項対立を作っている', icon: '⚔️' }
    ];

    // 第1段階：レトリックの有無を判定
    const handleFirstAnswer = (userSaidHasTechnique) => {
        if (userSaidHasTechnique && hasTechnique) {
            // 正解かつレトリックあり → 反駁フェーズへ
            setPhase('rebuttal');
        } else {
            // 不正解、またはレトリックなしと正しく判定 → フィードバックへ
            const isCorrect = userSaidHasTechnique === hasTechnique;
            const basePoints = 15;
            const streakBonus = isCorrect ? 1 + streak * 0.2 : 0;
            const points = isCorrect ? Math.round(basePoints * streakBonus) : 0;

            const answer = {
                questionId: currentQuestion.id,
                userAnswer: userSaidHasTechnique,
                correct: isCorrect,
                points,
                techniques: currentQuestion.techniques,
                rebuttalCorrect: null,
                selectedProblems: []
            };

            setAnswers(prev => [...prev, answer]);
            setLastAnswer(answer);
            setPhase('feedback');
            
            if (isCorrect) {
                setStreak(prev => prev + 1);
                setScore(prev => prev + points);
            } else {
                setStreak(0);
            }
        }
    };

    // 問題点の選択をトグル
    const toggleProblem = (problemId) => {
        setSelectedProblems(prev => 
            prev.includes(problemId)
                ? prev.filter(p => p !== problemId)
                : [...prev, problemId]
        );
    };

    // 第2段階：反駁を確定
    const handleRebuttalSubmit = () => {
        const correctTechniques = currentQuestion.techniques;
        const selected = selectedProblems;
        
        // 完全一致ボーナス、部分一致でも加点
        const correctSelections = selected.filter(s => correctTechniques.includes(s));
        const wrongSelections = selected.filter(s => !correctTechniques.includes(s));
        const missedTechniques = correctTechniques.filter(t => !selected.includes(t));
        
        const isFullyCorrect = correctSelections.length === correctTechniques.length && wrongSelections.length === 0;
        const isPartiallyCorrect = correctSelections.length > 0;
        
        // ポイント計算
        let basePoints = 15; // 検出成功分
        let rebuttalBonus = 0;
        
        if (isFullyCorrect) {
            rebuttalBonus = 20; // 完全一致ボーナス
        } else if (isPartiallyCorrect) {
            rebuttalBonus = Math.round(10 * (correctSelections.length / correctTechniques.length));
        }
        // 間違った選択はペナルティ
        rebuttalBonus -= wrongSelections.length * 3;
        rebuttalBonus = Math.max(0, rebuttalBonus);
        
        const streakBonus = 1 + streak * 0.2;
        const points = Math.round((basePoints + rebuttalBonus) * streakBonus);

        const answer = {
            questionId: currentQuestion.id,
            userAnswer: true,
            correct: true,
            points,
            techniques: currentQuestion.techniques,
            rebuttalCorrect: isFullyCorrect,
            rebuttalPartial: isPartiallyCorrect && !isFullyCorrect,
            selectedProblems: selected,
            correctSelections,
            wrongSelections,
            missedTechniques
        };

        setRebuttalResult({
            isFullyCorrect,
            isPartiallyCorrect,
            correctSelections,
            wrongSelections,
            missedTechniques,
            rebuttalBonus
        });

        setAnswers(prev => [...prev, answer]);
        setLastAnswer(answer);
        setPhase('feedback');
        setStreak(prev => prev + 1);
        setScore(prev => prev + points);
    };

    const handleNext = () => {
        setPhase('question');
        setSelectedProblems([]);
        setRebuttalResult(null);
        
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            const finalAnswers = [...answers, lastAnswer];
            
            const techMistakes = {};
            finalAnswers.forEach(a => {
                if (!a.correct) {
                    a.techniques.forEach(t => {
                        techMistakes[t] = (techMistakes[t] || 0) + 1;
                    });
                }
                // 反駁で見逃した技法もカウント
                if (a.missedTechniques) {
                    a.missedTechniques.forEach(t => {
                        techMistakes[t] = (techMistakes[t] || 0) + 0.5;
                    });
                }
            });

            const weakTechniques = Object.entries(techMistakes)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([tech]) => tech);

            const correctCount = finalAnswers.filter(a => a.correct).length;
            const finalScore = finalAnswers.reduce((sum, a) => sum + (a.points || 0), 0);
            const rebuttalStats = {
                total: finalAnswers.filter(a => a.rebuttalCorrect !== null).length,
                fullyCorrect: finalAnswers.filter(a => a.rebuttalCorrect === true).length,
                partiallyCorrect: finalAnswers.filter(a => a.rebuttalPartial === true).length
            };

            onComplete({
                answers: finalAnswers,
                score: finalScore,
                accuracy: Math.round((correctCount / questions.length) * 100),
                weakTechniques,
                rebuttalStats
            });
        }
    };

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* ヘッダー */}
            <div className="max-w-2xl w-full mx-auto mb-4">
                <div className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Stage 1: 見破る</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowTechniqueHelp(true)}
                                className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full transition-all flex items-center gap-1"
                            >
                                <span>📖</span>
                                <span>技法一覧</span>
                            </button>
                            <span className="text-sm text-gray-400">{currentIndex + 1} / {questions.length}</span>
                        </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="progress-bar h-full rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <span className="text-indigo-400">スコア: {score}</span>
                        {streak > 1 && <span className="text-yellow-400">🔥 {streak}連続正解!</span>}
                    </div>
                </div>
            </div>

            {/* レトリック技法ヘルプモーダル */}
            {showTechniqueHelp && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowTechniqueHelp(false)}>
                    <div className="bg-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto scrollbar-hide animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span>📖</span>
                                6つのレトリック技法
                            </h2>
                            <button
                                onClick={() => setShowTechniqueHelp(false)}
                                className="text-gray-400 hover:text-white text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4">
                            以下の技法が使われている投稿は「レトリック検出」を選んでください。
                        </p>

                        <div className="space-y-4">
                            {Object.values(TECHNIQUES).map(tech => {
                                const icons = {
                                    fear: '😱',
                                    authority: '👔',
                                    pseudoscience: '🔬',
                                    testimonial: '💬',
                                    polarization: '⚔️',
                                    bandwagon: '🚂'
                                };
                                return (
                                    <div key={tech.id} className={`rounded-xl p-4 border ${tech.borderColor} ${tech.bgColor}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">{icons[tech.id]}</span>
                                            <h3 className={`font-bold text-lg ${tech.textColor}`}>{tech.name}</h3>
                                        </div>
                                        <p className="text-gray-300 text-sm mb-3">{tech.description}</p>
                                        <div className={`${tech.bgColor} rounded-lg p-3 border ${tech.borderColor}/30`}>
                                            <p className="text-xs text-gray-400 mb-1">💡 例:</p>
                                            <p className={`text-sm ${tech.textColor} font-medium`}>"{tech.example}"</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setShowTechniqueHelp(false)}
                            className="w-full mt-6 btn-primary text-white font-bold py-3 rounded-xl"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}

            {/* メインコンテンツ */}
            <div className="flex-1 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    {/* Phase 1: 投稿を見て判定 */}
                    {phase === 'question' && (
                        <div className="animate-fade-in">
                            <div className="glass rounded-3xl p-6 md:p-8 mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                        currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        currentQuestion.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                        {currentQuestion.difficulty === 'easy' ? '易しい' :
                                         currentQuestion.difficulty === 'medium' ? '普通' :
                                         currentQuestion.difficulty === 'hard' ? '難しい' : '非常に難しい'}
                                    </span>
                                </div>
                                
                                <div className="mb-6">
                                    <SNSPostCard
                                        account={currentQuestion.account}
                                        accountId={currentQuestion.accountId}
                                        text={currentQuestion.text}
                                        isInteractive={true}
                                    />
                                </div>

                                <p className="text-center text-gray-400 mb-6">
                                    この投稿にレトリック技法は使われていますか？
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleFirstAnswer(false)}
                                        className="btn-success text-white font-bold py-4 px-6 rounded-2xl text-lg"
                                    >
                                        ✓ 問題なし
                                    </button>
                                    <button
                                        onClick={() => handleFirstAnswer(true)}
                                        className="btn-danger text-white font-bold py-4 px-6 rounded-2xl text-lg"
                                    >
                                        ⚠ レトリック検出!
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phase 2: 反駁フェーズ（問題点の指摘） */}
                    {phase === 'rebuttal' && (
                        <div className="animate-fade-in">
                            <div className="glass rounded-3xl p-6 md:p-8 mb-6 border-2 border-indigo-500">
                                <div className="text-center mb-6">
                                    <div className="text-4xl mb-2">🔍</div>
                                    <h3 className="text-xl font-bold text-indigo-400">反駁フェーズ</h3>
                                    <p className="text-gray-400 text-sm mt-2">
                                        この投稿の問題点を指摘してください（複数選択可）
                                    </p>
                                </div>

                                {/* 投稿の再表示（展開可能版） */}
                                <RebuttalPostPreview
                                    account={currentQuestion.account}
                                    accountId={currentQuestion.accountId}
                                    text={currentQuestion.text}
                                />

                                {/* 問題点の選択肢 */}
                                <div className="space-y-3 mb-6">
                                    {PROBLEM_OPTIONS.map(option => {
                                        const isSelected = selectedProblems.includes(option.id);
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => toggleProblem(option.id)}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                                    isSelected
                                                        ? 'border-indigo-500 bg-indigo-500/20'
                                                        : 'border-white/10 bg-white/5 hover:border-white/30'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{option.icon}</span>
                                                    <span className={`font-medium ${isSelected ? 'text-indigo-300' : 'text-gray-300'}`}>
                                                        {option.label}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="ml-auto text-indigo-400">✓</span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={handleRebuttalSubmit}
                                    disabled={selectedProblems.length === 0}
                                    className={`w-full font-bold py-4 px-8 rounded-2xl text-lg transition-all ${
                                        selectedProblems.length > 0
                                            ? 'btn-primary text-white'
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {selectedProblems.length > 0 
                                        ? `確定する（${selectedProblems.length}個選択中）`
                                        : '問題点を選択してください'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Phase 3: フィードバック */}
                    {phase === 'feedback' && lastAnswer && (
                        <div className="animate-fade-in">
                            <div className={`glass rounded-3xl p-6 md:p-8 border-2 ${
                                lastAnswer.correct ? 'border-green-500' : 'border-red-500'
                            }`}>
                                <div className="text-center mb-6">
                                    <div className={`text-6xl mb-2 ${lastAnswer.correct ? 'animate-pulse-once' : ''}`}>
                                        {lastAnswer.correct ? '✓' : '✗'}
                                    </div>
                                    <h3 className={`text-2xl font-bold ${
                                        lastAnswer.correct ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {lastAnswer.correct ? '正解!' : '不正解...'}
                                    </h3>
                                    {lastAnswer.correct && lastAnswer.points > 0 && (
                                        <p className="text-yellow-400 mt-1">
                                            +{lastAnswer.points}点
                                            {rebuttalResult?.rebuttalBonus > 0 && ` (反駁ボーナス+${rebuttalResult.rebuttalBonus})`}
                                            {streak > 1 && ' 連続ボーナス!'}
                                        </p>
                                    )}
                                </div>

                                {/* 反駁結果の表示 */}
                                {rebuttalResult && (
                                    <div className={`rounded-xl p-4 mb-4 ${
                                        rebuttalResult.isFullyCorrect 
                                            ? 'bg-green-500/20 border border-green-500/50' 
                                            : rebuttalResult.isPartiallyCorrect
                                                ? 'bg-yellow-500/20 border border-yellow-500/50'
                                                : 'bg-red-500/20 border border-red-500/50'
                                    }`}>
                                        <h4 className="font-bold mb-2 flex items-center gap-2">
                                            {rebuttalResult.isFullyCorrect ? (
                                                <><span>🎯</span><span className="text-green-400">完璧な分析!</span></>
                                            ) : rebuttalResult.isPartiallyCorrect ? (
                                                <><span>🔶</span><span className="text-yellow-400">部分的に正解</span></>
                                            ) : (
                                                <><span>❌</span><span className="text-red-400">分析ミス</span></>
                                            )}
                                        </h4>
                                        
                                        {rebuttalResult.correctSelections.length > 0 && (
                                            <p className="text-sm text-green-300 mb-1">
                                                ✓ 正しく指摘: {rebuttalResult.correctSelections.map(t => TECHNIQUES[t]?.name).join(', ')}
                                            </p>
                                        )}
                                        {rebuttalResult.missedTechniques.length > 0 && (
                                            <p className="text-sm text-yellow-300 mb-1">
                                                △ 見逃し: {rebuttalResult.missedTechniques.map(t => TECHNIQUES[t]?.name).join(', ')}
                                            </p>
                                        )}
                                        {rebuttalResult.wrongSelections.length > 0 && (
                                            <p className="text-sm text-red-300">
                                                ✗ 誤選択: {rebuttalResult.wrongSelections.map(t => TECHNIQUES[t]?.name).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="bg-white/5 rounded-2xl p-5 mb-6">
                                    <h4 className="font-bold mb-3">使用されている技法:</h4>
                                    {currentQuestion.techniques.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {currentQuestion.techniques.map(tech => (
                                                <TechniqueTag key={tech} techniqueId={tech} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 mb-4">レトリック技法は使われていません</p>
                                    )}
                                    
                                    <h4 className="font-bold mb-2">解説:</h4>
                                    <p className="text-gray-300 leading-relaxed">
                                        {currentQuestion.explanation}
                                    </p>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                >
                                    {currentIndex < questions.length - 1 ? '次の問題へ' : 'Stage 2へ進む'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Stage3: インフルエンサー育成
