import { useState, useEffect, useCallback } from 'react';
import { db, doc, setDoc } from './lib/firebase';
import { ConsentScreen } from './components/ConsentScreen';
import { Introduction } from './components/Introduction';
import { Stage1 } from './components/Stage1';
import { Stage2Intro } from './components/Stage2Intro';
import { Stage3 } from './components/Stage3';
import { Stage3Intro } from './components/Stage3Intro';
import { StageCreate } from './components/StageCreate';
import { FinalDebriefing } from './components/FinalDebriefing';
import { TransferTest } from './components/TransferTest';
import { ReadingTask } from './components/ReadingTask';
import { PostSurvey } from './components/PostSurvey';
import { CompletionScreen } from './components/CompletionScreen';
import { DataExport } from './components/DataExport';
import { TRANSFER_TEST_A, TRANSFER_TEST_B } from './data/transferTests';

export const App = () => {
    const [stage, setStage] = useState('consent'); // consent, preTest, intro, stage1, stage2intro, stage3, stage3intro, stageCreate, postTest, survey, complete
    const [stage1Data, setStage1Data] = useState(null);
    const [stage3Data, setStage3Data] = useState(null);
    const [stageCreateData, setStageCreateData] = useState(null);
    const [surveyData, setSurveyData] = useState(null);
    const [preTestData, setPreTestData] = useState(null);
    const [postTestData, setPostTestData] = useState(null);
    const [showDataExport, setShowDataExport] = useState(false);
    
    // URLパラメータから実験条件を取得
    const [experimentCondition] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('condition') || null;
        // 使用例: ?condition=experimental または ?condition=control
    });
    
    // 転移テストのセット順序（カウンターバランス）
    // 参加者の半数: 事前A→事後B、残り半数: 事前B→事後A
    const [testSetOrder] = useState(() => {
        // セッションIDベースでランダムに決定（再現性のため）
        const randomValue = Math.random();
        return randomValue < 0.5 ? { pre: 'A', post: 'B' } : { pre: 'B', post: 'A' };
    });

    // 被験者情報
    const [participantInfo, setParticipantInfo] = useState(null);
    
    // Firebase is initialized directly via ES import
    
    // Firebaseにデータを保存する関数
    const saveToFirebase = async (path, data, merge = true) => {
        if (!db) {
            console.warn('Firebase not initialized yet');
            return false;
        }
        
        try {
            const docRef = doc(db, 'sessions', sessionId);
            if (merge) {
                await setDoc(docRef, {
                    [path]: data,
                    lastUpdated: new Date().toISOString()
                }, { merge: true });
            } else {
                await setDoc(docRef, data);
            }
            console.log(`Saved to Firebase: ${path}`);
            return true;
        } catch (error) {
            console.error('Firebase save error:', error);
            return false;
        }
    };
    
    // ブラウザバック・タブを閉じる際の警告
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            // 同意前と完了後は警告を出さない
            if (stage === 'consent' || stage === 'complete') {
                return;
            }
            
            // 標準的な方法で警告を表示
            e.preventDefault();
            e.returnValue = 'ゲームの進行状況が失われます。本当にページを離れますか？';
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [stage]);

    // プレイ完了率の記録
    const [progress, setProgress] = useState({
        consentCompleted: false,
        preTestCompleted: false,
        introCompleted: false,
        readingTaskCompleted: false, // 対照群用
        stage1Started: false,
        stage1Completed: false,
        stage2IntroCompleted: false,
        stage3Started: false,
        stage3Completed: false,
        stageCreateStarted: false,
        stageCreateCompleted: false,
        debriefViewed: false,
        postTestCompleted: false,
        surveyStarted: false,
        surveyCompleted: false,
        fullyCompleted: false
    });
    
    // 時間記録用
    const [sessionId] = useState(() => Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
    const [timestamps, setTimestamps] = useState({
        consentTime: null,
        preTestStartTime: null,
        preTestEndTime: null,
        readingTaskStartTime: null, // 対照群用
        readingTaskEndTime: null,   // 対照群用
        gameStartTime: null,
        stage1StartTime: null,
        stage1EndTime: null,
        stage2IntroEndTime: null,
        stage3StartTime: null,
        stage3EndTime: null,
        stageCreateStartTime: null,
        stageCreateEndTime: null,
        debriefTime: null,
        postTestStartTime: null,
        postTestEndTime: null,
        surveyStartTime: null,
        surveyEndTime: null,
        completionTime: null
    });

    const handleConsent = (consentData) => {
        const participantId = consentData.participantId || `auto_${sessionId}`;
        
        setParticipantInfo({
            id: participantId,
            demographics: consentData.demographics
        });
        
        const consentTime = new Date().toISOString();
        setTimestamps(prev => ({ 
            ...prev, 
            consentTime: consentTime,
            preTestStartTime: consentTime
        }));
        setProgress(prev => ({ ...prev, consentCompleted: true }));
        
        // Firebaseにセッション開始を記録
        saveToFirebase('metadata', {
            sessionId: sessionId,
            participantId: participantId,
            experimentCondition: experimentCondition,
            testSetOrder: testSetOrder,
            startedAt: consentTime,
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language
        });
        
        if (consentData.demographics) {
            saveToFirebase('preSurvey', {
                demographics: consentData.demographics,
                completedAt: consentTime
            });
        }
        
        // 同意後は事前テストへ
        setStage('preTest');
    };

    // 事前転移テスト完了ハンドラー
    const handlePreTestComplete = (data) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({ 
            ...prev, 
            preTestEndTime: endTime 
        }));
        setPreTestData(data);
        setProgress(prev => ({ ...prev, preTestCompleted: true }));
        
        // Firebaseに保存
        saveToFirebase('preTest', {
            testSet: data.testSet,
            completedAt: endTime,
            responses: Object.entries(data.responses).map(([id, resp]) => ({
                postId: id,
                rating: resp.rating,
                technique: resp.technique,
                style: resp.style,
                topic: resp.topic
            }))
        });
        
        // 対照群は読解課題へ、実験群はゲーム本編へ
        if (experimentCondition === 'control') {
            setTimestamps(prev => ({ ...prev, readingTaskStartTime: endTime }));
            setStage('readingTask');
        } else {
            setStage('intro');
        }
    };

    // 読解課題データを保持
    const [readingTaskData, setReadingTaskData] = useState(null);

    // 対照群用：読解課題完了ハンドラー
    const handleReadingTaskComplete = (data) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({ 
            ...prev, 
            readingTaskEndTime: endTime,
            postTestStartTime: endTime
        }));
        setReadingTaskData(data);
        setProgress(prev => ({ ...prev, readingTaskCompleted: true }));
        
        // Firebaseに保存
        saveToFirebase('readingTask', {
            completedAt: endTime,
            results: data.results
        });
        
        // 事後テストへ
        setStage('postTest');
    };

    const handleStart = () => {
        setTimestamps(prev => ({ 
            ...prev, 
            gameStartTime: new Date().toISOString(),
            stage1StartTime: new Date().toISOString()
        }));
        setProgress(prev => ({ ...prev, introCompleted: true, stage1Started: true }));
        setStage('stage1');
    };

    const handleStage1Complete = (data) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({ ...prev, stage1EndTime: endTime }));
        
        const stage1Result = {
            ...data,
            startTime: timestamps.stage1StartTime,
            endTime: endTime
        };
        setStage1Data(stage1Result);
        setProgress(prev => ({ ...prev, stage1Completed: true }));
        
        // Firebaseに保存
        saveToFirebase('stage1', {
            completedAt: endTime,
            totalScore: data.score,
            accuracy: data.accuracy,
            results: data.answers ? data.answers.map(r => ({
                questionId: r.questionId,
                isManipulative: r.isManipulative,
                userJudgment: r.userJudgment,
                isCorrect: r.isCorrect,
                selectedTechniques: r.selectedTechniques || [],
                correctTechniques: r.correctTechniques || [],
                rebuttalCorrect: r.rebuttalCorrect,
                rebuttalPartial: r.rebuttalPartial
            })) : [],
            weakTechniques: data.weakTechniques || [],
            rebuttalStats: data.rebuttalStats || null
        });
        
        setStage('stage2intro');
    };

    const handleStage2IntroComplete = () => {
        const now = new Date().toISOString();
        setTimestamps(prev => ({ 
            ...prev, 
            stage2IntroEndTime: now,
            stage3StartTime: now 
        }));
        setProgress(prev => ({ ...prev, stage2IntroCompleted: true, stage3Started: true }));
        setStage('stage3');
    };

    const handleStage3Complete = (data) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({ 
            ...prev, 
            stage3EndTime: endTime
        }));
        
        const stage3Result = {
            ...data,
            startTime: timestamps.stage3StartTime,
            endTime: endTime
        };
        setStage3Data(stage3Result);
        setProgress(prev => ({ ...prev, stage3Completed: true }));
        
        // Firebaseに保存（これはStage2 = インフルエンサー体験）
        saveToFirebase('stage2', {
            completedAt: endTime,
            finalFollowers: data.totalFollowers,
            finalCredibility: data.finalEthics,
            suspended: data.suspended || false,
            suspendedAtRound: data.suspendedAtRound || null,
            rounds: data.results ? data.results.map((r, idx) => ({
                roundNumber: r.round || idx + 1,
                selectedPost: {
                    content: r.post?.content || '',
                    techniques: r.post?.techniques || []
                },
                target: r.target?.name || '',
                followersGained: r.newFollowers || 0,
                credibilityChange: r.ethicsChange || 0,
                likes: r.likes || 0,
                shares: r.shares || 0
            })) : []
        });
        
        setStage('stage3intro');
    };

    const handleStage3IntroComplete = () => {
        const now = new Date().toISOString();
        setTimestamps(prev => ({ 
            ...prev, 
            stageCreateStartTime: now 
        }));
        setProgress(prev => ({ ...prev, stageCreateStarted: true }));
        setStage('stageCreate');
    };

    const handleStageCreateComplete = (data) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({ 
            ...prev, 
            stageCreateEndTime: endTime,
            debriefTime: endTime 
        }));
        
        const stageCreateResult = {
            ...data,
            startTime: timestamps.stageCreateStartTime,
            endTime: endTime
        };
        setStageCreateData(stageCreateResult);
        setProgress(prev => ({ ...prev, stageCreateCompleted: true, debriefViewed: true }));
        
        // Firebaseに保存（これはStage3 = 情報検証訓練）
        saveToFirebase('stage3', {
            completedAt: endTime,
            totalScore: data.scenarios ? data.scenarios.reduce((sum, s) => sum + (s.totalScore || 0), 0) : 0,
            scenarios: data.scenarios ? data.scenarios.map(s => ({
                scenarioId: s.scenario?.id || 0,
                title: s.scenario?.title || '',
                difficulty: s.scenario?.difficulty || '',
                answers: s.answers ? s.answers.map((a, idx) => ({
                    stepNumber: idx + 1,
                    selectedOptionId: a.id || '',
                    score: a.score || 0
                })) : [],
                totalScore: s.totalScore || 0,
                maxScore: s.maxScore || 9
            })) : []
        });
        
        setStage('debrief');
    };

    // debrief後は事後テストへ
    const handleContinueToSurvey = () => {
        setTimestamps(prev => ({ 
            ...prev, 
            postTestStartTime: new Date().toISOString()
        }));
        setStage('postTest');
    };

    // 事後転移テスト完了ハンドラー
    const handlePostTestComplete = (data) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({ 
            ...prev, 
            postTestEndTime: endTime,
            surveyStartTime: endTime
        }));
        setPostTestData(data);
        setProgress(prev => ({ ...prev, postTestCompleted: true, surveyStarted: true }));
        
        // Firebaseに保存
        saveToFirebase('postTest', {
            testSet: data.testSet,
            completedAt: endTime,
            responses: Object.entries(data.responses).map(([id, resp]) => ({
                postId: id,
                rating: resp.rating,
                technique: resp.technique,
                style: resp.style,
                topic: resp.topic
            }))
        });
        
        setStage('survey');
    };

    const handleSurveyComplete = (responses) => {
        const endTime = new Date().toISOString();
        setTimestamps(prev => ({ 
            ...prev, 
            surveyEndTime: endTime,
            completionTime: endTime
        }));
        setSurveyData(responses);
        setProgress(prev => ({ ...prev, surveyCompleted: true, fullyCompleted: true }));
        
        // Firebaseに事後アンケートと完了を記録
        saveToFirebase('postSurvey', {
            responses: responses,
            completedAt: endTime
        });
        
        saveToFirebase('metadata', {
            completedAt: endTime,
            fullyCompleted: true
        });
        
        setStage('complete');
    };

    const handleRestart = () => {
        setStage('intro');
        setStage1Data(null);
        setStage3Data(null);
        setStageCreateData(null);
        setSurveyData(null);
        setTimestamps(prev => ({
            consentTime: prev.consentTime,
            gameStartTime: null,
            stage1StartTime: null,
            stage1EndTime: null,
            stage2IntroEndTime: null,
            stage3StartTime: null,
            stage3EndTime: null,
            stageCreateStartTime: null,
            stageCreateEndTime: null,
            debriefTime: null,
            surveyStartTime: null,
            surveyEndTime: null,
            completionTime: null
        }));
        // progressはリセットしない（再プレイも記録）
    };

    // 完全なゲームデータを生成
    const generateGameData = () => {
        const calcDuration = (start, end) => {
            if (!start || !end) return null;
            return Math.round((new Date(end) - new Date(start)) / 1000);
        };

        // 拡散影響を計算
        const calculateSpreadImpact = () => {
            if (!stage3Data) return null;
            
            let totalReach = 0;
            let totalBelievers = 0;
            
            stage3Data.results.forEach(result => {
                const techniques = result.post.techniques;
                const manipulationLevel = techniques.length;
                const isManipulative = manipulationLevel > 0;
                
                const primaryReach = result.newFollowers;
                const secondaryReach = Math.round(result.shares * 150 * (1 + manipulationLevel * 0.3));
                const tertiaryReach = Math.round(secondaryReach * 0.2 * (1 + manipulationLevel * 0.2));
                
                const roundReach = primaryReach + secondaryReach + tertiaryReach;
                totalReach += roundReach;
                
                if (isManipulative) {
                    const believerRate = 0.3 + manipulationLevel * 0.15;
                    totalBelievers += Math.round(roundReach * believerRate * 0.5);
                }
            });
            
            return { totalReach, totalBelievers };
        };

        // 称号を計算
        const calculateTitle = () => {
            if (!stage3Data) return null;
            
            // 凍結された場合
            if (stage3Data.suspended) return 'suspended';
            
            const followers = stage3Data.totalFollowers;
            const ethics = stage3Data.finalEthics;
            
            if (ethics >= 70) {
                if (followers >= 600) return 'ideal_leader';
                if (followers >= 300) return 'balanced_influencer';
                return 'honest_creator';
            } else if (ethics >= 40) {
                if (followers >= 600) return 'popular';
                if (followers >= 300) return 'growing_creator';
                return 'cautious_observer';
            } else {
                if (followers >= 600) return 'misinfo_spreader';
                if (followers >= 300) return 'controversy_influencer';
                return 'lost_beginner';
            }
        };

        const spreadImpact = calculateSpreadImpact();
        const title = calculateTitle();
        
        // 転移テストの分析
        const analyzeTransferTest = (testData) => {
            if (!testData) return null;
            
            const responses = Object.values(testData.responses);
            const manipulativeResponses = responses.filter(r => r.technique !== 'control');
            const controlResponses = responses.filter(r => r.technique === 'control');
            
            return {
                testSet: testData.testSet,
                completedAt: testData.completedAt,
                averageRating: {
                    overall: responses.reduce((sum, r) => sum + r.rating, 0) / responses.length,
                    manipulative: manipulativeResponses.length > 0 
                        ? manipulativeResponses.reduce((sum, r) => sum + r.rating, 0) / manipulativeResponses.length 
                        : null,
                    control: controlResponses.length > 0 
                        ? controlResponses.reduce((sum, r) => sum + r.rating, 0) / controlResponses.length 
                        : null
                },
                byTechnique: ['fear', 'authority', 'pseudoscience', 'testimonial', 'polarization', 'bandwagon'].reduce((acc, tech) => {
                    const techResponses = responses.filter(r => r.technique === tech);
                    acc[tech] = techResponses.length > 0 
                        ? techResponses.reduce((sum, r) => sum + r.rating, 0) / techResponses.length 
                        : null;
                    return acc;
                }, {}),
                responses: responses.map(r => ({
                    postId: Object.keys(testData.responses).find(k => testData.responses[k] === r),
                    rating: r.rating,
                    technique: r.technique,
                    style: r.style,
                    topic: r.topic
                }))
            };
        };
        
        const preTestAnalysis = analyzeTransferTest(preTestData);
        const postTestAnalysis = analyzeTransferTest(postTestData);
        
        // 変化量を計算
        const calculateChange = () => {
            if (!preTestAnalysis || !postTestAnalysis) return null;
            
            return {
                manipulative: postTestAnalysis.averageRating.manipulative - preTestAnalysis.averageRating.manipulative,
                control: postTestAnalysis.averageRating.control - preTestAnalysis.averageRating.control,
                overall: postTestAnalysis.averageRating.overall - preTestAnalysis.averageRating.overall
            };
        };

        return {
            sessionId,
            version: 'v21',
            experimentCondition,
            testSetOrder,
            participant: participantInfo,
            progress,
            timestamps: {
                ...timestamps,
                exportTime: new Date().toISOString()
            },
            durations: {
                total: calcDuration(timestamps.gameStartTime || timestamps.readingTaskStartTime, timestamps.completionTime || timestamps.surveyEndTime),
                preTest: calcDuration(timestamps.preTestStartTime, timestamps.preTestEndTime),
                readingTask: calcDuration(timestamps.readingTaskStartTime, timestamps.readingTaskEndTime), // 対照群用
                stage1: calcDuration(timestamps.stage1StartTime, timestamps.stage1EndTime),
                stage2Intro: calcDuration(timestamps.stage1EndTime, timestamps.stage2IntroEndTime),
                stage3: calcDuration(timestamps.stage3StartTime, timestamps.stage3EndTime),
                postTest: calcDuration(timestamps.postTestStartTime, timestamps.postTestEndTime),
                survey: calcDuration(timestamps.surveyStartTime, timestamps.surveyEndTime)
            },
            transferTest: {
                preTest: preTestAnalysis,
                postTest: postTestAnalysis,
                change: calculateChange()
            },
            readingTask: readingTaskData, // 対照群のみ
            stage1: stage1Data ? {
                score: stage1Data.score,
                accuracy: stage1Data.accuracy,
                correctCount: stage1Data.answers.filter(a => a.correct).length,
                totalQuestions: stage1Data.answers.length,
                weakTechniques: stage1Data.weakTechniques,
                answers: stage1Data.answers.map(a => ({
                    questionId: a.questionId,
                    userAnswer: a.userAnswer,
                    correct: a.correct,
                    points: a.points,
                    techniques: a.techniques
                }))
            } : null,
            stage3: stage3Data ? {
                finalFollowers: stage3Data.totalFollowers,
                finalEthics: stage3Data.finalEthics,
                totalRounds: stage3Data.results.length,
                ethicalPostCount: stage3Data.results.filter(r => r.post.ethics >= 0).length,
                title: title,
                suspended: stage3Data.suspended || false,
                suspendedAtRound: stage3Data.suspendedAtRound || null,
                spreadImpact: spreadImpact,
                rounds: stage3Data.results.map(r => ({
                    round: r.round,
                    target: r.target,
                    postId: r.post.id,
                    techniques: r.post.techniques,
                    newFollowers: r.newFollowers,
                    ethicsChange: r.ethicsChange,
                    criticismResponse: r.criticismResponse || null
                }))
            } : null,
            survey: surveyData
        };
    };

    return (
        <div className="scrollbar-hide">
            {stage === 'consent' && (
                <ConsentScreen 
                    onAgree={handleConsent} 
                    experimentCondition={experimentCondition}
                />
            )}
            {stage === 'preTest' && (
                <TransferTest 
                    testSet={testSetOrder.pre}
                    isPreTest={true}
                    onComplete={handlePreTestComplete}
                />
            )}
            {stage === 'readingTask' && (
                <ReadingTask 
                    onComplete={handleReadingTaskComplete}
                />
            )}
            {stage === 'intro' && <Introduction onStart={handleStart} />}
            {stage === 'stage1' && <Stage1 onComplete={handleStage1Complete} />}
            {stage === 'stage2intro' && <Stage2Intro stage1Data={stage1Data} onContinue={handleStage2IntroComplete} />}
            {stage === 'stage3' && <Stage3 stage1Data={stage1Data} onComplete={handleStage3Complete} />}
            {stage === 'stage3intro' && <Stage3Intro stage3Data={stage3Data} onContinue={handleStage3IntroComplete} />}
            {stage === 'stageCreate' && <StageCreate stage1Data={stage1Data} stage3Data={stage3Data} onComplete={handleStageCreateComplete} />}
            {stage === 'debrief' && (
                <FinalDebriefing 
                    stage1Data={stage1Data} 
                    stage3Data={stage3Data}
                    stageCreateData={stageCreateData}
                    onRestart={handleRestart}
                    onShowData={() => setShowDataExport(true)}
                    onContinueToSurvey={handleContinueToSurvey}
                />
            )}
            {stage === 'postTest' && (
                <TransferTest 
                    testSet={testSetOrder.post}
                    isPreTest={false}
                    onComplete={handlePostTestComplete}
                />
            )}
            {stage === 'survey' && (
                <PostSurvey 
                    onComplete={handleSurveyComplete}
                    onShowData={() => setShowDataExport(true)}
                />
            )}
            {stage === 'complete' && (
                <CompletionScreen 
                    onShowData={() => setShowDataExport(true)}
                    onRestart={handleRestart}
                />
            )}
            
            {showDataExport && (
                <DataExport 
                    gameData={generateGameData()} 
                    onClose={() => setShowDataExport(false)} 
                />
            )}
        </div>
    );
};

export default App;
