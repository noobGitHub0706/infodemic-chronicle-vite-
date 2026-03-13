import { useState } from 'react';
import { RhetoricQuiz } from '../activities/RhetoricQuiz';
import { InfluencerSim } from '../activities/InfluencerSim';
import { FactCheck } from '../activities/FactCheck';
import { DialogueBox } from '../../common/DialogueBox';
import { DialogueSequence } from '../narrative/DialogueSequence';
import {
    CHAPTER3_NARRATIVE,
    QUIZ_REACTIONS,
    INFLUENCER_NARRATIVE,
    FACTCHECK_NARRATIVE
} from '../../data/narrative';
import { CHAPTER3_QUESTIONS } from '../../data/questions_chapter3';
import { BOSS_QUESTIONS } from '../../data/organization';
import { INFLUENCER_POSTS } from '../../data/influencer_posts';
import { TARGETS } from '../../data/influencer_targets';
import { FACTCHECK_SCENARIOS } from '../../data/factcheck_scenarios';
import { shuffle } from '../../utils';
import { useRef } from 'react';

// 第3章フロー:
// opening → quiz_intro → quiz → influencer_intro → influencer
// → factcheck_intro → factcheck → boss_intro → boss → boss_result → transition

const SingleDialogueScreen = ({ dialogue, extraDialogue, onComplete, buttonLabel = '次へ' }) => (
    <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full animate-fade-in">
            <div className="glass rounded-3xl p-6 md:p-8">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={onComplete}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
                    >
                        スキップ →
                    </button>
                </div>
                <DialogueBox dialogue={dialogue} />
                {extraDialogue && <DialogueBox dialogue={extraDialogue} />}
                <button
                    onClick={onComplete}
                    className="w-full mt-4 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                >
                    {buttonLabel}
                </button>
            </div>
        </div>
    </div>
);

const BossResult = ({ bossQuestion, defeated, onComplete }) => {
    const narrative = defeated
        ? CHAPTER3_NARRATIVE.bossDefeated
        : CHAPTER3_NARRATIVE.bossFailed;
    const dialogues = Array.isArray(narrative) ? narrative : [narrative];

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className={`glass rounded-3xl p-6 md:p-8 border-2 ${defeated ? 'border-yellow-500/50' : 'border-gray-500/30'}`}>
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">{defeated ? '🏆' : '😓'}</div>
                        <h2 className={`text-2xl font-bold ${defeated ? 'text-yellow-400' : 'text-gray-400'}`}>
                            {defeated ? 'ボス撃破！' : '惜しかった...'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{bossQuestion.bossName}</p>
                    </div>
                    {dialogues.map((d, i) => <DialogueBox key={i} dialogue={d} />)}
                    <button
                        onClick={onComplete}
                        className="w-full mt-6 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                    >
                        エピローグへ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Chapter3({ onComplete, onTechniqueIdentified, onBossDefeated, onEthicsChange, recordEvent }) {
    const [scene, setScene] = useState('opening');
    const [quizData, setQuizData] = useState(null);
    const [influencerData, setInfluencerData] = useState(null);
    const [factCheckData, setFactCheckData] = useState(null);
    const [bossDefeated, setBossDefeated] = useState(false);
    const [questions] = useState(() => shuffle(CHAPTER3_QUESTIONS));
    const chapterStartTimeRef = useRef(Date.now());

    const bossQuestion = BOSS_QUESTIONS.chapter3;
    // 第3章: chapter === 3 のシナリオ2つ（中級・データ検証 + 上級・複合検証）
    const factCheckScenarios = FACTCHECK_SCENARIOS.filter(s => s.chapter === 3);

    const handleQuizComplete = (data) => {
        setQuizData(data);
        if (recordEvent) {
            data.answers.forEach(answer => recordEvent('quiz_answer', {
                chapter: 3,
                questionId: answer.questionId,
                selectedTechniques: answer.selectedProblems || [],
                correctTechniques: answer.techniques || [],
                isCorrect: answer.correct,
                responseTimeMs: answer.responseTimeMs || 0,
                isBoss: false,
            }));
        }
        setScene('influencer_intro');
    };

    const handleInfluencerComplete = (data) => {
        setInfluencerData(data);
        setScene('factcheck_intro');
    };

    const handleFactCheckComplete = (data) => {
        setFactCheckData(data);
        if (recordEvent) {
            data.scenarios.forEach(result => recordEvent('factcheck_result', {
                chapter: 3,
                scenarioId: result.scenario?.id,
                steps: result.answers.map((ans, i) => ({
                    stepId: `step${i + 1}`,
                    choiceId: ans.id,
                    correct: ans.score >= 15,
                    score: ans.score,
                })),
                totalScore: result.totalScore,
            }));
        }
        setScene('boss_intro');
    };

    const handleBossComplete = (data) => {
        const defeated = data.answers?.[0]?.correct === true;
        setBossDefeated(defeated);
        if (defeated && onBossDefeated) onBossDefeated(3);
        if (recordEvent) {
            data.answers.forEach(answer => recordEvent('quiz_answer', {
                chapter: 3,
                questionId: answer.questionId,
                selectedTechniques: answer.selectedProblems || [],
                correctTechniques: answer.techniques || [],
                isCorrect: answer.correct,
                responseTimeMs: answer.responseTimeMs || 0,
                isBoss: true,
            }));
        }
        setScene('boss_result');
    };

    const handleTransitionComplete = () => {
        if (recordEvent) {
            recordEvent('chapter_complete', {
                chapter: 3,
                quizScore: quizData?.score || 0,
                influencerScore: influencerData?.totalFollowers || 0,
                factcheckScore: factCheckData?.scenarios?.reduce((sum, s) => sum + (s.totalScore || 0), 0) || 0,
                bossDefeated,
                durationMs: Date.now() - chapterStartTimeRef.current,
            });
        }
        onComplete({
            chapter: 3,
            quizData,
            influencerData,
            factCheckData,
            bossDefeated,
            score: (quizData?.score || 0)
        });
    };

    switch (scene) {
        case 'opening':
            return (
                <DialogueSequence
                    dialogues={CHAPTER3_NARRATIVE.opening}
                    onComplete={() => setScene('quiz_intro')}
                    buttonLabel="最終訓練へ"
                />
            );

        case 'quiz_intro':
            return (
                <SingleDialogueScreen
                    dialogue={CHAPTER3_NARRATIVE.quizStart}
                    onComplete={() => setScene('quiz')}
                    buttonLabel="訓練を始める"
                />
            );

        case 'quiz':
            return (
                <RhetoricQuiz
                    questions={questions}
                    feedbackLevel="minimal"
                    questionIntros={QUIZ_REACTIONS.questionIntros.chapter3}
                    reactions={{
                        correct: QUIZ_REACTIONS.correct,
                        incorrect: QUIZ_REACTIONS.incorrect,
                        correctClear: QUIZ_REACTIONS.correctClear,
                        falseFlag: QUIZ_REACTIONS.falseFlag
                    }}
                    stageLabel="Stage 3: 実践"
                    isBoss={false}
                    chapterNumber={3}
                    onTechniqueIdentified={onTechniqueIdentified}
                    onEthicsChange={onEthicsChange}
                    onCriticismResponse={recordEvent
                        ? (d) => recordEvent('quiz_criticism', { chapter: 3, ...d })
                        : undefined}
                    onComplete={handleQuizComplete}
                />
            );

        case 'influencer_intro':
            return (
                <SingleDialogueScreen
                    dialogue={CHAPTER3_NARRATIVE.quizToInfluencer}
                    extraDialogue={INFLUENCER_NARRATIVE.start}
                    onComplete={() => setScene('influencer')}
                    buttonLabel="潜入を開始する"
                />
            );

        case 'influencer':
            return (
                <InfluencerSim
                    rounds={[INFLUENCER_POSTS.round4, INFLUENCER_POSTS.round5]}
                    targets={TARGETS}
                    narrativeIntros={INFLUENCER_NARRATIVE}
                    stageLabel="Stage 4: インフルエンサー体験（本番）"
                    onPostCompleted={recordEvent
                        ? (d) => recordEvent('influencer_action', { chapter: 3, ...d })
                        : undefined}
                    onComplete={handleInfluencerComplete}
                />
            );

        case 'factcheck_intro':
            return (
                <SingleDialogueScreen
                    dialogue={CHAPTER3_NARRATIVE.influencerToFactCheck}
                    extraDialogue={FACTCHECK_NARRATIVE.start}
                    onComplete={() => setScene('factcheck')}
                    buttonLabel="検証を始める"
                />
            );

        case 'factcheck':
            return (
                <FactCheck
                    scenarios={factCheckScenarios}
                    narrativeIntros={FACTCHECK_NARRATIVE}
                    stageLabel="Stage 5: 情報検証（本番）"
                    onComplete={handleFactCheckComplete}
                />
            );

        case 'boss_intro':
            return (
                <div className="min-h-screen p-4 flex items-center justify-center">
                    <div className="max-w-2xl w-full animate-fade-in">
                        <div className="glass rounded-3xl p-6 md:p-8">
                            <div className="flex justify-end mb-2">
                                <button
                                    onClick={() => setScene('boss')}
                                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
                                >
                                    スキップ →
                                </button>
                            </div>
                            {Array.isArray(CHAPTER3_NARRATIVE.factCheckToBoss)
                                ? CHAPTER3_NARRATIVE.factCheckToBoss.map((d, i) => <DialogueBox key={i} dialogue={d} />)
                                : <DialogueBox dialogue={CHAPTER3_NARRATIVE.factCheckToBoss} />
                            }
                            <DialogueBox dialogue={bossQuestion.bossIntro} />
                            <button
                                onClick={() => setScene('boss')}
                                className="w-full mt-4 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                            >
                                ボス戦へ
                            </button>
                        </div>
                    </div>
                </div>
            );

        case 'boss':
            return (
                <RhetoricQuiz
                    questions={[bossQuestion]}
                    feedbackLevel="detailed"
                    questionIntros={[]}
                    reactions={{
                        correct: QUIZ_REACTIONS.correct,
                        incorrect: QUIZ_REACTIONS.incorrect,
                        correctClear: QUIZ_REACTIONS.correctClear,
                        falseFlag: QUIZ_REACTIONS.falseFlag
                    }}
                    stageLabel={`⚔️ 最終ボス戦: ${bossQuestion.bossName}`}
                    isBoss={true}
                    chapterNumber={3}
                    onTechniqueIdentified={onTechniqueIdentified}
                    onEthicsChange={onEthicsChange}
                    onCriticismResponse={recordEvent
                        ? (d) => recordEvent('quiz_criticism', { chapter: 3, ...d })
                        : undefined}
                    onComplete={handleBossComplete}
                />
            );

        case 'boss_result':
            return (
                <BossResult
                    bossQuestion={bossQuestion}
                    defeated={bossDefeated}
                    onComplete={() => setScene('transition')}
                />
            );

        case 'transition':
            return (
                <DialogueSequence
                    dialogues={CHAPTER3_NARRATIVE.transition}
                    onComplete={handleTransitionComplete}
                    buttonLabel="エピローグへ"
                />
            );

        default:
            return null;
    }
}
