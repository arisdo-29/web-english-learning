import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import PlacementModal from './components/PlacementModal';
import CommandPalette from './components/CommandPalette';
import SpeedChallengeModal from './components/SpeedChallengeModal';

import HomeTab from './components/HomeTab';
import TranslateTab from './components/TranslateTab';
import VocabTab from './components/VocabTab';
import ScrambleTab from './components/ScrambleTab';
import BlankTab from './components/BlankTab';
import DictationTab from './components/DictationTab';
import ReadingTab from './components/ReadingTab';
import SpeakingTab from './components/SpeakingTab';
import GrammarTab from './components/GrammarTab';
import ConversationTab from './components/ConversationTab';
import NotebookTab from './components/NotebookTab';
import SettingsTab from './components/SettingsTab';

function MainContent() {
  const { activeTab } = useApp();

  return (
    <div className="h-screen flex bg-background text-foreground transition-colors selection:bg-primary/20 overflow-hidden">
      {/* shadcn/ui Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />

        <main className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 transition-all">
          <div className="animate-in fade-in duration-150">
            {activeTab === 'home' && <HomeTab />}
            {activeTab === 'translate' && <TranslateTab />}
            {activeTab === 'vocab' && <VocabTab />}
            {activeTab === 'scramble' && <ScrambleTab />}
            {activeTab === 'blank' && <BlankTab />}
            {activeTab === 'dictation' && <DictationTab />}
            {activeTab === 'reading' && <ReadingTab />}
            {activeTab === 'speaking' && <SpeakingTab />}
            {activeTab === 'grammar' && <GrammarTab />}
            {activeTab === 'chat' && <ConversationTab />}
            {activeTab === 'review' && <NotebookTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </main>
      </div>

      <CommandPalette />
      <SpeedChallengeModal />
      <PlacementModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
