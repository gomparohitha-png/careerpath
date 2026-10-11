import React, { useEffect } from 'react';
import { Award, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { fireCelebrationConfetti } from '../lib/confetti.ts';

interface CelebrationModalProps {
  data: {
    pointsAwarded: number;
    title?: string;
    message?: string;
    streakDays?: number;
    level?: string;
  } | null;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  useEffect(() => {
    fireCelebrationConfetti();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1B4E]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#F2C94C] overflow-hidden text-center p-8 relative">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-[#F2C94C]/40 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Badge Icon */}
        <div className="relative w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#D4A017] to-[#F2C94C] flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
          <Award className="w-10 h-10 text-[#2A1B4E]" />
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#3B2A6B] text-white flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#F2C94C]" />
          </div>
        </div>

        {/* Header */}
        <span className="text-xs font-bold tracking-widest uppercase text-[#805E00]">
          Verified Completion
        </span>
        <h3 className="text-2xl font-black text-[#2A1B4E] mt-1">
          Proof of Work Verified!
        </h3>

        {/* Points Display */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF5] to-[#FFF8E7] border border-[#F2C94C]/70">
          <div className="text-3xl font-black font-mono text-[#D4A017] tabular-nums">
            +{data.pointsAwarded} Points
          </div>
          <p className="text-xs text-[#6B5A99] font-medium mt-1">
            {data.message || 'Points added to your verified student record.'}
          </p>
        </div>

        {/* Streak & Level Info */}
        <div className="flex items-center justify-center gap-4 py-2 text-xs font-medium text-[#4A3B6F]">
          {data.streakDays !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3EEFF] border border-[#E6DBFF]">
              <Flame className="w-4 h-4 text-[#D4A017] fill-[#F2C94C]" />
              <span>Streak: <strong className="text-[#2A1B4E] font-bold">{data.streakDays} days</strong></span>
            </div>
          )}
          {data.level && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF]">
              <Award className="w-4 h-4 text-[#8E68CD]" />
              <span>Level: <strong className="text-[#2A1B4E] font-bold">{data.level}</strong></span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
