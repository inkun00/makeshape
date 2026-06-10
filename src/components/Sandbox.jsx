import { useState } from 'react';
import GridCanvas from './GridCanvas';
import { getActionKorean, transformVertices } from '../utils/geometry';

const PRESETS = [
  { name: '삼각형', vertices: [[2, 1], [5, 1], [3, 5], [2, 1]] },
  { name: '화살표', vertices: [[1, 3], [3, 5], [5, 3], [4, 3], [4, 1], [2, 1], [2, 3], [1, 3]] },
  { name: '집 모양', vertices: [[1, 1], [5, 1], [5, 3], [3, 5], [1, 3], [1, 1]] },
  { name: '블록 F', vertices: [[2, 1], [4, 1], [4, 2], [3, 2], [3, 3], [5, 3], [5, 4], [3, 4], [3, 5], [5, 5], [5, 6], [2, 6], [2, 1]] }
];

const ANIMATION_MS = 2775;

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
      sourceVertices: [...vertices],
      nextVertices: transformed
    });

    window.setTimeout(() => {
      setAnimation(prev => prev ? { ...prev, state: 'end' } : prev);
    }, 40);

    window.setTimeout(() => {
      updateVertices(transformed);
      setAnimation(null);
    }, ANIMATION_MS);
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
          <div className="tools-grid">
            <button className="btn btn-secondary" onClick={() => handleAction('rotate_cw_90')} disabled={vertices.length === 0 || isBusy}>
              시계 90도
            </button>
            <button className="btn btn-secondary" onClick={() => handleAction('rotate_cw_180')} disabled={vertices.length === 0 || isBusy}>
              180도
            </button>
            <button className="btn btn-secondary" onClick={() => handleAction('rotate_ccw_90')} disabled={vertices.length === 0 || isBusy}>
              반시계 90도
            </button>
            <button className="btn btn-secondary" onClick={() => handleAction('rotate_cw_270')} disabled={vertices.length === 0 || isBusy}>
              시계 270도
            </button>
          </div>
        </div>

        <div className="tools-group">
          <h3>도형 뒤집기</h3>
          <div className="tools-grid">
            <button className="btn btn-secondary" onClick={() => handleAction('flip_right')} disabled={vertices.length === 0 || isBusy}>
              좌우
            </button>
            <button className="btn btn-secondary" onClick={() => handleAction('flip_down')} disabled={vertices.length === 0 || isBusy}>
              상하
            </button>
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
