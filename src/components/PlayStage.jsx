import { useState } from 'react';
import GridCanvas from './GridCanvas';
import { comparePolygons, getActionKorean, transformVertices } from '../utils/geometry';

const isClosedPolygon = (vertices) => (
  vertices.length > 2 &&
  vertices[0][0] === vertices[vertices.length - 1][0] &&
  vertices[0][1] === vertices[vertices.length - 1][1]
);

const closePolygon = (vertices) => (
  isClosedPolygon(vertices) ? [...vertices] : [...vertices, [...vertices[0]]]
);

function CanvasPanel({ title, children, solved = false, active = false }) {
  return (
    <div className="canvas-wrapper">
      <span className="canvas-title">{title}</span>
      <div className={`canvas-box ${solved ? 'solved' : ''} ${active ? 'active' : ''}`}>
        {children}
      </div>
    </div>
  );
}

function OperationArrow({ label, axis = 'horizontal' }) {
  return (
    <div className="step-arrow">
      <span>{label}</span>
      {axis === 'vertical' ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M 12,22 L 8,18 M 12,22 L 16,18" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M 22,12 L 18,8 M 22,12 L 18,16" />
        </svg>
      )}
    </div>
  );
}

const MAX_HINT_USES = 10;
const ROTATION_STEP_MS = 1400;
const FLIP_SIMULATION_MS = 4200;

const getRotationTargetAngle = (action) => {
  if (!action.startsWith('rotate')) return 0;
  if (action.includes('270')) return 270;
  if (action.includes('180')) return 180;
  return 90;
};

export default function PlayStage({
  problem,
  onBack,
  onNext,
  onSolveStatusChange,
  onPenalty,
  hintUses = 0,
  isSolvedPrev
}) {
  const [userVertices, setUserVertices] = useState([]);
  const [intermediateUserVertices, setIntermediateUserVertices] = useState([]);
  const [originalUserVertices, setOriginalUserVertices] = useState([]);
  const [isSolved, setIsSolved] = useState(isSolvedPrev);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatingState, setSimulatingState] = useState('start');
  const [simulatingRotationDegrees, setSimulatingRotationDegrees] = useState(0);
  const [simulatingTransitionMs, setSimulatingTransitionMs] = useState(4050);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const intermediateVertices = problem.intermediateAction
    ? transformVertices(problem.originalVertices, problem.intermediateAction)
    : null;
  const finalVertices = transformVertices(problem.originalVertices, problem.action);
  const correctVertices = finalVertices;
  const remainingHints = Math.max(0, MAX_HINT_USES - hintUses);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    window.setTimeout(() => {
      setToast({ show: false, message: '', type });
    }, 2500);
  };

  const registerWrongAttempt = () => {
    onPenalty?.('wrong');
  };

  const clearIncorrect = () => {
    if (isIncorrect) setIsIncorrect(false);
  };

  const handleVerticesChange = (newVertices) => {
    if (isSolved) return;
    setUserVertices(newVertices);
    clearIncorrect();
  };

  const handleIntermediateChange = (newVertices) => {
    if (isSolved) return;
    setIntermediateUserVertices(newVertices);
    clearIncorrect();
  };

  const handleOriginalChange = (newVertices) => {
    if (isSolved) return;
    setOriginalUserVertices(newVertices);
    clearIncorrect();
  };

  const handleReset = () => {
    setUserVertices([]);
    setIntermediateUserVertices([]);
    setOriginalUserVertices([]);
    setIsSolved(false);
    setIsIncorrect(false);
    setHintActive(false);
    setSimulatingRotationDegrees(0);
    onSolveStatusChange(problem.id, false);
  };

  const handleUndo = () => {
    if (isSolved) return;
    if (problem.layout === 'double_flip_user_intermediate') {
      setIntermediateUserVertices(prev => prev.slice(0, -1));
      return;
    }
    if (problem.layout === 'reverse_double_flip') {
      setOriginalUserVertices(prev => prev.slice(0, -1));
      return;
    }
    setUserVertices(prev => prev.slice(0, -1));
  };

  const getPrimaryDrawCount = () => (
    userVertices.length + intermediateUserVertices.length + originalUserVertices.length
  );

  const checkSingleTarget = () => {
    if (userVertices.length < 3) {
      registerWrongAttempt();
      triggerToast('도형을 그리려면 꼭짓점을 3개 이상 찍어 주세요.', 'error');
      return;
    }

    const userFinal = closePolygon(userVertices);
    const correct = comparePolygons(userFinal, correctVertices);

    if (correct) {
      setIsSolved(true);
      onSolveStatusChange(problem.id, true);
      triggerToast('잘했어요! 정답입니다.', 'success');
    } else {
      registerWrongAttempt();
      setIsIncorrect(true);
      triggerToast('다시 생각해 볼까요? 모양과 위치를 확인해 보세요.', 'error');
      window.setTimeout(() => setIsIncorrect(false), 500);
    }
  };

  const checkDoubleFlipWithUserIntermediate = () => {
    if (intermediateUserVertices.length < 3 || userVertices.length < 3) {
      registerWrongAttempt();
      triggerToast('중간 도형과 최종 도형을 모두 그려 주세요.', 'error');
      return;
    }

    const intermediateCorrect = comparePolygons(closePolygon(intermediateUserVertices), intermediateVertices);
    const finalCorrect = comparePolygons(closePolygon(userVertices), finalVertices);

    if (intermediateCorrect && finalCorrect) {
      setIsSolved(true);
      onSolveStatusChange(problem.id, true);
      triggerToast('잘했어요! 중간 도형과 최종 도형이 모두 맞습니다.', 'success');
    } else {
      registerWrongAttempt();
      setIsIncorrect(true);
      triggerToast('중간 도형과 최종 도형의 모양과 위치를 다시 확인해 보세요.', 'error');
      window.setTimeout(() => setIsIncorrect(false), 500);
    }
  };

  const checkReverseDoubleFlip = () => {
    if (originalUserVertices.length < 3 || intermediateUserVertices.length < 3) {
      registerWrongAttempt();
      triggerToast('처음 도형과 그 전 단계 도형을 모두 그려 주세요.', 'error');
      return;
    }

    const originalCorrect = comparePolygons(closePolygon(originalUserVertices), problem.originalVertices);
    const intermediateCorrect = comparePolygons(closePolygon(intermediateUserVertices), intermediateVertices);

    if (originalCorrect && intermediateCorrect) {
      setIsSolved(true);
      onSolveStatusChange(problem.id, true);
      triggerToast('잘했어요! 처음 도형과 그 전 단계 도형이 모두 맞습니다.', 'success');
    } else {
      registerWrongAttempt();
      setIsIncorrect(true);
      triggerToast('처음 도형과 그 전 단계 도형의 위치를 다시 확인해 보세요.', 'error');
      window.setTimeout(() => setIsIncorrect(false), 500);
    }
  };

  const handleCheckAnswer = () => {
    if (problem.layout === 'double_flip_user_intermediate') {
      checkDoubleFlipWithUserIntermediate();
      return;
    }

    if (problem.layout === 'reverse_double_flip') {
      checkReverseDoubleFlip();
      return;
    }

    setIsSimulating(true);
    setSimulatingState('start');
    setSimulatingRotationDegrees(0);
    setIsIncorrect(false);

    const rotationTargetAngle = getRotationTargetAngle(problem.action);
    const isRotation = rotationTargetAngle > 0;
    const stepCount = Math.max(1, rotationTargetAngle / 90);
    const simulationMs = isRotation ? stepCount * ROTATION_STEP_MS + 120 : FLIP_SIMULATION_MS;

    if (isRotation) {
      setSimulatingTransitionMs(ROTATION_STEP_MS);
      window.setTimeout(() => {
        setSimulatingState('end');
        setSimulatingRotationDegrees(90);
      }, 50);

      for (let step = 2; step <= stepCount; step += 1) {
        window.setTimeout(() => {
          setSimulatingRotationDegrees(step * 90);
        }, ROTATION_STEP_MS * (step - 1) + 50);
      }
    } else {
      setSimulatingTransitionMs(FLIP_SIMULATION_MS);
      window.setTimeout(() => {
        setSimulatingState('end');
      }, 50);
    }

    window.setTimeout(() => {
      checkSingleTarget();
      setIsSimulating(false);
      setSimulatingRotationDegrees(0);
    }, simulationMs);
  };

  const handleShowHint = () => {
    if (remainingHints <= 0) {
      triggerToast('힌트는 전체 학습에서 최대 10회까지만 볼 수 있습니다.', 'error');
      return;
    }

    setHintActive(true);
    onPenalty?.('hint');
    triggerToast(`정답의 윤곽선을 초록색 점선으로 표시했습니다. 남은 힌트 ${remainingHints - 1}회`, 'success');
  };

  const renderOperationIndicator = () => {
    const isRotation = problem.action.startsWith('rotate');
    const isClockwise = problem.action.startsWith('rotate_cw');
    const angle = problem.action.includes('180') ? 180 : problem.action.includes('270') ? 270 : 90;

    if (isRotation) {
      const sectorClass = angle === 180
        ? 'compass-sector compass-sector-180'
        : angle === 270
          ? 'compass-sector compass-sector-270'
          : 'compass-sector';

      return (
        <div className="canvas-wrapper operation-wrapper">
          <span className="canvas-title">돌리는 방향</span>
          <div className="transition-indicator">
            <div className="compass-widget">
              <div className={sectorClass} />
              <div
                className="compass-arrow"
                style={{ transform: `rotate(${isClockwise ? angle : -angle}deg)` }}
              />
            </div>
            <span className="operation-label">{isClockwise ? '시계' : '반시계'}</span>
          </div>
        </div>
      );
    }

    const horizontalFlip = problem.action.includes('left') || problem.action.includes('right');

    return (
      <div className="canvas-wrapper operation-wrapper">
        <span className="canvas-title">뒤집기 축</span>
        <div className="transition-indicator">
          {horizontalFlip ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="3 3" />
              <path d="M 6,12 Q 12,6 18,12" />
              <path d="M 18,12 L 15,9 M 18,12 L 15,15" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="3 3" />
              <path d="M 12,6 Q 6,12 12,18" />
              <path d="M 12,18 L 9,15 M 12,18 L 15,15" />
            </svg>
          )}
        </div>
      </div>
    );
  };

  const renderReadOnlyCanvas = (vertices, width, title) => (
    <CanvasPanel title={title}>
      <GridCanvas width={width} vertices={vertices} readOnly={true} isOriginal={true} />
    </CanvasPanel>
  );

  const renderEditableCanvas = ({
    vertices,
    onChange,
    width = 320,
    title = '정답 도형 그리기',
    correct = correctVertices
  }) => (
    <CanvasPanel title={title} solved={isSolved} active={!isSolved}>
      {isSolved && (
        <div className="overlay-message">
          <h3 style={{ color: 'var(--color-correct)' }}>정답입니다!</h3>
          <p>도형의 이동을 잘 맞췄습니다.</p>
        </div>
      )}
      <GridCanvas
        width={width}
        vertices={vertices}
        onChange={onChange}
        readOnly={isSolved || isSimulating}
        hintActive={hintActive}
        correctVertices={correct}
        isSolved={isSolved}
        isIncorrect={isIncorrect}
        isSimulating={isSimulating}
        simulatingVertices={problem.originalVertices}
        simulatingAction={problem.action}
        simulatingState={simulatingState}
        simulatingRotationDegrees={simulatingRotationDegrees}
        simulatingTransitionMs={simulatingTransitionMs}
      />
    </CanvasPanel>
  );

  const renderOriginalCanvas = (width = 320, title = '원본 도형') => (
    renderReadOnlyCanvas(problem.originalVertices, width, title)
  );

  const renderTargetCanvas = (width = 320, title = '정답 도형 그리기') => (
    renderEditableCanvas({
      width,
      title,
      vertices: userVertices,
      onChange: handleVerticesChange,
      correct: correctVertices
    })
  );

  const renderSideBySide = () => {
    const original = renderOriginalCanvas();
    const target = renderTargetCanvas();
    const indicator = renderOperationIndicator();

    return problem.originalGrid === 'right'
      ? [target, indicator, original]
      : [original, indicator, target];
  };

  const renderStacked = () => {
    const original = renderOriginalCanvas();
    const target = renderTargetCanvas();
    const indicator = renderOperationIndicator();

    return problem.originalGrid === 'bottom'
      ? [target, indicator, original]
      : [original, indicator, target];
  };

  const renderCompoundFinalOnly = () => (
    <div className="canvas-area side_by_side">
      <div>{renderOriginalCanvas()}</div>
      <OperationArrow label={getActionKorean(problem.action)} />
      <div>{renderTargetCanvas(320, '최종 도형 그리기')}</div>
    </div>
  );

  const renderDoubleFlipUserIntermediate = () => (
    <div className="canvas-area double_flip">
      {renderOriginalCanvas(280, '1단계: 원본 도형')}
      <OperationArrow label={getActionKorean(problem.intermediateAction)} axis="vertical" />
      {renderEditableCanvas({
        width: 280,
        title: '2단계: 중간 도형 그리기',
        vertices: intermediateUserVertices,
        onChange: handleIntermediateChange,
        correct: intermediateVertices
      })}
      <OperationArrow label={getActionKorean(problem.finalAction)} />
      {renderTargetCanvas(280, '3단계: 최종 도형 그리기')}
    </div>
  );

  const renderReverseDoubleFlip = () => (
    <div className="canvas-area double_flip">
      {renderEditableCanvas({
        width: 280,
        title: '1단계: 처음 도형 그리기',
        vertices: originalUserVertices,
        onChange: handleOriginalChange,
        correct: problem.originalVertices
      })}
      <OperationArrow label={getActionKorean(problem.intermediateAction)} axis="vertical" />
      {renderEditableCanvas({
        width: 280,
        title: '2단계: 그 전 단계 도형 그리기',
        vertices: intermediateUserVertices,
        onChange: handleIntermediateChange,
        correct: intermediateVertices
      })}
      <OperationArrow label={getActionKorean(problem.finalAction)} />
      {renderReadOnlyCanvas(finalVertices, 280, '3단계: 제시된 최종 도형')}
    </div>
  );

  const renderLegacyDoubleFlip = () => (
    <div className="canvas-area double_flip">
      {renderOriginalCanvas(280, '1단계: 원본 도형')}
      <OperationArrow label={getActionKorean(problem.intermediateAction)} axis="vertical" />
      {renderReadOnlyCanvas(intermediateVertices, 280, '2단계: 중간 도형')}
      <OperationArrow label={getActionKorean(problem.finalAction)} />
      {renderTargetCanvas(280, '3단계: 최종 정답 그리기')}
    </div>
  );

  return (
    <div className="play-stage-layout">
      <div className="glass-panel stage-info">
        <h2 className="stage-title">
          <button className="btn btn-secondary" onClick={onBack}>
            목록으로
          </button>
          <span>문제 {problem.id}</span>
        </h2>
        <div className="instruction-text">{getActionKorean(problem.action)}</div>
        <div style={{ width: '80px', textAlign: 'right' }}>
          {isSolved && <span style={{ color: 'var(--color-correct)', fontWeight: 'bold' }}>완료</span>}
        </div>
      </div>

      <div className="glass-panel">
        {problem.layout === 'side_by_side' && (
          <div className="canvas-area side_by_side">
            {renderSideBySide().map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        )}

        {problem.layout === 'stacked' && (
          <div className="canvas-area stacked">
            {renderStacked().map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        )}

        {problem.layout === 'compound_final_only' && renderCompoundFinalOnly()}
        {problem.layout === 'double_flip_user_intermediate' && renderDoubleFlipUserIntermediate()}
        {problem.layout === 'reverse_double_flip' && renderReverseDoubleFlip()}
        {problem.layout === 'double_flip' && renderLegacyDoubleFlip()}
      </div>

      <div className="glass-panel control-bar">
        <div className="left-controls">
          <button className="btn btn-secondary" onClick={handleUndo} disabled={isSolved || getPrimaryDrawCount() === 0}>
            되돌리기
          </button>
          <button className="btn btn-secondary" onClick={handleReset} disabled={isSimulating}>
            초기화
          </button>
          <button className="btn btn-secondary" onClick={handleShowHint} disabled={isSolved || hintActive || remainingHints <= 0}>
            힌트 보기 ({remainingHints}/10)
          </button>
        </div>

        <div className="right-controls">
          {!isSolved ? (
            <>
              <button className="btn btn-secondary" onClick={onNext} disabled={isSimulating}>
                다음 문제
              </button>
              <button className="btn btn-primary" onClick={handleCheckAnswer} disabled={isSimulating}>
                정답 확인
              </button>
            </>
          ) : (
            <button className="btn btn-success" onClick={onNext}>
              다음 문제
            </button>
          )}
        </div>
      </div>

      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
        {toast.message}
      </div>
    </div>
  );
}
