"use client";

import { useEffect, useState } from "react";

export interface DocumentItem {
  id: string;
  type: "link" | "text" | "file";
  content: string; // URL for link, text content for text, filename for file
  name?: string; // Optional name for the document
  size?: number; // Size in bytes
  createdAt: number;
  isSelected: boolean;
}

const STORAGE_KEY = "chat-model-documents";
const EVENT_KEY = "documents-updated";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    const loadDocuments = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setDocuments(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse documents from local storage", e);
        }
      }
    };

    loadDocuments();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadDocuments();
      }
    };

    const handleCustomEvent = () => loadDocuments();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(EVENT_KEY, handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(EVENT_KEY, handleCustomEvent);
    };
  }, []);

  const saveDocuments = (newDocs: DocumentItem[]) => {
    setDocuments(newDocs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDocs));
    window.dispatchEvent(new Event(EVENT_KEY));
  };

  const addDocument = (doc: Omit<DocumentItem, "id" | "createdAt" | "isSelected">) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      isSelected: true,
    };
    const updated = [...documents, newDoc];
    saveDocuments(updated);
  };

  const addDocuments = (
    docs: Omit<DocumentItem, "id" | "createdAt" | "isSelected">[]
  ) => {
    const newDocs = docs.map((doc) => ({
      ...doc,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      isSelected: true,
    }));
    const updated = [...documents, ...newDocs];
    saveDocuments(updated);
  };

  const removeDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    saveDocuments(updated);
  };

  const clearDocuments = () => {
    saveDocuments([]);
  };

  const toggleSelection = (id: string, isSelected: boolean) => {
    const updated = documents.map((doc) =>
      doc.id === id ? { ...doc, isSelected } : doc
    );
    saveDocuments(updated);
  };

  const toggleAll = (isSelected: boolean) => {
    const updated = documents.map((doc) => ({ ...doc, isSelected }));
    saveDocuments(updated);
  };

  return {
    documents,
    addDocument,
    addDocuments,
    removeDocument,
    clearDocuments,
    toggleSelection,
    toggleAll,
  };
};
