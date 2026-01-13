'use client';

import * as CryptoJS from "crypto-js";
import { CryptoHistoryItem } from "./types";

const historyKey = "crypto-history";
const maxHistoryItems = 5;
const secretKey = "WctFUiHmEQ1yKIkQDbGigE2"

// This function save data for history with a maximum of 5 items
const saveToHistoryToLocalStorage = (id: string, name: string): void => {
    const now = new Date().toISOString();

    const encrypted = localStorage.getItem(historyKey);

    let history: CryptoHistoryItem[] = []

    if (encrypted) {
        const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
        if (decrypted) {
            history = JSON.parse(decrypted) as CryptoHistoryItem[];
        }
    }

    history.push({ id, name, timestamp: now });
    if (history.length > maxHistoryItems) {
        history = history.slice(history.length - maxHistoryItems);
    }

    localStorage.setItem(historyKey, CryptoJS.AES.encrypt(JSON.stringify(history), secretKey).toString());
}

// This functions retrieves history from local storage
const getHistoryFromLocalStorage = (): CryptoHistoryItem[] => {
    const encrypted = localStorage.getItem(historyKey);
    if (!encrypted) {
        return [];
    }
    const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as CryptoHistoryItem[];
}

export { saveToHistoryToLocalStorage, getHistoryFromLocalStorage };