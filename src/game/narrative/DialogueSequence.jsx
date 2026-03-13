import { useState } from 'react';
import { DialogueBox } from './DialogueBox';

/**
 * セリフ配列を順次表示する共通コンポーネント
 *
 * @param {Array}    dialogues   - DialogueオブジェクトArray
 * @param {Function} onComplete  - 全セリフ表示後のコールバック
 * @param {string}   buttonLabel - 最後のボタンラベル（デフォルト '次へ'）
 * @param {boolean}  showSkip    - スキップボタンを表示するか（デフォルト true）
 */
export const DialogueSequence = ({
    dialogues,
    onComplete,
    buttonLabel = '次へ',
    showSkip = true,
}) => {
    const [index, setIndex] = useState(0);

    if (!dialogues || dialogues.length === 0) {
        onComplete?.();
        return null;
    }

    const handleNext = () => {
        if (index < dialogues.length - 1) {
            setIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const isLast = index >= dialogues.length - 1;

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass rounded-3xl p-6 md:p-8">
                    {showSkip && (
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={onComplete}
                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
                            >
                                スキップ →
                            </button>
                        </div>
                    )}
                    <DialogueBox dialogue={dialogues[index]} />
                    <button
                        onClick={handleNext}
                        className="w-full mt-4 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                    >
                        {isLast ? buttonLabel : '次へ'}
                    </button>
                </div>
            </div>
        </div>
    );
};
