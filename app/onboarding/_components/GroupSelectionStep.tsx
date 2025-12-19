"use client";
import React, { useState } from 'react';
import { StepContainer } from './StepContainer';
import { ChevronRight, Atom, BookOpen, Calculator } from 'lucide-react';

const GROUPS = [
  { id: 'science', label: 'বিজ্ঞান', icon: Atom, desc: 'পদার্থ, রসায়ন, জীববিজ্ঞান' },
  { id: 'commerce', label: 'ব্যবসায় শিক্ষা', icon: Calculator, desc: 'হিসাববিজ্ঞান, ফিন্যান্স' },
  { id: 'arts', label: 'মানবিক', icon: BookOpen, desc: 'ইতিহাস, অর্থনীতি' },
];

interface GroupSelectionStepProps {
  onNext: (group: string) => void;
  onBack: () => void;
}

export const GroupSelectionStep: React.FC<GroupSelectionStepProps> = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected) {
      onNext(selected);
    }
  };

  return (
    <StepContainer
      title="বিভাগ নির্বাচন করুন"
      subtitle="আপনি কোন বিভাগে পড়াশোনা করছেন?"
    >
      <div className="space-y-4 mb-8">
        {GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <button
              key={group.id}
              onClick={() => setSelected(group.id)}
              className={`
                w-full p-4 md:p-6 rounded-2xl border transition-all duration-300 flex items-center space-x-6 text-left group
                ${selected === group.id
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-400 text-white shadow-xl scale-[1.02]'
                  : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/30'
                }
              `}
            >
              <div className={`
                p-3 rounded-full
                ${selected === group.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}
              `}>
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{group.label}</h3>
                <p className={`text-sm mt-1 ${selected === group.id ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {group.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          পেছনে যান
        </button>
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`
            flex items-center space-x-2 px-8 py-3 rounded-full font-semibold transition-all duration-300
            ${selected
              ? 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg cursor-pointer'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <span>বোর্ড কুইজ শুরু করুন</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </StepContainer>
  );
};
