import { useEffect, useState } from 'react';
import Header from './components/Header';
import StageSelector from './components/StageSelector';
import PlayStage from './components/PlayStage';
import Sandbox from './components/Sandbox';
import CertificateModal from './components/CertificateModal';
import { problems } from './data/problems';

const STORAGE_KEYS = {
  solvedStages: 'makeshape_solved_stages',
  theme: 'makeshape_theme',
  performance: 'makeshape_performance_stats',
  certificateSeen: 'makeshape_certificate_seen'
};

const getInitialPerformanceStats = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.performance);
    return saved ? JSON.parse(saved) : { wrongAttempts: 0, hintUses: 0 };
  } catch {
    return { wrongAttempts: 0, hintUses: 0 };
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState('selector');
  const [activeProblem, setActiveProblem] = useState(null);

  const [solvedStages, setSolvedStages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.solvedStages);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [performanceStats, setPerformanceStats] = useState(getInitialPerformanceStats);
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [certificateSeen, setCertificateSeen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.certificateSeen) === 'true';
    } catch {
      return false;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.theme) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const allStagesCleared = problems.every(
    problem => solvedStages[`${problem.category}_${problem.id}`] === true
  );

  const certificateVisible = certificateOpen || (allStagesCleared && !certificateSeen);

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
    localStorage.setItem(STORAGE_KEYS.solvedStages, JSON.stringify(nextSolvedStages));

    if (!status) {
      setCertificateSeen(false);
      localStorage.setItem(STORAGE_KEYS.certificateSeen, 'false');
    }
  };

  const handlePenalty = (type) => {
    const key = type === 'hint' ? 'hintUses' : 'wrongAttempts';

    setPerformanceStats((currentStats) => {
      const nextStats = {
        wrongAttempts: currentStats.wrongAttempts || 0,
        hintUses: currentStats.hintUses || 0,
        [key]: (currentStats[key] || 0) + 1
      };

      localStorage.setItem(STORAGE_KEYS.performance, JSON.stringify(nextStats));
      return nextStats;
    });
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

  const handleCloseCertificate = () => {
    setCertificateOpen(false);

    if (allStagesCleared) {
      setCertificateSeen(true);
      localStorage.setItem(STORAGE_KEYS.certificateSeen, 'true');
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
            allStagesCleared={allStagesCleared}
            onOpenCertificate={() => setCertificateOpen(true)}
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
            onPenalty={handlePenalty}
            hintUses={performanceStats.hintUses || 0}
          />
        )}

        {currentView === 'sandbox' && <Sandbox />}
      </main>

      <CertificateModal
        open={certificateVisible}
        stats={performanceStats}
        onClose={handleCloseCertificate}
      />
    </>
  );
}
