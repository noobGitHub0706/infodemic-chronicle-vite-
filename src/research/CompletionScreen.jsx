export const CompletionScreen = ({ onShowData, onRestart }) => {
    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass rounded-3xl p-8 md:p-12 text-center">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        ご協力ありがとうございました！
                    </h1>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        すべてのステップが完了しました。<br />
                        このゲームで学んだことを、日常のSNS利用に活かしていただければ幸いです。
                    </p>

                    <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span>💡</span> 今日から実践できること
                        </h2>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                「すぐに行動しないと」と焦らせる情報は一度立ち止まる
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                「専門家が言っている」の専門家が実在するか確認する
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                具体的な数字が出てきたら、出典やサンプル数を確認する
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                「みんなやっている」に流されず、自分で判断する
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onShowData}
                            className="flex-1 btn-primary text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2"
                        >
                            <span>📊</span> データを出力
                        </button>
                        <button
                            onClick={onRestart}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl transition-all"
                        >
                            もう一度プレイ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
