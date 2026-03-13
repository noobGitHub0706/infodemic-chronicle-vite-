import { useState, useEffect } from 'react';
import { TECHNIQUES } from '../../data/techniques';
import { TechniqueTag } from '../../common/TechniqueTag';
import { SpreadVisualization } from '../../common/SpreadVisualization';
import { DialogueBox } from '../../common/DialogueBox';
import { randomBetween } from '../../utils';

/**
 * 汎用インフルエンサー体験コンポーネント
 *
 * @param {Array} rounds    - ラウンドオブジェクト配列 [{ chapter, theme, posts[] }]
 * @param {Array} targets   - ターゲット層配列 (TARGETS from influencer_targets.js)
 * @param {Object} narrativeIntros - INFLUENCER_NARRATIVE (roundIntros, followerSurge, trustDrop, accountSuspended)
 * @param {string} stageLabel      - ヘッダー表示用ラベル
 * @param {Function} onComplete    - 完了コールバック
 */

const SUSPENSION_THRESHOLD = -60;
const WARNING_THRESHOLD = -40;

export const InfluencerSim = ({
    rounds,
    targets,
    narrativeIntros,
    stageLabel = 'インフルエンサー体験',
    onPostCompleted,
    onComplete
}) => {
    const [roundIndex, setRoundIndex] = useState(0);
    const [phase, setPhase] = useState('target'); // target | post | result
    const [selectedTargetId, setSelectedTargetId] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [followers, setFollowers] = useState(100);
    const [cumulativeEthics, setCumulativeEthics] = useState(0);
    const [results, setResults] = useState([]);
    const [currentResult, setCurrentResult] = useState(null);
    const [showCriticism, setShowCriticism] = useState(false);
    const [criticismHandled, setCriticismHandled] = useState(false);
    const [criticismResult, setCriticismResult] = useState(null);
    const [isSuspended, setIsSuspended] = useState(false);
    const [visibleReactions, setVisibleReactions] = useState(0);

    const currentRound = rounds[roundIndex];
    const currentPosts = currentRound?.posts || [];
    const selectedTarget = targets?.find(t => t.id === selectedTargetId) || null;

    // ラウンドイントロのオフセット: 第3章はroundIntros[2][3]を使用
    const introOffset = rounds[0]?.chapter === 3 ? 2 : 0;
    const currentRoundIntro = narrativeIntros?.roundIntros?.[introOffset + roundIndex] ?? null;

    // 信頼性表示: 100% から始まり、-60 で凍結 (=> 40%)
    const reliability = Math.min(100, Math.max(0, 100 + cumulativeEthics));

    // 結果画面用: 現在の投稿技法情報
    const resultTarget = currentResult ? (targets?.find(t => t.id === currentResult.targetId) ?? null) : null;
    const resultTechId = currentResult?.post?.technique ?? null;
    const resultTech = resultTechId ? TECHNIQUES[resultTechId] : null;
    const resultIsWeak = !!(resultTech && resultTarget?.weaknesses.includes(resultTechId));
    const resultIsResist = !!(resultTech && !resultIsWeak && resultTarget?.resistances.includes(resultTechId));

    // SNS反応のスタガー表示
    useEffect(() => {
        if (phase !== 'result' || !currentResult) return;
        setVisibleReactions(0);
        const reactions = currentResult.snsReactions || [];
        const timers = reactions.map((_, i) =>
            setTimeout(() => setVisibleReactions(i + 1), (i + 1) * 400)
        );
        return () => timers.forEach(clearTimeout);
    }, [phase, currentResult]);

    const confirmPost = () => {
        if (!selectedTargetId || !selectedPost || !selectedTarget) return;

        const targetEffect = selectedPost.targetEffects[selectedTargetId] || 1;
        const randomFactor = randomBetween(0.8, 1.2);
        const finalInfluence = Math.round(selectedPost.influence * targetEffect * randomFactor);
        const newFollowers = Math.round(finalInfluence * (8 + Math.random() * 4));
        const likes = Math.round(finalInfluence * (12 + Math.random() * 8));
        const shares = Math.round(finalInfluence * (6 + Math.random() * 4));
        const newCumulativeEthics = Math.min(100, Math.max(-100, cumulativeEthics + selectedPost.ethics));

        // SpreadVisualization は post.techniques (配列) を参照するため変換
        const postForResult = {
            ...selectedPost,
            techniques: selectedPost.technique ? [selectedPost.technique] : []
        };

        const result = {
            round: roundIndex + 1,
            targetId: selectedTargetId,
            post: postForResult,
            finalInfluence,
            newFollowers,
            likes,
            shares,
            ethicsChange: selectedPost.ethics,
            snsReactions: selectedPost.snsReactions || [],
        };

        setCurrentResult(result);
        setFollowers(prev => prev + newFollowers);
        setCumulativeEthics(newCumulativeEthics);
        setResults(prev => [...prev, result]);
        setPhase('result');

        if (newCumulativeEthics <= SUSPENSION_THRESHOLD) {
            setIsSuspended(true);
            return;
        }

        if (selectedPost.criticism !== null) {
            setShowCriticism(true);
        }
    };

    const handleCriticismResponse = (response) => {
        const newCumulativeEthics = Math.min(100, Math.max(-100, cumulativeEthics + response.ethics));
        const followersChange = Math.round(response.influence * 10);

        setCumulativeEthics(newCumulativeEthics);
        setFollowers(prev => Math.max(0, prev + followersChange));
        setCriticismHandled(true);
        setShowCriticism(false);
        setCriticismResult({ response, ethicsChange: response.ethics, followersChange });

        if (newCumulativeEthics <= SUSPENSION_THRESHOLD) {
            setIsSuspended(true);
        }
    };

    const nextRound = () => {
        // ラウンド完了データを研究記録用コールバックに渡す
        if (onPostCompleted && currentResult) {
            onPostCompleted({
                round: roundIndex + 1,
                targetId: selectedTargetId,
                postId: currentResult.post?.id,
                postTechniques: currentResult.post?.technique ? [currentResult.post.technique] : [],
                followerChange: currentResult.newFollowers,
                ethicsChange: currentResult.ethicsChange,
                criticismChoiceId: criticismResult?.response?.id || null,
            });
        }

        if (roundIndex < rounds.length - 1) {
            setRoundIndex(prev => prev + 1);
            setPhase('target');
            setSelectedTargetId(null);
            setSelectedPost(null);
            setCurrentResult(null);
            setCriticismHandled(false);
            setCriticismResult(null);
            setShowCriticism(false);
        } else {
            onComplete({
                results,
                totalFollowers: followers,
                finalEthics: cumulativeEthics,
                suspended: false,
            });
        }
    };

    const handleSuspendedComplete = () => {
        onComplete({
            results,
            totalFollowers: followers,
            finalEthics: cumulativeEthics,
            suspended: true,
            suspendedAtRound: roundIndex + 1,
        });
    };

    return (
        <div className="min-h-screen p-4 flex flex-col">

            {/* ── アカウント凍結画面 ─────────────────────── */}
            {isSuspended ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-2xl w-full animate-fade-in">
                        <div className="glass rounded-3xl p-8 md:p-12 text-center">
                            <div className="mb-6">
                                <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <span className="text-5xl">🚫</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-red-400 mb-2">アカウント凍結</h1>
                                <p className="text-gray-400">Account Suspended</p>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6 text-left">
                                <h3 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                                    <span>⚠️</span>凍結理由
                                </h3>
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    あなたのアカウントは、<span className="text-red-400 font-bold">信頼性の著しい低下</span>により凍結されました。
                                </p>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        複数のユーザーから「誤解を招く情報」として報告されました
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        コミュニティガイドラインに違反する投稿が検出されました
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        信頼性スコアが基準値を下回りました
                                    </li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">到達ラウンド</p>
                                    <p className="text-2xl font-bold text-indigo-400">{roundIndex + 1} / {rounds.length}</p>
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

                            {narrativeIntros?.accountSuspended && (
                                <DialogueBox dialogue={narrativeIntros.accountSuspended} />
                            )}

                            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 mb-8 text-left">
                                <h3 className="font-bold text-indigo-300 mb-3 flex items-center gap-2">
                                    <span>💡</span>学びのポイント
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    操作的なレトリック技法を多用すると、短期的にはフォロワーを増やせますが、
                                    信頼性が急速に低下し、最終的には<span className="text-indigo-300 font-bold">アカウントを失う</span>リスクがあります。
                                </p>
                            </div>

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
                    {/* ── ヘッダー ─────────────────────────────── */}
                    <div className="max-w-3xl w-full mx-auto mb-4">
                        <div className="glass rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">{stageLabel}</span>
                                <span className="text-sm text-gray-400">ラウンド {roundIndex + 1} / {rounds.length}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                                <div
                                    className="progress-bar h-full rounded-full"
                                    style={{ width: `${((roundIndex + 1) / rounds.length) * 100}%` }}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-400">フォロワー</p>
                                    <p className="text-2xl font-bold text-indigo-400">{followers.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-400">信頼性</p>
                                    <p className={`text-2xl font-bold ${
                                        reliability >= 70 ? 'text-green-400' :
                                        reliability >= 41 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                        {reliability}%
                                    </p>
                                    {reliability <= 40 && reliability > 0 && (
                                        <p className="text-xs text-red-400 animate-pulse">⚠️ 凍結の危険</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── メインコンテンツ ──────────────────────── */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="max-w-3xl w-full">

                            {/* ターゲット選択 */}
                            {phase === 'target' && (
                                <div className="animate-fade-in">
                                    {currentRoundIntro && <DialogueBox dialogue={currentRoundIntro} />}
                                    <div className="glass rounded-3xl p-6 md:p-8">
                                        <h2 className="text-2xl font-bold text-center mb-2">ターゲットを選択</h2>
                                        <p className="text-gray-400 text-center text-sm mb-6">どの層に向けて投稿しますか？</p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            {(targets || []).map(target => (
                                                <button
                                                    key={target.id}
                                                    onClick={() => setSelectedTargetId(target.id)}
                                                    className={`card-hover p-5 rounded-2xl text-left transition-all ${
                                                        selectedTargetId === target.id
                                                            ? 'bg-indigo-500/30 border-2 border-indigo-500'
                                                            : 'bg-white/5 border-2 border-transparent hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="text-4xl mb-3">{target.icon}</div>
                                                    <h3 className="font-bold text-lg mb-1">{target.name}</h3>
                                                    <p className="text-sm text-gray-400">{target.description}</p>
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => selectedTargetId && setPhase('post')}
                                            disabled={!selectedTargetId}
                                            className={`w-full font-bold py-4 px-8 rounded-2xl text-lg transition-all ${
                                                selectedTargetId
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
                            {phase === 'post' && selectedTarget && (
                                <div className="animate-fade-in">
                                    <div className="glass rounded-3xl p-6 md:p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-2xl font-bold">投稿を選択</h2>
                                            {/* ターゲット情報ツールチップ */}
                                            <div className="relative group">
                                                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 cursor-help border border-transparent group-hover:border-indigo-500/50 transition-all">
                                                    <span className="text-2xl">{selectedTarget.icon}</span>
                                                    <span className="text-sm">{selectedTarget.name}</span>
                                                    <span className="text-xs text-gray-400 ml-1">ℹ️</span>
                                                </div>
                                                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-indigo-500/30 rounded-xl p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                    <div className="absolute -top-2 right-6 w-4 h-4 bg-slate-800 border-l border-t border-indigo-500/30 transform rotate-45" />
                                                    <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2">
                                                        <span>{selectedTarget.icon}</span>
                                                        {selectedTarget.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-300 mb-3">{selectedTarget.description}</p>
                                                    <div className="space-y-2">
                                                        <div className="bg-red-500/10 rounded-lg p-2">
                                                            <p className="text-xs font-bold text-red-400 mb-1">⚠️ 弱点（効きやすい）</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {selectedTarget.weaknesses.map(tech => (
                                                                    <span key={tech} className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                                                                        {TECHNIQUES[tech]?.name || tech}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="bg-green-500/10 rounded-lg p-2">
                                                            <p className="text-xs font-bold text-green-400 mb-1">🛡️ 耐性（効きにくい）</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {selectedTarget.resistances.map(tech => (
                                                                    <span key={tech} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                                                                        {TECHNIQUES[tech]?.name || tech}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 弱点・耐性バッジ */}
                                        <div className="bg-white/5 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-2 text-xs">
                                            <span className="text-gray-400">このターゲットは</span>
                                            {selectedTarget.weaknesses.map(tech => (
                                                <span key={tech} className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                                                    {TECHNIQUES[tech]?.name || tech}
                                                </span>
                                            ))}
                                            <span className="text-gray-400">に弱く、</span>
                                            {selectedTarget.resistances.map(tech => (
                                                <span key={tech} className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                                                    {TECHNIQUES[tech]?.name || tech}
                                                </span>
                                            ))}
                                            <span className="text-gray-400">には耐性があります</span>
                                        </div>

                                        {/* 投稿一覧 */}
                                        <div className="space-y-3 mb-6">
                                            {currentPosts.map(post => (
                                                <button
                                                    key={post.id}
                                                    onClick={() => setSelectedPost(post)}
                                                    className={`w-full card-hover rounded-2xl text-left transition-all border-2 p-4 ${
                                                        selectedPost?.id === post.id
                                                            ? 'border-purple-500 bg-purple-500/10'
                                                            : 'border-transparent bg-white/5 hover:border-white/20'
                                                    }`}
                                                >
                                                    <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                                                        {post.text}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => { setPhase('target'); setSelectedPost(null); }}
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

                                        {/* 技法タグ */}
                                        <div className="bg-white/5 rounded-2xl p-4 mb-4">
                                            <p className="text-sm text-gray-400 mb-2">使用されたレトリック技法:</p>
                                            {resultTechId ? (
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <TechniqueTag techniqueId={resultTechId} />
                                                    {resultIsWeak && (
                                                        <span className="text-xs bg-red-500/30 text-red-300 px-2 py-0.5 rounded-full">
                                                            弱点技法 ⚡
                                                        </span>
                                                    )}
                                                    {resultIsResist && (
                                                        <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">
                                                            耐性あり 🛡️
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">なし（誠実な投稿）</p>
                                            )}
                                        </div>

                                        {/* 技法の効果説明 */}
                                        {resultTechId && resultTarget && resultTech && (
                                            <div className={`rounded-2xl p-4 mb-4 ${resultTech.bgColor} border ${resultTech.borderColor}`}>
                                                <p className={`text-sm font-bold mb-2 flex items-center gap-2 ${resultTech.textColor}`}>
                                                    <span>💡</span>
                                                    {resultIsWeak
                                                        ? `「${resultTarget.name}」の弱点技法です`
                                                        : resultIsResist
                                                        ? `「${resultTarget.name}」には耐性があります`
                                                        : `「${resultTarget.name}」への影響`
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    {resultIsWeak
                                                        ? `${resultTarget.name}は${resultTech.name}に弱い傾向があります。この技法による影響が通常より大きくなりました。`
                                                        : resultIsResist
                                                        ? `${resultTarget.name}は${resultTech.name}への耐性を持ちます。この技法の効果は抑えられています。`
                                                        : `${resultTech.name}を使用した投稿は${resultTarget.name}に影響を与えました。`
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {/* 誠実投稿メッセージ */}
                                        {!resultTechId && (
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-4">
                                                <p className="text-sm font-bold text-green-300 mb-2 flex items-center gap-2">
                                                    <span>✨</span>誠実な情報発信
                                                </p>
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    操作的な技法を使わない投稿は、短期的な拡散力は低いですが、
                                                    長期的な信頼性の構築に貢献します。
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

                                        {/* SNS反応（スタガー） */}
                                        <div className="bg-white/5 rounded-2xl p-4 mb-4">
                                            <p className="text-sm text-gray-400 mb-3">SNSの反応:</p>
                                            <div className="space-y-2">
                                                {currentResult.snsReactions.map((reaction, i) => (
                                                    <div
                                                        key={i}
                                                        className="text-sm text-gray-300 bg-white/5 rounded-xl px-4 py-2"
                                                        style={{
                                                            opacity: i < visibleReactions ? 1 : 0,
                                                            transform: i < visibleReactions ? 'translateY(0)' : 'translateY(8px)',
                                                            transition: 'opacity 0.3s, transform 0.3s',
                                                        }}
                                                    >
                                                        {reaction}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* ナラティブイベント */}
                                        {narrativeIntros?.followerSurge && currentResult.newFollowers >= 200 && (
                                            <DialogueBox dialogue={narrativeIntros.followerSurge} />
                                        )}
                                        {narrativeIntros?.trustDrop && currentResult.ethicsChange <= -20 && (
                                            <DialogueBox dialogue={narrativeIntros.trustDrop} />
                                        )}

                                        {/* 拡散シミュレーション */}
                                        <SpreadVisualization
                                            result={currentResult}
                                            targetInfo={resultTarget}
                                        />

                                        {/* 批判パネル */}
                                        {showCriticism && !criticismHandled && selectedPost?.criticism && (
                                            <div className="bg-red-500/20 border border-red-500 rounded-2xl p-5 mb-6 animate-fade-in">
                                                <h3 className="font-bold text-red-400 mb-3">⚠️ 批判コメントが届きました</h3>
                                                <p className="text-gray-300 mb-4 text-sm italic">
                                                    「{selectedPost.criticism.text}」
                                                </p>
                                                <p className="text-sm text-gray-400 mb-4">どう対応しますか？</p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {selectedPost.criticism.responses.map(response => (
                                                        <button
                                                            key={response.id}
                                                            onClick={() => handleCriticismResponse(response)}
                                                            className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-left transition-all text-sm text-gray-300"
                                                        >
                                                            {response.text}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 批判対応結果 */}
                                        {criticismHandled && criticismResult && (
                                            <div className={`rounded-2xl p-5 mb-6 animate-fade-in border ${
                                                criticismResult.ethicsChange >= 0
                                                    ? 'bg-green-500/20 border-green-500/50'
                                                    : 'bg-red-500/20 border-red-500/50'
                                            }`}>
                                                <h3 className={`font-bold mb-3 ${criticismResult.ethicsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {criticismResult.ethicsChange >= 0 ? '✨ 信頼性向上' : '💥 信頼性低下'}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className={`rounded-xl p-3 text-center ${criticismResult.followersChange >= 0 ? 'bg-indigo-500/20' : 'bg-red-500/20'}`}>
                                                        <p className="text-xs text-gray-400">フォロワー変化</p>
                                                        <p className={`text-xl font-bold ${criticismResult.followersChange >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
                                                            {criticismResult.followersChange >= 0 ? '+' : ''}{criticismResult.followersChange}
                                                        </p>
                                                    </div>
                                                    <div className={`rounded-xl p-3 text-center ${criticismResult.ethicsChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                        <p className="text-xs text-gray-400">信頼性変化</p>
                                                        <p className={`text-xl font-bold ${criticismResult.ethicsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {criticismResult.ethicsChange >= 0 ? '+' : ''}{criticismResult.ethicsChange}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 低信頼性警告 */}
                                        {reliability <= 40 && (
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
                                            {roundIndex < rounds.length - 1 ? '次のラウンドへ' : '完了'}
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
