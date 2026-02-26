import { useState } from 'react';
import { RhetoricStage } from './RhetoricStage';
import { STAGE2_QUESTIONS } from '../data/stage2Questions';
import { STAGE2_RHETORIC_NARRATIVE } from '../data/narrative';
import { shuffle } from '../utils';

// Stage2: 応用フェーズ（RhetoricStageのラッパー）
export const Stage2Rhetoric = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(STAGE2_QUESTIONS));
    return (
        <RhetoricStage
            questions={questions}
            feedbackLevel="moderate"
            narrative={STAGE2_RHETORIC_NARRATIVE}
            stageLabel="Stage 2: 応用"
            stageNumber={2}
            onComplete={onComplete}
        />
    );
};
