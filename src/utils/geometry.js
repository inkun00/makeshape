/**
 * Geometry utility functions for 6x6 grid transformations.
 * Grid coordinates range from 0 to 6. The transformation center is (3, 3).
 */

const GRID_SIZE = 6;

const ACTION_LABELS = {
  rotate_cw_90: '시계 방향으로 90도 돌리기',
  rotate_cw_180: '시계 방향으로 180도 돌리기',
  rotate_cw_270: '시계 방향으로 270도 돌리기',
  rotate_ccw_90: '시계 반대 방향으로 90도 돌리기',
  rotate_ccw_180: '시계 반대 방향으로 180도 돌리기',
  rotate_ccw_270: '시계 반대 방향으로 270도 돌리기',
  flip_left: '왼쪽으로 뒤집기',
  flip_right: '오른쪽으로 뒤집기',
  flip_up: '위쪽으로 뒤집기',
  flip_down: '아래쪽으로 뒤집기',
  flip_down_then_right: '아래쪽으로 뒤집고 오른쪽으로 뒤집기',
  flip_up_then_left: '위쪽으로 뒤집고 왼쪽으로 뒤집기'
};

const COMPOUND_ACTION_STEPS = {
  flip_down_then_right: ['flip_down', 'flip_right'],
  flip_up_then_left: ['flip_up', 'flip_left']
};

export function transformPoint([x, y], action) {
  switch (action) {
    case 'rotate_cw_90':
    case 'rotate_ccw_270':
      return [y, GRID_SIZE - x];
    case 'rotate_cw_180':
    case 'rotate_ccw_180':
      return [GRID_SIZE - x, GRID_SIZE - y];
    case 'rotate_cw_270':
    case 'rotate_ccw_90':
      return [GRID_SIZE - y, x];
    case 'flip_left':
    case 'flip_right':
      return [GRID_SIZE - x, y];
    case 'flip_up':
    case 'flip_down':
      return [x, GRID_SIZE - y];
    default:
      return [x, y];
  }
}

export function transformVertices(vertices, action) {
  const steps = COMPOUND_ACTION_STEPS[action];

  if (steps) {
    return steps.reduce(
      (currentVertices, step) => currentVertices.map(pt => transformPoint(pt, step)),
      vertices.map(pt => [...pt])
    );
  }

  return vertices.map(pt => transformPoint(pt, action));
}

function normalizePolygon(poly) {
  if (!poly || poly.length === 0) return [];

  const normalized = poly.map(([x, y]) => [x, y]);
  const first = normalized[0];
  const last = normalized[normalized.length - 1];

  if (normalized.length > 1 && first[0] === last[0] && first[1] === last[1]) {
    normalized.pop();
  }

  return normalized;
}

export function comparePolygons(polyA, polyB) {
  const normalizedA = normalizePolygon(polyA);
  const normalizedB = normalizePolygon(polyB);

  if (normalizedA.length !== normalizedB.length) return false;
  if (normalizedA.length === 0) return true;

  const len = normalizedA.length;
  const ptsEqual = (p1, p2) => p1[0] === p2[0] && p1[1] === p2[1];

  for (let startIdx = 0; startIdx < len; startIdx++) {
    if (!ptsEqual(normalizedA[0], normalizedB[startIdx])) continue;

    let forwardMatch = true;
    for (let i = 0; i < len; i++) {
      if (!ptsEqual(normalizedA[i], normalizedB[(startIdx + i) % len])) {
        forwardMatch = false;
        break;
      }
    }
    if (forwardMatch) return true;

    let backwardMatch = true;
    for (let i = 0; i < len; i++) {
      const bIdx = (startIdx - i + len) % len;
      if (!ptsEqual(normalizedA[i], normalizedB[bIdx])) {
        backwardMatch = false;
        break;
      }
    }
    if (backwardMatch) return true;
  }

  return false;
}

export function verticesToSvgPath(vertices, cellSize, isClosed = true) {
  if (!vertices || vertices.length === 0) return '';

  const points = vertices.map(([x, y]) => {
    const svgX = x * cellSize;
    const svgY = (GRID_SIZE - y) * cellSize;
    return `${svgX},${svgY}`;
  });

  return `M ${points.join(' L ')} ${isClosed ? 'Z' : ''}`;
}

export function getActionKorean(action) {
  return ACTION_LABELS[action] ?? '알 수 없는 변환';
}
