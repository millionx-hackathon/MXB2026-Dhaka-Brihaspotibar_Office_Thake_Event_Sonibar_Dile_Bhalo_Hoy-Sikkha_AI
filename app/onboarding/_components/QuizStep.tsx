"use client";
import React, { useState } from 'react';
import { StepContainer } from './StepContainer';
import { QUIZ_DATA } from '../_data/quiz';
import { CheckCircle, Circle, Timer } from 'lucide-react';

interface QuizStepProps {
  onFinish: (score: number, answers: Record<string, number>) => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({ onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // qId -> optionIndex
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = QUIZ_DATA[currentIdx];
  const isLast = currentIdx === QUIZ_DATA.length - 1;

  const handleOptionSelect = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optIdx }));
  };

  const handleNext = () => {
    if (isLast) {
      finishQuiz();
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const finishQuiz = () => {
    setIsSubmitting(true);
    // Calculate score
    let score = 0;
    QUIZ_DATA.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    // Simulate network delay for "calculating"
    setTimeout(() => {
      onFinish(score, answers);
    }, 1500);
  };

  if (isSubmitting) {
    return (
      <StepContainer className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">ফলাফল বিশ্লেষণ করা হচ্ছে...</h2>
        <p className="text-gray-400">আমরা আপনার দক্ষতাসমূহ যাচাই করছি</p>
      </StepContainer>
    );
  }

  return (
    <StepContainer
      title="দক্ষতা যাচাই পরীক্ষা"
      subtitle={`প্রশ্ন ${currentIdx + 1} / ${QUIZ_DATA.length}`}
    >
      <div className="mb-6">
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / QUIZ_DATA.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8 min-h-[200px]">
        <h3 className="text-xl font-medium mb-2 text-indigo-300">
          {currentQuestion.subject}
        </h3>
        <p className="text-2xl font-bold mb-6">
          {currentQuestion.question}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`
                w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group
                ${answers[currentQuestion.id] === idx
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }
              `}
            >
              <span>{opt}</span>
              {answers[currentQuestion.id] === idx ? (
                <CheckCircle className="w-5 h-5 text-indigo-400" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600 group-hover:text-gray-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
        <div className="text-sm text-gray-400 flex items-center">
          <Timer className="w-4 h-4 mr-2" />
          সময়: কোনো বাধা নেই
        </div>
        <button
          onClick={handleNext}
          disabled={answers[currentQuestion.id] === undefined}
          className={`
            px-8 py-3 rounded-full font-bold transition-all
            ${answers[currentQuestion.id] !== undefined
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLast ? 'জমা দিন' : 'পরবর্তী'}
        </button>
      </div>
    </StepContainer>
  );
};
