"use client";

import { useState, useEffect, useCallback } from "react";
import type { Document } from "@/lib/types";
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
    const newDocuments = [doc, ...documents];
    updateAndStoreDocuments(newDocuments);
  }, [documents]);

  return { documents, addDocument, isLoaded };
}
