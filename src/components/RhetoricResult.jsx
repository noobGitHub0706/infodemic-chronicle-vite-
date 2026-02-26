import { TechniqueTag } from './common/TechniqueTag';
import { DialogueBox } from './common/DialogueBox';
import { getResultCommentFromNarrative } from '../data/narrative';

/**
 * Stage1 / Stage2 の共通結果画面
 *
 * @param {1|2} stageNumber
 * @param {Object} resultData - { accuracy, score, weakTechniques, rebuttalStats }
 * @param {Object} narrative - STAGE1_RESULT_NARRATIVE | STAGE2_RESULT_NARRATIVE
 * @param {Function} onContinue
 */
export const RhetoricResult = ({ stageNumber, resultData, narrative, onContinue }) => {
    const comment = getResultCommentFromNarrative(resultData.accuracy, narrative);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🎯</div>
                        <h1 className="text-3xl font-bold mb-2">Stage {stageNumber} 完了！</h1>
                        <p className="text-gray-400">レトリック技法識別訓練フェーズ {stageNumber}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-400">正答率</p>
                                <p className={`text-3xl font-bold ${
                                    resultData.accuracy >= 70 ? 'text-green-400' :
                                    resultData.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                    {resultData.accuracy}%
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-400">スコア</p>
                                <p className="text-3xl font-bold text-indigo-400">{resultData.score}</p>
                            </div>
                        </div>

                        {resultData.weakTechniques && resultData.weakTechniques.length > 0 && (
                            <div className="border-t border-white/10 pt-4">
                                <p className="text-sm text-gray-400 mb-2">見破りにくかった技法:</p>
                                <div className="flex flex-wrap gap-2">
                                    {resultData.weakTechniques.map(tech => (
                                        <TechniqueTag key={tech} techniqueId={tech} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogueBox dialogue={comment} />

                    {narrative.transition && narrative.transition.map((dialogue, i) => (
                        <DialogueBox key={i} dialogue={dialogue} />
                    ))}

                    <button
                        onClick={onContinue}
                        className="w-full mt-4 btn-primary text-white font-bold py-4 px-8 rounded-2xl text-lg"
                    >
                        次へ進む
                    </button>
                </div>
            </div>
        </div>
    );
};
