import { useState, useEffect } from 'react';
import { TECHNIQUES } from '../../data/techniques';

export const SpreadVisualization = ({ result, targetInfo }) => {
    const [animationPhase, setAnimationPhase] = useState(0);
    
    useEffect(() => {
        // アニメーションを段階的に進める
        const timers = [
            setTimeout(() => setAnimationPhase(1), 300),
            setTimeout(() => setAnimationPhase(2), 800),
            setTimeout(() => setAnimationPhase(3), 1300),
            setTimeout(() => setAnimationPhase(4), 1800)
        ];
        return () => timers.forEach(t => clearTimeout(t));
    }, []);

    // 拡散計算
    const techniques = result.post.techniques;
    const isManipulative = techniques.length > 0;
    const manipulationLevel = techniques.length; // 0-3
    
    // 1次拡散（直接届いた人）
    const primaryReach = result.newFollowers;
    
    // 2次拡散（シェアした人のフォロワー）
    const secondaryReach = Math.round(result.shares * 150 * (1 + manipulationLevel * 0.3));
    
    // 3次拡散（さらに広がった）
    const tertiaryReach = Math.round(secondaryReach * 0.2 * (1 + manipulationLevel * 0.2));
    
    // 誤情報を信じた人の割合（操作的なほど高い）
    const believerRate = isManipulative 
        ? 0.3 + manipulationLevel * 0.15 
        : 0.05;
    
    // 各層で信じた人の数
    const primaryBelievers = Math.round(primaryReach * believerRate);
    const secondaryBelievers = Math.round(secondaryReach * believerRate * 0.8);
    const tertiaryBelievers = Math.round(tertiaryReach * believerRate * 0.6);
    const totalBelievers = primaryBelievers + secondaryBelievers + tertiaryBelievers;
    
    // 総リーチ
    const totalReach = primaryReach + secondaryReach + tertiaryReach;

    // ノード生成関数
    const generateNodes = (count, radius, startAngle, isBeliever, layer) => {
        const nodes = [];
        const angleStep = (Math.PI * 2) / Math.max(count, 1);
        const maxNodes = Math.min(count, layer === 1 ? 8 : layer === 2 ? 12 : 16);
        
        for (let i = 0; i < maxNodes; i++) {
            const angle = startAngle + i * angleStep;
            const jitter = (Math.random() - 0.5) * 15;
            const x = 150 + Math.cos(angle) * (radius + jitter);
            const y = 150 + Math.sin(angle) * (radius + jitter);
            const isBelieving = i < Math.round(maxNodes * believerRate);
            nodes.push({ x, y, isBelieving, layer });
        }
        return nodes;
    };

    const primaryNodes = generateNodes(Math.min(primaryReach, 8), 50, 0, false, 1);
    const secondaryNodes = generateNodes(Math.min(Math.round(secondaryReach / 100), 12), 95, Math.PI / 12, false, 2);
    const tertiaryNodes = generateNodes(Math.min(Math.round(tertiaryReach / 200), 16), 135, Math.PI / 16, false, 3);

    return (
        <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-4 mb-6 border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <span>🌐</span> 情報拡散シミュレーション
            </h3>
            
            <div className="flex flex-col md:flex-row gap-4">
                {/* ネットワーク図 */}
                <div className="flex-1 flex justify-center">
                    <svg width="300" height="300" viewBox="0 0 300 300" className="max-w-full">
                        {/* 背景の円（拡散範囲） */}
                        <circle 
                            cx="150" cy="150" r="140" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.05)" 
                            strokeWidth="1"
                            className={animationPhase >= 3 ? 'opacity-100' : 'opacity-0'}
                            style={{ transition: 'opacity 0.5s' }}
                        />
                        <circle 
                            cx="150" cy="150" r="100" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.08)" 
                            strokeWidth="1"
                            className={animationPhase >= 2 ? 'opacity-100' : 'opacity-0'}
                            style={{ transition: 'opacity 0.5s' }}
                        />
                        <circle 
                            cx="150" cy="150" r="55" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.1)" 
                            strokeWidth="1"
                            className={animationPhase >= 1 ? 'opacity-100' : 'opacity-0'}
                            style={{ transition: 'opacity 0.5s' }}
                        />

                        {/* エッジ（接続線） */}
                        {animationPhase >= 1 && primaryNodes.map((node, i) => (
                            <line 
                                key={`edge-p-${i}`}
                                x1="150" y1="150" 
                                x2={node.x} y2={node.y}
                                stroke={node.isBelieving ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}
                                strokeWidth="1"
                                style={{ 
                                    opacity: animationPhase >= 1 ? 1 : 0,
                                    transition: 'opacity 0.3s'
                                }}
                            />
                        ))}
                        
                        {animationPhase >= 2 && secondaryNodes.map((node, i) => (
                            <line 
                                key={`edge-s-${i}`}
                                x1={primaryNodes[i % primaryNodes.length]?.x || 150} 
                                y1={primaryNodes[i % primaryNodes.length]?.y || 150}
                                x2={node.x} y2={node.y}
                                stroke={node.isBelieving ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}
                                strokeWidth="1"
                                style={{ 
                                    opacity: animationPhase >= 2 ? 1 : 0,
                                    transition: 'opacity 0.3s'
                                }}
                            />
                        ))}

                        {animationPhase >= 3 && tertiaryNodes.map((node, i) => (
                            <line 
                                key={`edge-t-${i}`}
                                x1={secondaryNodes[i % secondaryNodes.length]?.x || 150}
                                y1={secondaryNodes[i % secondaryNodes.length]?.y || 150}
                                x2={node.x} y2={node.y}
                                stroke={node.isBelieving ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)'}
                                strokeWidth="1"
                                style={{ 
                                    opacity: animationPhase >= 3 ? 1 : 0,
                                    transition: 'opacity 0.3s'
                                }}
                            />
                        ))}

                        {/* 3次拡散ノード */}
                        {animationPhase >= 3 && tertiaryNodes.map((node, i) => (
                            <circle 
                                key={`tertiary-${i}`}
                                cx={node.x} cy={node.y} r="4"
                                fill={node.isBelieving ? '#ef4444' : '#6366f1'}
                                opacity={0.5}
                                style={{ 
                                    transition: 'all 0.3s',
                                    transform: animationPhase >= 3 ? 'scale(1)' : 'scale(0)'
                                }}
                            />
                        ))}

                        {/* 2次拡散ノード */}
                        {animationPhase >= 2 && secondaryNodes.map((node, i) => (
                            <circle 
                                key={`secondary-${i}`}
                                cx={node.x} cy={node.y} r="5"
                                fill={node.isBelieving ? '#ef4444' : '#818cf8'}
                                opacity={0.7}
                                style={{ 
                                    transition: 'all 0.3s',
                                    transform: animationPhase >= 2 ? 'scale(1)' : 'scale(0)'
                                }}
                            />
                        ))}

                        {/* 1次拡散ノード（ターゲット層） */}
                        {animationPhase >= 1 && primaryNodes.map((node, i) => (
                            <g key={`primary-${i}`}>
                                <circle 
                                    cx={node.x} cy={node.y} r="8"
                                    fill={node.isBelieving ? '#ef4444' : '#a5b4fc'}
                                    stroke={node.isBelieving ? '#fca5a5' : '#c7d2fe'}
                                    strokeWidth="2"
                                    style={{ 
                                        transition: 'all 0.3s',
                                        transform: animationPhase >= 1 ? 'scale(1)' : 'scale(0)'
                                    }}
                                />
                            </g>
                        ))}

                        {/* 中央ノード（あなた） */}
                        <circle 
                            cx="150" cy="150" r="15"
                            fill="url(#centerGradient)"
                            stroke="#fff"
                            strokeWidth="2"
                        />
                        <text x="150" y="155" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                            You
                        </text>

                        {/* グラデーション定義 */}
                        <defs>
                            <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* 統計情報 */}
                <div className="flex-1 space-y-3">
                    <div className="text-xs text-gray-400 mb-2">推定拡散データ</div>
                    
                    <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">総リーチ</span>
                            <span className="text-lg font-bold text-indigo-400">
                                {animationPhase >= 4 ? totalReach.toLocaleString() : '---'}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            1次: {primaryReach} → 2次: {secondaryReach.toLocaleString()} → 3次: {tertiaryReach.toLocaleString()}
                        </div>
                    </div>

                    {isManipulative && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-red-300">誤情報を信じた人</span>
                                <span className="text-lg font-bold text-red-400">
                                    {animationPhase >= 4 ? `約${totalBelievers.toLocaleString()}人` : '---'}
                                </span>
                            </div>
                            <div className="text-xs text-red-400/70 mt-1">
                                操作的な技法により、{Math.round(believerRate * 100)}%が影響を受けました
                            </div>
                        </div>
                    )}

                    {!isManipulative && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-300">正確な情報の拡散</span>
                                <span className="text-lg font-bold text-green-400">✓</span>
                            </div>
                            <div className="text-xs text-green-400/70 mt-1">
                                誠実な投稿は信頼性を維持したまま広がります
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 text-xs">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
                            <span className="text-gray-400">正常な拡散</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-red-400"></span>
                            <span className="text-gray-400">誤情報を信じた人</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// イントロダクション画面
