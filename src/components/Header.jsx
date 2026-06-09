export default function Header({ currentView, onViewChange, theme, onToggleTheme }) {
  return (
    <header className="glass-panel app-header">
      <div className="app-logo" onClick={() => onViewChange('selector')}>
        <div className="app-logo-icon" />
        <span>도형 Transformer</span>
      </div>

      <div className="header-actions">
        <button
          className={`btn ${currentView === 'selector' || currentView === 'play' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onViewChange('selector')}
        >
          학습 문제
        </button>

        <button
          className={`btn ${currentView === 'sandbox' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onViewChange('sandbox')}
        >
          자유 실험
        </button>

        <button
          className="btn btn-secondary btn-icon-only"
          onClick={onToggleTheme}
          title={theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}
          aria-label="테마 변경"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  );
}
