"use client";

import React, { useState, useEffect } from 'react';
import { Layers, Loader2, X, ChevronLeft, ChevronRight, RotateCcw, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { addFlashcard, removeFlashcard, Flashcard } from '@/lib/store/slices/bookReaderSlice';

interface FlashcardGeneratorProps {
  bookId: string;
  chapterId: string;
  currentPage: number;
  chapterTitle: string;
  onClose: () => void;
}

export default function FlashcardGenerator({
  bookId,
  chapterId,
  currentPage,
  chapterTitle,
  onClose,
}: FlashcardGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const dispatch = useAppDispatch();

  const flashcards = useAppSelector(
    (state) => state.bookReader?.flashcards?.[`${bookId}/${chapterId}`] || []
  );

  const generateFlashcards = () => {
    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const newFlashcards: Flashcard[] = [];

      // Generate mock flashcards based on chapter
      if (chapterId === 'ch2' || chapterId === 'chapter-2') {
        newFlashcards.push(
          {
            id: `fc-${Date.now()}-1`,
            front: 'গতি কী?',
            back: 'গতি হলো পরসঙ্গ কাঠামোর সাপেক্ষে বস্তুর অবস্থানের পরিবর্তন।',
            page: currentPage,
            createdAt: Date.now(),
          },
          {
            id: `fc-${Date.now()}-2`,
            front: 'স্থিতি এবং গতির পার্থক্য কী?',
            back: 'স্থিতি হলো বস্তুর অবস্থানের পরিবর্তন না হওয়া, আর গতি হলো অবস্থানের পরিবর্তন। এই পার্থক্য পরসঙ্গ কাঠামোর উপর নির্ভর করে।',
            page: currentPage,
            createdAt: Date.now(),
          },
          {
            id: `fc-${Date.now()}-3`,
            front: 'গতির প্রকারভেদ কী কী?',
            back: 'গতির প্রধান প্রকারগুলো হলো: ১) রৈখিক গতি, ২) ঘূর্ণন গতি, ৩) চলন গতি, ৪) পর্যায়বৃত্ত গতি।',
            page: currentPage,
            createdAt: Date.now(),
          },
          {
            id: `fc-${Date.now()}-4`,
            front: 'পরসঙ্গ কাঠামো কী?',
            back: 'পরসঙ্গ কাঠামো হলো একটি স্থির বিন্দু বা বস্তু যার সাপেক্ষে অন্য বস্তুর অবস্থান বা গতি পরিমাপ করা হয়।',
            page: currentPage,
            createdAt: Date.now(),
          }
        );
      } else {
        newFlashcards.push(
          {
            id: `fc-${Date.now()}-1`,
            front: 'ভৌত রাশি কী?',
            back: 'ভৌত রাশি হলো পদার্থবিজ্ঞানে ব্যবহৃত পরিমাপযোগ্য রাশি, যেমন দৈর্ঘ্য, ভর, সময়, তাপমাত্রা ইত্যাদি।',
            page: currentPage,
            createdAt: Date.now(),
          },
          {
            id: `fc-${Date.now()}-2`,
            front: 'পরিমাপের গুরুত্ব কী?',
            back: 'পরিমাপ বিজ্ঞানের ভিত্তি। সঠিক পরিমাপ ছাড়া বিজ্ঞান সম্ভব নয়। পরিমাপের মাধ্যমে আমরা প্রকৃতির নিয়মগুলো আবিষ্কার করতে পারি।',
            page: currentPage,
            createdAt: Date.now(),
          },
          {
            id: `fc-${Date.now()}-3`,
            front: 'নির্ভুলতা এবং যথার্থতার পার্থক্য কী?',
            back: 'নির্ভুলতা হলো পরিমাপের কাছাকাছি আসার ক্ষমতা, আর যথার্থতা হলো একই পরিমাপ বারবার করার সময় একই ফল পাওয়া।',
            page: currentPage,
            createdAt: Date.now(),
          }
        );
      }

      // Add flashcards to Redux
      newFlashcards.forEach(flashcard => {
        dispatch(addFlashcard({ bookId, chapterId, flashcard }));
      });

      setIsGenerating(false);
      setCurrentIndex(0);
      setIsFlipped(false);
    }, 2000);
  };

  useEffect(() => {
    if (flashcards.length === 0) {
      generateFlashcards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcards.length]);

  const handleDelete = (flashcardId: string) => {
    dispatch(removeFlashcard({ bookId, chapterId, flashcardId }));
    if (currentIndex >= flashcards.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6" />
            <div>
              <h2 className="font-bold text-lg">ফ্ল্যাশকার্ড</h2>
              <p className="text-sm text-indigo-100">{chapterTitle} - পৃষ্ঠা {currentPage}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-gray-600 bengali-text">ফ্ল্যাশকার্ড তৈরি হচ্ছে...</p>
            </div>
          ) : flashcards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Layers className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-600 bengali-text">কোনো ফ্ল্যাশকার্ড নেই</p>
              <button
                onClick={generateFlashcards}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ফ্ল্যাশকার্ড তৈরি করুন
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Flashcard Counter */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
                  <span className="text-sm font-semibold text-indigo-700">
                    {currentIndex + 1} / {flashcards.length}
                  </span>
                </div>
              </div>

              {/* Flashcard - Improved Design */}
              <div className="relative min-h-[400px]">
                {/* Front Side */}
                <div
                  className={`absolute inset-0 p-8 bg-white rounded-2xl shadow-xl border-2 border-gray-100 flex flex-col transition-all duration-500 cursor-pointer hover:shadow-2xl ${
                    isFlipped ? 'opacity-0 scale-95 rotate-y-180 pointer-events-none' : 'opacity-100 scale-100'
                  }`}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
                      <span className="text-sm font-semibold text-indigo-700">প্রশ্ন</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(currentFlashcard.id);
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                    </button>
                  </div>
                  <div className="flex-1 flex items-center justify-center px-4">
                    <p className="text-2xl font-semibold text-gray-900 bengali-text text-center leading-relaxed">
                      {currentFlashcard.front}
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <RotateCcw className="w-4 h-4" />
                    <span>ক্লিক করে উল্টান</span>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className={`absolute inset-0 p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl border-2 border-indigo-200 flex flex-col transition-all duration-500 cursor-pointer hover:shadow-2xl ${
                    isFlipped ? 'opacity-100 scale-100' : 'opacity-0 scale-95 rotate-y-180 pointer-events-none'
                  }`}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                      <span className="text-sm font-semibold text-green-700">উত্তর</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(currentFlashcard.id);
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                    </button>
                  </div>
                  <div className="flex-1 flex items-center justify-center px-4">
                    <p className="text-xl text-gray-800 bengali-text text-center leading-relaxed">
                      {currentFlashcard.back}
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-indigo-200 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <RotateCcw className="w-4 h-4" />
                    <span>আবার উল্টান</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setCurrentIndex(Math.max(0, currentIndex - 1));
                    setIsFlipped(false);
                  }}
                  disabled={currentIndex === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>পূর্ববর্তী</span>
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>উল্টান</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1));
                    setIsFlipped(false);
                  }}
                  disabled={currentIndex === flashcards.length - 1}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow"
                >
                  <span>পরবর্তী</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <button
            onClick={generateFlashcards}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            নতুন ফ্ল্যাশকার্ড তৈরি করুন
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}

