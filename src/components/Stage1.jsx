import { useState } from 'react';
import { RhetoricStage, RebuttalPostPreview } from './RhetoricStage';
import { STAGE1_QUESTIONS } from '../data/stage1Questions';
import { STAGE1_NARRATIVE } from '../data/narrative';
import { shuffle } from '../utils';

// Stage1.jsx から RebuttalPostPreview を再エクスポートして既存の参照を維持
export { RebuttalPostPreview };

// Stage1: 見破る（RhetoricStageのラッパー）
export const Stage1 = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(STAGE1_QUESTIONS));
    return (
        <RhetoricStage
            questions={questions}
            feedbackLevel="detailed"
            narrative={STAGE1_NARRATIVE}
            stageLabel="Stage 1: 見破る"
            stageNumber={1}
            onComplete={onComplete}
        />
    );
};
