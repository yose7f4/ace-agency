import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CandidateApplicationForm } from '@/components/candidates/CandidateApplicationForm';

export default function ApplyGeneralPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading application...</div>}>
          <CandidateApplicationForm />
        </Suspense>
      </main>
    </div>
  );
}
