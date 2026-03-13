import { useState } from 'react';
import { READING_TASKS } from '../data/readingTasks';

export const ReadingTask = ({ onComplete }) => {
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [phase, setPhase] = useState('intro'); // intro, reading, questions, feedback
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [taskResults, setTaskResults] = useState([]);

    const currentTask = READING_TASKS[currentTaskIndex];
    const currentQuestion = currentTask?.questions[currentQuestionIndex];
    const totalTasks = READING_TASKS.length;

    const handleStartReading = () => {
        setPhase('reading');
    };

    const handleFinishReading = () => {
        setPhase('questions');
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
    };

    const handleSelectAnswer = (optionId) => {
        if (showFeedback) return;
        setSelectedAnswer(optionId);
    };

    const handleSubmitAnswer = () => {
        if (!selectedAnswer) return;

        const isCorrect = currentQuestion.options.find(o => o.id === selectedAnswer)?.correct;

        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: {
                selected: selectedAnswer,
                correct: isCorrect
            }
        }));

        setShowFeedback(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentTask.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        } else {
            // この記事の問題が終了
            const taskCorrect = currentTask.questions.filter(q =>
                answers[q.id]?.correct ||
                (q.id === currentQuestion.id && currentQuestion.options.find(o => o.id === selectedAnswer)?.correct)
            ).length;

            const newResult = {
                taskId: currentTask.id,
                title: currentTask.title,
                correctCount: taskCorrect,
                totalQuestions: currentTask.questions.length
            };

            setTaskResults(prev => [...prev, newResult]);

            if (currentTaskIndex < totalTasks - 1) {
                // 次の記事へ
                setCurrentTaskIndex(currentTaskIndex + 1);
                setPhase('intro');
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setShowFeedback(false);
                setAnswers({});
            } else {
                // 全記事完了
                onComplete({
                    results: [...taskResults, newResult],
                    completedAt: new Date().toISOString()
                });
            }
        }
    };

    // イントロ画面（各記事の開始前）
    if (phase === 'intro') {
        return (
            <div className="min-h-screen p-4 flex items-center justify-center">
                <div className="max-w-2xl w-full animate-fade-in">
                    <div className="glass rounded-3xl p-8 md:p-12">
                        {currentTaskIndex === 0 ? (
                            // 最初の記事の前：全体説明
                            <>
                                <div className="text-center mb-8">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h1 className="text-2xl font-bold mb-2">読解課題</h1>
                                    <p className="text-gray-400">
                                        これから3つの記事を読んでいただきます。<br />
                                        各記事の後に、内容に関する簡単な確認問題があります。
                                    </p>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 mb-8">
                                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <span>📝</span> 課題の説明
                                    </h2>
                                    <ul className="space-y-3 text-gray-300 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-400">•</span>
                                            3つの記事を順番に読みます（各5分程度）
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-400">•</span>
                                            各記事の後に3〜4問の確認問題があります
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-400">•</span>
                                            自分のペースで読み進めてください
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-indigo-500/20 rounded-2xl p-4 mb-8">
                                    <p className="text-sm text-indigo-300">
                                        <span className="font-bold">記事1:</span> {currentTask.title}（{currentTask.readingTime}）
                                    </p>
                                </div>

                                <button
                                    onClick={handleStartReading}
                                    className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                >
                                    読み始める
                                </button>
                            </>
                        ) : (
                            // 2つ目以降の記事
                            <>
                                <div className="text-center mb-8">
                                    <div className="text-5xl mb-4">📖</div>
                                    <h1 className="text-xl font-bold mb-2">次の記事へ</h1>
                                    <p className="text-gray-400">
                                        記事 {currentTaskIndex + 1} / {totalTasks}
                                    </p>
                                </div>

                                <div className="bg-indigo-500/20 rounded-2xl p-6 mb-8">
                                    <h2 className="font-bold text-lg mb-2">{currentTask.title}</h2>
                                    <p className="text-sm text-gray-400">{currentTask.readingTime}</p>
                                </div>

                                <button
                                    onClick={handleStartReading}
                                    className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                >
                                    読み始める
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 記事を読む画面
    if (phase === 'reading') {
        return (
            <div className="min-h-screen p-4 flex flex-col">
                {/* ヘッダー */}
                <div className="max-w-3xl w-full mx-auto mb-4">
                    <div className="glass rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                                記事 {currentTaskIndex + 1} / {totalTasks}
                            </span>
                            <span className="text-sm text-gray-400">{currentTask.readingTime}</span>
                        </div>
                    </div>
                </div>

                {/* 記事コンテンツ */}
                <div className="flex-1 max-w-3xl w-full mx-auto">
                    <div className="glass rounded-3xl p-6 md:p-8 mb-6">
                        <h1 className="text-2xl font-bold mb-6 text-center">{currentTask.title}</h1>
                        <div className="prose prose-invert max-w-none">
                            <div className="text-gray-300 leading-relaxed whitespace-pre-line text-base">
                                {currentTask.content}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleFinishReading}
                        className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg mb-8"
                    >
                        読み終わった → 確認問題へ
                    </button>
                </div>
            </div>
        );
    }

    // 確認問題画面
    if (phase === 'questions') {
        return (
            <div className="min-h-screen p-4 flex flex-col">
                {/* ヘッダー */}
                <div className="max-w-2xl w-full mx-auto mb-4">
                    <div className="glass rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">
                                {currentTask.title} - 確認問題
                            </span>
                            <span className="text-sm text-gray-400">
                                {currentQuestionIndex + 1} / {currentTask.questions.length}
                            </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / currentTask.questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* 問題 */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-2xl w-full animate-fade-in">
                        <div className="glass rounded-3xl p-6 md:p-8">
                            <p className="text-lg font-medium mb-6">{currentQuestion.text}</p>

                            <div className="space-y-3 mb-6">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSelectAnswer(option.id)}
                                        disabled={showFeedback}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                            showFeedback
                                                ? option.correct
                                                    ? 'border-green-500 bg-green-500/20'
                                                    : selectedAnswer === option.id
                                                        ? 'border-red-500 bg-red-500/20'
                                                        : 'border-white/10 bg-white/5'
                                                : selectedAnswer === option.id
                                                    ? 'border-indigo-500 bg-indigo-500/20'
                                                    : 'border-white/10 bg-white/5 hover:border-indigo-500/50'
                                        } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        <span className="font-medium mr-2">{option.id.toUpperCase()}.</span>
                                        {option.text}
                                    </button>
                                ))}
                            </div>

                            {!showFeedback ? (
                                <button
                                    onClick={handleSubmitAnswer}
                                    disabled={!selectedAnswer}
                                    className={`w-full font-bold py-4 px-8 rounded-2xl text-lg transition-all ${
                                        selectedAnswer
                                            ? 'btn-primary text-white'
                                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    回答する
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextQuestion}
                                    className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                >
                                    {currentQuestionIndex < currentTask.questions.length - 1
                                        ? '次の問題へ'
                                        : currentTaskIndex < totalTasks - 1
                                            ? '次の記事へ'
                                            : '完了'
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
