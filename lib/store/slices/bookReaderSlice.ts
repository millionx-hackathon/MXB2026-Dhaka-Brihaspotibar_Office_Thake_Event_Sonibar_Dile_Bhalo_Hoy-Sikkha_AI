import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  page: number;
  createdAt: number;
}

export interface PageSummary {
  page: number;
  summary: string;
  keyPoints: string[];
  createdAt: number;
}

export interface TextHighlight {
  id: string;
  text: string;
  page: number;
  rects: Array<{ x: number; y: number; width: number; height: number }>;
  createdAt: number;
  color?: string;
}

export interface BookReaderState {
  // Key format: "bookId/chapterId" -> last read page
  lastReadPages: Record<string, number>;
  // Reading progress: "bookId/chapterId" -> reading session data
  readingSessions: Record<string, {
    lastReadAt: number;
    totalPagesRead: number;
    readingTime: number; // in seconds
    bookmarks: number[]; // page numbers
    highlightedPages: number[]; // highlighted page numbers
  }>;
  // Flashcards: "bookId/chapterId" -> array of flashcards
  flashcards: Record<string, Flashcard[]>;
  // Page summaries: "bookId/chapterId" -> array of summaries
  pageSummaries: Record<string, PageSummary[]>;
  // Text highlights: "bookId/chapterId" -> array of highlights
  textHighlights: Record<string, TextHighlight[]>;
}

const initialState: BookReaderState = {
  lastReadPages: {},
  readingSessions: {},
  flashcards: {},
  pageSummaries: {},
  textHighlights: {},
};

const bookReaderSlice = createSlice({
  name: 'bookReader',
  initialState,
  reducers: {
    setLastReadPage: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
        page: number;
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (!state.lastReadPages) {
        state.lastReadPages = {};
      }
      state.lastReadPages[key] = action.payload.page;

      // Update reading session
      if (!state.readingSessions) {
        state.readingSessions = {};
      }
      if (!state.readingSessions[key]) {
        state.readingSessions[key] = {
          lastReadAt: Date.now(),
          totalPagesRead: action.payload.page,
          readingTime: 0,
          bookmarks: [],
          highlightedPages: [],
        };
      } else {
        state.readingSessions[key].lastReadAt = Date.now();
        state.readingSessions[key].totalPagesRead = Math.max(
          state.readingSessions[key].totalPagesRead,
          action.payload.page
        );
      }
    },

    updateReadingTime: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
        timeSpent: number; // in seconds
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (!state.readingSessions) {
        state.readingSessions = {};
      }
      if (state.readingSessions[key]) {
        state.readingSessions[key].readingTime += action.payload.timeSpent;
      }
    },

    toggleBookmark: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
        page: number;
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (!state.readingSessions) {
        state.readingSessions = {};
      }
      if (!state.readingSessions[key]) {
        state.readingSessions[key] = {
          lastReadAt: Date.now(),
          totalPagesRead: action.payload.page,
          readingTime: 0,
          bookmarks: [],
          highlightedPages: [],
        };
      }

      // Ensure bookmarks exists and is an array
      if (!state.readingSessions[key].bookmarks) {
        state.readingSessions[key].bookmarks = [];
      }

      const bookmarks = state.readingSessions[key].bookmarks;
      const index = bookmarks.indexOf(action.payload.page);
      if (index > -1) {
        bookmarks.splice(index, 1);
      } else {
        bookmarks.push(action.payload.page);
        bookmarks.sort((a, b) => a - b);
      }
    },

    clearReadingSession: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (state.readingSessions) {
        delete state.readingSessions[key];
      }
      if (state.lastReadPages) {
        delete state.lastReadPages[key];
      }
    },

    toggleHighlight: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
        page: number;
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (!state.readingSessions) {
        state.readingSessions = {};
      }
      if (!state.readingSessions[key]) {
        state.readingSessions[key] = {
          lastReadAt: Date.now(),
          totalPagesRead: action.payload.page,
          readingTime: 0,
          bookmarks: [],
          highlightedPages: [],
        };
      }

      // Ensure highlightedPages exists and is an array
      if (!state.readingSessions[key].highlightedPages) {
        state.readingSessions[key].highlightedPages = [];
      }

      const highlightedPages = state.readingSessions[key].highlightedPages;
      const index = highlightedPages.indexOf(action.payload.page);
      if (index > -1) {
        highlightedPages.splice(index, 1);
      } else {
        highlightedPages.push(action.payload.page);
        highlightedPages.sort((a, b) => a - b);
      }
    },

    addFlashcard: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
        flashcard: Flashcard;
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (!state.flashcards) {
        state.flashcards = {};
      }
      if (!state.flashcards[key]) {
        state.flashcards[key] = [];
      }
      state.flashcards[key].push(action.payload.flashcard);
    },

    removeFlashcard: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
        flashcardId: string;
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (!state.flashcards) {
        state.flashcards = {};
      }
      if (state.flashcards[key]) {
        state.flashcards[key] = state.flashcards[key].filter(
          f => f.id !== action.payload.flashcardId
        );
      }
    },

    addPageSummary: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
        summary: PageSummary;
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (!state.pageSummaries) {
        state.pageSummaries = {};
      }
      if (!state.pageSummaries[key]) {
        state.pageSummaries[key] = [];
      }
      // Remove existing summary for this page if exists
      state.pageSummaries[key] = state.pageSummaries[key].filter(
        s => s.page !== action.payload.summary.page
      );
      state.pageSummaries[key].push(action.payload.summary);
    },

    addTextHighlight: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
        highlight: TextHighlight;
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (!state.textHighlights) {
        state.textHighlights = {};
      }
      if (!state.textHighlights[key]) {
        state.textHighlights[key] = [];
      }
      state.textHighlights[key].push(action.payload.highlight);
    },

    removeTextHighlight: (
      state,
      action: PayloadAction<{
        bookId: string;
        chapterId: string;
        highlightId: string;
      }>
    ) => {
      const key = `${action.payload.bookId}/${action.payload.chapterId}`;
      if (state.textHighlights && state.textHighlights[key]) {
        state.textHighlights[key] = state.textHighlights[key].filter(
          h => h.id !== action.payload.highlightId
        );
      }
    },
  },
});

export const {
  setLastReadPage,
  updateReadingTime,
  toggleBookmark,
  clearReadingSession,
  toggleHighlight,
  addFlashcard,
  removeFlashcard,
  addPageSummary,
  addTextHighlight,
  removeTextHighlight,
} = bookReaderSlice.actions;

export default bookReaderSlice.reducer;

