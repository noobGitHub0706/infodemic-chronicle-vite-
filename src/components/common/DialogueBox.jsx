import { CHARACTERS } from '../../data/narrative';

export const DialogueBox = ({ dialogue }) => {
    if (!dialogue) return null;

    if (dialogue.type === 'system') {
        return (
            <div className="text-center text-gray-400 text-sm my-4 whitespace-pre-line italic px-4">
                {dialogue.text}
            </div>
        );
    }

    if (dialogue.type === 'boss') {
        return (
            <div className="glass p-4 rounded-xl my-3 flex gap-3 items-start">
                <div className="text-2xl shrink-0">🍵</div>
                <div>
                    <div className="text-xs text-purple-400 font-bold mb-1">
                        {CHARACTERS.boss.name}
                    </div>
                    <div className="text-gray-200 text-sm whitespace-pre-line leading-relaxed">
                        {dialogue.text}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
