import { TECHNIQUES } from '../data/techniques';
import { TARGETS } from '../data/targets';
import { TechniqueTag } from './common/TechniqueTag';

export const Stage2Intro = ({ stage1Data, onContinue }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass rounded-3xl p-8 md:p-12">
                    {/* Stage1の結果サマリー */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🎯</div>
                        <h1 className="text-3xl font-bold mb-2">Stage 1 完了！</h1>
                        <p className="text-gray-400">レトリック技法を見破る訓練が終わりました</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-400">正答率</p>
                                <p className={`text-3xl font-bold ${
                                    stage1Data.accuracy >= 70 ? 'text-green-400' : 
                                    stage1Data.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                    {stage1Data.accuracy}%
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-400">スコア</p>
                                <p className="text-3xl font-bold text-indigo-400">{stage1Data.score}</p>
                            </div>
                        </div>
                        
                        {stage1Data.weakTechniques.length > 0 && (
                            <div className="border-t border-white/10 pt-4">
                                <p className="text-sm text-gray-400 mb-2">見破りにくかった技法:</p>
                                <div className="flex flex-wrap gap-2">
                                    {stage1Data.weakTechniques.map(tech => (
                                        <TechniqueTag key={tech} techniqueId={tech} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stage2の説明 */}
                    <div className="bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">📱</span>
                            次のステージ：インフルエンサー体験
                        </h2>
                        
                        <p className="text-gray-300 leading-relaxed mb-4">
                            今度は<strong className="text-purple-400">攻撃者の視点</strong>を体験します。
                            あなたは健康情報を発信するインフルエンサーになり、
                            フォロワーを増やすために投稿を選んでいきます。
                        </p>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-start gap-3">
                                <span className="bg-indigo-500/30 text-indigo-300 rounded-full w-7 h-7 flex items-center justify-center font-bold shrink-0 text-sm">1</span>
                                <p className="text-gray-300 text-sm">
                                    <strong>ターゲット選択</strong>：どの層に向けて投稿するか決める
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-indigo-500/30 text-indigo-300 rounded-full w-7 h-7 flex items-center justify-center font-bold shrink-0 text-sm">2</span>
                                <p className="text-gray-300 text-sm">
                                    <strong>投稿選択</strong>：3つの選択肢から投稿内容を選ぶ
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-indigo-500/30 text-indigo-300 rounded-full w-7 h-7 flex items-center justify-center font-bold shrink-0 text-sm">3</span>
                                <p className="text-gray-300 text-sm">
                                    <strong>結果確認</strong>：フォロワー数と信頼性の変化を見る
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                            <p className="text-yellow-300 text-sm font-medium mb-1">💡 ポイント</p>
                            <p className="text-gray-300 text-sm">
                                操作的なレトリック技法を使えばフォロワーは増えますが、
                                <strong className="text-red-400">信頼性が下がります</strong>。
                                短期的な利益と長期的な信頼のバランスを考えながらプレイしてみてください。
                            </p>
                        </div>
                    </div>

                    {/* 3つのターゲットの紹介 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-center">ターゲット層の特徴</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {Object.values(TARGETS).map(target => (
                                <div key={target.id} className="bg-white/5 rounded-xl p-4 text-center">
                                    <div className="text-3xl mb-2">{target.icon}</div>
                                    <h4 className="font-bold text-sm mb-1">{target.name}</h4>
                                    <p className="text-xs text-gray-400">{target.traits}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={onContinue}
                        className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                    >
                        Stage 2 を始める
                    </button>
                </div>
            </div>
        </div>
    );
};

// 同意画面コンポーネント
