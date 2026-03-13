import { useState } from 'react';
import { ResearchFlow } from './research/ResearchFlow';
import { DevCollectionSelect } from './research/DevCollectionSelect';

// ▼ 開発フラグ: 本番リリース時は false に変更
export const DEV_MODE = true;

// App: 最上位ルーター
// sessionId をここで一元生成し ResearchFlow に渡す。
// ResearchFlow が全フェーズ（GameEngine含む）を管理する。
export const App = () => {
    const [phase, setPhase] = useState('consent');
    const [sessionId] = useState(
        () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    );

    // DEV_MODE: コレクション選択。非開発時は 'sessions' 固定
    const [collectionName, setCollectionName] = useState('sessions');
    const [devSetupDone, setDevSetupDone] = useState(!DEV_MODE);

    const handleCollectionSelect = (name) => {
        setCollectionName(name);
        setDevSetupDone(true);
    };

    if (!devSetupDone) {
        return (
            <div className="scrollbar-hide">
                <DevCollectionSelect onSelect={handleCollectionSelect} />
            </div>
        );
    }

    return (
        <div className="scrollbar-hide">
            <ResearchFlow
                sessionId={sessionId}
                phase={phase}
                onPhaseChange={setPhase}
                collectionName={collectionName}
                onCollectionChange={DEV_MODE ? setCollectionName : undefined}
            />
        </div>
    );
};

export default App;
