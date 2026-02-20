import { useState } from 'react';
import { TECHNIQUES } from '../data/techniques';
import { TechniqueTag } from './common/TechniqueTag';

export const Introduction = ({ onStart }) => {
    const [showTechniques, setShowTechniques] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            インフォデミック・クロニクル
                        </h1>
                        <p className="text-gray-400 text-lg">
                            情報操作のレトリックを見破り、体験するシミュレーションゲーム
                        </p>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="bg-white/5 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <span className="text-2xl">🎯</span> このゲームの目的
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                SNS上で拡散される健康情報には、様々な<strong className="text-purple-400">レトリック技法</strong>が使われています。
                                このゲームでは、それらの技法を<strong className="text-indigo-400">見破る力</strong>と、
                                <strong className="text-pink-400">使う側の視点</strong>を体験することで、
                                情報操作への抵抗力を身につけます。
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <span className="text-2xl">📋</span> ゲームの流れ
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="bg-indigo-500/30 text-indigo-300 rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</span>
                                    <div>
                                        <p className="font-medium">Stage 1: 見破る</p>
                                        <p className="text-sm text-gray-400">SNS投稿に隠されたレトリック技法を識別します（10問）</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-purple-500/30 text-purple-300 rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
                                    <div>
                                        <p className="font-medium">Stage 2: インフルエンサー体験</p>
                                        <p className="text-sm text-gray-400">攻撃者の視点で投稿を選び、その効果を体験します（5ラウンド）</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-cyan-500/30 text-cyan-300 rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
                                    <div>
                                        <p className="font-medium">Stage 3: 情報検証訓練</p>
                                        <p className="text-sm text-gray-400">操作的投稿を外部で検証するスキルを訓練（3シナリオ）</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-green-500/30 text-green-300 rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">✓</span>
                                    <div>
                                        <p className="font-medium">最終評価</p>
                                        <p className="text-sm text-gray-400">あなたの識別能力と行動の振り返り</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowTechniques(!showTechniques)}
                            className="w-full text-left bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                        >
                            <h2 className="text-xl font-bold mb-1 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <span className="text-2xl">🔍</span> 6つのレトリック技法
                                </span>
                                <span className="text-gray-400">{showTechniques ? '▲' : '▼'}</span>
                            </h2>
                            <p className="text-sm text-gray-400">クリックして詳細を確認</p>
                        </button>

                        {showTechniques && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                                {Object.values(TECHNIQUES).map(tech => (
                                    <div 
                                        key={tech.id}
                                        className={`${tech.bgColor} border ${tech.borderColor} rounded-xl p-4`}
                                    >
                                        <h3 className={`font-bold ${tech.textColor}`}>{tech.name}</h3>
                                        <p className="text-sm text-gray-300 mt-1">{tech.description}</p>
                                        <p className="text-xs text-gray-400 mt-2 italic">例: {tech.example}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onStart}
                        className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                    >
                        ゲームを始める
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-4">
                        所要時間: 約25-35分
                    </p>
                </div>
            </div>
        </div>
    );
};

// 反駁フェーズ用の投稿プレビューコンポーネント（展開/折りたたみ機能付き）
