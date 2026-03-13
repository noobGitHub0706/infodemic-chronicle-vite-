import { useEffect, useState } from 'react';

const CHAPTER_INFO = {
    1: { number: '第1章', title: '配属初日', subtitle: 'レトリックを見破る', color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    2: { number: '第2章', title: '潜入調査', subtitle: '操作する心理を学ぶ', color: 'text-purple-400', glow: 'shadow-purple-500/20' },
    3: { number: '第3章', title: '最終決戦', subtitle: '真実を解き明かす', color: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
};

/**
 * 章間アニメーション
 *
 * @param {number}   chapter    - 遷移先の章番号 (1 | 2 | 3)
 * @param {Function} onComplete - アニメーション完了コールバック（自動）
 */
export const ChapterTransition = ({ chapter, onComplete }) => {
    const [phase, setPhase] = useState('hidden'); // hidden | visible | exit

    useEffect(() => {
        const t0 = setTimeout(() => setPhase('visible'), 50);
        const t1 = setTimeout(() => setPhase('exit'), 2400);
        const t2 = setTimeout(() => onComplete(), 2900);
        return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
    }, [onComplete]);

    const info = CHAPTER_INFO[chapter] ?? {
        number: `第${chapter}章`,
        title: '',
        subtitle: '',
        color: 'text-white',
        glow: '',
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 transition-opacity duration-500 ${
                phase === 'hidden' || phase === 'exit' ? 'opacity-0' : 'opacity-100'
            }`}
        >
            <div
                className={`text-center transition-all duration-500 ${
                    phase === 'visible' ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
            >
                {/* 章番号バッジ */}
                <div className={`inline-block px-4 py-1.5 rounded-full border mb-4 text-sm font-bold tracking-widest ${info.color} border-current`}>
                    {info.number}
                </div>

                {/* タイトル */}
                <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
                    {info.title}
                </h1>

                {/* サブタイトル */}
                <p className={`text-lg ${info.color} font-medium`}>
                    {info.subtitle}
                </p>

                {/* 進捗ドット */}
                <div className="mt-8 flex justify-center gap-2">
                    {[1, 2, 3].map(n => (
                        <div
                            key={n}
                            className={`rounded-full transition-all duration-300 ${
                                n === chapter
                                    ? `w-6 h-3 ${info.color.replace('text-', 'bg-')}`
                                    : n < chapter
                                        ? `w-3 h-3 bg-white/50`
                                        : `w-3 h-3 bg-white/15`
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
