import { useRef, useCallback } from 'react';

// ============================================================
// useResearchData
// ゲーム内イベントを時系列で蓄積する研究データフック。
// Firebase保存は行わず、getResearchData() で全データを返す。
//
// 使い方:
//   const { recordEvent, getResearchData } = useResearchData(sessionId);
//   recordEvent('quiz_answer', { chapter: 1, questionId: 'q1', ... });
//   const data = getResearchData(); // → { sessionId, events: [...], summary: {...} }
// ============================================================

// 有効なイベントタイプ一覧
const VALID_EVENT_TYPES = new Set([
    'quiz_answer',
    'quiz_criticism',
    'influencer_action',
    'factcheck_result',
    'investigation_update',
    'chapter_complete',
    'game_complete',
]);

export const useResearchData = (sessionId) => {
    const eventsRef = useRef([]);
    const startTimeRef = useRef(new Date().toISOString());

    // イベントを記録する
    const recordEvent = useCallback((eventType, data) => {
        if (!VALID_EVENT_TYPES.has(eventType)) {
            console.warn(`[useResearchData] 未知のイベントタイプ: ${eventType}`);
        }
        eventsRef.current.push({
            eventType,
            timestamp: new Date().toISOString(),
            ...data,
        });
    }, []);

    // 全記録データをオブジェクトとして返す
    const getResearchData = useCallback(() => {
        const events = eventsRef.current;
        return {
            sessionId,
            recordingStartedAt: startTimeRef.current,
            events,
            summary: buildSummary(events),
        };
    }, [sessionId]);

    return { recordEvent, getResearchData };
};

// ============================================================
// サマリー生成（getResearchData内で自動計算）
// ============================================================

function buildSummary(events) {
    const quizAnswers   = events.filter(e => e.eventType === 'quiz_answer');
    const criticisms    = events.filter(e => e.eventType === 'quiz_criticism');
    const influencerActs = events.filter(e => e.eventType === 'influencer_action');
    const factchecks    = events.filter(e => e.eventType === 'factcheck_result');
    const chapterDones  = events.filter(e => e.eventType === 'chapter_complete');
    const gameComplete  = events.find(e => e.eventType === 'game_complete') || null;

    // クイズ正答率
    const quizTotal   = quizAnswers.length;
    const quizCorrect = quizAnswers.filter(a => a.isCorrect).length;
    const quizAccuracy = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : null;

    // 技法ごとの正答率
    const techniqueStats = {};
    quizAnswers.forEach(a => {
        (a.correctTechniques || []).forEach(tech => {
            if (!techniqueStats[tech]) techniqueStats[tech] = { total: 0, correct: 0 };
            techniqueStats[tech].total += 1;
            if (a.isCorrect) techniqueStats[tech].correct += 1;
        });
    });

    // 批判イベントの選択分布
    const criticismChoices = {};
    criticisms.forEach(c => {
        criticismChoices[c.choiceId] = (criticismChoices[c.choiceId] || 0) + 1;
    });

    // ファクトチェック総スコア
    const factcheckTotalScore = factchecks.reduce((sum, f) => sum + (f.totalScore || 0), 0);

    // インフルエンサーの累積倫理変化
    const influencerEthicsTotal = influencerActs.reduce((sum, a) => sum + (a.ethicsChange || 0), 0);

    return {
        quizTotal,
        quizCorrect,
        quizAccuracy,
        techniqueStats,
        criticismEventCount: criticisms.length,
        criticismChoices,
        influencerActionCount: influencerActs.length,
        influencerEthicsTotal,
        factcheckScenariosCompleted: factchecks.length,
        factcheckTotalScore,
        chaptersCompleted: chapterDones.map(c => c.chapter),
        gameComplete: gameComplete ? {
            totalScore:            gameComplete.totalScore,
            endingType:            gameComplete.endingType,
            bossesDefeated:        gameComplete.bossesDefeated,
            investigationProgress: gameComplete.investigationProgress,
            totalDurationMs:       gameComplete.totalDurationMs,
        } : null,
    };
}
