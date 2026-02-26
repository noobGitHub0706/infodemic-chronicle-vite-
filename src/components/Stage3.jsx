import { useState, useEffect, useCallback } from 'react';
import { TECHNIQUES } from '../data/techniques';
import { STAGE3_POSTS, SNS_REACTIONS, CRITICISM_RESPONSES } from '../data/stage3Posts';
import { TARGETS } from '../data/targets';
import { TechniqueTag } from './common/TechniqueTag';
import { SNSPostCard } from './common/SNSPostCard';
import { SpreadVisualization } from './common/SpreadVisualization';
import { DialogueBox } from './common/DialogueBox';
import { STAGE3_NARRATIVE } from '../data/narrative';
import { shuffle, randomBetween } from '../utils';

export const Stage3 = ({ stage1Data, onComplete }) => {
    const [round, setRound] = useState(0);
    const [phase, setPhase] = useState('target'); // target, post, result, criticism, suspended
    const [stageStartShown, setStageStartShown] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [followers, setFollowers] = useState(100);
    const [ethics, setEthics] = useState(70);
    const [results, setResults] = useState([]);
    const [currentResult, setCurrentResult] = useState(null);
    const [showCriticism, setShowCriticism] = useState(false);
    const [criticismHandled, setCriticismHandled] = useState(false);
    const [criticismResult, setCriticismResult] = useState(null);
    const [isSuspended, setIsSuspended] = useState(false); // アカウント凍結状態

    const currentPosts = STAGE3_POSTS[round];

    const handleTargetSelect = (targetId) => {
        setSelectedTarget(targetId);
    };

    const handlePostSelect = (post) => {
        setSelectedPost(post);
    };

    const confirmPost = () => {
        if (!selectedTarget || !selectedPost) return;

        const target = TARGETS[selectedTarget];
        const targetEffect = selectedPost.targetEffects[selectedTarget] || 1;
        const randomFactor = randomBetween(0.8, 1.2);
        const finalInfluence = Math.round(selectedPost.influence * targetEffect * randomFactor);

        const newFollowers = Math.round(finalInfluence * (8 + Math.random() * 4));
        const likes = Math.round(finalInfluence * (12 + Math.random() * 8));
        const shares = Math.round(finalInfluence * (6 + Math.random() * 4));
        const newEthics = Math.max(0, Math.min(100, ethics + selectedPost.ethics));

        // SNS反応の生成
        const reactions = [];
        const hasManipulativeTech = selectedPost.techniques.length > 0;
        const targetReactions = SNS_REACTIONS.target[selectedTarget];
        
        if (hasManipulativeTech) {
            // ターゲット層からのポジティブ反応（操作的な投稿が効いた）
            if (targetReactions?.positive) {
                reactions.push(targetReactions.positive[Math.floor(Math.random() * targetReactions.positive.length)]);
            }
            // 信者的反応
            reactions.push(SNS_REACTIONS.believer[Math.floor(Math.random() * SNS_REACTIONS.believer.length)]);
            // 拡散者
            if (finalInfluence > 25) {
                reactions.push(SNS_REACTIONS.sharer[Math.floor(Math.random() * SNS_REACTIONS.sharer.length)]);
            }
            // 懐疑派（倫理が低いほど出やすい）
            if (newEthics < 50 || Math.random() < 0.3) {
                reactions.push(SNS_REACTIONS.skeptic[Math.floor(Math.random() * SNS_REACTIONS.skeptic.length)]);
            }
            // ターゲット層からのネガティブ反応（確率で）
            if (targetReactions?.negative && Math.random() < 0.4) {
                reactions.push(targetReactions.negative[Math.floor(Math.random() * targetReactions.negative.length)]);
            }
        } else {
            // 中立的な反応
            reactions.push(SNS_REACTIONS.neutral[Math.floor(Math.random() * SNS_REACTIONS.neutral.length)]);
            reactions.push(SNS_REACTIONS.positive[Math.floor(Math.random() * SNS_REACTIONS.positive.length)]);
            // ターゲット層からもポジティブな反応
            if (targetReactions?.positive) {
                const positiveReaction = {...targetReactions.positive[Math.floor(Math.random() * targetReactions.positive.length)]};
                positiveReaction.text = positiveReaction.text.replace(/シェア|広め|教え/g, '参考に');
                reactions.push(positiveReaction);
            }
        }

        const result = {
            round: round + 1,
            target: selectedTarget,
            post: selectedPost,
            finalInfluence,
            newFollowers,
            likes,
            shares,
            ethicsChange: selectedPost.ethics,
            reactions
        };

        setCurrentResult(result);
        setFollowers(prev => prev + newFollowers);
        setEthics(newEthics);
        setResults(prev => [...prev, result]);
        setPhase('result');

        // 信頼性が0になったらアカウント凍結
        if (newEthics <= 0) {
            setIsSuspended(true);
            return;
        }

        // ラウンド2と4で批判イベント発生（倫理が低い場合）
        if ((round === 1 || round === 3) && newEthics < 60 && hasManipulativeTech) {
            setShowCriticism(true);
        }
    };

    const handleCriticismResponse = (response) => {
        const ethicsChange = response.ethics;
        const followersChange = response.influence * 10;
        
        const newEthics = Math.max(0, Math.min(100, ethics + ethicsChange));
        setEthics(newEthics);
        setFollowers(prev => Math.max(0, prev + followersChange));
        setCriticismHandled(true);
        setShowCriticism(false);
        
        // 結果を保存
        setCriticismResult({
            response: response,
            ethicsChange: ethicsChange,
            followersChange: followersChange
        });

        // 批判対応後に信頼性が0になったら凍結
        if (newEthics <= 0) {
            setIsSuspended(true);
        }
    };

    const nextRound = () => {
        if (round < 4) {
            setRound(prev => prev + 1);
            setPhase('target');
            setSelectedTarget(null);
            setSelectedPost(null);
            setCurrentResult(null);
            setCriticismHandled(false);
            setCriticismResult(null); // リセット
        } else {
            onComplete({
                results,
                totalFollowers: followers,
                finalEthics: ethics,
                suspended: false
            });
        }
    };

    // アカウント凍結時の完了処理
    const handleSuspendedComplete = () => {
        onComplete({
            results,
            totalFollowers: followers,
            finalEthics: 0,
            suspended: true,
            suspendedAtRound: round + 1
        });
    };

    // --- stageStart 画面 ---
    if (!stageStartShown) {
        return (
            <div className="min-h-screen p-4 flex items-center justify-center">
                <div className="max-w-2xl w-full animate-fade-in">
                    <div className="glass rounded-3xl p-6 md:p-8">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => setStageStartShown(true)}
                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
                            >
                                スキップ →
                            </button>
                        </div>
                        <div className="text-center mb-4">
                            <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">Stage 2: インフルエンサー体験</span>
                        </div>
                        <DialogueBox dialogue={STAGE3_NARRATIVE.stageStart} />
                        <button
                            onClick={() => setStageStartShown(true)}
                            className="w-full mt-4 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                        >
                            潜入を開始する
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* アカウント凍結画面 */}
            {isSuspended ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-2xl w-full animate-fade-in">
                        <div className="glass rounded-3xl p-8 md:p-12 text-center">
                            {/* 凍結アイコン */}
                            <div className="mb-6">
                                <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <span className="text-5xl">🚫</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-red-400 mb-2">
                                    アカウント凍結
                                </h1>
                                <p className="text-gray-400">Account Suspended</p>
                            </div>

                            {/* 凍結理由 */}
                            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6 text-left">
                                <h3 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                                    <span>⚠️</span>
                                    凍結理由
                                </h3>
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    あなたのアカウントは、<span className="text-red-400 font-bold">信頼性の著しい低下</span>により凍結されました。
                                </p>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        <span>複数のユーザーから「誤解を招く情報」として報告されました</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        <span>コミュニティガイドラインに違反する投稿が検出されました</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        <span>信頼性スコアが基準値を下回りました</span>
                                    </li>
                                </ul>
                            </div>

                            {/* 統計 */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">到達ラウンド</p>
                                    <p className="text-2xl font-bold text-indigo-400">{round + 1} / 5</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">最終フォロワー</p>
                                    <p className="text-2xl font-bold text-pink-400">{followers.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">最終信頼性</p>
                                    <p className="text-2xl font-bold text-red-400">0%</p>
                                </div>
                            </div>

                            {/* 凍結ナラティブ */}
                            <DialogueBox dialogue={STAGE3_NARRATIVE.accountSuspended} />

                            {/* 学びのポイント */}
                            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 mb-8 text-left">
                                <h3 className="font-bold text-indigo-300 mb-3 flex items-center gap-2">
                                    <span>💡</span>
                                    学びのポイント
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    操作的なレトリック技法を多用すると、短期的にはフォロワーを増やせますが、
                                    信頼性が急速に低下し、最終的には<span className="text-indigo-300 font-bold">アカウントを失う</span>リスクがあります。
                                </p>
                                <p className="text-gray-300 leading-relaxed mt-3">
                                    現実のSNSでも、誤情報の拡散は<span className="text-indigo-300 font-bold">アカウント停止</span>や
                                    <span className="text-indigo-300 font-bold">法的責任</span>につながることがあります。
                                    影響力と責任は表裏一体です。
                                </p>
                            </div>

                            {/* 結果確認ボタン */}
                            <button
                                onClick={handleSuspendedComplete}
                                className="btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg w-full"
                            >
                                結果を確認する
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
            <>
            {/* ヘッダー */}
            <div className="max-w-3xl w-full mx-auto mb-4">
                <div className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Stage 2: インフルエンサー体験</span>
                        <span className="text-sm text-gray-400">ラウンド {round + 1} / 5</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                        <div className="progress-bar h-full rounded-full" style={{ width: `${((round + 1) / 5) * 100}%` }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400">フォロワー</p>
                            <p className="text-2xl font-bold text-indigo-400">{followers.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400">信頼性</p>
                            <p className={`text-2xl font-bold ${ethics >= 50 ? 'text-green-400' : ethics >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {ethics}%
                            </p>
                            {ethics < 20 && ethics > 0 && (
                                <p className="text-xs text-red-400 animate-pulse">⚠️ 凍結の危険</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="flex-1 flex items-center justify-center">
                <div className="max-w-3xl w-full">
                    {/* ターゲット選択 */}
                    {phase === 'target' && (
                        <div className="animate-fade-in">
                            <DialogueBox dialogue={STAGE3_NARRATIVE.roundIntros[round]} />
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-center mb-6">
                                    ターゲットを選択
                                </h2>
                                <p className="text-gray-400 text-center mb-6">
                                    どの層に向けて投稿しますか？
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {Object.values(TARGETS).map(target => (
                                        <button
                                            key={target.id}
                                            onClick={() => handleTargetSelect(target.id)}
                                            className={`card-hover p-5 rounded-2xl text-left transition-all ${
                                                selectedTarget === target.id
                                                    ? 'bg-indigo-500/30 border-2 border-indigo-500'
                                                    : 'bg-white/5 border-2 border-transparent hover:border-white/20'
                                            }`}
                                        >
                                            <div className="text-4xl mb-3">{target.icon}</div>
                                            <h3 className="font-bold text-lg mb-1">{target.name}</h3>
                                            <p className="text-sm text-gray-400 mb-2">{target.description}</p>
                                            <p className="text-xs text-purple-400">{target.traits}</p>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => selectedTarget && setPhase('post')}
                                    disabled={!selectedTarget}
                                    className={`w-full font-bold py-4 px-8 rounded-2xl text-lg transition-all ${
                                        selectedTarget
                                            ? 'btn-primary text-white'
                                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    投稿を選択へ
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 投稿選択 */}
                    {phase === 'post' && (
                        <div className="animate-fade-in">
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold">投稿を選択</h2>
                                    <div className="relative group">
                                        <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 cursor-help border border-transparent group-hover:border-indigo-500/50 transition-all">
                                            <span className="text-2xl">{TARGETS[selectedTarget].icon}</span>
                                            <span className="text-sm">{TARGETS[selectedTarget].name}</span>
                                            <span className="text-xs text-gray-400 ml-1">ℹ️</span>
                                        </div>
                                        {/* ツールチップ */}
                                        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-indigo-500/30 rounded-xl p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                            <div className="absolute -top-2 right-6 w-4 h-4 bg-slate-800 border-l border-t border-indigo-500/30 transform rotate-45"></div>
                                            <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2">
                                                <span>{TARGETS[selectedTarget].icon}</span>
                                                {TARGETS[selectedTarget].name}
                                            </h4>
                                            <p className="text-sm text-gray-300 mb-3">{TARGETS[selectedTarget].description}</p>
                                            
                                            <div className="space-y-2">
                                                <div className="bg-red-500/10 rounded-lg p-2">
                                                    <p className="text-xs font-bold text-red-400 mb-1">⚠️ 弱点（効きやすい）</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {TARGETS[selectedTarget].weaknesses.map(tech => (
                                                            <span key={tech} className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                                                                {TECHNIQUES[tech].name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-green-500/10 rounded-lg p-2">
                                                    <p className="text-xs font-bold text-green-400 mb-1">🛡️ 耐性（効きにくい）</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {TARGETS[selectedTarget].resistances.map(tech => (
                                                            <span key={tech} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                                                                {TECHNIQUES[tech].name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <p className="text-xs text-gray-500 mt-2 italic">
                                                💡 {TARGETS[selectedTarget].traits}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ターゲット特性の簡易表示 */}
                                <div className="bg-white/5 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-2 text-xs">
                                    <span className="text-gray-400">このターゲットは</span>
                                    {TARGETS[selectedTarget].weaknesses.map(tech => (
                                        <span key={tech} className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                                            {TECHNIQUES[tech].name}
                                        </span>
                                    ))}
                                    <span className="text-gray-400">に弱く、</span>
                                    {TARGETS[selectedTarget].resistances.map(tech => (
                                        <span key={tech} className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                                            {TECHNIQUES[tech].name}
                                        </span>
                                    ))}
                                    <span className="text-gray-400">には耐性があります</span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {currentPosts.map((post, index) => (
                                        <button
                                            key={post.id}
                                            onClick={() => handlePostSelect(post)}
                                            className={`w-full card-hover rounded-2xl text-left transition-all border-2 ${
                                                selectedPost?.id === post.id
                                                    ? 'border-purple-500'
                                                    : 'border-transparent hover:border-white/20'
                                            }`}
                                        >
                                            <SNSPostCard
                                                account={post.account}
                                                accountId={post.accountId}
                                                text={post.text}
                                                isInteractive={false}
                                                compact={true}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setPhase('target');
                                            setSelectedPost(null);
                                        }}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl transition-all"
                                    >
                                        戻る
                                    </button>
                                    <button
                                        onClick={confirmPost}
                                        disabled={!selectedPost}
                                        className={`flex-1 font-bold py-4 px-6 rounded-2xl transition-all ${
                                            selectedPost
                                                ? 'btn-primary text-white'
                                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        投稿する
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 結果表示 */}
                    {phase === 'result' && currentResult && (
                        <div className="animate-fade-in">
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-center mb-6">投稿結果</h2>

                                {/* 使用した技法 */}
                                <div className="bg-white/5 rounded-2xl p-4 mb-4">
                                    <p className="text-sm text-gray-400 mb-2">使用されたレトリック技法:</p>
                                    {currentResult.post.techniques.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {currentResult.post.techniques.map(tech => (
                                                <TechniqueTag key={tech} techniqueId={tech} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">なし（誠実な投稿）</p>
                                    )}
                                </div>

                                {/* 技法がターゲットに効いた理由 */}
                                {currentResult.post.techniques.length > 0 && (
                                    <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-4 mb-6">
                                        <p className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                                            <span>💡</span>
                                            なぜ「{TARGETS[currentResult.target].name}」に効いたのか？
                                        </p>
                                        <div className="space-y-3">
                                            {currentResult.post.techniques.map(techId => {
                                                const tech = TECHNIQUES[techId];
                                                const target = TARGETS[currentResult.target];
                                                const reason = target.techniqueReasons[techId];
                                                const isWeak = target.weaknesses.includes(techId);
                                                const isResist = target.resistances.includes(techId);
                                                
                                                return (
                                                    <div key={techId} className={`rounded-xl p-3 ${tech.bgColor} border ${tech.borderColor}`}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`font-bold ${tech.textColor}`}>{tech.name}</span>
                                                            {isWeak && (
                                                                <span className="text-xs bg-red-500/30 text-red-300 px-2 py-0.5 rounded-full">
                                                                    弱点技法 ⚡
                                                                </span>
                                                            )}
                                                            {isResist && (
                                                                <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">
                                                                    耐性あり 🛡️
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-300 leading-relaxed">{reason}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* 誠実な投稿の場合の解説 */}
                                {currentResult.post.techniques.length === 0 && (
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6">
                                        <p className="text-sm font-bold text-green-300 mb-2 flex items-center gap-2">
                                            <span>✨</span>
                                            誠実な情報発信
                                        </p>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            操作的なレトリック技法を使わない投稿は、短期的な拡散力は低いですが、
                                            長期的な信頼性の構築に貢献します。批判を受けるリスクも低く、
                                            持続可能な影響力を築くことができます。
                                        </p>
                                    </div>
                                )}

                                {/* 数値結果 */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                    <div className="bg-indigo-500/20 rounded-xl p-4 text-center">
                                        <p className="text-xs text-gray-400">新規フォロワー</p>
                                        <p className="text-xl font-bold text-indigo-400">+{currentResult.newFollowers}</p>
                                    </div>
                                    <div className="bg-pink-500/20 rounded-xl p-4 text-center">
                                        <p className="text-xs text-gray-400">いいね</p>
                                        <p className="text-xl font-bold text-pink-400">{currentResult.likes}</p>
                                    </div>
                                    <div className="bg-cyan-500/20 rounded-xl p-4 text-center">
                                        <p className="text-xs text-gray-400">シェア</p>
                                        <p className="text-xl font-bold text-cyan-400">{currentResult.shares}</p>
                                    </div>
                                    <div className={`${currentResult.ethicsChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-xl p-4 text-center`}>
                                        <p className="text-xs text-gray-400">信頼性</p>
                                        <p className={`text-xl font-bold ${currentResult.ethicsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {currentResult.ethicsChange >= 0 ? '+' : ''}{currentResult.ethicsChange}
                                        </p>
                                    </div>
                                </div>

                                {/* SNS反応 */}
                                <div className="bg-white/5 rounded-2xl p-4 mb-6">
                                    <p className="text-sm text-gray-400 mb-3">SNSの反応:</p>
                                    <div className="space-y-3">
                                        {currentResult.reactions.map((reaction, i) => (
                                            <div 
                                                key={i} 
                                                className={`flex items-start gap-3 animate-slide-in p-2 rounded-xl ${
                                                    reaction.isTarget 
                                                        ? 'bg-indigo-500/10 border border-indigo-500/30' 
                                                        : ''
                                                }`}
                                                style={{ animationDelay: `${i * 0.1}s` }}
                                            >
                                                <span className="text-2xl">{reaction.icon}</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-gray-300">{reaction.name}</p>
                                                        {reaction.isTarget && (
                                                            <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full">
                                                                {TARGETS[currentResult.target].name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400">{reaction.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 特殊イベントナラティブ */}
                                {currentResult.newFollowers >= 200 && (
                                    <DialogueBox dialogue={STAGE3_NARRATIVE.followerSurge} />
                                )}
                                {currentResult.ethicsChange <= -20 && (
                                    <DialogueBox dialogue={STAGE3_NARRATIVE.trustDrop} />
                                )}

                                {/* 拡散可視化 */}
                                <SpreadVisualization
                                    result={currentResult}
                                    targetInfo={TARGETS[currentResult.target]}
                                />

                                {/* 批判イベント */}
                                {showCriticism && !criticismHandled && (
                                    <div className="bg-red-500/20 border border-red-500 rounded-2xl p-5 mb-6 animate-fade-in">
                                        <h3 className="font-bold text-red-400 mb-3">⚠️ 批判コメントが殺到!</h3>
                                        <p className="text-gray-300 mb-4">
                                            「この情報、根拠ないですよね？デマ拡散やめてください」
                                        </p>
                                        <p className="text-sm text-gray-400 mb-4">どう対応しますか？</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {CRITICISM_RESPONSES.map(response => (
                                                <button
                                                    key={response.id}
                                                    onClick={() => handleCriticismResponse(response)}
                                                    className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-left transition-all"
                                                >
                                                    <p className="font-medium">{response.text}</p>
                                                    <p className="text-xs text-gray-400">{response.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 批判対応の結果フィードバック */}
                                {criticismHandled && criticismResult && (
                                    <div className={`rounded-2xl p-5 mb-6 animate-fade-in border ${
                                        criticismResult.response.feedback.type === 'positive' 
                                            ? 'bg-green-500/20 border-green-500/50' 
                                            : criticismResult.response.feedback.type === 'negative'
                                            ? 'bg-red-500/20 border-red-500/50'
                                            : 'bg-yellow-500/20 border-yellow-500/50'
                                    }`}>
                                        <h3 className={`font-bold mb-3 flex items-center gap-2 ${
                                            criticismResult.response.feedback.type === 'positive' 
                                                ? 'text-green-400' 
                                                : criticismResult.response.feedback.type === 'negative'
                                                ? 'text-red-400'
                                                : 'text-yellow-400'
                                        }`}>
                                            <span>{
                                                criticismResult.response.feedback.type === 'positive' ? '✨' :
                                                criticismResult.response.feedback.type === 'negative' ? '💥' : '🤔'
                                            }</span>
                                            {criticismResult.response.feedback.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                            {criticismResult.response.feedback.message}
                                        </p>
                                        
                                        {/* 数値変化 */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className={`rounded-xl p-3 text-center ${
                                                criticismResult.followersChange >= 0 ? 'bg-indigo-500/20' : 'bg-red-500/20'
                                            }`}>
                                                <p className="text-xs text-gray-400">フォロワー変化</p>
                                                <p className={`text-xl font-bold ${
                                                    criticismResult.followersChange >= 0 ? 'text-indigo-400' : 'text-red-400'
                                                }`}>
                                                    {criticismResult.followersChange >= 0 ? '+' : ''}{criticismResult.followersChange}
                                                </p>
                                            </div>
                                            <div className={`rounded-xl p-3 text-center ${
                                                criticismResult.ethicsChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                                            }`}>
                                                <p className="text-xs text-gray-400">信頼性変化</p>
                                                <p className={`text-xl font-bold ${
                                                    criticismResult.ethicsChange >= 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                    {criticismResult.ethicsChange >= 0 ? '+' : ''}{criticismResult.ethicsChange}%
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* 学びのポイント */}
                                        <div className="mt-4 bg-white/5 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-1">💡 学びのポイント</p>
                                            <p className="text-sm text-gray-300">
                                                {criticismResult.response.id === 'ignore' && 
                                                    '批判への沈黙は炎上を避けられますが、説明責任を果たさないことで信頼を失うこともあります。'}
                                                {criticismResult.response.id === 'attack' && 
                                                    '攻撃的な反論は支持者を喜ばせますが、中立的な人々からの信頼を大きく損ないます。'}
                                                {criticismResult.response.id === 'block' && 
                                                    'ブロックは一時的な解決策ですが、批判を封じ込める姿勢は長期的に信頼を損ないます。'}
                                                {criticismResult.response.id === 'acknowledge' && 
                                                    '誠実な謝罪は短期的にフォロワーを失いますが、長期的な信頼構築につながります。'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* 警告メッセージ */}
                                {ethics < 30 && (
                                    <div className="bg-red-500/30 border border-red-500 rounded-xl p-4 mb-6">
                                        <p className="text-red-400 font-bold">💀 警告: 信頼性が著しく低下しています</p>
                                        <p className="text-sm text-gray-300">アカウント凍結のリスクがあります</p>
                                    </div>
                                )}

                                <button
                                    onClick={nextRound}
                                    disabled={showCriticism && !criticismHandled}
                                    className={`w-full font-bold py-4 px-8 rounded-2xl text-lg ${
                                        showCriticism && !criticismHandled
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'btn-primary text-white'
                                    }`}
                                >
                                    {round < 4 ? '次のラウンドへ' : 'Stage 3へ'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </>
            )}
        </div>
    );
};

// Stage3 説明画面（情報検証訓練）
