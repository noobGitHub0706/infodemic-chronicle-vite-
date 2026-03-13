import { useState, useEffect } from 'react';

/**
 * 判定後の投稿状態変化アニメーション
 *
 * reactionType:
 *   'flaggedCorrectly' - ⚠️検証中 → いいね減少 → グレーアウト
 *   'missed'           - いいね急増 → 拡散数カウントアップ
 *   'falseFlagged'     - 非表示 → 異議申し立て → 復元
 *   'cleared'          - ✓ 問題なし（変化なし）
 *
 * @param {string} reactionType
 * @param {object} reactionData - questions.reactions の対応データ
 * @param {string} account
 * @param {string} accountId
 * @param {string} text
 */
export const PostReaction = ({ reactionType, reactionData, account, accountId, text }) => {
    const [step, setStep] = useState(0);
    const [displayLikes, setDisplayLikes] = useState(0);
    const [displayRetweets, setDisplayRetweets] = useState(0);

    useEffect(() => {
        if (!reactionData || reactionType === 'cleared') return;

        // step 0 → 1 → 2 の自動遷移
        const t1 = setTimeout(() => setStep(1), 600);
        const t2 = setTimeout(() => setStep(2), 1500);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [reactionData, reactionType]);

    // いいねカウントアニメーション
    useEffect(() => {
        if (!reactionData) return;
        const target = reactionType === 'flaggedCorrectly'
            ? Math.abs(reactionData.likeChange || 0)
            : (reactionData.likeChange || 0);
        if (target === 0) return;

        let current = 0;
        const steps = 15;
        const increment = target / steps;
        const interval = setInterval(() => {
            current = Math.min(current + increment, target);
            setDisplayLikes(Math.round(current));
            if (current >= target) clearInterval(interval);
        }, 60);
        return () => clearInterval(interval);
    }, [step, reactionData, reactionType]);

    useEffect(() => {
        if (!reactionData) return;
        const target = Math.abs(reactionData.retweetChange || 0);
        if (target === 0) return;

        let current = 0;
        const steps = 12;
        const increment = target / steps;
        const interval = setInterval(() => {
            current = Math.min(current + increment, target);
            setDisplayRetweets(Math.round(current));
            if (current >= target) clearInterval(interval);
        }, 70);
        return () => clearInterval(interval);
    }, [step, reactionData, reactionType]);

    if (!reactionData && reactionType !== 'cleared') return null;

    // ==============================
    // cleared: 変化なし
    // ==============================
    if (reactionType === 'cleared') {
        return (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 font-bold text-sm">✓ 正常な投稿として記録</span>
                </div>
                <PostTextPreview account={account} accountId={accountId} text={text} />
                <div className="text-xs text-gray-500 mt-2 text-center">
                    この投稿には問題点が確認されませんでした
                </div>
            </div>
        );
    }

    // ==============================
    // flaggedCorrectly: 正しくフラグ
    // ==============================
    if (reactionType === 'flaggedCorrectly') {
        const statusLabels = ['', '⚠️ 検証中...', '📉 信頼性低下'];
        return (
            <div className={`rounded-2xl border-2 p-4 mb-4 transition-all duration-700 ${
                step >= 2
                    ? 'border-gray-500/40 bg-gray-800/60 opacity-60'
                    : step >= 1
                        ? 'border-orange-500/60 bg-orange-500/10'
                        : 'border-white/20 bg-white/5'
            }`}>
                {step >= 1 && (
                    <div className="flex items-center gap-2 mb-2 animate-fade-in">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            step >= 2
                                ? 'bg-gray-600/50 text-gray-400'
                                : 'bg-orange-500/30 text-orange-300'
                        }`}>
                            {statusLabels[step]}
                        </span>
                        {step >= 2 && (
                            <span className="text-xs text-gray-500">
                                拡散ブロック: {(reactionData.spreadBlocked || 0).toLocaleString()}件
                            </span>
                        )}
                    </div>
                )}
                <PostTextPreview
                    account={account}
                    accountId={accountId}
                    text={text}
                    dimmed={step >= 2}
                />
                {step >= 1 && (
                    <div className="flex gap-4 mt-2 text-sm animate-fade-in">
                        <span className="text-red-400">
                            ❤️ -{displayLikes.toLocaleString()}
                        </span>
                        <span className="text-red-400">
                            🔁 -{displayRetweets.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    // ==============================
    // missed: 見逃し → 拡散
    // ==============================
    if (reactionType === 'missed') {
        return (
            <div className={`rounded-2xl border-2 p-4 mb-4 transition-all duration-700 ${
                step >= 2
                    ? 'border-red-500/60 bg-red-500/10'
                    : step >= 1
                        ? 'border-yellow-500/40 bg-yellow-500/5'
                        : 'border-white/20 bg-white/5'
            }`}>
                {step >= 1 && (
                    <div className="flex items-center gap-2 mb-2 animate-fade-in">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/30 text-red-300">
                            🚨 拡散中
                        </span>
                    </div>
                )}
                <PostTextPreview account={account} accountId={accountId} text={text} />
                {step >= 1 && (
                    <div className="flex gap-4 mt-2 text-sm animate-fade-in">
                        <span className="text-green-400">
                            ❤️ +{displayLikes.toLocaleString()}
                        </span>
                        <span className="text-green-400">
                            🔁 +{displayRetweets.toLocaleString()}
                        </span>
                    </div>
                )}
                {step >= 2 && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in">
                        <p className="text-xs text-red-300">
                            😟 {(reactionData.believedCount || 0).toLocaleString()}人が影響を受けた可能性があります
                        </p>
                        <p className="text-xs text-red-400 mt-1">
                            拡散数: {(reactionData.spreadReached || 0).toLocaleString()}件
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // ==============================
    // falseFlagged: 誤フラグ
    // ==============================
    if (reactionType === 'falseFlagged') {
        const steps = ['', '🚫 非表示処理中...', '✋ 異議申し立てを受理', '🔄 投稿を復元'];
        return (
            <div className={`rounded-2xl border-2 p-4 mb-4 transition-all duration-700 ${
                step >= 2
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : step >= 1
                        ? 'border-gray-500/40 bg-gray-800/50 opacity-40'
                        : 'border-white/20 bg-white/5'
            }`}>
                {step >= 1 && (
                    <div className="flex items-center gap-2 mb-2 animate-fade-in">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            step >= 2
                                ? 'bg-blue-500/30 text-blue-300'
                                : 'bg-gray-600/50 text-gray-400'
                        }`}>
                            {steps[step] || steps[steps.length - 1]}
                        </span>
                    </div>
                )}
                <PostTextPreview
                    account={account}
                    accountId={accountId}
                    text={text}
                    dimmed={step === 1}
                />
                {step >= 2 && reactionData.complaintCount > 0 && (
                    <div className="mt-2 text-xs text-orange-300 animate-fade-in">
                        ⚠️ 異議申し立て {reactionData.complaintCount}件
                    </div>
                )}
            </div>
        );
    }

    return null;
};

// ============================================================
// 内部: 投稿テキストプレビュー
// ============================================================

const PostTextPreview = ({ account, accountId, text, dimmed = false }) => (
    <div className={`transition-opacity duration-500 ${dimmed ? 'opacity-40' : 'opacity-100'}`}>
        <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold shrink-0">
                {account?.charAt(0) || '?'}
            </div>
            <div>
                <p className="text-sm font-medium text-white leading-tight">{account}</p>
                <p className="text-xs text-gray-500">{accountId}</p>
            </div>
        </div>
        <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed line-clamp-3">
            {text}
        </p>
    </div>
);
