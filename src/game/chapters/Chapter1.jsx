import { useState, useEffect, useRef } from 'react';
import { RhetoricQuiz } from '../activities/RhetoricQuiz';
import { InfluencerSim } from '../activities/InfluencerSim';
import { DialogueBox } from '../../common/DialogueBox';
import { DialogueSequence } from '../narrative/DialogueSequence';
import {
    CHAPTER1_NARRATIVE,
    QUIZ_REACTIONS,
    INFLUENCER_NARRATIVE
} from '../../data/narrative';
import { INVESTIGATION_TUTORIAL } from '../../data/profileCards';
import { CHAPTER1_QUESTIONS } from '../../data/questions_chapter1';
import { BOSS_QUESTIONS } from '../../data/organization';
import { INFLUENCER_POSTS } from '../../data/influencer_posts';
import { TARGETS } from '../../data/influencer_targets';
import { shuffle } from '../../utils';

// 第1章フロー:
// opening → briefing → quiz_intro → quiz → influencer_intro → influencer
// → boss_intro → boss → boss_result → transition

const TechniqueBriefing = ({ onComplete }) => {
    const TECHNIQUES_LIST = [
        { id: 'fear', icon: '😱', name: '恐怖訴求', description: '不安や危機感を煽って行動を促す技法。「このまま続けると〇〇になる」のような表現。' },
        { id: 'authority', icon: '👔', name: '権威訴求', description: '専門家・機関・肩書きへの言及で信頼感を演出する。実在しない機関名も多い。' },
        { id: 'fabricated_evidence', icon: '🔬', name: '根拠の捏造・歪曲', description: 'データや統計を捏造・歪曲したり、都合の良い部分だけを抜き出して全体像を歪めて提示する。' },
        { id: 'testimonial', icon: '💬', name: '体験談一般化', description: '個人の体験を「みんなに効く」かのように誇張する。やらせ体験談も多い。' },
        { id: 'social_proof', icon: '🌊', name: '同調圧力', description: '「みんなやってる」「乗り遅れるな」で不安をかき立てる。' },
    ];

    return (
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
                    <DialogueBox dialogue={CHAPTER1_NARRATIVE.techniqueBriefingIntro} />
                    <div className="space-y-3 my-4">
                        {TECHNIQUES_LIST.map(tech => (
                            <div key={tech.id} className="bg-white/5 rounded-xl p-4 flex gap-3 items-start">
                                <span className="text-2xl shrink-0">{tech.icon}</span>
                                <div>
                                    <p className="font-bold text-sm mb-1">{tech.name}</p>
                                    <p className="text-xs text-gray-400">{tech.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogueBox dialogue={CHAPTER1_NARRATIVE.techniqueBriefingOutro} />
                    <button
                        onClick={onComplete}
                        className="w-full mt-4 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                    >
                        訓練を始める
                    </button>
                </div>
            </div>
        </div>
    );
};

const BossResult = ({ bossQuestion, defeated, onComplete }) => {
    const narrative = defeated
        ? CHAPTER1_NARRATIVE.bossDefeated
        : CHAPTER1_NARRATIVE.bossFailed;
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
                        次へ進む
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Chapter1({ onComplete, onTechniqueIdentified, onBossDefeated, onEthicsChange, recordEvent, fileOpened }) {
    const [scene, setScene] = useState('opening');
    const [tutorialStep, setTutorialStep] = useState('introduce'); // 'introduce' | 'prompt' | 'after_open'
    const [quizData, setQuizData] = useState(null);
    const [influencerData, setInfluencerData] = useState(null);
    const [bossDefeated, setBossDefeated] = useState(false);
    const [questions] = useState(() => shuffle(CHAPTER1_QUESTIONS));
    const chapterStartTimeRef = useRef(Date.now());

    // ファイルが開かれたら 'prompt' → 'after_open' へ自動進行
    useEffect(() => {
        if (fileOpened && scene === 'file_tutorial' && tutorialStep === 'prompt') {
            setTutorialStep('after_open');
        }
    }, [fileOpened, scene, tutorialStep]);

    const bossQuestion = BOSS_QUESTIONS.chapter1;

    const handleQuizComplete = (data) => {
        setQuizData(data);
        if (recordEvent) {
            data.answers.forEach(answer => recordEvent('quiz_answer', {
                chapter: 1,
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
        setScene('boss_intro');
    };

    const handleBossComplete = (data) => {
        const defeated = data.answers?.[0]?.correct === true;
        setBossDefeated(defeated);
        if (defeated && onBossDefeated) onBossDefeated(1);
        if (recordEvent) {
            data.answers.forEach(answer => recordEvent('quiz_answer', {
                chapter: 1,
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
                chapter: 1,
                quizScore: quizData?.score || 0,
                influencerScore: influencerData?.totalFollowers || 0,
                factcheckScore: 0,
                bossDefeated,
                durationMs: Date.now() - chapterStartTimeRef.current,
            });
        }
        onComplete({
            chapter: 1,
            quizData,
            influencerData,
            bossDefeated,
            score: (quizData?.score || 0)
        });
    };

    switch (scene) {
        case 'opening':
            return (
                <DialogueSequence
                    dialogues={CHAPTER1_NARRATIVE.opening}
                    onComplete={() => setScene('file_tutorial')}
                    buttonLabel="次へ"
                />
            );

        case 'file_tutorial':
            if (tutorialStep === 'introduce') {
                return (
                    <DialogueSequence
                        dialogues={INVESTIGATION_TUTORIAL.introduce}
                        onComplete={() => setTutorialStep('prompt')}
                        buttonLabel="調査ファイルを確認する"
                    />
                );
            }
            if (tutorialStep === 'prompt') {
                return (
                    <div className="min-h-screen p-4 flex items-center justify-center">
                        <div className="max-w-2xl w-full animate-fade-in">
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <DialogueBox dialogue={INVESTIGATION_TUTORIAL.promptOpen} />
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-400 mb-3">
                                        右下のアイコン 🗂️ から調査ファイルを開いてください
                                    </p>
                                    <div className="text-2xl animate-bounce">↘️</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            if (tutorialStep === 'after_open') {
                return (
                    <div className="min-h-screen p-4 flex items-center justify-center">
                        <div className="max-w-2xl w-full animate-fade-in">
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <DialogueBox dialogue={INVESTIGATION_TUTORIAL.afterOpen} />
                                <button
                                    onClick={() => setScene('briefing')}
                                    className="w-full mt-4 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                                >
                                    ブリーフィングへ
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }
            return null;

        case 'briefing':
            return <TechniqueBriefing onComplete={() => setScene('quiz_intro')} />;

        case 'quiz_intro':
            return (
                <div className="min-h-screen p-4 flex items-center justify-center">
                    <div className="max-w-2xl w-full animate-fade-in">
                        <div className="glass rounded-3xl p-6 md:p-8">
                            <div className="flex justify-end mb-2">
                                <button
                                    onClick={() => setScene('quiz')}
                                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
                                >
                                    スキップ →
                                </button>
                            </div>
                            <div className="text-center mb-4">
                                <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">Stage 1: 見破る</span>
                            </div>
                            <DialogueBox dialogue={CHAPTER1_NARRATIVE.quizStart} />
                            <button
                                onClick={() => setScene('quiz')}
                                className="w-full mt-4 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                            >
                                訓練を始める
                            </button>
                        </div>
                    </div>
                </div>
            );

        case 'quiz':
            return (
                <RhetoricQuiz
                    questions={questions}
                    feedbackLevel="detailed"
                    questionIntros={QUIZ_REACTIONS.questionIntros.chapter1}
                    reactions={{
                        correct: QUIZ_REACTIONS.correct,
                        incorrect: QUIZ_REACTIONS.incorrect,
                        correctClear: QUIZ_REACTIONS.correctClear,
                        falseFlag: QUIZ_REACTIONS.falseFlag
                    }}
                    stageLabel="Stage 1: 見破る"
                    isBoss={false}
                    chapterNumber={1}
                    onTechniqueIdentified={onTechniqueIdentified}
                    onEthicsChange={onEthicsChange}
                    onCriticismResponse={recordEvent
                        ? (d) => recordEvent('quiz_criticism', { chapter: 1, ...d })
                        : undefined}
                    onComplete={handleQuizComplete}
                />
            );

        case 'influencer_intro':
            return (
                <div className="min-h-screen p-4 flex items-center justify-center">
                    <div className="max-w-2xl w-full animate-fade-in">
                        <div className="glass rounded-3xl p-6 md:p-8">
                            <div className="flex justify-end mb-2">
                                <button
                                    onClick={() => setScene('influencer')}
                                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
                                >
                                    スキップ →
                                </button>
                            </div>
                            <DialogueBox dialogue={CHAPTER1_NARRATIVE.quizToInfluencer} />
                            <DialogueBox dialogue={INFLUENCER_NARRATIVE.firstStart} />
                            <button
                                onClick={() => setScene('influencer')}
                                className="w-full mt-4 btn-primary text-white font-bold py-4 rounded-2xl text-lg"
                            >
                                潜入を開始する
                            </button>
                        </div>
                    </div>
                </div>
            );

        case 'influencer':
            return (
                <InfluencerSim
                    rounds={[INFLUENCER_POSTS.round1]}
                    targets={TARGETS}
                    narrativeIntros={INFLUENCER_NARRATIVE}
                    stageLabel="Stage 2: インフルエンサー体験（ミニ）"
                    onPostCompleted={recordEvent
                        ? (d) => recordEvent('influencer_action', { chapter: 1, ...d })
                        : undefined}
                    onComplete={handleInfluencerComplete}
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
                            <DialogueBox dialogue={CHAPTER1_NARRATIVE.influencerToBoss} />
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
                    stageLabel={`⚔️ ボス戦: ${bossQuestion.bossName}`}
                    isBoss={true}
                    chapterNumber={1}
                    onTechniqueIdentified={onTechniqueIdentified}
                    onEthicsChange={onEthicsChange}
                    onCriticismResponse={recordEvent
                        ? (d) => recordEvent('quiz_criticism', { chapter: 1, ...d })
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
                    dialogues={CHAPTER1_NARRATIVE.transition}
                    onComplete={handleTransitionComplete}
                    buttonLabel="第2章へ"
                />
            );

        default:
            return null;
    }
}
