"use client";

import React, { useEffect, useRef } from 'react';
import { Sparkles, Plus, X, Highlighter } from 'lucide-react';

interface TextSelectionPopupProps {
  text: string;
  position: { x: number; y: number };
  page: number;
  onAddToContext: () => void;
  onAskAI: () => void;
  onHighlight: () => void;
  onClose: () => void;
}

export default function TextSelectionPopup({
  text,
  position,
  page,
  onAddToContext,
  onAskAI,
  onHighlight,
  onClose,
}: TextSelectionPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-2 min-w-[200px]"
      style={{
        left: `${Math.min(position.x, window.innerWidth - 220)}px`,
        top: `${Math.max(position.y - 80, 10)}px`,
      }}
    >
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-xs font-semibold text-gray-600">নির্বাচিত টেক্সট</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>
      </div>

      <div className="px-2 py-1 mb-2 bg-gray-50 rounded text-xs text-gray-700 max-h-20 overflow-y-auto">
        {text.length > 100 ? `${text.substring(0, 100)}...` : text}
      </div>

      <div className="space-y-1">
        <button
          onClick={onHighlight}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded transition-colors font-medium"
        >
          <Highlighter className="w-4 h-4" />
          <span>হাইলাইট করুন</span>
        </button>
        <button
          onClick={onAddToContext}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>কনটেক্সটে যোগ করুন</span>
        </button>
        <button
          onClick={onAskAI}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI-কে জিজ্ঞাসা করুন</span>
        </button>
      </div>
    </div>
  );
}

