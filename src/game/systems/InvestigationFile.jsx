import { useState, useEffect } from 'react';
import { TECHNIQUES } from '../../data/techniques';
import { ORGANIZATION } from '../../data/organization';
import { DialogueBox } from '../../common/DialogueBox';
import { INVESTIGATION_COMMENTS } from '../../data/narrative';
import { AGENCY_PROFILE, MEMBER_PROFILES } from '../../data/profileCards';

const TECHNIQUE_ICONS = {
    fear: '😱',
    authority: '👔',
    fabricated_evidence: '🔬',
    testimonial: '💬',
    social_proof: '🌊',
};

/**
 * 画面端のスライドイン調査ファイルUI
 *
 * @param {object} investigation - useInvestigation().investigation
 * @param {Function} onClearNewUnlock - useInvestigation().clearNewUnlock
 * @param {Function} onFirstOpen - 初めて開かれた時のコールバック（チュートリアル用）
 * @param {boolean} highlightButton - トグルボタンをハイライト（pulse）するか
 */
export const InvestigationFile = ({ investigation, onClearNewUnlock, onFirstOpen, highlightButton }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [activeTab, setActiveTab] = useState('org'); // 'org' | 'techniques' | 'intel' | 'ihia'
    const [flashId, setFlashId] = useState(null);
    const [newUnlockMsg, setNewUnlockMsg] = useState(null);

    // 新解放時にフラッシュ + 通知
    useEffect(() => {
        if (investigation.newUnlockId) {
            setFlashId(investigation.newUnlockId);
            setIsOpen(true);
            setActiveTab('org');

            // 解放されたメンバーを特定してコメント表示
            const allMembers = [
                ...ORGANIZATION.footSoldiers,
                ...ORGANIZATION.officers,
                ORGANIZATION.leader,
            ].filter(Boolean);
            const member = allMembers.find(m => m.id === investigation.newUnlockId);
            if (member) {
                setNewUnlockMsg(INVESTIGATION_COMMENTS.memberIdentified);
            }

            const t = setTimeout(() => {
                setFlashId(null);
                setNewUnlockMsg(null);
                onClearNewUnlock?.();
            }, 3500);
            return () => clearTimeout(t);
        }
    }, [investigation.newUnlockId, onClearNewUnlock]);

    const { techniques, members, bosses, progress, unlockedIntel } = investigation;

    const unlockedSoldierIds = members.footSoldiers.map(m => m.id);
    const unlockedOfficerIds = members.officers.map(m => m.id);

    return (
        <>
            {/* トグルボタン（常時表示） */}
            <button
                onClick={() => {
                    if (!isOpen && !hasOpened) {
                        setHasOpened(true);
                        onFirstOpen?.();
                    }
                    setIsOpen(!isOpen);
                }}
                className={`fixed bottom-6 right-4 z-40 w-14 h-14 rounded-full flex flex-col items-center justify-center gap-0.5 shadow-lg transition-all ${
                    isOpen
                        ? 'bg-indigo-600 text-white'
                        : highlightButton
                            ? 'bg-indigo-500 text-white border-2 border-indigo-300 animate-pulse'
                            : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-white/20'
                }`}
                aria-label="調査ファイルを開く"
            >
                <span className="text-lg">🗂️</span>
                <span className="text-xs font-bold leading-none">{Math.round(progress)}%</span>
            </button>

            {/* 新解放通知 */}
            {newUnlockMsg && (
                <div className="fixed bottom-24 right-4 z-50 max-w-xs animate-fade-in">
                    <DialogueBox dialogue={newUnlockMsg} />
                </div>
            )}

            {/* スライドインパネル */}
            <div
                className={`fixed inset-y-0 right-0 z-30 w-80 max-w-full transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="h-full bg-slate-900/95 backdrop-blur-md border-l border-white/10 flex flex-col">

                    {/* ヘッダー */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                        <div>
                            <h2 className="font-bold text-white text-sm">🗂️ 調査ファイル</h2>
                            <p className="text-xs text-gray-400">ウェルネス・サークル</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white text-xl leading-none p-1"
                        >
                            ×
                        </button>
                    </div>

                    {/* 進捗バー */}
                    <div className="px-4 py-3 border-b border-white/10 shrink-0">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>調査進捗</span>
                            <span className="text-indigo-400 font-bold">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* タブ */}
                    <div className="flex border-b border-white/10 shrink-0">
                        {[
                            { id: 'org', label: '組織図' },
                            { id: 'techniques', label: '技法' },
                            { id: 'intel', label: 'インテル' },
                            { id: 'ihia', label: 'IHIA' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-white border-b-2 border-indigo-500'
                                        : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* コンテンツ */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">

                        {/* --- 組織図タブ --- */}
                        {activeTab === 'org' && (
                            <>
                                {/* リーダー */}
                                <OrgSection title="リーダー">
                                    <MemberCard
                                        member={members.leader || { id: 'leader', name: '???' }}
                                        isUnlocked={!!members.leader}
                                        isFlashing={flashId === 'leader'}
                                        defeated={bosses.chapter3.defeated}
                                    />
                                </OrgSection>

                                {/* 幹部 */}
                                <OrgSection title="幹部">
                                    {ORGANIZATION.officers.map(officer => {
                                        const unlocked = unlockedOfficerIds.includes(officer.id);
                                        return (
                                            <MemberCard
                                                key={officer.id}
                                                member={unlocked ? officer : { id: officer.id, name: '???', role: '幹部（未特定）' }}
                                                isUnlocked={unlocked}
                                                isFlashing={flashId === officer.id}
                                                defeated={
                                                    officer.bossChapter
                                                        ? bosses[`chapter${officer.bossChapter}`]?.defeated
                                                        : false
                                                }
                                            />
                                        );
                                    })}
                                </OrgSection>

                                {/* 末端 */}
                                <OrgSection title="末端メンバー">
                                    {ORGANIZATION.footSoldiers.map(soldier => {
                                        const unlocked = unlockedSoldierIds.includes(soldier.id);
                                        const techData = techniques[soldier.specialty];
                                        return (
                                            <MemberCard
                                                key={soldier.id}
                                                member={unlocked ? soldier : {
                                                    id: soldier.id,
                                                    name: '???',
                                                    description: `${TECHNIQUES[soldier.specialty]?.name || soldier.specialty}担当（未特定）`
                                                }}
                                                isUnlocked={unlocked}
                                                isFlashing={flashId === soldier.id}
                                                progressHint={!unlocked && techData
                                                    ? `識別 ${techData.identified}/${techData.required}`
                                                    : null
                                                }
                                            />
                                        );
                                    })}
                                </OrgSection>
                            </>
                        )}

                        {/* --- 技法タブ --- */}
                        {activeTab === 'techniques' && (
                            <div className="space-y-3">
                                {Object.entries(techniques).map(([techId, data]) => {
                                    const tech = TECHNIQUES[techId];
                                    const pct = Math.min((data.identified / data.required) * 100, 100);
                                    return (
                                        <div
                                            key={techId}
                                            className={`p-3 rounded-xl border ${
                                                data.mastered
                                                    ? 'border-green-500/40 bg-green-500/5'
                                                    : 'border-white/10 bg-white/5'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">{TECHNIQUE_ICONS[techId]}</span>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className={`text-xs font-bold ${
                                                            data.mastered ? 'text-green-400' : 'text-gray-300'
                                                        }`}>
                                                            {tech?.name || techId}
                                                        </span>
                                                        <span className={`text-xs ${
                                                            data.mastered ? 'text-green-400' : 'text-gray-500'
                                                        }`}>
                                                            {data.mastered ? '✓ 習熟' : `${data.identified}/${data.required}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        data.mastered ? 'bg-green-500' : 'bg-indigo-500'
                                                    }`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* --- インテルタブ --- */}
                        {activeTab === 'intel' && (
                            <div className="space-y-2">
                                {unlockedIntel.length === 0 ? (
                                    <p className="text-gray-500 text-xs text-center py-6">
                                        調査を進めると情報が集まります
                                    </p>
                                ) : (
                                    unlockedIntel.map((intel, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20"
                                        >
                                            <span className="text-indigo-400 text-sm shrink-0">📌</span>
                                            <p className="text-xs text-gray-300 leading-relaxed">{intel}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* --- IHIAタブ --- */}
                        {activeTab === 'ihia' && (
                            <div className="space-y-4">
                                {/* 機関概要 */}
                                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                    <p className="text-xs font-bold text-indigo-400 mb-0.5">{AGENCY_PROFILE.nameEn}</p>
                                    <p className="text-xs text-gray-300">{AGENCY_PROFILE.nickname} — {AGENCY_PROFILE.location}</p>
                                    <p className="text-xs text-gray-500 mt-1">{AGENCY_PROFILE.status}</p>
                                    <p className="text-xs text-gray-600 mt-1 italic leading-relaxed">{AGENCY_PROFILE.notes}</p>
                                </div>

                                {/* メンバーカード */}
                                <div className="space-y-2">
                                    {MEMBER_PROFILES.map(member => (
                                        <IhiaMemberCard key={member.id} member={member} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 背景オーバーレイ（モバイル用） */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

// ============================================================
// 内部コンポーネント
// ============================================================

const OrgSection = ({ title, children }) => (
    <div>
        <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

const MemberCard = ({ member, isUnlocked, isFlashing, defeated, progressHint }) => (
    <div
        className={`p-3 rounded-xl border transition-all duration-300 ${
            isFlashing
                ? 'border-yellow-500 bg-yellow-500/20 animate-pulse'
                : isUnlocked
                    ? 'border-white/20 bg-white/5'
                    : 'border-white/5 bg-white/2 opacity-60'
        }`}
    >
        <div className="flex items-start gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                isUnlocked
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    : 'bg-gray-700'
            }`}>
                {isUnlocked ? (member.name?.charAt(0) || '?') : '?'}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                    <p className={`text-xs font-bold leading-tight ${
                        isUnlocked ? 'text-white' : 'text-gray-600'
                    }`}>
                        {member.name}
                    </p>
                    {defeated && (
                        <span className="text-xs text-yellow-400">⚔️撃破</span>
                    )}
                </div>
                {member.role && (
                    <p className="text-xs text-gray-500 leading-tight mt-0.5">{member.role}</p>
                )}
                {isUnlocked && member.realName && (
                    <p className="text-xs text-gray-400 mt-1">{member.realName}</p>
                )}
                {isUnlocked && member.description && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                        {member.description}
                    </p>
                )}
                {!isUnlocked && progressHint && (
                    <p className="text-xs text-indigo-400/60 mt-1">{progressHint}</p>
                )}
            </div>
        </div>
    </div>
);

const IhiaMemberCard = ({ member }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-3 flex items-center gap-3 text-left"
            >
                <span className="text-xl shrink-0">{member.icon}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-tight">{member.name}</p>
                    <p className="text-xs text-gray-500 leading-tight">{member.role}</p>
                </div>
                <span className="text-gray-600 text-xs shrink-0">{expanded ? '▲' : '▼'}</span>
            </button>
            {expanded && (
                <div className="px-3 pb-3 space-y-2 border-t border-white/5 pt-2">
                    <p className="text-xs text-gray-400 leading-relaxed">{member.background}</p>
                    {member.skills?.length > 0 && (
                        <div>
                            <p className="text-xs text-indigo-400 font-bold mb-1">スキル</p>
                            {member.skills.map((s, i) => (
                                <p key={i} className="text-xs text-gray-500">• {s}</p>
                            ))}
                        </div>
                    )}
                    {member.personality && (
                        <p className="text-xs text-gray-500 leading-relaxed">{member.personality}</p>
                    )}
                    {member.quirk && (
                        <div className="p-2 rounded-lg bg-white/5 mt-1">
                            <p className="text-xs text-gray-600 italic leading-relaxed">{member.quirk}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
