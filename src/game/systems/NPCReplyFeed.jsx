import { useState, useEffect } from 'react';

/**
 * 判定後にNPCリプライを順次フェードイン表示
 *
 * @param {Array} replies - [{ account, text }] 形式
 * @param {number} delayMs - 1リプライあたりの表示間隔（デフォルト 600ms）
 */
export const NPCReplyFeed = ({ replies, delayMs = 600 }) => {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        if (!replies || replies.length === 0) return;

        setVisibleCount(0);
        const timers = replies.map((_, i) =>
            setTimeout(() => setVisibleCount(i + 1), delayMs * (i + 1))
        );
        return () => timers.forEach(clearTimeout);
    }, [replies, delayMs]);

    if (!replies || replies.length === 0) return null;

    return (
        <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-500 font-medium">💬 SNSの反応</span>
                <div className="flex-1 h-px bg-white/10" />
            </div>
            {replies.slice(0, visibleCount).map((reply, i) => (
                <ReplyCard key={i} reply={reply} index={i} />
            ))}
        </div>
    );
};

const ReplyCard = ({ reply, index }) => (
    <div
        className="animate-fade-in flex gap-2 p-3 rounded-xl bg-white/5 border border-white/10"
        style={{ animationDelay: `${index * 50}ms` }}
    >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs shrink-0 font-bold">
            {reply.account?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-indigo-300 font-medium leading-tight mb-1">
                {reply.account}
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
                {reply.text}
            </p>
        </div>
    </div>
);
