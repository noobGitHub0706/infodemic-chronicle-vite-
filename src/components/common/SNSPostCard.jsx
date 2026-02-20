import { useState, Fragment } from 'react';

export const SNSPostCard = ({ account, accountId, text, isInteractive = true, compact = false }) => {
            // 決定論的シード生成（accountIdの文字コード合計）
            const seed = (accountId || '@user').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            const seededRand = (n, offset = 0) => ((seed * 1664525 + 1013904223 + offset * 22695477) >>> 0) % n;

            const AVATAR_GRADIENTS = [
                'from-blue-400 to-cyan-400',
                'from-purple-400 to-pink-400',
                'from-green-400 to-emerald-400',
                'from-orange-400 to-red-400',
                'from-yellow-400 to-orange-400',
                'from-pink-400 to-rose-400',
                'from-indigo-400 to-blue-400',
                'from-teal-400 to-green-400',
            ];
            const gradient = AVATAR_GRADIENTS[seededRand(AVATAR_GRADIENTS.length)];
            const hours = seededRand(23, 1) + 1;
            const timestamp = `${hours}h`;

            // エンゲージメント数値（擬似ランダム）
            const replies = seededRand(80, 2) + 2;
            const baseRetweets = seededRand(200, 3) + 5;
            const baseLikes = seededRand(800, 4) + 20;
            const views = seededRand(9000, 5) + 500;
            const formatNum = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

            const [liked, setLiked] = useState(false);
            const [retweeted, setRetweeted] = useState(false);

            // ハッシュタグを青文字にレンダリング
            const renderText = (t) => {
                const parts = t.split(/(\s#\S+)/g);
                return parts.map((part, i) => {
                    if (/^\s#\S+/.test(part)) {
                        const space = part.match(/^(\s)/)?.[1] || '';
                        const tag = part.trimStart();
                        return <Fragment key={i}>{space}<span className="text-blue-400">{tag}</span></Fragment>;
                    }
                    return <Fragment key={i}>{part}</Fragment>;
                });
            };

            const avatarInitial = (account || 'U').charAt(0);

            return (
                <div className={`bg-[#16181c] border border-white/10 rounded-2xl ${compact ? 'p-3' : 'p-4'} text-left`}>
                    {/* ヘッダー行 */}
                    <div className="flex items-start gap-3">
                        {/* アバター */}
                        <div className={`bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center font-bold text-white shrink-0 ${compact ? 'w-9 h-9 text-sm' : 'w-11 h-11 text-base'}`}>
                            {avatarInitial}
                        </div>
                        {/* アカウント情報 */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 flex-wrap">
                                <span className={`font-bold text-white truncate ${compact ? 'text-sm' : 'text-[15px]'}`}>{account || 'ユーザー'}</span>
                                <span className={`text-gray-500 truncate ${compact ? 'text-xs' : 'text-sm'}`}>{accountId || '@user'}</span>
                                <span className="text-gray-500 text-sm">·</span>
                                <span className="text-gray-500 text-sm shrink-0">{timestamp}</span>
                            </div>
                            {/* 投稿本文 */}
                            <p className={`text-gray-100 whitespace-pre-line mt-1 leading-relaxed ${compact ? 'text-sm' : 'text-[15px]'}`}>
                                {renderText(text || '')}
                            </p>
                            {/* エンゲージメントボタン */}
                            {!compact && (
                                <div className="flex items-center gap-5 mt-3 text-gray-500">
                                    {/* 返信 */}
                                    <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group" disabled={!isInteractive}>
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] group-hover:fill-blue-400/20 rounded-full transition-all" fill="none" stroke="currentColor" strokeWidth="1.75">
                                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
                                        </svg>
                                        <span className="text-sm">{formatNum(replies)}</span>
                                    </button>
                                    {/* リポスト */}
                                    <button
                                        className="flex items-center gap-1.5 hover:text-green-400 transition-colors group"
                                        style={retweeted ? { color: '#00ba7c' } : {}}
                                        onClick={isInteractive ? () => setRetweeted(r => !r) : undefined}
                                        disabled={!isInteractive}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
                                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
                                        </svg>
                                        <span className="text-sm">{formatNum(baseRetweets + (retweeted ? 1 : 0))}</span>
                                    </button>
                                    {/* いいね */}
                                    <button
                                        className="flex items-center gap-1.5 hover:text-pink-500 transition-colors group"
                                        style={liked ? { color: '#f91880' } : {}}
                                        onClick={isInteractive ? () => setLiked(l => !l) : undefined}
                                        disabled={!isInteractive}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] transition-all" fill={liked ? '#f91880' : 'none'} stroke="currentColor" strokeWidth="1.75">
                                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.582 1.074 1.74 3.261 3.77 7.127 6.03 3.865-2.26 6.052-4.29 7.126-6.03 1.111-1.8 1.03-3.46.477-4.58-.561-1.13-1.666-1.84-2.906-1.91zm4.853 4.211c-1.431 2.315-4.081 4.67-8.543 7.29-4.464-2.62-7.014-4.975-8.546-7.29C2.939 8.065 3.068 5.71 4.435 4.266 5.831 2.79 7.85 2.44 9.618 3.01c0 0 .538.16.975.49.558-.4 1.181-.67 1.826-.78V2h.003c.832 0 1.55.42 1.98 1.06.29.43.46.95.46 1.5v.72c.435.11.85.31 1.214.59.34.26.566.61.566.96v.3c1.72-.23 3.47.46 4.41 2.08z"/>
                                        </svg>
                                        <span className="text-sm">{formatNum(baseLikes + (liked ? 1 : 0))}</span>
                                    </button>
                                    {/* 閲覧数 */}
                                    <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors" disabled={!isInteractive}>
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
                                            <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/>
                                        </svg>
                                        <span className="text-sm">{formatNum(views)}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* メニューボタン（装飾） */}
                        <button className="text-gray-600 hover:text-gray-400 shrink-0 mt-0.5" disabled>
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
            </svg>
                        </button>
                    </div>
                </div>
            );
        };
