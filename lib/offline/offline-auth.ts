'use client';

import {
  findOfflineAccount,
  saveOfflineAccount,
  getOfflineAccounts,
  removeOfflineAccount,
  type OfflineStoredAccount,
} from './offline-storage';
import { normaliserIdentifiant } from '../auth-identifier';

export interface OfflineUserContext {
  userId: string;
  nomComplet?: string | null;
  identifiant: string;
  telephone?: string | null;
  email?: string | null;
  role: string;
  hotelId: string;
  hotelNom: string;
  devise?: string;
  permissions?: any;
}

export interface OfflineSession {
  user: OfflineUserContext;
  isOffline: boolean;
  token: string;
  createdAt: string;
  expiresAt: number;
}

const STORAGE_SESSION_KEY = 'demba_offline_dhotel_session';
const COOKIE_OFFLINE_KEY = 'demba_offline_active';

export function generateSalt(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    let hash = 0;
    const str = `demba:${salt}:${password}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(`demba:${salt}:${password}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function authenticateOffline(
  identifierOrPhoneOrEmail: string,
  plainPassword: string
): Promise<{ success: boolean; session?: OfflineSession; error?: string }> {
  try {
    const account = await findOfflineAccount(identifierOrPhoneOrEmail);
    if (!account) {
      return {
        success: false,
        error: 'Aucun compte local enregistré sur cet appareil. Connectez-vous une première fois avec une connexion Internet active.',
      };
    }

    const computedHash = await hashPasswordWithSalt(plainPassword, account.salt);
    if (computedHash !== account.passwordHash) {
      return {
        success: false,
        error: 'Mot de passe incorrect pour le mode hors-ligne.',
      };
    }

    const session: OfflineSession = {
      user: {
        userId: account.userContext.userId,
        nomComplet: account.userContext.nomComplet,
        identifiant: account.userContext.identifiant,
        telephone: account.userContext.telephone,
        email: account.userContext.email,
        role: account.userContext.role,
        hotelId: account.userContext.hotelId || 'offline-hotel-id',
        hotelNom: account.userContext.hotelNom || 'Hôtel Teranga Palace 5★',
        devise: account.userContext.devise || 'XOF',
        permissions: account.userContext.permissions,
      },
      isOffline: true,
      token: `offline_tok_${generateSalt()}`,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 jours
    };

    saveOfflineSession(session);
    return { success: true, session };
  } catch (err: any) {
    return {
      success: false,
      error: `Erreur d'authentification locale : ${err.message || 'Erreur inconnue'}`,
    };
  }
}

export function saveOfflineSession(session: OfflineSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    document.cookie = `${COOKIE_OFFLINE_KEY}=1; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
  } catch (e) {
    console.warn('Impossible de sauvegarder la session locale:', e);
  }
}

export function getOfflineSession(): OfflineSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    const session: OfflineSession = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearOfflineSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearOfflineSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    document.cookie = `${COOKIE_OFFLINE_KEY}=0; path=/; max-age=0; SameSite=Lax`;
  } catch {}
}
