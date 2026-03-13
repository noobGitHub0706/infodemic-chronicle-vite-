import { useState } from 'react';
import { DEV_MODE } from '../App';

const COLLECTION_PRESETS = ['sessions', 'sessions_test', 'sessions_dev'];

export const DataExport = ({ gameData, onClose, collectionName, onCollectionChange }) => {
    const [copied, setCopied] = useState(false);
    const [format, setFormat] = useState('json'); // json or csv

    const jsonString = JSON.stringify(gameData, null, 2);

    // CSV形式に変換（1行フラット）
    const generateCSV = () => {
        // 転移テスト回答を questionId ごとの列に展開
        const expandAnswers = (answers, prefix) => {
            const obj = {};
            (answers || []).forEach(a => {
                obj[`${prefix}_${a.questionId}_rating`] = a.rating ?? '';
                obj[`${prefix}_${a.questionId}_rt_ms`] = a.responseTimeMs ?? '';
            });
            return obj;
        };

        const flatData = {
            // 基本情報
            session_id: gameData.sessionId || '',
            condition: gameData.condition || '',
            test_set_order: gameData.testSetOrder || '',
            started_at: gameData.startedAt || '',
            completed_at: gameData.completedAt || '',
            total_duration_ms: gameData.totalDurationMs ?? '',

            // デモグラフィック
            age: gameData.demographics?.age ?? '',
            gender: gameData.demographics?.gender ?? '',
            sns_usage: gameData.demographics?.snsUsage ?? '',
            health_info_source: gameData.demographics?.healthInfoSource ?? '',

            // 転移テスト（事前）
            pre_mean_score: gameData.preTest?.meanScore ?? '',
            ...expandAnswers(gameData.preTest?.answers, 'pre_q'),

            // ゲーム
            game_total_score: gameData.game?.totalScore ?? '',
            game_ending_type: gameData.game?.endingType ?? '',
            game_final_progress: gameData.game?.investigation?.finalProgress ?? '',
            game_members_found: gameData.game?.investigation?.membersFound ?? '',
            game_bosses_defeated: gameData.game?.investigation?.bossesDefeated ?? '',
            ...[1, 2, 3].reduce((acc, n) => {
                const ch = gameData.game?.chapters?.find(c => c.chapter === n);
                acc[`ch${n}_boss_defeated`] = ch?.bossResult?.defeated ? 1 : (ch ? 0 : '');
                acc[`ch${n}_boss_rt_ms`] = ch?.bossResult?.responseTimeMs ?? '';
                acc[`ch${n}_duration_ms`] = ch?.duration ?? '';
                return acc;
            }, {}),

            // 転移テスト（事後）
            post_mean_score: gameData.postTest?.meanScore ?? '',
            ...expandAnswers(gameData.postTest?.answers, 'post_q'),

            // スコア変化
            score_change: gameData.scoreChange ?? '',

            // アンケート
            survey_enjoyment: gameData.survey?.enjoyment ?? '',
            survey_difficulty: gameData.survey?.difficulty ?? '',
            survey_learning: gameData.survey?.learning ?? '',
            survey_recommendation: gameData.survey?.recommendation ?? '',
        };

        const headers = Object.keys(flatData);
        const values = Object.values(flatData).map(v =>
            `"${String(v).replace(/"/g, '""')}"`
        );

        return headers.join(',') + '\n' + values.join(',');
    };

    const currentData = format === 'json' ? jsonString : generateCSV();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(currentData);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = currentData;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        const mimeType = format === 'json' ? 'application/json' : 'text/csv';
        const extension = format === 'json' ? 'json' : 'csv';
        const blob = new Blob([currentData], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infodemic_chronicle_${gameData.sessionId}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">📊 プレイデータ</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* DEV_MODE: コレクション切り替え */}
                {DEV_MODE && collectionName && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <p className="text-xs text-yellow-400 mb-2 font-mono">🔧 保存先コレクション</p>
                        <div className="flex flex-wrap gap-2">
                            {COLLECTION_PRESETS.map(name => (
                                <button
                                    key={name}
                                    onClick={() => onCollectionChange?.(name)}
                                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                                        collectionName === name
                                            ? 'bg-yellow-500 text-black font-bold'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* フォーマット切り替え */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setFormat('json')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            format === 'json'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        JSON
                    </button>
                    <button
                        onClick={() => setFormat('csv')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            format === 'csv'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        CSV（1行形式）
                    </button>
                </div>

                <div className="bg-black/30 rounded-xl p-4 mb-6 flex-1 overflow-auto scrollbar-hide">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                        {currentData}
                    </pre>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleCopy}
                        className={`flex-1 font-bold py-3 px-6 rounded-xl transition-all ${
                            copied
                                ? 'bg-green-500 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                    >
                        {copied ? '✓ コピーしました' : '📋 コピー'}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 btn-primary text-white font-bold py-3 px-6 rounded-xl"
                    >
                        💾 ダウンロード
                    </button>
                </div>
            </div>
        </div>
    );
};
