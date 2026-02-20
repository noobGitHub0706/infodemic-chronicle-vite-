
export const DataExport = ({ gameData, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [format, setFormat] = useState('json'); // json or csv

    const jsonString = JSON.stringify(gameData, null, 2);

    // CSV形式に変換（フラット化）
    const generateCSV = () => {
        const flatData = {
            // 基本情報
            session_id: gameData.sessionId,
            participant_id: gameData.participant?.id || '',
            experiment_condition: gameData.experimentCondition || '',
            version: gameData.version,
            
            // デモグラフィック
            age_group: gameData.participant?.demographics?.ageGroup || '',
            gender: gameData.participant?.demographics?.gender || '',
            sns_frequency: gameData.participant?.demographics?.snsFrequency || '',
            health_info_source: gameData.participant?.demographics?.healthInfoSource || '',
            
            // プレイ完了率
            progress_consent: gameData.progress?.consentCompleted ? 1 : 0,
            progress_intro: gameData.progress?.introCompleted ? 1 : 0,
            progress_stage1_start: gameData.progress?.stage1Started ? 1 : 0,
            progress_stage1_complete: gameData.progress?.stage1Completed ? 1 : 0,
            progress_stage2_intro: gameData.progress?.stage2IntroCompleted ? 1 : 0,
            progress_stage3_start: gameData.progress?.stage3Started ? 1 : 0,
            progress_stage3_complete: gameData.progress?.stage3Completed ? 1 : 0,
            progress_debrief: gameData.progress?.debriefViewed ? 1 : 0,
            progress_survey_start: gameData.progress?.surveyStarted ? 1 : 0,
            progress_survey_complete: gameData.progress?.surveyCompleted ? 1 : 0,
            progress_fully_completed: gameData.progress?.fullyCompleted ? 1 : 0,
            
            // 時間
            consent_time: gameData.timestamps?.consentTime || '',
            game_start_time: gameData.timestamps?.gameStartTime || '',
            completion_time: gameData.timestamps?.completionTime || '',
            total_duration_sec: gameData.durations?.total || '',
            stage1_duration_sec: gameData.durations?.stage1 || '',
            stage2_intro_duration_sec: gameData.durations?.stage2Intro || '',
            stage3_duration_sec: gameData.durations?.stage3 || '',
            survey_duration_sec: gameData.durations?.survey || '',
            
            // Stage1結果
            stage1_score: gameData.stage1?.score || '',
            stage1_accuracy: gameData.stage1?.accuracy || '',
            stage1_correct_count: gameData.stage1?.correctCount || '',
            stage1_total_questions: gameData.stage1?.totalQuestions || '',
            stage1_weak_techniques: gameData.stage1?.weakTechniques?.join(';') || '',
            
            // Stage3結果
            stage3_final_followers: gameData.stage3?.finalFollowers || '',
            stage3_final_ethics: gameData.stage3?.finalEthics || '',
            stage3_ethical_post_count: gameData.stage3?.ethicalPostCount || '',
            stage3_total_rounds: gameData.stage3?.totalRounds || '',
            stage3_title: gameData.stage3?.title || '',
            stage3_suspended: gameData.stage3?.suspended ? 1 : 0,
            stage3_suspended_at_round: gameData.stage3?.suspendedAtRound || '',
            
            // 拡散影響
            spread_total_reach: gameData.stage3?.spreadImpact?.totalReach || '',
            spread_total_believers: gameData.stage3?.spreadImpact?.totalBelievers || '',
            
            // 事後アンケート
            survey_enjoyment: gameData.survey?.enjoyment || '',
            survey_understanding: gameData.survey?.understanding || '',
            survey_behavior_change: gameData.survey?.behaviorChange || '',
            survey_difficulty: gameData.survey?.difficulty || '',
            survey_recommendation: gameData.survey?.recommendation || '',
            survey_free_comment: gameData.survey?.freeComment || ''
        };

        // Stage1の各問題の回答
        if (gameData.stage1?.answers) {
            gameData.stage1.answers.forEach((answer, i) => {
                flatData[`s1_q${i + 1}_correct`] = answer.correct ? 1 : 0;
                flatData[`s1_q${i + 1}_techniques`] = answer.techniques?.join(';') || '';
            });
        }

        // Stage3の各ラウンドの選択
        if (gameData.stage3?.rounds) {
            gameData.stage3.rounds.forEach((round, i) => {
                flatData[`s3_r${i + 1}_target`] = round.target || '';
                flatData[`s3_r${i + 1}_techniques`] = round.techniques?.join(';') || '';
                flatData[`s3_r${i + 1}_followers`] = round.newFollowers || '';
                flatData[`s3_r${i + 1}_ethics`] = round.ethicsChange || '';
            });
        }

        const headers = Object.keys(flatData);
        const values = Object.values(flatData);
        
        return headers.join(',') + '\n' + values.map(v => `"${v}"`).join(',');
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

// メインアプリ
