import { useState } from 'react';
import { TECHNIQUES } from '../data/techniques';
import { TechniqueTag } from './common/TechniqueTag';

export const Stage3Intro = ({ stage3Data, onContinue }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass rounded-3xl p-8 md:p-12">
                    {/* Stage2の結果サマリー */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">📱</div>
                        <h1 className="text-3xl font-bold mb-2">Stage 2 完了！</h1>
                        <p className="text-gray-400">インフルエンサー体験が終わりました</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-400">最終フォロワー</p>
                                <p className="text-3xl font-bold text-indigo-400">
                                    {stage3Data.totalFollowers.toLocaleString()}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-400">最終信頼性</p>
                                <p className={`text-3xl font-bold ${
                                    stage3Data.finalEthics >= 50 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {stage3Data.finalEthics}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stage3の説明 */}
                    <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">🔍</span>
                            最終ステージ：情報検証訓練
                        </h2>
                        
                        <p className="text-gray-300 leading-relaxed mb-4">
                            最後のステージでは、<strong className="text-cyan-400">操作的な投稿を検証するスキル</strong>を訓練します。
                            「本当かどうか」を自分で確認する方法を学びましょう。
                        </p>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-start gap-3">
                                <span className="bg-cyan-500/30 text-cyan-300 rounded-full w-7 h-7 flex items-center justify-center font-bold shrink-0 text-sm">1</span>
                                <p className="text-gray-300 text-sm">
                                    <strong>検証行動の選択</strong>：まず何を確認すべきかを選ぶ
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-cyan-500/30 text-cyan-300 rounded-full w-7 h-7 flex items-center justify-center font-bold shrink-0 text-sm">2</span>
                                <p className="text-gray-300 text-sm">
                                    <strong>情報源の選択</strong>：どこで確認するかを選ぶ
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-cyan-500/30 text-cyan-300 rounded-full w-7 h-7 flex items-center justify-center font-bold shrink-0 text-sm">3</span>
                                <p className="text-gray-300 text-sm">
                                    <strong>結果の解釈</strong>：検証結果をどう判断するか
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                            <p className="text-yellow-300 text-sm font-medium mb-1">💡 Lateral Reading（横断的読解）</p>
                            <p className="text-gray-300 text-sm">
                                専門家は投稿を「じっくり読む」のではなく、
                                <strong className="text-green-400">すぐに外部で確認</strong>します。
                                このスキルを身につけましょう。
                            </p>
                        </div>
                    </div>

                    {/* 検証行動の紹介 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-center">学ぶ検証行動</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-2xl mb-1">👤</div>
                                <p className="text-xs font-bold text-gray-300">発信者の確認</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-2xl mb-1">🔢</div>
                                <p className="text-xs font-bold text-gray-300">出典の検索</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-2xl mb-1">🏛️</div>
                                <p className="text-xs font-bold text-gray-300">公式情報源</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-2xl mb-1">📰</div>
                                <p className="text-xs font-bold text-gray-300">複数情報源</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-2xl mb-1">✅</div>
                                <p className="text-xs font-bold text-gray-300">ファクトチェック</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-2xl mb-1">🤔</div>
                                <p className="text-xs font-bold text-gray-300">適切な解釈</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onContinue}
                        className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                    >
                        Stage 3 を始める
                    </button>
                </div>
            </div>
        </div>
    );
};

// Stage3: 情報検証訓練（Lateral Reading）
