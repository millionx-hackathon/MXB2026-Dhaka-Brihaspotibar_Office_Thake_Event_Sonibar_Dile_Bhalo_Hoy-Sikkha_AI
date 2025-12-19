"use client";
import React, { useState } from 'react';
import { StepContainer } from './StepContainer';
import { ChevronRight } from 'lucide-react';

const CLASSES = [
  { id: '1', label: '১ম শ্রেণী' },
  { id: '2', label: '২য় শ্রেণী' },
  { id: '3', label: '৩য় শ্রেণী' },
  { id: '4', label: '৪র্থ শ্রেণী' },
  { id: '5', label: '৫ম শ্রেণী' },
  { id: '6', label: '৬ষ্ঠ শ্রেণী' },
  { id: '7', label: '৭ম শ্রেণী' },
  { id: '8', label: '৮ম শ্রেণী' },
  { id: '9', label: '৯ম শ্রেণী' },
  { id: '10', label: '১০ম শ্রেণী' },
  { id: '11', label: 'একাদশ' },
  { id: '12', label: 'দ্বাদশ' },
];

interface IntroStepProps {
  onNext: (selectedClass: string) => void;
}

export const IntroStep: React.FC<IntroStepProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected) {
      onNext(selected);
    }
  };

  return (
    <StepContainer
      title="Shikkha AI তে স্বাগতম!"
      subtitle="শুরু করার জন্য আপনার শ্রেণী নির্বাচন করুন"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {CLASSES.map((cls) => (
          <button
            key={cls.id}
            onClick={() => setSelected(cls.id)}
            className={`
              p-4 rounded-xl border transition-all duration-300 transform hover:scale-105
              text-lg font-medium text-center
              ${selected === cls.id
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/30'
              }
            `}
          >
            {cls.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`
            flex items-center space-x-2 px-8 py-3 rounded-full font-semibold transition-all duration-300
            ${selected
              ? 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg cursor-pointer transform hover:-translate-y-1'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <span>পরবর্তী ধাপ</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </StepContainer>
  );
};
