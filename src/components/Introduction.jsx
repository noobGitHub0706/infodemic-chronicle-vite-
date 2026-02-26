import { useState } from 'react';
import { TECHNIQUES } from '../data/techniques';
import { TechniqueTag } from './common/TechniqueTag';
import { INTRO_NARRATIVE } from '../data/narrative';
import { DialogueBox } from './common/DialogueBox';

export const Introduction = ({ onStart }) => {
    const [showTechniques, setShowTechniques] = useState(false);
    const [narrativeStep, setNarrativeStep] = useState(0);

    const opening = INTRO_NARRATIVE.opening;
    const isNarrativeActive = narrativeStep < opening.length;

    // --- オープニングシーケンス ---
    if (isNarrativeActive) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-2xl w-full animate-fade-in">
                    <div className="glass rounded-3xl p-8 md:p-10">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                インフォデミック・クロニクル
                            </div>
                            <button
                                onClick={() => setNarrativeStep(opening.length)}
                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
                            >
                                スキップ →
                            </button>
                        </div>

                        <div className="min-h-36">
                            <DialogueBox dialogue={opening[narrativeStep]} />
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <div className="flex gap-1.5">
                                {opening.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            i === narrativeStep ? 'bg-indigo-400 w-6' :
                                            i < narrativeStep ? 'bg-indigo-700 w-3' : 'bg-white/20 w-3'
                                        }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => setNarrativeStep(prev => prev + 1)}
                                className="btn-primary text-white font-bold py-3 px-8 rounded-2xl"
                            >
                                {narrativeStep < opening.length - 1 ? '次へ →' : '続ける →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- メインコンテンツ（技法ブリーフィング挿入済み）---
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

                        {/* 技法ブリーフィング前セリフ */}
                        <DialogueBox dialogue={INTRO_NARRATIVE.techniqueBriefingIntro} />

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

                        {/* 技法ブリーフィング後セリフ */}
                        <DialogueBox dialogue={INTRO_NARRATIVE.techniqueBriefingOutro} />
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
