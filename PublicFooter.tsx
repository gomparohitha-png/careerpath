import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E6DBFF] text-xs text-[#6B5A99] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3B2A6B] text-white flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#F2C94C]" />
              </div>
              <span className="font-bold text-sm text-[#2A1B4E]">CareerPath</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Personalized, year-wise engineering career and placement roadmap platform with automated proof-of-work completion.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-2">
            <div className="font-bold text-[#2A1B4E] uppercase tracking-wider text-[11px]">
              Platform
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/features" className="hover:text-[#3B2A6B]">Curriculum Roadmaps</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#3B2A6B]">Proof Verification</Link></li>
              <li><Link to="/scoring" className="hover:text-[#3B2A6B]">How Scoring Works</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-2">
            <div className="font-bold text-[#2A1B4E] uppercase tracking-wider text-[11px]">
              Branches & Goals
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/features" className="hover:text-[#3B2A6B]">CSE / IT Software Roadmap</Link></li>
              <li><Link to="/features" className="hover:text-[#3B2A6B]">ECE / EEE Embedded Paths</Link></li>
              <li><Link to="/features" className="hover:text-[#3B2A6B]">Core Mechanical & Civil</Link></li>
              <li><Link to="/features" className="hover:text-[#3B2A6B]">GATE & Government Exams</Link></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-2">
            <div className="font-bold text-[#2A1B4E] uppercase tracking-wider text-[11px]">
              Portals
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/login" className="hover:text-[#3B2A6B]">Student Login</Link></li>
              <li><Link to="/signup" className="hover:text-[#3B2A6B]">Student Registration</Link></li>
              <li><Link to="/admin-login" className="hover:text-[#3B2A6B]">Admin & TPO Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#F3EEFF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} CareerPath: Plan • Learn • Grow. Engineered for B.Tech students.
          </div>
          <div className="flex items-center gap-1.5 text-[#805E00]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Server-Authoritative Proof-of-Work Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
