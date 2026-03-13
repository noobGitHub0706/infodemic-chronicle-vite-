import { useState, useRef } from 'react';
import { TRANSFER_TEST_SETS } from '../data/transferTests';
import { SNSPostCard } from '../common/SNSPostCard';

export const TransferTest = ({ testSet, isPreTest, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [showIntro, setShowIntro] = useState(true);
    const questionStartTimeRef = useRef(null);

    const questions = TRANSFER_TEST_SETS[testSet];
    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleResponse = (value) => {
        const responseTimeMs = questionStartTimeRef.current !== null
            ? Date.now() - questionStartTimeRef.current
            : null;

        const newResponses = {
            ...responses,
            [currentQuestion.id]: {
                rating: value,
                manipulative: currentQuestion.manipulative,
                techniques: currentQuestion.techniques,
                style: currentQuestion.style,
                topic: currentQuestion.topic,
                responseTimeMs,
                timestamp: new Date().toISOString()
            }
        };
        setResponses(newResponses);

        // 次の問題へ、または完了
        if (currentIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                questionStartTimeRef.current = Date.now();
            }, 300);
        } else {
            // 全問完了
            setTimeout(() => {
                onComplete({
                    testSet,
                    isPreTest,
                    responses: newResponses,
                    completedAt: new Date().toISOString()
                });
            }, 500);
        }
    };

    const ratingLabels = [
        '全く操作的でない',
        'ほぼ操作的でない',
        'やや操作的でない',
        'どちらとも言えない',
        'やや操作的',
        '操作的',
        '非常に操作的'
    ];

    // イントロ画面
    if (showIntro) {
        return (
            <div className="min-h-screen p-4 flex items-center justify-center">
                <div className="max-w-2xl w-full animate-fade-in">
                    <div className="glass rounded-3xl p-8 md:p-12">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">{isPreTest ? '📋' : '📊'}</div>
                            <h1 className="text-2xl font-bold mb-2">
                                {isPreTest ? '事前テスト' : '事後テスト'}
                            </h1>
                            <p className="text-gray-400">
                                {isPreTest
                                    ? 'ゲームを始める前に、いくつかのSNS投稿を評価していただきます。'
                                    : 'ゲーム終了後のテストです。先ほどとは異なる投稿を評価していただきます。'
                                }
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 mb-8">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span>📝</span> テストの説明
                            </h2>
                            <ul className="space-y-3 text-gray-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400">•</span>
                                    8つのSNS投稿が表示されます
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400">•</span>
                                    各投稿の「操作性」を7段階で評価してください
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400">•</span>
                                    正解・不正解はありません。直感で答えてください
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400">•</span>
                                    所要時間は約3〜4分です
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => {
                                questionStartTimeRef.current = Date.now();
                                setShowIntro(false);
                            }}
                            className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                        >
                            テストを開始する
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* ヘッダー */}
            <div className="max-w-2xl w-full mx-auto mb-4">
                <div className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">
                            {isPreTest ? '事前テスト' : '事後テスト'}
                        </span>
                        <span className="text-sm text-gray-400">{currentIndex + 1} / {questions.length}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="flex-1 flex items-center justify-center">
                <div className="max-w-2xl w-full animate-fade-in" key={currentQuestion.id}>
                    <div className="glass rounded-3xl p-6 md:p-8">
                        {/* 質問 */}
                        <p className="text-center text-gray-300 mb-6">
                            以下の投稿を読んで、操作性を評価してください
                        </p>

                        {/* SNS投稿カード */}
                        <div className="mb-8">
                            <SNSPostCard
                                account={currentQuestion.account}
                                accountId={currentQuestion.accountId}
                                text={currentQuestion.text}
                                isInteractive={true}
                            />
                        </div>

                        {/* 評価尺度 */}
                        <div className="mb-6">
                            <p className="text-center text-sm text-gray-400 mb-4">
                                この投稿はどの程度操作的だと思いますか？
                            </p>

                            <div className="grid grid-cols-7 gap-2 mb-3">
                                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => handleResponse(value)}
                                        className={`py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 ${
                                            responses[currentQuestion.id]?.rating === value
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>

                            {/* ラベル */}
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>全く操作的でない</span>
                                <span>どちらとも言えない</span>
                                <span>非常に操作的</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
