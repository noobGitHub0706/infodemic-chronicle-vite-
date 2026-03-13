import { useCallback } from 'react';
import { db, doc, setDoc } from '../lib/firebase';

export const useFirebase = (sessionId, collectionName = 'sessions') => {
    console.log('[Firebase] hook initialized — collection:', collectionName, 'sessionId:', sessionId);

    // フィールド単位の保存: {collectionName}/{sessionId} の { [field]: data } に merge
    const saveToFirebase = useCallback(async (field, data, merge = true) => {
        const path = `${collectionName}/${sessionId}`;
        console.log('[Firebase] saveToFirebase — collection:', collectionName, 'path:', path, 'field:', field, 'data:', data);
        try {
            const docRef = doc(db, collectionName, sessionId);
            await setDoc(docRef, {
                [field]: data,
                lastUpdated: new Date().toISOString()
            }, { merge });
            console.log('[Firebase] saveToFirebase OK —', path, '/', field);
            return true;
        } catch (error) {
            console.error('[Firebase] saveToFirebase ERROR — path:', path, error);
            return false;
        }
    }, [sessionId, collectionName]);

    // トップレベルマージ: {collectionName}/{sessionId} に data を直接マージ
    const mergeDoc = useCallback(async (data) => {
        const path = `${collectionName}/${sessionId}`;
        console.log('[Firebase] mergeDoc — collection:', collectionName, 'path:', path, 'data:', data);
        try {
            const docRef = doc(db, collectionName, sessionId);
            await setDoc(docRef, {
                ...data,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
            console.log('[Firebase] mergeDoc OK —', path);
            return true;
        } catch (error) {
            console.error('[Firebase] mergeDoc ERROR — path:', path, error);
            return false;
        }
    }, [sessionId, collectionName]);

    // サブコレクション保存: {collectionName}/{sessionId}/{subcollection}/{docId}
    const saveSubdoc = useCallback(async (subcollection, docId, data) => {
        const path = `${collectionName}/${sessionId}/${subcollection}/${docId}`;
        console.log('[Firebase] saveSubdoc — collection:', collectionName, 'path:', path, 'data:', data);
        try {
            const docRef = doc(db, collectionName, sessionId, subcollection, docId);
            await setDoc(docRef, {
                ...data,
                savedAt: new Date().toISOString()
            }, { merge: true });
            console.log('[Firebase] saveSubdoc OK —', path);
            return true;
        } catch (error) {
            console.error('[Firebase] saveSubdoc ERROR — path:', path, error);
            return false;
        }
    }, [sessionId, collectionName]);

    return { saveToFirebase, mergeDoc, saveSubdoc };
};
