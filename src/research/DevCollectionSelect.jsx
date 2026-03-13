import { useState } from 'react';

const PRESETS = [
    { value: 'sessions',      label: 'sessions',      desc: '本番用' },
    { value: 'sessions_test', label: 'sessions_test', desc: 'テスト用' },
    { value: 'sessions_dev',  label: 'sessions_dev',  desc: '開発用' },
];

export const DevCollectionSelect = ({ onSelect }) => {
    const [selected, setSelected] = useState('sessions_dev');
    const [customValue, setCustomValue] = useState('');

    const isCustom = selected === 'custom';
    const resolvedName = isCustom ? customValue.trim() : selected;
    const isValid = resolvedName.length > 0;

    const handleStart = () => {
        if (!isValid) return;
        onSelect(resolvedName);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && isValid) handleStart();
    };

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="max-w-md w-full animate-fade-in">
                <div className="glass rounded-3xl p-8">
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-3">🔧</div>
                        <h1 className="text-xl font-bold mb-1">開発者設定</h1>
                        <p className="text-gray-400 text-sm">データ保存先コレクションを選択してください</p>
                    </div>

                    <div className="space-y-3 mb-6">
                        {PRESETS.map(({ value, label, desc }) => (
                            <button
                                key={value}
                                onClick={() => setSelected(value)}
                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                                    selected === value
                                        ? 'border-indigo-500 bg-indigo-500/20'
                                        : 'border-white/10 bg-white/5 hover:border-white/30'
                                }`}
                            >
                                <span className="font-mono font-bold text-sm">{label}</span>
                                <span className="text-gray-400 text-xs ml-3">{desc}</span>
                            </button>
                        ))}

                        {/* カスタム入力 */}
                        <button
                            onClick={() => setSelected('custom')}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                                isCustom
                                    ? 'border-indigo-500 bg-indigo-500/20'
                                    : 'border-white/10 bg-white/5 hover:border-white/30'
                            }`}
                        >
                            <span className="font-bold text-sm">カスタム</span>
                            <span className="text-gray-400 text-xs ml-3">任意のコレクション名</span>
                        </button>

                        {isCustom && (
                            <input
                                type="text"
                                value={customValue}
                                onChange={e => setCustomValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="コレクション名を入力..."
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                autoFocus
                            />
                        )}
                    </div>

                    {/* 保存先プレビュー */}
                    <div className="bg-black/30 rounded-xl px-4 py-3 mb-6 text-xs font-mono text-gray-400">
                        保存先:{' '}
                        <span className={isValid ? 'text-indigo-300' : 'text-gray-600'}>
                            {isValid ? resolvedName : '...'}
                        </span>
                        <span className="text-gray-600">/{'{sessionId}'}</span>
                    </div>

                    <button
                        onClick={handleStart}
                        disabled={!isValid}
                        className={`w-full font-bold py-4 rounded-2xl text-lg transition-all ${
                            isValid
                                ? 'btn-primary text-white'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        開始
                    </button>
                </div>
            </div>
        </div>
    );
};
