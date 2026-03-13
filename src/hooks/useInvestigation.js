import { useReducer } from 'react';
import { ORGANIZATION, MILESTONES } from '../data/organization';

// ============================================================
// 初期状態
// ============================================================

const initialInvestigation = {
    techniques: {
        fear:                { identified: 0, required: 3, mastered: false },
        authority:           { identified: 0, required: 3, mastered: false },
        fabricated_evidence: { identified: 0, required: 4, mastered: false },
        testimonial:         { identified: 0, required: 3, mastered: false },
        social_proof:        { identified: 0, required: 3, mastered: false },
    },
    members: {
        footSoldiers: [],
        officers: [],
        leader: null,
    },
    bosses: {
        chapter1: { defeated: false, name: 'ヘルシー太郎' },
        chapter2: { defeated: false, name: 'Dr.ナチュラル' },
        chapter3: { defeated: false, name: 'ウェルネス・ライフ公式' },
    },
    progress: 0,
    unlockedIntel: [],
    newUnlockId: null, // 最後に解放されたメンバーID（ハイライト用）
    endingFlags: {
        allBossesDefeated: false,
        highEthics: false,
        perfectChapter: false,
    },
};

// ============================================================
// 進捗計算ヘルパー
// 技法習熟 50% + ボス討伐 30% + インテル 10% + 余裕 10%
// ============================================================

const calcProgress = (techniques, bosses, unlockedIntel) => {
    const techScore = Object.values(techniques).reduce((sum, t) => {
        return sum + (t.mastered ? 10 : Math.floor((t.identified / t.required) * 10));
    }, 0); // max 50

    const bossScore = Object.values(bosses).filter(b => b.defeated).length * 10; // max 30

    const intelScore = Math.min(unlockedIntel.length * 2, 10); // max 10

    return Math.min(techScore + bossScore + intelScore, 100);
};

// ============================================================
// Reducer
// ============================================================

function investigationReducer(state, action) {
    switch (action.type) {

        // 技法を識別した（正しく「レトリック検出」した時）
        // payload: { technique: string }
        case 'IDENTIFY_TECHNIQUE': {
            const { technique } = action.payload;
            if (!state.techniques[technique]) return state;

            const prev = state.techniques[technique];
            if (prev.mastered) return state; // 既に習熟済み

            const newIdentified = prev.identified + 1;
            const nowMastered = newIdentified >= prev.required;

            const updatedTechniques = {
                ...state.techniques,
                [technique]: {
                    ...prev,
                    identified: newIdentified,
                    mastered: nowMastered,
                },
            };

            // unlockedBy.count に達したメンバーを解放（識別のたびにチェック）
            let updatedFootSoldiers = [...state.members.footSoldiers];
            let newUnlockId = state.newUnlockId;

            ORGANIZATION.footSoldiers.forEach(s => {
                if (
                    s.unlockedBy?.technique === technique &&
                    s.unlockedBy?.count === newIdentified &&
                    !updatedFootSoldiers.find(u => u.id === s.id)
                ) {
                    updatedFootSoldiers = [...updatedFootSoldiers, s];
                    newUnlockId = s.id;
                }
            });

            const updatedMembers = {
                ...state.members,
                footSoldiers: updatedFootSoldiers,
            };

            // マイルストーンインテル解放チェック
            const newProgress = calcProgress(updatedTechniques, state.bosses, state.unlockedIntel);
            const newIntel = checkMilestoneIntel(state.progress, newProgress, state.unlockedIntel);

            return {
                ...state,
                techniques: updatedTechniques,
                members: updatedMembers,
                progress: newProgress,
                unlockedIntel: newIntel,
                newUnlockId,
            };
        }

        // ボスを討伐した
        // payload: { chapter: 1 | 2 | 3 }
        case 'DEFEAT_BOSS': {
            const { chapter } = action.payload;
            const key = `chapter${chapter}`;
            if (!state.bosses[key] || state.bosses[key].defeated) return state;

            const updatedBosses = {
                ...state.bosses,
                [key]: { ...state.bosses[key], defeated: true },
            };

            // ボス討伐 → 対応する幹部・リーダーを解放
            const bossKey = `chapter${chapter}_boss`;
            let updatedOfficers = [...state.members.officers];
            let updatedLeader = state.members.leader;
            let newUnlockId = state.newUnlockId;

            const officerUnlock = ORGANIZATION.officers.find(
                o => o.unlockedBy === bossKey &&
                !updatedOfficers.find(u => u.id === o.id)
            );
            if (officerUnlock) {
                updatedOfficers = [...updatedOfficers, officerUnlock];
                newUnlockId = officerUnlock.id;
            }

            if (chapter === 3 && !updatedLeader) {
                updatedLeader = ORGANIZATION.leader;
                newUnlockId = 'leader';
            }

            const updatedMembers = {
                ...state.members,
                officers: updatedOfficers,
                leader: updatedLeader,
            };

            const allDefeated = Object.values(updatedBosses).every(b => b.defeated);

            const newProgress = calcProgress(state.techniques, updatedBosses, state.unlockedIntel);
            const newIntel = checkMilestoneIntel(state.progress, newProgress, state.unlockedIntel);

            return {
                ...state,
                bosses: updatedBosses,
                members: updatedMembers,
                progress: newProgress,
                unlockedIntel: newIntel,
                newUnlockId,
                endingFlags: {
                    ...state.endingFlags,
                    allBossesDefeated: allDefeated,
                },
            };
        }

        // 第2章クイズ完了 → バズマスターKを解放
        case 'COMPLETE_CHAPTER_QUIZ': {
            const { chapter } = action.payload;
            if (chapter !== 2) return state;

            const key = 'chapter2_quiz_complete';
            const officer = ORGANIZATION.officers.find(
                o => o.unlockedBy === key &&
                !state.members.officers.find(u => u.id === o.id)
            );
            if (!officer) return state;

            const updatedOfficers = [...state.members.officers, officer];
            const newProgress = calcProgress(state.techniques, state.bosses, state.unlockedIntel);
            const newIntel = checkMilestoneIntel(state.progress, newProgress, state.unlockedIntel);

            return {
                ...state,
                members: { ...state.members, officers: updatedOfficers },
                progress: newProgress,
                unlockedIntel: newIntel,
                newUnlockId: officer.id,
            };
        }

        // インテル追加（手動）
        // payload: { intel: string }
        case 'ADD_INTEL': {
            const { intel } = action.payload;
            if (state.unlockedIntel.includes(intel)) return state;

            const newIntel = [...state.unlockedIntel, intel];
            const newProgress = calcProgress(state.techniques, state.bosses, newIntel);

            return {
                ...state,
                unlockedIntel: newIntel,
                progress: newProgress,
            };
        }

        // 進捗を直接更新
        case 'UPDATE_PROGRESS': {
            return {
                ...state,
                progress: Math.min(Math.max(action.payload.progress, 0), 100),
            };
        }

        // エンディングフラグ設定
        // payload: { flag: string, value: boolean }
        case 'SET_ENDING_FLAG': {
            return {
                ...state,
                endingFlags: {
                    ...state.endingFlags,
                    [action.payload.flag]: action.payload.value,
                },
            };
        }

        // 新解放ハイライトをクリア
        case 'CLEAR_NEW_UNLOCK': {
            return { ...state, newUnlockId: null };
        }

        default:
            return state;
    }
}

// ============================================================
// マイルストーンインテル解放チェック
// ============================================================

function checkMilestoneIntel(prevProgress, newProgress, existingIntel) {
    const newIntel = [...existingIntel];
    MILESTONES.forEach(m => {
        if (prevProgress < m.progress && newProgress >= m.progress) {
            if (!newIntel.includes(m.intel)) {
                newIntel.push(m.intel);
            }
        }
    });
    return newIntel;
}

// ============================================================
// Hook
// ============================================================

export const useInvestigation = () => {
    const [state, dispatch] = useReducer(investigationReducer, initialInvestigation);

    const identifyTechnique = (technique) =>
        dispatch({ type: 'IDENTIFY_TECHNIQUE', payload: { technique } });

    const defeatBoss = (chapter) =>
        dispatch({ type: 'DEFEAT_BOSS', payload: { chapter } });

    const completeChapterQuiz = (chapter) =>
        dispatch({ type: 'COMPLETE_CHAPTER_QUIZ', payload: { chapter } });

    const addIntel = (intel) =>
        dispatch({ type: 'ADD_INTEL', payload: { intel } });

    const updateProgress = (progress) =>
        dispatch({ type: 'UPDATE_PROGRESS', payload: { progress } });

    const setEndingFlag = (flag, value) =>
        dispatch({ type: 'SET_ENDING_FLAG', payload: { flag, value } });

    const clearNewUnlock = () =>
        dispatch({ type: 'CLEAR_NEW_UNLOCK' });

    return {
        investigation: state,
        identifyTechnique,
        defeatBoss,
        completeChapterQuiz,
        addIntel,
        updateProgress,
        setEndingFlag,
        clearNewUnlock,
    };
};
