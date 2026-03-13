import { useState, useEffect } from 'react';
import { ConsentScreen } from './ConsentScreen';
import { TransferTest } from './TransferTest';
import { ReadingTask } from './ReadingTask';
import { PostSurvey } from './PostSurvey';
import { CompletionScreen } from './CompletionScreen';
import { DataExport } from './DataExport';
import { useFirebase } from '../hooks/useFirebase';
import { GameEngine } from '../game/GameEngine';

// ResearchFlow: 研究手続きオーケストレーター
// phase props: 'consent' | 'preTest' | 'game' | 'postTest' | 'survey' | 'complete'
// sessionId: App.jsx で生成した共有ID（GameEngine と同じドキュメントに書き込む）
export const ResearchFlow = ({ sessionId, phase, onPhaseChange, collectionName = 'sessions', onCollectionChange }) => {
    const { saveToFirebase, mergeDoc } = useFirebase(sessionId, collectionName);

    const [experimentCondition] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('condition') || null;
    });
    const [testSetOrder] = useState(() => {
        const randomValue = Math.random();
        return randomValue < 0.5 ? { pre: 'A', post: 'B' } : { pre: 'B', post: 'A' };
    });

    // 研究データ
    const [participantInfo, setParticipantInfo] = useState(null);
    const [preTestData, setPreTestData] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const [postTestData, setPostTestData] = useState(null);
    const [readingTaskData, setReadingTaskData] = useState(null);
    const [surveyData, setSurveyData] = useState(null);
    const [showDataExport, setShowDataExport] = useState(false);

    // 対照群の読解課題は ResearchFlow 内部フェーズで管理
    const [internalPhase, setInternalPhase] = useState(null);

    const [progress, setProgress] = useState({
        consentCompleted: false,
        preTestCompleted: false,
        readingTaskCompleted: false,
        postTestCompleted: false,
        surveyStarted: false,
        surveyCompleted: false,
        fullyCompleted: false
    });

    const [timestamps, setTimestamps] = useState({
        consentTime: null,
        preTestStartTime: null,
        preTestEndTime: null,
        readingTaskStartTime: null,
        readingTaskEndTime: null,
        gameStartTime: null,
        gameEndTime: null,
        postTestStartTime: null,
        postTestEndTime: null,
        surveyStartTime: null,
        surveyEndTime: null,
        completionTime: null
    });

    // ゲーム終了時刻を記録
    useEffect(() => {
        if (gameResult && phase === 'postTest' && !timestamps.gameEndTime) {
            const now = gameResult.endTime || new Date().toISOString();
            setTimestamps(prev => ({
                ...prev,
                gameEndTime: now,
                postTestStartTime: now
            }));
        }
    }, [gameResult, phase]);

    // ページ離脱警告
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (phase === 'consent' || phase === 'complete') return;
            e.preventDefault();
            e.returnValue = 'ゲームの進行状況が失われます。本当にページを離れますか？';
            return e.returnValue;
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [phase]);

    // 同意完了
    const handleConsent = (consentData) => {
        const participantId = consentData.participantId || `auto_${sessionId}`;
        setParticipantInfo({ id: participantId, demographics: consentData.demographics });

        const consentTime = new Date().toISOString();
        setTimestamps(prev => ({ ...prev, consentTime, preTestStartTime: consentTime }));
        setProgress(prev => ({ ...prev, consentCompleted: true }));

        // spec: sessions/{sessionId} に同意情報を保存
        mergeDoc({
            condition: experimentCondition,
            testSetOrder,
            demographics: consentData.demographics || null,
            participantId,
            startedAt: consentTime,
            status: 'consent_complete',
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
        });

        onPhaseChange('preTest');
    };

    // 事前テスト完了
    const handlePreTestComplete = (data) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({ ...prev, preTestEndTime: endTime }));
        setPreTestData(data);
        setProgress(prev => ({ ...prev, preTestCompleted: true }));

        // spec: sessions/{sessionId}/preTest
        saveToFirebase('preTest', {
            testSet: data.testSet,
            completedAt: endTime,
            answers: Object.entries(data.responses).map(([id, resp]) => ({
                postId: id,
                rating: resp.rating,
                manipulative: resp.manipulative,
                techniques: resp.techniques,
                style: resp.style,
                topic: resp.topic
            }))
        });

        if (experimentCondition === 'control') {
            setTimestamps(prev => ({ ...prev, readingTaskStartTime: endTime }));
            setInternalPhase('readingTask');
        } else {
            setTimestamps(prev => ({ ...prev, gameStartTime: endTime }));
            mergeDoc({ status: 'game_started', gameStartTime: endTime });
            onPhaseChange('game');
        }
    };

    // ゲーム完了（実験群）
    const handleGameComplete = (gameData) => {
        const endTime = gameData.endTime || new Date().toISOString();
        setGameResult(gameData);
        setTimestamps(prev => ({
            ...prev,
            gameEndTime: endTime,
            postTestStartTime: endTime
        }));

        // GameEngine が mergeDoc で保存済みだが、研究レイヤー側でも status を確定
        mergeDoc({
            gameData,
            endingType: gameData.endingType || null,
            status: 'game_complete',
        });

        onPhaseChange('postTest');
    };

    // 読解課題完了（対照群）
    const handleReadingTaskComplete = (data) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({
            ...prev,
            readingTaskEndTime: endTime,
            postTestStartTime: endTime
        }));
        setReadingTaskData(data);
        setProgress(prev => ({ ...prev, readingTaskCompleted: true }));

        saveToFirebase('readingTask', {
            completedAt: endTime,
            results: data.results
        });

        setInternalPhase(null);
        onPhaseChange('postTest');
    };

    // 事後テスト完了
    const handlePostTestComplete = (data) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({
            ...prev,
            postTestEndTime: endTime,
            surveyStartTime: endTime
        }));
        setPostTestData(data);
        setProgress(prev => ({ ...prev, postTestCompleted: true, surveyStarted: true }));

        // spec: sessions/{sessionId}/postTest
        saveToFirebase('postTest', {
            testSet: data.testSet,
            completedAt: endTime,
            answers: Object.entries(data.responses).map(([id, resp]) => ({
                postId: id,
                rating: resp.rating,
                manipulative: resp.manipulative,
                techniques: resp.techniques,
                style: resp.style,
                topic: resp.topic
            }))
        });

        onPhaseChange('survey');
    };

    // アンケート完了
    const handleSurveyComplete = (responses) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({
            ...prev,
            surveyEndTime: endTime,
            completionTime: endTime
        }));
        setSurveyData(responses);
        setProgress(prev => ({ ...prev, surveyCompleted: true, fullyCompleted: true }));

        // spec: sessions/{sessionId}/survey
        saveToFirebase('survey', { answers: responses, completedAt: endTime });
        // spec: sessions/{sessionId} status: 'complete'
        mergeDoc({ status: 'complete', completedAt: endTime });

        onPhaseChange('complete');
    };

    // 再スタート
    const handleRestart = () => {
        onPhaseChange('consent');
    };

    // エクスポート用データ生成（新スキーマ）
    const generateGameData = () => {
        const startedAt = timestamps.consentTime || null;
        const completedAt = timestamps.completionTime || timestamps.surveyEndTime || null;
        const totalDurationMs = startedAt && completedAt
            ? new Date(completedAt) - new Date(startedAt)
            : null;

        // testSetOrder: { pre:'A', post:'B' } → 'AB'
        const testSetOrderStr = testSetOrder.pre + testSetOrder.post;

        // 転移テスト回答フラット化
        const buildTestSection = (testData) => {
            if (!testData?.responses) return { answers: [], meanScore: null };
            const answers = Object.entries(testData.responses).map(([id, resp]) => ({
                questionId: id,
                rating: resp.rating,
                responseTimeMs: resp.responseTimeMs ?? null,
            }));
            const meanScore = answers.length > 0
                ? Math.round((answers.reduce((s, a) => s + a.rating, 0) / answers.length) * 100) / 100
                : null;
            return { answers, meanScore };
        };

        const preTestSection = buildTestSection(preTestData);
        const postTestSection = buildTestSection(postTestData);
        const scoreChange = preTestSection.meanScore !== null && postTestSection.meanScore !== null
            ? Math.round((postTestSection.meanScore - preTestSection.meanScore) * 100) / 100
            : null;

        // ゲームセクション
        let gameSection = null;
        if (gameResult) {
            const events = gameResult.researchData?.events || [];

            const buildChapter = (chapterNum) => {
                const chapterEvents = events.filter(e => e.chapter === chapterNum);
                const quizAnswers = chapterEvents
                    .filter(e => e.eventType === 'quiz_answer' && !e.isBoss)
                    .map(e => ({
                        questionId: e.questionId,
                        selectedTechniques: e.selectedTechniques || [],
                        correctTechniques: e.correctTechniques || [],
                        isCorrect: e.isCorrect,
                        responseTimeMs: e.responseTimeMs ?? null,
                    }));
                const bossEvent = chapterEvents.find(e => e.eventType === 'quiz_answer' && e.isBoss);
                const influencerActions = chapterEvents
                    .filter(e => e.eventType === 'influencer_action')
                    .map(e => ({
                        round: e.round,
                        targetId: e.targetId,
                        postId: e.postId,
                        followerChange: e.followerChange,
                        ethicsChange: e.ethicsChange,
                    }));
                const factcheckResults = chapterEvents
                    .filter(e => e.eventType === 'factcheck_result')
                    .map(e => ({
                        scenarioId: e.scenarioId,
                        totalScore: e.totalScore,
                    }));
                const criticismEvents = chapterEvents
                    .filter(e => e.eventType === 'quiz_criticism')
                    .map(e => ({
                        eventId: e.criticismEventId,
                        choiceId: e.choiceId,
                        scoreChange: e.scoreChange,
                        ethicsChange: e.ethicsChange,
                    }));
                const chapterComplete = chapterEvents.find(e => e.eventType === 'chapter_complete');

                return {
                    chapter: chapterNum,
                    quizAnswers,
                    influencerActions,
                    factcheckResults,
                    bossResult: bossEvent
                        ? { defeated: bossEvent.isCorrect, responseTimeMs: bossEvent.responseTimeMs ?? null }
                        : null,
                    criticismEvents,
                    duration: chapterComplete?.durationMs ?? null,
                };
            };

            const inv = gameResult.investigation || {};
            const bossesDefeated = inv.bosses
                ? Object.values(inv.bosses).filter(b => b.defeated).length
                : 0;
            const membersFound = inv.members
                ? Object.values(inv.members).filter(m => m.found).length
                : 0;
            const endingType = inv.endingFlags?.allBossesDefeated
                ? (inv.endingFlags?.highEthics ? 'perfect' : 'good')
                : 'normal';
            const totalScore = Object.values(gameResult.chapters || {})
                .reduce((sum, ch) => sum + (ch.score || 0), 0);

            gameSection = {
                chapters: [1, 2, 3].map(buildChapter),
                investigation: {
                    finalProgress: inv.progress || 0,
                    membersFound,
                    bossesDefeated,
                },
                endingType,
                totalScore,
            };
        }

        return {
            sessionId,
            condition: experimentCondition || 'unknown',
            testSetOrder: testSetOrderStr,
            startedAt,
            completedAt,
            totalDurationMs,
            demographics: participantInfo?.demographics
                ? {
                    age: participantInfo.demographics.age ?? null,
                    gender: participantInfo.demographics.gender ?? null,
                    snsUsage: participantInfo.demographics.snsUsage ?? null,
                    healthInfoSource: participantInfo.demographics.healthInfoSource ?? null,
                }
                : null,
            preTest: preTestSection,
            game: gameSection,
            postTest: postTestSection,
            scoreChange,
            survey: surveyData
                ? {
                    enjoyment: surveyData.enjoyment ?? null,
                    difficulty: surveyData.difficulty ?? null,
                    learning: surveyData.learning ?? null,
                    recommendation: surveyData.recommendation ?? null,
                    freeText: surveyData.freeText ?? null,
                }
                : null,
        };
    };

    // 対照群の読解課題（内部フェーズ）
    if (internalPhase === 'readingTask') {
        return <ReadingTask onComplete={handleReadingTaskComplete} />;
    }

    const dataExportOverlay = showDataExport && (
        <DataExport
            gameData={generateGameData()}
            onClose={() => setShowDataExport(false)}
            collectionName={collectionName}
            onCollectionChange={onCollectionChange}
        />
    );

    switch (phase) {
        case 'consent':
            return (
                <>
                    <ConsentScreen
                        onAgree={handleConsent}
                        experimentCondition={experimentCondition}
                    />
                    {dataExportOverlay}
                </>
            );
        case 'preTest':
            return (
                <TransferTest
                    testSet={testSetOrder.pre}
                    isPreTest={true}
                    onComplete={handlePreTestComplete}
                />
            );
        case 'game':
            return (
                <GameEngine
                    sessionId={sessionId}
                    collectionName={collectionName}
                    onComplete={handleGameComplete}
                />
            );
        case 'postTest':
            return (
                <TransferTest
                    testSet={testSetOrder.post}
                    isPreTest={false}
                    onComplete={handlePostTestComplete}
                />
            );
        case 'survey':
            return (
                <>
                    <PostSurvey
                        onComplete={handleSurveyComplete}
                        onShowData={() => setShowDataExport(true)}
                    />
                    {dataExportOverlay}
                </>
            );
        case 'complete':
            return (
                <>
                    <CompletionScreen
                        onShowData={() => setShowDataExport(true)}
                        onRestart={handleRestart}
                    />
                    {dataExportOverlay}
                </>
            );
        default:
            return null;
    }
};
