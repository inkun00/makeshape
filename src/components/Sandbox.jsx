import { useState } from 'react';
import GridCanvas from './GridCanvas';
import { getActionKorean, transformVertices } from '../utils/geometry';

const PRESETS = [
  { name: '삼각형', vertices: [[2, 1], [5, 1], [3, 5], [2, 1]] },
  { name: '화살표', vertices: [[1, 3], [3, 5], [5, 3], [4, 3], [4, 1], [2, 1], [2, 3], [1, 3]] },
  { name: '집 모양', vertices: [[1, 1], [5, 1], [5, 3], [3, 5], [1, 3], [1, 1]] },
  { name: '블록 F', vertices: [[2, 1], [4, 1], [4, 2], [3, 2], [3, 3], [5, 3], [5, 4], [3, 4], [3, 5], [5, 5], [5, 6], [2, 6], [2, 1]] }
];

const ROTATION_DIRECTIONS = [
  { value: 'cw', label: '시계' },
  { value: 'ccw', label: '반시계' }
];

const ROTATION_ANGLES = [90, 180, 270, 360];

const FLIP_ACTIONS = [
  { action: 'flip_up', label: '위' },
  { action: 'flip_down', label: '아래' },
  { action: 'flip_left', label: '왼쪽' },
  { action: 'flip_right', label: '오른쪽' }
];

const ROTATION_STEP_MS = 1400;
const ROTATION_PAUSE_MS = 500;
const FLIP_ANIMATION_MS = 4165;

const getRotationTargetAngle = (action) => {
  if (!action.startsWith('rotate')) return 0;
  if (action.includes('360')) return 360;
  if (action.includes('270')) return 270;
  if (action.includes('180')) return 180;
  return 90;
};

const isClosedPolygon = (vertices) => (
  vertices.length > 2 &&
  vertices[0][0] === vertices[vertices.length - 1][0] &&
  vertices[0][1] === vertices[vertices.length - 1][1]
);

export default function Sandbox() {
  const [vertices, setVertices] = useState(PRESETS[0].vertices);
  const [history, setHistory] = useState([PRESETS[0].vertices]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [animation, setAnimation] = useState(null);
  const [rotationDirection, setRotationDirection] = useState('cw');
  const [rotationAngle, setRotationAngle] = useState(90);

  const updateVertices = (newVertices) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newVertices);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setVertices(newVertices);
  };

  const handleAction = (actionType) => {
    if (vertices.length === 0 || animation) return;

    const wasClosed = isClosedPolygon(vertices);
    const uniqueVertices = wasClosed ? vertices.slice(0, -1) : [...vertices];
    const transformed = transformVertices(uniqueVertices, actionType);

    if (wasClosed) {
      transformed.push([...transformed[0]]);
    }

    setAnimation({
      action: actionType,
      state: 'start',
      rotationDegrees: 0,
      transitionMs: FLIP_ANIMATION_MS,
      sourceVertices: [...vertices],
      nextVertices: transformed
    });

    const rotationTargetAngle = getRotationTargetAngle(actionType);
    const isRotation = rotationTargetAngle > 0;
    const stepCount = Math.max(1, rotationTargetAngle / 90);
    const rotationStepIntervalMs = ROTATION_STEP_MS + ROTATION_PAUSE_MS;
    const animationMs = isRotation
      ? stepCount * ROTATION_STEP_MS + Math.max(0, stepCount - 1) * ROTATION_PAUSE_MS + 120
      : FLIP_ANIMATION_MS;

    if (isRotation) {
      window.setTimeout(() => {
        setAnimation(prev => prev ? {
          ...prev,
          state: 'end',
          rotationDegrees: 90,
          transitionMs: ROTATION_STEP_MS
        } : prev);
      }, 40);

      for (let step = 2; step <= stepCount; step += 1) {
        window.setTimeout(() => {
          setAnimation(prev => prev ? { ...prev, rotationDegrees: step * 90 } : prev);
        }, rotationStepIntervalMs * (step - 1) + 40);
      }
    } else {
      window.setTimeout(() => {
        setAnimation(prev => prev ? {
          ...prev,
          state: 'end',
          transitionMs: FLIP_ANIMATION_MS
        } : prev);
      }, 40);
    }

    window.setTimeout(() => {
      updateVertices(transformed);
      setAnimation(null);
    }, animationMs);
  };

  const handleRotate = () => {
    handleAction(`rotate_${rotationDirection}_${rotationAngle}`);
  };

  const handlePresetSelect = (presetVertices) => {
    if (animation) return;
    updateVertices(presetVertices);
  };

  const handleUndo = () => {
    if (animation || historyIndex <= 0) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    setVertices(history[idx]);
  };

  const handleRedo = () => {
    if (animation || historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setVertices(history[idx]);
  };

  const handleClear = () => {
    if (animation) return;
    updateVertices([]);
  };

  const isShapeClosed = isClosedPolygon(vertices);
  const isBusy = Boolean(animation);

  return (
    <div className="sandbox-layout">
      <div className="glass-panel sandbox-tools">
        <h2>실험 도구</h2>

        <div className="tools-group">
          <h3>도형 템플릿</h3>
          <div className="tools-grid">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                className="btn btn-secondary"
                onClick={() => handlePresetSelect(preset.vertices)}
                disabled={isBusy}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="tools-group">
          <h3>도형 돌리기</h3>
          <div className="tool-choice-row">
            {ROTATION_DIRECTIONS.map((direction) => (
              <button
                key={direction.value}
                className={`btn ${rotationDirection === direction.value ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRotationDirection(direction.value)}
                disabled={isBusy}
              >
                {direction.label}
              </button>
            ))}
          </div>
          <div className="tools-grid">
            {ROTATION_ANGLES.map((angle) => (
              <button
                key={angle}
                className={`btn ${rotationAngle === angle ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRotationAngle(angle)}
                disabled={isBusy}
              >
                {angle}도
              </button>
            ))}
          </div>
          <button className="btn btn-success tool-action-button" onClick={handleRotate} disabled={vertices.length === 0 || isBusy}>
            선택한 방향으로 돌리기
          </button>
        </div>

        <div className="tools-group">
          <h3>도형 뒤집기</h3>
          <div className="tools-grid">
            {FLIP_ACTIONS.map((flip) => (
              <button
                key={flip.action}
                className="btn btn-secondary"
                onClick={() => handleAction(flip.action)}
                disabled={vertices.length === 0 || isBusy}
              >
                {flip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tools-group tools-footer">
          <h3>캔버스 편집</h3>
          <div className="tools-grid">
            <button className="btn btn-secondary" onClick={handleUndo} disabled={historyIndex === 0 || isBusy}>
              되돌리기
            </button>
            <button className="btn btn-secondary" onClick={handleRedo} disabled={historyIndex === history.length - 1 || isBusy}>
              다시 실행
            </button>
          </div>
          <button className="btn btn-danger" onClick={handleClear} disabled={isBusy}>
            모두 지우기
          </button>
        </div>
      </div>

      <div className="glass-panel sandbox-canvas-panel">
        <div className="canvas-wrapper">
          <span className="canvas-title">
            {animation
              ? `${getActionKorean(animation.action)} 중`
              : vertices.length === 0
                ? '격자를 눌러 자유롭게 도형을 그려 보세요'
                : isShapeClosed
                  ? '도형이 닫혔습니다. 돌리기와 뒤집기를 실험해 보세요'
                  : '마지막에 첫 꼭짓점을 다시 누르면 도형이 완성됩니다'}
          </span>
          <div className="canvas-box sandbox-canvas-box active">
            <GridCanvas
              width={450}
              vertices={vertices}
              onChange={updateVertices}
              readOnly={isBusy}
              isSimulating={isBusy}
              simulatingVertices={animation?.sourceVertices}
              simulatingAction={animation?.action}
              simulatingState={animation?.state}
              simulatingRotationDegrees={animation?.rotationDegrees}
              simulatingTransitionMs={animation?.transitionMs}
            />
          </div>
        </div>

        <p className="draw-helper">
          격자 교차점을 눌러 꼭짓점을 만들고, 첫 꼭짓점을 다시 눌러 도형을 닫으세요.
        </p>
      </div>
    </div>
  );
}
