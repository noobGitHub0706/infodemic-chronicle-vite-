import { useState, useCallback } from 'react';
import Chapter1 from './chapters/Chapter1';
import Chapter2 from './chapters/Chapter2';
import Chapter3 from './chapters/Chapter3';
import Epilogue from './chapters/Epilogue';
import { ChapterTransition } from './narrative/ChapterTransition';
import { InvestigationFile } from './systems/InvestigationFile';
import { useInvestigation } from '../hooks/useInvestigation';
import { useResearchData } from '../hooks/useResearchData';
import { useFirebase } from '../hooks/useFirebase';

// GameEngine: ゲームレイヤーのオーケストレーター
// chapter: 1 | 2 | 3 | 'epilogue'
// sessionId: App.jsx で生成した共有ID（ResearchFlow と同じドキュメントに書き込む）
// onComplete(gameData): ゲーム終了時に研究レイヤーにデータを返す
export const GameEngine = ({ sessionId, collectionName = 'sessions', onComplete }) => {
    const [chapter, setChapter] = useState(1);
    const [allChapterData, setAllChapterData] = useState({});
    const [startTime] = useState(() => new Date().toISOString());

    const { recordEvent, getResearchData } = useResearchData(sessionId);
    const { mergeDoc, saveSubdoc } = useFirebase(sessionId, collectionName);

    // 章間トランジション管理
    const [transitioning, setTransitioning] = useState(false);
    const [nextChapter, setNextChapter] = useState(null);

    const {
        investigation,
        identifyTechnique,
        defeatBoss,
        completeChapterQuiz,
        setEndingFlag,
        clearNewUnlock,
    } = useInvestigation();

    // 第1章チュートリアル: 調査ファイルが初めて開かれたかを追跡
    const [ch1FileOpened, setCh1FileOpened] = useState(false);

    // 批判イベントの倫理累積 → highEthics エンディングフラグ
    const [totalEthics, setTotalEthics] = useState(0);
    const handleEthicsChange = useCallback((delta) => {
        setTotalEthics(prev => {
            const newTotal = prev + delta;
            setEndingFlag('highEthics', newTotal > 0);
            return newTotal;
        });
    }, [setEndingFlag]);

    const handleChapterComplete = (data) => {
        const chapterNum = typeof chapter === 'number' ? chapter : null;
        const key = chapterNum ? `chapter${chapterNum}` : chapter;
        const updated = { ...allChapterData, [key]: data };
        setAllChapterData(updated);

        // 章データをサブコレクションに保存
        if (chapterNum) {
            const researchSnapshot = getResearchData();
            const chapterEvents = researchSnapshot.events.filter(
                e => e.chapter === chapterNum
            );
            const quizAnswers = chapterEvents.filter(e => e.eventType === 'quiz_answer');
            const influencerActions = chapterEvents.filter(e => e.eventType === 'influencer_action');
            const factcheckResults = chapterEvents.filter(e => e.eventType === 'factcheck_result');
            const criticismEvents = chapterEvents.filter(e => e.eventType === 'quiz_criticism');

            saveSubdoc('chapters', `chapter${chapterNum}`, {
                chapterNumber: chapterNum,
                quizAnswers,
                influencerActions,
                factcheckResults,
                criticismEvents,
                bossResult: quizAnswers.find(e => e.isBoss) || null,
                investigationState: {
                    progress: investigation.progress,
                    endingFlags: investigation.endingFlags,
                },
                score: data.score || 0,
                bossDefeated: data.bossDefeated || false,
                completedAt: new Date().toISOString(),
            });
        }

        if (chapter === 3) {
            // 章トランジションなしで直接エピローグへ
            setChapter('epilogue');
        } else if (typeof chapter === 'number') {
            // 次章へのトランジション演出
            setNextChapter(chapter + 1);
            setTransitioning(true);
        }
    };

    const handleTransitionComplete = () => {
        setChapter(nextChapter);
        setTransitioning(false);
        setNextChapter(null);
    };

    const handleEpilogueComplete = (data) => {
        const endTime = new Date().toISOString();
        const totalDurationMs = new Date(endTime) - new Date(startTime);
        const totalScore = Object.values(allChapterData).reduce(
            (sum, ch) => sum + (ch.score || 0), 0
        );
        const endingType = investigation.endingFlags.allBossesDefeated
            ? (investigation.endingFlags.highEthics ? 'perfect' : 'good')
            : 'normal';

        recordEvent('game_complete', {
            totalScore,
            endingType,
            bossesDefeated: Object.values(investigation.bosses).filter(b => b.defeated).length,
            investigationProgress: investigation.progress,
            totalDurationMs,
        });

        const researchData = getResearchData();

        // ゲーム完了データをFirestoreメインドキュメントに保存
        mergeDoc({
            gameData: researchData,
            endingType,
            investigationFinal: {
                progress: investigation.progress,
                endingFlags: investigation.endingFlags,
                bossesDefeated: Object.values(investigation.bosses).filter(b => b.defeated).length,
            },
            totalScore,
            status: 'game_complete',
            gameEndTime: endTime,
        });

        onComplete({
            sessionId,
            startTime,
            endTime,
            chapters: allChapterData,
            epilogue: data,
            investigation,
            researchData,
        });
    };

    const renderChapter = () => {
        // 章間トランジション中
        if (transitioning && typeof nextChapter === 'number') {
            return (
                <ChapterTransition
                    chapter={nextChapter}
                    onComplete={handleTransitionComplete}
                />
            );
        }

        if (chapter === 1) return (
            <Chapter1
                onComplete={handleChapterComplete}
                onTechniqueIdentified={identifyTechnique}
                onBossDefeated={defeatBoss}
                onEthicsChange={handleEthicsChange}
                recordEvent={recordEvent}
                fileOpened={ch1FileOpened}
            />
        );
        if (chapter === 2) return (
            <Chapter2
                onComplete={handleChapterComplete}
                onTechniqueIdentified={identifyTechnique}
                onBossDefeated={defeatBoss}
                onChapterQuizComplete={completeChapterQuiz}
                onEthicsChange={handleEthicsChange}
                recordEvent={recordEvent}
            />
        );
        if (chapter === 3) return (
            <Chapter3
                onComplete={handleChapterComplete}
                onTechniqueIdentified={identifyTechnique}
                onBossDefeated={defeatBoss}
                onEthicsChange={handleEthicsChange}
                recordEvent={recordEvent}
            />
        );
        if (chapter === 'epilogue') return (
            <Epilogue
                onComplete={handleEpilogueComplete}
                investigation={investigation}
            />
        );
        return null;
    };

    return (
        <>
            {renderChapter()}
            {/* InvestigationFile: エピローグ以外で表示 */}
            {chapter !== 'epilogue' && !transitioning && (
                <InvestigationFile
                    investigation={investigation}
                    onClearNewUnlock={clearNewUnlock}
                    onFirstOpen={() => setCh1FileOpened(true)}
                    highlightButton={chapter === 1 && !ch1FileOpened}
                />
            )}
        </>
    );
};
