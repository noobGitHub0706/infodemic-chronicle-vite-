import { useState } from 'react';
import { RhetoricStage } from './RhetoricStage';
import { STAGE3_QUESTIONS } from '../data/stage3Questions';
import { STAGE3_RHETORIC_NARRATIVE } from '../data/narrative';
import { shuffle } from '../utils';

// Stage3Rhetoric: 実践フェーズ（RhetoricStageのラッパー）
export const Stage3Rhetoric = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(STAGE3_QUESTIONS));
    return (
        <RhetoricStage
            questions={questions}
            feedbackLevel="minimal"
            narrative={STAGE3_RHETORIC_NARRATIVE}
            stageLabel="Stage 3: 実践"
            stageNumber={3}
            onComplete={onComplete}
        />
    );
};
