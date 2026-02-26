import { useState } from 'react';
import { TECHNIQUES } from '../data/techniques';
import { TechniqueTag } from './common/TechniqueTag';
import { DEBRIEF_NARRATIVE } from '../data/narrative';
import { DialogueBox } from './common/DialogueBox';

export const FinalDebriefing = ({ stage1Data, stage3Data, stageCreateData, onRestart, onShowData, onContinueToSurvey }) => {
    const [closingIndex, setClosingIndex] = useState(0);
    const [closingDone, setClosingDone] = useState(false);

    const closing = DEBRIEF_NARRATIVE.closing;

    const totalTechniquesUsed = stage3Data.results.reduce((acc, r) => acc + r.post.techniques.length, 0);
    const ethicalPosts = stage3Data.results.filter(r => r.post.techniques.length === 0).length;
    
    // 称号システム
    const getTitleAndBadge = () => {
        // 凍結された場合
        if (stage3Data.suspended) {
            return {
                title: '永久凍結の人',
                titleId: 'suspended',
                icon: '🧊',
                color: 'from-gray-400 via-gray-500 to-gray-600',
                bgColor: 'bg-gradient-to-r from-gray-500/20 via-gray-600/20 to-gray-700/20',
                borderColor: 'border-gray-500/50',
                description: `ラウンド${stage3Data.suspendedAtRound}でアカウントが凍結されました。やりすぎたね...。でもこれが現実のSNSなら、同じ末路をたどるインフルエンサーは少なくありません。`
            };
        }

        const followers = stage3Data.totalFollowers;
        const ethics = stage3Data.finalEthics;
        
        // フォロワー区分: 低(〜300), 中(300-600), 高(600〜)
        // 信頼性区分: 低(〜39%), 中(40-69%), 高(70%〜)
        
        if (ethics >= 70) {
            // 高信頼性
            if (followers >= 600) {
                return {
                    title: '聖人インフルエンサー',
                    icon: '👼',
                    color: 'from-yellow-400 via-amber-400 to-orange-400',
                    bgColor: 'bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20',
                    borderColor: 'border-yellow-500/50',
                    description: '高い信頼性を維持しながら大きな影響力を獲得。実在したら国民栄誉賞もの。現実にはほぼ存在しない伝説の存在です。'
                };
            } else if (followers >= 300) {
                return {
                    title: '良心的バズり手',
                    icon: '⚖️',
                    color: 'from-emerald-400 via-teal-400 to-cyan-400',
                    bgColor: 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
                    borderColor: 'border-emerald-500/50',
                    description: '信頼性と影響力のバランスを保ちました。地味に見えて、実はこれが一番難しいんです。'
                };
            } else {
                return {
                    title: '清く正しく目立たない人',
                    icon: '🌱',
                    color: 'from-green-400 via-emerald-400 to-teal-400',
                    bgColor: 'bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20',
                    borderColor: 'border-green-500/50',
                    description: '誠実さを最優先。フォロワーは少ないけど、信頼されてる...はず。たぶん。きっと誰かが見てくれてる。'
                };
            }
        } else if (ethics >= 40) {
            // 中信頼性
            if (followers >= 600) {
                return {
                    title: 'グレーゾーンの覇者',
                    icon: '⭐',
                    color: 'from-pink-400 via-rose-400 to-red-400',
                    bgColor: 'bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-red-500/20',
                    borderColor: 'border-pink-500/50',
                    description: '大きな影響力を持ちつつ、ギリギリ炎上しないラインを攻めました。現実のインフルエンサーに多いタイプ。'
                };
            } else if (followers >= 300) {
                return {
                    title: '発展途上アカウント',
                    icon: '📈',
                    color: 'from-blue-400 via-indigo-400 to-purple-400',
                    bgColor: 'bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20',
                    borderColor: 'border-blue-500/50',
                    description: '可もなく不可もなく。このまま行くか、闇落ちするか、あなた次第。'
                };
            } else {
                return {
                    title: 'ROM専から一歩踏み出した人',
                    icon: '👀',
                    color: 'from-slate-400 via-gray-400 to-zinc-400',
                    bgColor: 'bg-gradient-to-r from-slate-500/20 via-gray-500/20 to-zinc-500/20',
                    borderColor: 'border-slate-500/50',
                    description: 'おとなしめの発信。「いいね」はするけど投稿は控えめ。それはそれで賢い選択かも？'
                };
            }
        } else {
            // 低信頼性
            if (followers >= 600) {
                return {
                    title: '闇のカリスマ',
                    icon: '💀',
                    color: 'from-red-400 via-rose-500 to-pink-500',
                    bgColor: 'bg-gradient-to-r from-red-500/20 via-rose-500/20 to-pink-500/20',
                    borderColor: 'border-red-500/50',
                    description: '大量のフォロワーを獲得したけど、みんなを騙して得た人気です。現実なら訴訟リスク特大。いつか痛い目見るタイプ。'
                };
            } else if (followers >= 300) {
                return {
                    title: '炎上芸人見習い',
                    icon: '🔥',
                    color: 'from-orange-400 via-red-400 to-rose-400',
                    bgColor: 'bg-gradient-to-r from-orange-500/20 via-red-500/20 to-rose-500/20',
                    borderColor: 'border-orange-500/50',
                    description: '注目は集まってるけど、だいたい批判。「炎上商法」という言葉を体現中。消火器の用意を推奨。'
                };
            } else {
                return {
                    title: 'スベり散らかした人',
                    icon: '🦗',
                    color: 'from-gray-400 via-slate-400 to-zinc-400',
                    bgColor: 'bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-zinc-500/20',
                    borderColor: 'border-gray-500/50',
                    description: '操作的な投稿をしたのに誰にも響かなかった...。ある意味一番悲しい結末。でも被害者が出なかったのは不幸中の幸い？'
                };
            }
        }
    };
    
    const badge = getTitleAndBadge();
    
    // 累計拡散影響を計算
    const calculateTotalImpact = () => {
        let totalReach = 0;
        let totalBelievers = 0;
        
        stage3Data.results.forEach(result => {
            const techniques = result.post.techniques;
            const manipulationLevel = techniques.length;
            const isManipulative = manipulationLevel > 0;
            
            const primaryReach = result.newFollowers;
            const secondaryReach = Math.round(result.shares * 150 * (1 + manipulationLevel * 0.3));
            const tertiaryReach = Math.round(secondaryReach * 0.2 * (1 + manipulationLevel * 0.2));
            
            const roundReach = primaryReach + secondaryReach + tertiaryReach;
            totalReach += roundReach;
            
            if (isManipulative) {
                const believerRate = 0.3 + manipulationLevel * 0.15;
                totalBelievers += Math.round(roundReach * believerRate * 0.5);
            }
        });
        
        return { totalReach, totalBelievers };
    };
    
    const { totalReach, totalBelievers } = calculateTotalImpact();

    // --- エピローグクロージングシーケンス ---
    if (!closingDone) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-2xl w-full animate-fade-in">
                    <div className="glass rounded-3xl p-8 md:p-10">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                エピローグ
                            </div>
                            <button
                                onClick={() => setClosingDone(true)}
                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
                            >
                                スキップ →
                            </button>
                        </div>

                        <div className="min-h-36">
                            <DialogueBox dialogue={closing[closingIndex]} />
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <div className="flex gap-1.5">
                                {closing.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            i === closingIndex ? 'bg-indigo-400 w-6' :
                                            i < closingIndex ? 'bg-indigo-700 w-3' : 'bg-white/20 w-3'
                                        }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    if (closingIndex < closing.length - 1) {
                                        setClosingIndex(prev => prev + 1);
                                    } else {
                                        setClosingDone(true);
                                    }
                                }}
                                className="btn-primary text-white font-bold py-3 px-8 rounded-2xl"
                            >
                                {closingIndex < closing.length - 1 ? '次へ →' : '結果を見る →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="max-w-3xl w-full animate-fade-in">
                <div className="glass rounded-3xl p-6 md:p-8">
                    <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        最終評価
                    </h1>

                    {/* 称号表示 */}
                    <div className={`${badge.bgColor} border ${badge.borderColor} rounded-2xl p-6 mb-6 text-center`}>
                        <div className="text-5xl mb-3">{badge.icon}</div>
                        <h2 className={`text-2xl font-black mb-2 bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`}>
                            {badge.title}
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {badge.description}
                        </p>
                    </div>

                    {/* Stage1結果 */}
                    <div className="bg-white/5 rounded-2xl p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">🎯</span> Stage 1: 見破る力
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-indigo-500/20 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-400">正答率</p>
                                <p className="text-3xl font-bold text-indigo-400">{stage1Data.accuracy}%</p>
                            </div>
                            <div className="bg-purple-500/20 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-400">スコア</p>
                                <p className="text-3xl font-bold text-purple-400">{stage1Data.score}</p>
                            </div>
                        </div>
                        
                        {stage1Data.weakTechniques.length > 0 && (
                            <div>
                                <p className="text-sm text-gray-400 mb-2">苦手な技法:</p>
                                <div className="flex flex-wrap gap-2">
                                    {stage1Data.weakTechniques.map(tech => (
                                        <TechniqueTag key={tech} techniqueId={tech} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stage3結果 */}
                    <div className="bg-white/5 rounded-2xl p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">📱</span> Stage 2: インフルエンサー体験
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-indigo-500/20 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-400">最終フォロワー</p>
                                <p className="text-2xl font-bold text-indigo-400">{stage3Data.totalFollowers.toLocaleString()}</p>
                            </div>
                            <div className={`${stage3Data.finalEthics >= 50 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-xl p-4 text-center`}>
                                <p className="text-xs text-gray-400">最終信頼性</p>
                                <p className={`text-2xl font-bold ${stage3Data.finalEthics >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                                    {stage3Data.finalEthics}%
                                </p>
                            </div>
                            <div className="bg-purple-500/20 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-400">使用技法数</p>
                                <p className="text-2xl font-bold text-purple-400">{totalTechniquesUsed}</p>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-sm text-gray-400 mb-2">あなたの傾向:</p>
                            {ethicalPosts >= 3 ? (
                                <p className="text-green-400">
                                    👏 倫理的な情報発信を心がけていました。信頼性を維持しながら影響力を築くことができました。
                                </p>
                            ) : ethicalPosts >= 1 ? (
                                <p className="text-yellow-400">
                                    ⚖️ 拡散力と倫理のバランスを取ろうとしていました。時に操作的な手法も使用しました。
                                </p>
                            ) : (
                                <p className="text-red-400">
                                    ⚠️ 拡散力を優先し、多くの操作的技法を使用しました。短期的な効果はありますが、長期的な信頼を損なう可能性があります。
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stage3結果: 情報検証訓練 */}
                    {stageCreateData && stageCreateData.scenarios && (
                        <div className="bg-white/5 rounded-2xl p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-2xl">🔍</span> Stage 3: 情報検証訓練
                            </h2>
                            
                            <div className="space-y-4">
                                {stageCreateData.scenarios.map((result, index) => (
                                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                    result.scenario.difficultyColor === 'green' ? 'bg-green-500/20 text-green-300' :
                                                    result.scenario.difficultyColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    'bg-red-500/20 text-red-300'
                                                }`}>
                                                    {result.scenario.difficulty}
                                                </span>
                                                <span className="font-bold text-sm">{result.scenario.title}</span>
                                            </div>
                                            <span className={`text-sm font-bold ${
                                                result.totalScore >= 7 ? 'text-green-400' :
                                                result.totalScore >= 4 ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                                {result.totalScore}/{result.maxScore}点
                                            </span>
                                        </div>
                                        
                                        {/* 各ステップの結果 */}
                                        <div className="flex gap-2">
                                            {result.answers.map((answer, idx) => (
                                                <div key={idx} className={`flex-1 text-center py-1 rounded text-xs ${
                                                    answer.score >= 3 ? 'bg-green-500/20 text-green-300' :
                                                    answer.score >= 2 ? 'bg-yellow-500/20 text-yellow-300' :
                                                    'bg-red-500/20 text-red-300'
                                                }`}>
                                                    Step{idx + 1}: +{answer.score}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* 総評 */}
                            {(() => {
                                const totalScore = stageCreateData.scenarios.reduce((sum, s) => sum + s.totalScore, 0);
                                const maxTotal = stageCreateData.scenarios.reduce((sum, s) => sum + s.maxScore, 0);
                                const percentage = (totalScore / maxTotal) * 100;
                                return (
                                    <div className={`mt-4 p-4 rounded-xl ${
                                        percentage >= 70 ? 'bg-green-500/10 border border-green-500/30' :
                                        percentage >= 40 ? 'bg-yellow-500/10 border border-yellow-500/30' :
                                        'bg-red-500/10 border border-red-500/30'
                                    }`}>
                                        <p className={`text-sm ${
                                            percentage >= 70 ? 'text-green-300' :
                                            percentage >= 40 ? 'text-yellow-300' : 'text-red-300'
                                        }`}>
                                            {percentage >= 70 
                                                ? '👏 素晴らしい検証力！情報の真偽を自分で確認するスキルが身についています。'
                                                : percentage >= 40
                                                    ? '💪 検証スキルが向上中！公式情報源を優先して確認する習慣をつけましょう。'
                                                    : '📚 情報検証は練習が必要です。「投稿を読む」のではなく「外部で確認する」ことを意識しましょう。'}
                                        </p>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* 社会的影響（累計拡散） */}
                    <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">🌐</span> あなたの投稿の社会的影響
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-indigo-500/20 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-400">推定総リーチ</p>
                                <p className="text-2xl font-bold text-indigo-400">{totalReach.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">人に届きました</p>
                            </div>
                            <div className={`${totalBelievers > 0 ? 'bg-red-500/20' : 'bg-green-500/20'} rounded-xl p-4 text-center`}>
                                <p className="text-xs text-gray-400">誤情報を信じた人</p>
                                <p className={`text-2xl font-bold ${totalBelievers > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {totalBelievers > 0 ? `約${totalBelievers.toLocaleString()}` : '0'}
                                </p>
                                <p className="text-xs text-gray-500">人が影響を受けました</p>
                            </div>
                        </div>
                        
                        {totalBelievers > 0 ? (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                <p className="text-sm text-red-300 leading-relaxed">
                                    <span className="font-bold">⚠️ 考えてみてください：</span><br />
                                    あなたの投稿により、約{totalBelievers.toLocaleString()}人が誤った情報を信じた可能性があります。
                                    その中には、間違った健康法を実践したり、必要な医療を受けなかったりする人がいるかもしれません。
                                </p>
                            </div>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                <p className="text-sm text-green-300 leading-relaxed">
                                    <span className="font-bold">✨ 素晴らしい選択でした：</span><br />
                                    あなたは誠実な情報発信を心がけました。{totalReach.toLocaleString()}人に正確な情報を届けることができました。
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 学びのまとめ */}
                    <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">💡</span> 学びのまとめ
                        </h2>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400">•</span>
                                レトリック技法は、私たちの感情や判断に影響を与えるために使われます
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                攻撃者の視点を理解することで、操作的な情報を見抜きやすくなります
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-pink-400">•</span>
                                短期的な拡散力と長期的な信頼性はトレードオフの関係にあります
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400">•</span>
                                情報を受け取る際も発信する際も、技法の存在を意識することが大切です
                            </li>
                        </ul>
                    </div>

                    {/* 事後テストへ進むボタン */}
                    <button
                        onClick={onContinueToSurvey}
                        className="w-full btn-primary text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2"
                    >
                        <span>📋</span> 事後テストへ進む
                    </button>
                </div>
            </div>
        </div>
    );
};

// 転移テストコンポーネント
