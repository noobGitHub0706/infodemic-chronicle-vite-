import { useEffect, useState } from 'react';
import { DialogueBox } from '../../common/DialogueBox';
import { QUIZ_REACTIONS } from '../../data/narrative';

/**
 * 連続正解ストリーク表示
 *
 * @param {number} streak - 現在の連続正解数
 * @param {boolean} justBroke - 直前でストリークが切れた場合true
 */
export const ComboSystem = ({ streak, justBroke }) => {
    const [announcement, setAnnouncement] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let dialogue = null;

        if (justBroke) {
            dialogue = QUIZ_REACTIONS.combo.streakBroken;
        } else if (streak === 5) {
            dialogue = QUIZ_REACTIONS.combo.streak5;
        } else if (streak === 3) {
            dialogue = QUIZ_REACTIONS.combo.streak3;
        }

        if (dialogue) {
            setAnnouncement(dialogue);
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(t);
        }
    }, [streak, justBroke]);

    if (!announcement || !visible) return null;

    return (
        <div className="animate-fade-in">
            <DialogueBox dialogue={announcement} />
        </div>
    );
};

/**
 * ヘッダー表示用ストリークバッジ
 * RhetoricQuizのヘッダーに埋め込む小コンポーネント
 *
 * @param {number} streak
 */
export const StreakBadge = ({ streak }) => {
    if (streak < 2) return null;

    const color = streak >= 5
        ? 'text-yellow-300 bg-yellow-500/20'
        : streak >= 3
            ? 'text-orange-300 bg-orange-500/20'
            : 'text-red-300 bg-red-500/20';

    return (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${color} animate-pulse`}>
            🔥 {streak}連続正解!
        </span>
    );
};
