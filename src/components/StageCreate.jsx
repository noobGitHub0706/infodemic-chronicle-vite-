import { useState, useCallback } from 'react';
import { TECHNIQUES } from '../data/techniques';
import { TARGETS } from '../data/targets';
import { STAGE3_POSTS } from '../data/stage3Posts';
import { TechniqueTag } from './common/TechniqueTag';
import { SNSPostCard } from './common/SNSPostCard';
import { shuffle } from '../utils';

export const StageCreate = ({ stage1Data, stage3Data, onComplete }) => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1-3: steps, 4: result
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [lastFeedback, setLastFeedback] = useState(null);
    const [results, setResults] = useState([]);
    const [showFullPost, setShowFullPost] = useState(false); // 投稿全文表示用

    // シナリオ定義
    const SCENARIOS = [
        {
            id: 1,
            title: '数字の検証',
            difficulty: '易',
            difficultyColor: 'green',
            post: {
                author: '健康ニュース速報',
                authorHandle: '@health_news_jp',
                content: '【衝撃】最新調査で判明！\n87%の子供がスマホ依存症に！\n専門家「今すぐ対策を」\n\n子供の将来が心配な方は必見です。\n#拡散希望 #子育て',
                techniques: ['pseudoscience', 'fear', 'authority']
            },
            steps: [
                {
                    question: 'この投稿を検証するために、まず何を確認しますか？',
                    options: [
                        { id: 'read_more', text: '投稿の文章をもっと詳しく読む', score: 0, feedback: '投稿を詳しく読んでも、情報の正確さは確認できません。外部で検証しましょう。' },
                        { id: 'check_source', text: '「87%」という数字の出典を探す', score: 3, feedback: '正解！数字の根拠を外部で確認することが重要です。' },
                        { id: 'check_likes', text: '投稿の「いいね」数を見る', score: 0, feedback: '「いいね」の数は情報の正確さとは関係ありません。' },
                        { id: 'read_comments', text: 'コメント欄で他の人の意見を見る', score: 1, feedback: 'コメントも参考になることがありますが、一次情報源の確認が優先です。' }
                    ]
                },
                {
                    question: '「87%」の出典を確認するために、どこを見ますか？',
                    options: [
                        { id: 'same_sns', text: '同じSNSで「87% スマホ 子供」と検索', score: 1, feedback: 'SNS内検索では、同じ誤情報が拡散している可能性があります。' },
                        { id: 'google', text: 'Googleで「87% スマホ 子供 調査」と検索', score: 2, feedback: '悪くない選択ですが、公式機関の情報を直接確認する方が確実です。' },
                        { id: 'official', text: '厚労省や内閣府の調査を確認', score: 3, feedback: '正解！公式機関の一次情報源を確認することが最も信頼性が高いです。' },
                        { id: 'chiebukuro', text: 'Yahoo!知恵袋で聞いてみる', score: 0, feedback: 'Q&Aサイトの回答も検証が必要です。一次情報源を直接確認しましょう。' }
                    ]
                },
                {
                    question: '公式機関のサイトで「87%」という数字は見つかりませんでした。この結果をどう解釈しますか？',
                    verificationResult: '内閣府「青少年のインターネット利用環境実態調査」を確認した結果：\n・スマホ利用率：約70%（所持率）\n・「依存傾向」を示す数値：約10〜15%\n・「87%が依存症」というデータは確認できず',
                    options: [
                        { id: 'definite_lie', text: '87%は完全な嘘だと断定できる', score: 1, feedback: '「嘘」と断定するのは過剰です。「確認できなかった」が正確な表現です。' },
                        { id: 'unverified', text: '87%の根拠は確認できず、信頼性に疑問がある', score: 3, feedback: '正解！「確認できない」と「嘘」は異なります。適切な判断です。' },
                        { id: 'maybe_true', text: '公式データと違うが、投稿も正しいかもしれない', score: 0, feedback: '根拠が確認できない数字を信じるのは危険です。出典のない情報は疑いましょう。' }
                    ]
                }
            ],
            summary: {
                learned: '数字の出典は必ず確認する。公式機関の一次情報を優先する。',
                key_point: '「87%」のような具体的な数字は、出典を確認することで信頼性を判断できます。'
            }
        },
        {
            id: 2,
            title: '発信者の検証',
            difficulty: '中',
            difficultyColor: 'yellow',
            post: {
                author: '健康科学研究所',
                authorHandle: '@health_science_lab',
                content: '【公式発表】当研究所の調査により、\nデジタルデトックスが睡眠の質を\n40%改善することが判明しました。\n\n詳細はプロフィールのリンクから。\n#研究成果 #睡眠改善',
                techniques: ['authority', 'pseudoscience']
            },
            steps: [
                {
                    question: 'この投稿を検証するために、まず何を確認しますか？',
                    options: [
                        { id: 'click_link', text: 'プロフィールのリンクを開く', score: 1, feedback: 'リンク先の情報も検証が必要です。まずは発信者の信頼性を確認しましょう。' },
                        { id: 'check_org', text: '「健康科学研究所」が実在するか確認する', score: 3, feedback: '正解！発信者の実在性・信頼性を確認することが重要です。' },
                        { id: 'check_followers', text: 'フォロワー数を確認する', score: 0, feedback: 'フォロワー数は信頼性の指標にはなりません。' },
                        { id: 'check_likes', text: '投稿の「いいね」数を見る', score: 0, feedback: '「いいね」の数は情報の正確さとは関係ありません。' }
                    ]
                },
                {
                    question: '「健康科学研究所」の実在を確認するために、どこを見ますか？',
                    options: [
                        { id: 'trust_profile', text: 'プロフィールに書いてある情報を信じる', score: 0, feedback: 'プロフィールは誰でも自由に書けます。外部で確認が必要です。' },
                        { id: 'google_search', text: 'Googleで「健康科学研究所」と検索', score: 2, feedback: '検索は有効ですが、公的なデータベースでの確認がより確実です。' },
                        { id: 'official_db', text: '法人登記や学術機関データベースで確認', score: 3, feedback: '正解！公的なデータベースで確認することで、実在性を判断できます。' },
                        { id: 'other_sns', text: '他のSNSでアカウントを探す', score: 1, feedback: '複数のSNSで活動していても、組織の実在性は確認できません。' }
                    ]
                },
                {
                    question: '確認した結果、法人登記にも学術機関DBにも該当がありませんでした。どう解釈しますか？',
                    verificationResult: '検証結果：\n・法人登記検索：該当なし\n・学術機関データベース：該当なし\n・Webサイト：個人ブログ風のページが存在\n・学術論文：該当する研究は見つからず',
                    options: [
                        { id: 'report', text: '研究所を名乗る詐欺なので通報すべき', score: 1, feedback: '詐欺と断定するには証拠が不十分です。ただし、信頼性は低いと判断すべきです。' },
                        { id: 'low_trust', text: '研究機関としての信頼性は低く、主張を鵜呑みにすべきでない', score: 3, feedback: '正解！公的に確認できない組織の主張は、慎重に扱うべきです。' },
                        { id: 'maybe_ok', text: '登記がなくても研究機関は存在しうるので問題ない', score: 0, feedback: '正式な研究機関なら公的記録があるはずです。確認できないなら信頼性は低いです。' }
                    ]
                }
            ],
            summary: {
                learned: '発信者の実在性・信頼性は公的データベースで確認できる。',
                key_point: '「〇〇研究所」「〇〇協会」を名乗っていても、実在するとは限りません。'
            }
        },
        {
            id: 3,
            title: '総合的な検証',
            difficulty: '難',
            difficultyColor: 'red',
            post: {
                author: '真実を伝える会',
                authorHandle: '@truth_teller_jp',
                content: '【緊急拡散】テレビでは報道されない真実\n\nハーバード大学の研究チームが発表！\n5G電波がウイルスを活性化させる\nことが判明。\n\n大手メディアは利権のため隠蔽中。\n気づいた人だけシェアしてください。',
                techniques: ['authority', 'pseudoscience', 'polarization', 'fear']
            },
            steps: [
                {
                    question: 'この投稿には複数の問題がありそうです。まず何を確認しますか？',
                    options: [
                        { id: 'check_shares', text: '他に同じ情報をシェアしている人がいるか確認', score: 1, feedback: '拡散状況は参考になりますが、真偽の判断にはなりません。一次情報源を確認しましょう。' },
                        { id: 'check_harvard', text: 'ハーバード大学が本当にそのような研究を発表したか確認', score: 3, feedback: '正解！具体的な機関名が挙げられている場合、まずその事実を確認します。' },
                        { id: 'think_reason', text: '「報道されない」理由を考える', score: 0, feedback: '推測よりも事実確認が重要です。外部で検証しましょう。' },
                        { id: 'self_research', text: '5Gとウイルスの関係を自分で調べる', score: 2, feedback: '調べること自体は良いですが、まずは主張の根拠を確認する方が効率的です。' }
                    ]
                },
                {
                    question: 'この投稿の真偽を確認するために、どこを見ますか？（最も効果的なものを選択）',
                    options: [
                        { id: 'harvard_official', text: 'ハーバード大学の公式サイト', score: 2, feedback: '良い選択です。公式発表を確認することで、主張の根拠を検証できます。' },
                        { id: 'fact_check', text: 'ファクトチェック機関（日本ファクトチェックセンター等）', score: 3, feedback: '正解！このような話題は既にファクトチェックされている可能性が高いです。効率的な検証方法です。' },
                        { id: 'overseas_sns', text: '海外のSNSで検索', score: 1, feedback: '海外SNSでも誤情報は拡散します。公式機関やファクトチェック機関を優先しましょう。' },
                        { id: 'pubmed', text: '学術論文データベース（PubMed等）', score: 2, feedback: '学術的な検証には有効ですが、この種の陰謀論はファクトチェック機関が既に検証済みの場合が多いです。' }
                    ]
                },
                {
                    question: '検証の結果、以下のことが分かりました。この投稿の問題点は何ですか？',
                    verificationResult: '検証結果：\n・ハーバード大学：該当する発表なし\n・ファクトチェック：「5Gとウイルスの関連は科学的根拠なし」と判定済み\n・WHO：「5Gはウイルスを拡散しない」と公式見解\n・総務省：同様の見解を発表',
                    isMultiSelect: true,
                    options: [
                        { id: 'fake_research', text: '架空の研究を根拠にしている', score: 1, isCorrect: true },
                        { id: 'conspiracy', text: '陰謀論的な表現（「隠蔽」「気づいた人だけ」）', score: 1, isCorrect: true },
                        { id: 'urge_spread', text: '拡散を促す煽り表現', score: 1, isCorrect: true },
                        { id: 'low_followers', text: '投稿者のフォロワー数が少ない', score: -1, isCorrect: false }
                    ]
                }
            ],
            summary: {
                learned: '複数の検証方法を組み合わせる。ファクトチェック機関を活用する。',
                key_point: '「報道されない真実」「気づいた人だけ」は陰謀論の典型的な表現です。'
            }
        }
    ];

    const currentScenarioData = SCENARIOS[currentScenario];
    const currentStepData = currentScenarioData.steps[currentStep - 1];

    // 選択肢を選んだとき
    const handleSelect = (option) => {
        if (showFeedback) return;

        const newAnswers = [...selectedAnswers, option];
        setSelectedAnswers(newAnswers);
        setLastFeedback(option.feedback);
        setShowFeedback(true);
    };

    // 複数選択の場合
    const [multiSelectAnswers, setMultiSelectAnswers] = useState([]);
    
    const handleMultiSelect = (option) => {
        if (showFeedback) return;
        
        setMultiSelectAnswers(prev => {
            if (prev.find(o => o.id === option.id)) {
                return prev.filter(o => o.id !== option.id);
            } else {
                return [...prev, option];
            }
        });
    };

    const handleMultiSelectSubmit = () => {
        if (multiSelectAnswers.length === 0) return;
        
        const correctCount = multiSelectAnswers.filter(o => o.isCorrect).length;
        const incorrectCount = multiSelectAnswers.filter(o => !o.isCorrect).length;
        const totalCorrect = currentStepData.options.filter(o => o.isCorrect).length;
        
        const score = Math.max(0, correctCount - incorrectCount);
        const feedback = correctCount === totalCorrect && incorrectCount === 0
            ? '完璧です！すべての問題点を正しく特定できました。'
            : correctCount > 0
                ? `${correctCount}個の問題点を特定できました。${incorrectCount > 0 ? '不適切な選択もありました。' : ''}`
                : '問題点を見逃しています。投稿の特徴をよく観察しましょう。';

        const combinedOption = {
            id: 'multi',
            score: score,
            feedback: feedback,
            selected: multiSelectAnswers
        };
        
        setSelectedAnswers(prev => [...prev, combinedOption]);
        setLastFeedback(feedback);
        setShowFeedback(true);
    };

    // 次へ進む
    const handleNext = () => {
        setShowFeedback(false);
        setLastFeedback(null);
        setMultiSelectAnswers([]);
        setShowFullPost(false); // モーダルを閉じる

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // シナリオ完了 → 結果表示
            setCurrentStep(4);
        }
    };

    // 次のシナリオへ
    const handleNextScenario = () => {
        // 結果を保存
        const totalScore = selectedAnswers.reduce((sum, a) => sum + a.score, 0);
        const maxScore = 9;
        
        setResults(prev => [...prev, {
            scenario: currentScenarioData,
            answers: selectedAnswers,
            totalScore,
            maxScore
        }]);

        if (currentScenario < SCENARIOS.length - 1) {
            setCurrentScenario(prev => prev + 1);
            setCurrentStep(0);
            setSelectedAnswers([]);
            setShowFullPost(false); // リセット
        } else {
            // 全シナリオ完了
            const finalResults = [...results, {
                scenario: currentScenarioData,
                answers: selectedAnswers,
                totalScore: selectedAnswers.reduce((sum, a) => sum + a.score, 0),
                maxScore: 9
            }];
            
            onComplete({
                scenarios: finalResults
            });
        }
    };

    const progress = ((currentScenario * 4 + currentStep) / (SCENARIOS.length * 4)) * 100;

    // 難易度の色
    const difficultyColors = {
        green: 'bg-green-500/20 text-green-300 border-green-500/30',
        yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        red: 'bg-red-500/20 text-red-300 border-red-500/30'
    };

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* ヘッダー */}
            <div className="max-w-2xl w-full mx-auto mb-4">
                <div className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Stage 3: 情報検証訓練</span>
                        <span className="text-sm text-gray-400">シナリオ {currentScenario + 1} / {SCENARIOS.length}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="progress-bar h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="flex-1 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    <div className="animate-fade-in">
                        <div className="glass rounded-3xl p-6 md:p-8">
                            
                            {/* シナリオイントロ */}
                            {currentStep === 0 && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 border ${difficultyColors[currentScenarioData.difficultyColor]}`}>
                                            難易度: {currentScenarioData.difficulty}
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">
                                            🔍 {currentScenarioData.title}
                                        </h2>
                                        <p className="text-gray-400">以下の投稿を検証してください</p>
                                    </div>

                                    {/* 投稿表示 */}
                                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-lg">
                                                {currentScenarioData.post.author.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{currentScenarioData.post.author}</p>
                                                <p className="text-xs text-gray-500">{currentScenarioData.post.authorHandle}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm whitespace-pre-line mb-3">{currentScenarioData.post.content}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {currentScenarioData.post.techniques.map(tech => (
                                                <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                                                    {TECHNIQUES[tech]?.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                    >
                                        検証を始める
                                    </button>
                                </>
                            )}

                            {/* ステップ1-3: 検証行動 */}
                            {currentStep >= 1 && currentStep <= 3 && currentStepData && (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold">
                                            Step {currentStep}/3
                                        </h3>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(s => (
                                                <div
                                                    key={s}
                                                    className={`w-8 h-2 rounded-full ${
                                                        s < currentStep ? 'bg-cyan-500' :
                                                        s === currentStep ? 'bg-cyan-500/50' : 'bg-white/10'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* 投稿の縮小表示（クリックで全文表示） */}
                                    <div 
                                        className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                                        onClick={() => setShowFullPost(true)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">検証対象:</p>
                                                <p className="text-sm line-clamp-2">{currentScenarioData.post.content.split('\n')[0]}...</p>
                                            </div>
                                            <span className="text-xs text-cyan-400 ml-2 shrink-0">👆 全文を見る</span>
                                        </div>
                                    </div>
                                    
                                    {/* 投稿全文表示モーダル */}
                                    {showFullPost && (
                                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowFullPost(false)}>
                                            <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-bold text-lg">検証対象の投稿</h3>
                                                    <button 
                                                        onClick={() => setShowFullPost(false)}
                                                        className="text-gray-400 hover:text-white text-2xl"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                
                                                <div className="bg-white/5 rounded-2xl p-5">
                                                    {/* SNS風ヘッダー */}
                                                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-lg">
                                                            {currentScenarioData.post.author.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">{currentScenarioData.post.author}</p>
                                                            <p className="text-xs text-gray-500">{currentScenarioData.post.authorHandle}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-lg leading-relaxed whitespace-pre-line mb-4">{currentScenarioData.post.content}</p>
                                                    <div className="flex flex-wrap gap-1 pt-3 border-t border-white/10">
                                                        {currentScenarioData.post.techniques.map(tech => (
                                                            <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                                                                {TECHNIQUES[tech]?.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <button
                                                    onClick={() => setShowFullPost(false)}
                                                    className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all"
                                                >
                                                    閉じる
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* 検証結果（Step3のみ） */}
                                    {currentStepData.verificationResult && (
                                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-4">
                                            <p className="text-xs text-cyan-300 mb-2">📊 検証結果</p>
                                            <p className="text-sm whitespace-pre-line text-gray-300">{currentStepData.verificationResult}</p>
                                        </div>
                                    )}

                                    {/* 質問 */}
                                    <p className="text-gray-300 mb-4">{currentStepData.question}</p>

                                    {/* 選択肢 */}
                                    {!currentStepData.isMultiSelect ? (
                                        <div className="space-y-2 mb-4">
                                            {currentStepData.options.map(option => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleSelect(option)}
                                                    disabled={showFeedback}
                                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
                                                        showFeedback && selectedAnswers[selectedAnswers.length - 1]?.id === option.id
                                                            ? option.score >= 3
                                                                ? 'border-green-500 bg-green-500/20'
                                                                : option.score >= 2
                                                                    ? 'border-yellow-500 bg-yellow-500/20'
                                                                    : 'border-red-500 bg-red-500/20'
                                                            : 'border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                                                    } ${showFeedback ? 'cursor-default' : ''}`}
                                                >
                                                    {option.text}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-2 mb-4">
                                            <p className="text-xs text-gray-500 mb-2">（複数選択可）</p>
                                            {currentStepData.options.map(option => {
                                                const isSelected = multiSelectAnswers.find(o => o.id === option.id);
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => handleMultiSelect(option)}
                                                        disabled={showFeedback}
                                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
                                                            showFeedback
                                                                ? option.isCorrect
                                                                    ? 'border-green-500 bg-green-500/20'
                                                                    : isSelected
                                                                        ? 'border-red-500 bg-red-500/20'
                                                                        : 'border-white/10 bg-white/5'
                                                                : isSelected
                                                                    ? 'border-cyan-500 bg-cyan-500/20'
                                                                    : 'border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                                                        } ${showFeedback ? 'cursor-default' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                                isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-white/30'
                                                            }`}>
                                                                {isSelected && <span className="text-white text-xs">✓</span>}
                                                            </div>
                                                            {option.text}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            {!showFeedback && (
                                                <button
                                                    onClick={handleMultiSelectSubmit}
                                                    disabled={multiSelectAnswers.length === 0}
                                                    className={`w-full mt-4 font-bold py-3 px-6 rounded-xl transition-all ${
                                                        multiSelectAnswers.length > 0
                                                            ? 'btn-primary text-white'
                                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    回答を確定
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* フィードバック */}
                                    {showFeedback && lastFeedback && (
                                        <div className={`rounded-xl p-4 mb-4 ${
                                            selectedAnswers[selectedAnswers.length - 1]?.score >= 3
                                                ? 'bg-green-500/10 border border-green-500/30'
                                                : selectedAnswers[selectedAnswers.length - 1]?.score >= 2
                                                    ? 'bg-yellow-500/10 border border-yellow-500/30'
                                                    : 'bg-red-500/10 border border-red-500/30'
                                        }`}>
                                            <p className="text-sm">{lastFeedback}</p>
                                        </div>
                                    )}

                                    {/* 次へボタン */}
                                    {showFeedback && (
                                        <button
                                            onClick={handleNext}
                                            className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                        >
                                            {currentStep < 3 ? '次のステップへ' : '結果を見る'}
                                        </button>
                                    )}
                                </>
                            )}

                            {/* シナリオ結果 */}
                            {currentStep === 4 && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="text-5xl mb-3">
                                            {selectedAnswers.reduce((sum, a) => sum + a.score, 0) >= 7 ? '🎉' :
                                             selectedAnswers.reduce((sum, a) => sum + a.score, 0) >= 4 ? '👍' : '📚'}
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">シナリオ完了！</h2>
                                        <p className="text-gray-400">{currentScenarioData.title}</p>
                                    </div>

                                    {/* スコア */}
                                    <div className="bg-white/5 rounded-xl p-6 mb-6 text-center">
                                        <p className="text-sm text-gray-400 mb-2">検証スコア</p>
                                        <p className={`text-4xl font-bold ${
                                            selectedAnswers.reduce((sum, a) => sum + a.score, 0) >= 7 ? 'text-green-400' :
                                            selectedAnswers.reduce((sum, a) => sum + a.score, 0) >= 4 ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                            {selectedAnswers.reduce((sum, a) => sum + a.score, 0)} / 9
                                        </p>
                                    </div>

                                    {/* 各ステップの結果 */}
                                    <div className="space-y-3 mb-6">
                                        {selectedAnswers.map((answer, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                                                <span className="text-sm text-gray-400">Step {idx + 1}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-bold ${
                                                        answer.score >= 3 ? 'text-green-400' :
                                                        answer.score >= 2 ? 'text-yellow-400' : 'text-red-400'
                                                    }`}>
                                                        +{answer.score}点
                                                    </span>
                                                    <span className={`text-lg ${
                                                        answer.score >= 3 ? '' : answer.score >= 2 ? '' : ''
                                                    }`}>
                                                        {answer.score >= 3 ? '✓' : answer.score >= 2 ? '△' : '✗'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 学んだこと */}
                                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
                                        <h3 className="font-bold mb-2 text-cyan-300 flex items-center gap-2">
                                            <span>💡</span>このシナリオで学んだこと
                                        </h3>
                                        <p className="text-sm text-gray-300 mb-2">{currentScenarioData.summary.learned}</p>
                                        <p className="text-xs text-gray-400">{currentScenarioData.summary.key_point}</p>
                                    </div>

                                    <button
                                        onClick={handleNextScenario}
                                        className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                                    >
                                        {currentScenario < SCENARIOS.length - 1 ? '次のシナリオへ' : '最終評価へ'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 最終評価
