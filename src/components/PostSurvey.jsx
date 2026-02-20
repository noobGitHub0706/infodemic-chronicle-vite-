import { useState } from 'react';

export const PostSurvey = ({ onComplete, onShowData }) => {
    const [responses, setResponses] = useState({
        enjoyment: 0,        // 楽しさ
        understanding: 0,    // 理解度
        behaviorChange: 0,   // 行動変容意図
        difficulty: 0,       // 難易度
        recommendation: 0,   // 推奨度
        freeComment: ''      // 自由記述
    });

    const questions = [
        {
            id: 'enjoyment',
            text: 'このゲームは楽しかったですか？',
            labels: ['全く楽しくなかった', 'あまり楽しくなかった', 'どちらとも言えない', 'まあ楽しかった', 'とても楽しかった']
        },
        {
            id: 'understanding',
            text: 'レトリック技法について理解が深まりましたか？',
            labels: ['全く深まらなかった', 'あまり深まらなかった', 'どちらとも言えない', 'まあ深まった', 'とても深まった']
        },
        {
            id: 'behaviorChange',
            text: '今後、SNSで健康情報を見るときの意識が変わりそうですか？',
            labels: ['全く変わらない', 'あまり変わらない', 'どちらとも言えない', 'まあ変わりそう', 'とても変わりそう']
        },
        {
            id: 'difficulty',
            text: 'ゲームの難易度はいかがでしたか？',
            labels: ['とても簡単', 'やや簡単', 'ちょうど良い', 'やや難しい', 'とても難しい']
        },
        {
            id: 'recommendation',
            text: 'このゲームを他の人にも勧めたいですか？',
            labels: ['全く勧めない', 'あまり勧めない', 'どちらとも言えない', 'まあ勧めたい', 'ぜひ勧めたい']
        }
    ];

    const allAnswered = questions.every(q => responses[q.id] > 0);

    const handleSubmit = () => {
        onComplete(responses);
    };

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass rounded-3xl p-6 md:p-8">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">📝</div>
                        <h1 className="text-2xl font-bold mb-2">事後アンケート</h1>
                        <p className="text-gray-400 text-sm">
                            最後に、ゲームについてのご意見をお聞かせください
                        </p>
                    </div>

                    <div className="space-y-6 mb-8">
                        {questions.map((question, qIndex) => (
                            <div key={question.id} className="bg-white/5 rounded-2xl p-5">
                                <p className="text-sm font-medium text-gray-200 mb-4">
                                    Q{qIndex + 1}. {question.text}
                                </p>
                                <div className="flex justify-between gap-2">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => setResponses(prev => ({ ...prev, [question.id]: value }))}
                                            className={`flex-1 py-3 px-2 rounded-xl text-xs font-medium transition-all ${
                                                responses[question.id] === value
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                            }`}
                                        >
                                            <div className="text-lg mb-1">{value}</div>
                                            <div className="hidden md:block text-xs leading-tight">{question.labels[value - 1]}</div>
                                        </button>
                                    ))}
                                </div>
                                {/* モバイル用ラベル */}
                                <div className="flex justify-between mt-2 md:hidden">
                                    <span className="text-xs text-gray-500">{question.labels[0]}</span>
                                    <span className="text-xs text-gray-500">{question.labels[4]}</span>
                                </div>
                            </div>
                        ))}

                        {/* 自由記述 */}
                        <div className="bg-white/5 rounded-2xl p-5">
                            <p className="text-sm font-medium text-gray-200 mb-4">
                                Q6. ご意見・ご感想があればお聞かせください（任意）
                            </p>
                            <textarea
                                value={responses.freeComment}
                                onChange={(e) => setResponses(prev => ({ ...prev, freeComment: e.target.value }))}
                                placeholder="改善点、気づいたこと、感想など..."
                                className="w-full bg-slate-700 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none h-24"
                                style={{ backgroundColor: '#334155' }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className={`w-full font-bold py-4 px-8 rounded-2xl text-lg transition-all mb-4 ${
                            allAnswered
                                ? 'btn-primary text-white'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {allAnswered ? '回答を送信して完了' : 'すべての質問に回答してください'}
                    </button>

                    <button
                        onClick={onShowData}
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <span>📊</span> データを出力
                    </button>
                </div>
            </div>
        </div>
    );
};

// 完了画面コンポーネント
