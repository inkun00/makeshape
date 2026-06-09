import { useEffect, useState } from 'react';
import Header from './components/Header';
import StageSelector from './components/StageSelector';
import PlayStage from './components/PlayStage';
import Sandbox from './components/Sandbox';
import { problems } from './data/problems';

export default function App() {
  const [currentView, setCurrentView] = useState('selector');
  const [activeProblem, setActiveProblem] = useState(null);

  const [solvedStages, setSolvedStages] = useState(() => {
    try {
      const saved = localStorage.getItem('makeshape_solved_stages');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('makeshape_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('makeshape_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectProblem = (problem) => {
    setActiveProblem(problem);
    setCurrentView('play');
  };

  const handleSolveStatusChange = (problemId, status) => {
    if (!activeProblem) return;

    const compositeKey = `${activeProblem.category}_${problemId}`;
    const nextSolvedStages = { ...solvedStages, [compositeKey]: status };
    setSolvedStages(nextSolvedStages);
    localStorage.setItem('makeshape_solved_stages', JSON.stringify(nextSolvedStages));
  };

  const handleNextProblem = () => {
    if (!activeProblem) return;

    const currentIndex = problems.findIndex(
      p => p.id === activeProblem.id && p.category === activeProblem.category
    );

    if (currentIndex !== -1 && currentIndex < problems.length - 1) {
      setActiveProblem(problems[currentIndex + 1]);
      return;
    }

    alert('축하합니다! 모든 평면도형 이동 문제를 마쳤습니다.');
    setCurrentView('selector');
    setActiveProblem(null);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'selector') {
      setActiveProblem(null);
    }
  };

  const isActiveProblemSolved = () => {
    if (!activeProblem) return false;
    return solvedStages[`${activeProblem.category}_${activeProblem.id}`] === true;
  };

  return (
    <>
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main-content">
        {currentView === 'selector' && (
          <StageSelector
            solvedStages={solvedStages}
            onSelectProblem={handleSelectProblem}
          />
        )}

        {currentView === 'play' && activeProblem && (
          <PlayStage
            key={`${activeProblem.category}_${activeProblem.id}`}
            problem={activeProblem}
            isSolvedPrev={isActiveProblemSolved()}
            onBack={() => handleViewChange('selector')}
            onNext={handleNextProblem}
            onSolveStatusChange={handleSolveStatusChange}
          />
        )}

        {currentView === 'sandbox' && <Sandbox />}
      </main>
    </>
  );
}
