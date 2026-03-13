import { CHARACTERS } from '../../data/narrative';

/**
 * 汎用ダイアログボックス
 *
 * dialogue.type:
 *   'boss'   — 黒田のセリフ（🍵アイコン + glassカード）
 *   'system' — システムメッセージ（中央揃え・イタリック）
 *   'title'  — セクション見出し風（大きめテキスト）
 */
export const DialogueBox = ({ dialogue }) => {
    if (!dialogue) return null;

    if (dialogue.type === 'system') {
        return (
            <div className="text-center text-gray-400 text-sm my-4 whitespace-pre-line italic px-4 animate-fade-in">
                {dialogue.text}
            </div>
        );
    }

    if (dialogue.type === 'title') {
        return (
            <div className="text-center my-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-1">{dialogue.text}</h2>
                {dialogue.subtitle && (
                    <p className="text-gray-400 text-sm">{dialogue.subtitle}</p>
                )}
            </div>
        );
    }

    if (dialogue.type === 'boss') {
        return (
            <div className="glass p-4 rounded-2xl my-3 flex gap-3 items-start animate-fade-in border border-white/10">
                <div className="text-2xl shrink-0 mt-0.5" aria-hidden="true">🍵</div>
                <div className="flex-1 min-w-0">
                    <div className="text-xs text-purple-400 font-bold mb-1.5 tracking-wide">
                        {CHARACTERS.boss.name}
                    </div>
                    <div className="text-gray-100 text-sm whitespace-pre-line leading-relaxed">
                        {dialogue.text}
                    </div>
                </div>
            </div>
        );
    }

    // フォールバック: typeなし or 未知typeはテキストのみ
    return (
        <div className="text-gray-300 text-sm whitespace-pre-line leading-relaxed my-2 animate-fade-in">
            {dialogue.text}
        </div>
    );
};
