

"use client";

import { useState, useEffect, useCallback } from "react";
import type { Document, DocumentStatus, AuditLogEntry } from "@/lib/types";
import { mockDocuments as initialDocuments } from "@/lib/data";

const STORAGE_KEY = "documents";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setDocuments(JSON.parse(storedItems));
      } else {
        // Initialize with mock data if localStorage is empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDocuments));
        setDocuments(initialDocuments);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback to initial mock data if localStorage is not available
      setDocuments(initialDocuments);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateAndStoreDocuments = (newDocuments: Document[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDocuments));
    } catch (error) {
      console.error("Failed to save documents to localStorage:", error);
    }
    setDocuments(newDocuments);
  };
  
  const addDocument = useCallback((doc: Document) => {
    setDocuments(prevDocs => {
      const newDocuments = [doc, ...prevDocs];
      updateAndStoreDocuments(newDocuments);
      return newDocuments;
    });
  }, []);

  const updateDocumentStatus = useCallback((docId: string, status: DocumentStatus, user: { id: string; name: string }, action?: string) => {
    setDocuments(prevDocs => {
      const newDocuments = prevDocs.map(doc => {
        if (doc.id === docId && doc.status !== status) {
          const newAuditLogEntry: AuditLogEntry = {
            id: `log-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            action: action || `Status changed to ${status}`,
            timestamp: new Date().toISOString(),
          };
          const updatedAuditLog = [...(doc.auditLog || []), newAuditLogEntry];
          return { ...doc, status, auditLog: updatedAuditLog };
        }
        return doc;
      });
      updateAndStoreDocuments(newDocuments);
      return newDocuments;
    });
  }, []);

  const addAuditLogEntry = useCallback((docId: string, logEntry: AuditLogEntry) => {
    setDocuments(prevDocs => {
      const newDocuments = prevDocs.map(doc => {
        if (doc.id === docId) {
           const updatedAuditLog = [...(doc.auditLog || []), logEntry];
           return { ...doc, auditLog: updatedAuditLog };
        }
        return doc;
      });
       updateAndStoreDocuments(newDocuments);
       return newDocuments;
    });
  }, []);


  return { documents, addDocument, updateDocumentStatus, addAuditLogEntry, isLoaded };
}
