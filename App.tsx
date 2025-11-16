
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Chat } from './components/Chat';
import { CarePlan } from './components/CarePlan';
import type { MedicalAnalysis, View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [medicalAnalysis, setMedicalAnalysis] = useState<MedicalAnalysis | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleAnalysisComplete = useCallback((analysis: MedicalAnalysis) => {
    setMedicalAnalysis(analysis);
    setCurrentView('dashboard'); // Switch back to dashboard to show results
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <Chat documentContext={medicalAnalysis?.summary || ''} />;
      case 'care-plan':
        return <CarePlan documentContext={medicalAnalysis?.summary || ''} keyFindings={medicalAnalysis?.keyFindings || []} />;
      case 'dashboard':
      default:
        return <Dashboard analysis={medicalAnalysis} onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-secondary">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
