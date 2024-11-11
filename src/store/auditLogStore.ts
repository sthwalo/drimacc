// src/store/auditLogStore.ts
import { create } from 'zustand';
import { AuditLogEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AuditLogState {
  auditLogs: AuditLogEntry[];
  logAuditEntry: (action: string, details: string) => void;
}

export const useAuditLogStore = create<AuditLogState>((set) => ({
  auditLogs: [],
  logAuditEntry: (action, details) =>
    set((state) => ({
      auditLogs: [
        ...state.auditLogs,
        {
          id: uuidv4(),
          action,
          details,
          timestamp: new Date().toISOString(),
        },
      ],
    })),
}));