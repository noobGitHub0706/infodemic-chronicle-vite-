import { useState } from 'react';

export const ConsentScreen = ({ onAgree, experimentCondition }) => {
    const [agreed, setAgreed] = useState(false);
    const [participantId, setParticipantId] = useState('');
    const [demographics, setDemographics] = useState({
        ageGroup: '',
        gender: '',
        snsFrequency: '',
        healthInfoSource: ''
    });

    const handleSubmit = () => {
        onAgree({
            participantId: participantId.trim() || null,
            demographics: {
                ageGroup: demographics.ageGroup || null,
                gender: demographics.gender || null,
                snsFrequency: demographics.snsFrequency || null,
                healthInfoSource: demographics.healthInfoSource || null
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">📋</div>
                        <h1 className="text-3xl font-bold mb-2">研究参加への同意</h1>
                        <p className="text-gray-400">ゲームを始める前にお読みください</p>
                        {experimentCondition && (
                            <p className="text-xs text-indigo-400 mt-2">条件: {experimentCondition}</p>
                        )}
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 mb-6 max-h-60 overflow-y-auto scrollbar-hide">
                        <h2 className="font-bold text-lg mb-4">研究の目的</h2>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            本研究は、健康情報に関するメディアリテラシー教育の効果を検証することを目的としています。
                            このゲームでは、SNS上で使用される説得技法（レトリック技法）を学び、
                            誤情報を見抜く力を養うことを目指しています。
                        </p>

                        <h2 className="font-bold text-lg mb-4">収集するデータ</h2>
                        <ul className="text-gray-300 text-sm space-y-2 mb-4">
                            <li>• ゲーム内での回答内容と正誤</li>
                            <li>• 各ステージの所要時間</li>
                            <li>• 選択した投稿とその結果</li>
                            <li>• 基本属性（任意回答）</li>
                        </ul>
                        <p className="text-gray-400 text-sm mb-4">
                            ※ 個人を特定できる情報（氏名、メールアドレス等）は収集しません。
                        </p>

                        <h2 className="font-bold text-lg mb-4">データの取り扱い</h2>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            収集したデータは研究目的のみに使用され、統計的に処理された形で
                            学術論文や発表で使用される可能性があります。
                            データは厳重に管理され、研究終了後は適切に廃棄されます。
                        </p>

                        <h2 className="font-bold text-lg mb-4">参加の任意性</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            本研究への参加は任意です。参加に同意した後でも、
                            いつでも参加を中止することができます。
                            参加を中止しても、不利益を受けることはありません。
                        </p>
                    </div>

                    {/* 被験者ID入力 */}
                    <div className="bg-white/5 rounded-2xl p-4 mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            被験者ID（任意）
                        </label>
                        <input
                            type="text"
                            value={participantId}
                            onChange={(e) => setParticipantId(e.target.value)}
                            placeholder="指定されたIDがあれば入力してください"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            ※ 空欄の場合は自動生成されます
                        </p>
                    </div>

                    {/* デモグラフィック情報 */}
                    <div className="bg-white/5 rounded-2xl p-4 mb-6">
                        <p className="text-sm font-medium text-gray-300 mb-4">
                            基本属性（任意・分析のために使用します）
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">年代</label>
                                <select
                                    value={demographics.ageGroup}
                                    onChange={(e) => setDemographics(prev => ({ ...prev, ageGroup: e.target.value }))}
                                    className="w-full bg-slate-700 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    style={{ backgroundColor: '#334155' }}
                                >
                                    <option value="" style={{ backgroundColor: '#334155' }}>選択してください</option>
                                    <option value="10s" style={{ backgroundColor: '#334155' }}>10代</option>
                                    <option value="20s" style={{ backgroundColor: '#334155' }}>20代</option>
                                    <option value="30s" style={{ backgroundColor: '#334155' }}>30代</option>
                                    <option value="40s" style={{ backgroundColor: '#334155' }}>40代</option>
                                    <option value="50s" style={{ backgroundColor: '#334155' }}>50代</option>
                                    <option value="60+" style={{ backgroundColor: '#334155' }}>60代以上</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">性別</label>
                                <select
                                    value={demographics.gender}
                                    onChange={(e) => setDemographics(prev => ({ ...prev, gender: e.target.value }))}
                                    className="w-full bg-slate-700 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    style={{ backgroundColor: '#334155' }}
                                >
                                    <option value="" style={{ backgroundColor: '#334155' }}>選択してください</option>
                                    <option value="male" style={{ backgroundColor: '#334155' }}>男性</option>
                                    <option value="female" style={{ backgroundColor: '#334155' }}>女性</option>
                                    <option value="other" style={{ backgroundColor: '#334155' }}>その他</option>
                                    <option value="no_answer" style={{ backgroundColor: '#334155' }}>回答しない</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">SNS利用頻度</label>
                                <select
                                    value={demographics.snsFrequency}
                                    onChange={(e) => setDemographics(prev => ({ ...prev, snsFrequency: e.target.value }))}
                                    className="w-full bg-slate-700 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    style={{ backgroundColor: '#334155' }}
                                >
                                    <option value="" style={{ backgroundColor: '#334155' }}>選択してください</option>
                                    <option value="daily_heavy" style={{ backgroundColor: '#334155' }}>毎日2時間以上</option>
                                    <option value="daily_light" style={{ backgroundColor: '#334155' }}>毎日2時間未満</option>
                                    <option value="weekly" style={{ backgroundColor: '#334155' }}>週に数回</option>
                                    <option value="rarely" style={{ backgroundColor: '#334155' }}>ほとんど使わない</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">健康情報の主な入手元</label>
                                <select
                                    value={demographics.healthInfoSource}
                                    onChange={(e) => setDemographics(prev => ({ ...prev, healthInfoSource: e.target.value }))}
                                    className="w-full bg-slate-700 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    style={{ backgroundColor: '#334155' }}
                                >
                                    <option value="" style={{ backgroundColor: '#334155' }}>選択してください</option>
                                    <option value="sns" style={{ backgroundColor: '#334155' }}>SNS（X, Instagram等）</option>
                                    <option value="search" style={{ backgroundColor: '#334155' }}>検索エンジン</option>
                                    <option value="tv_news" style={{ backgroundColor: '#334155' }}>テレビ・ニュース</option>
                                    <option value="medical" style={{ backgroundColor: '#334155' }}>医療機関・専門家</option>
                                    <option value="family_friends" style={{ backgroundColor: '#334155' }}>家族・友人</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-5 h-5 mt-1 rounded border-gray-500 bg-white/10 text-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                            上記の内容を理解し、研究への参加に同意します。
                            収集されたデータが研究目的で使用されることに同意します。
                        </span>
                    </label>

                    <button
                        onClick={handleSubmit}
                        disabled={!agreed}
                        className={`w-full font-bold py-4 px-8 rounded-2xl text-lg transition-all ${
                            agreed
                                ? 'btn-primary text-white'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        同意してゲームを始める
                    </button>

                    <p className="text-center text-gray-500 text-xs mt-4">
                        研究責任者: 法政大学大学院 情報科学研究科
                    </p>
                </div>
            </div>
        </div>
    );
};

// データ出力コンポーネント
