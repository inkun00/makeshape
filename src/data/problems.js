const rotation1 = [
  {
    id: 1,
    category: 'rotation_1',
    title: '시계 방향으로 90도 돌리기',
    action: 'rotate_cw_90',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 5], [5, 1], [3, 1]]
  },
  {
    id: 2,
    category: 'rotation_1',
    title: '시계 방향으로 90도 돌리기',
    action: 'rotate_cw_90',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 3], [5, 5], [3, 1]]
  },
  {
    id: 3,
    category: 'rotation_1',
    title: '시계 방향으로 180도 돌리기',
    action: 'rotate_cw_180',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 5], [3, 1], [1, 3]]
  },
  {
    id: 4,
    category: 'rotation_1',
    title: '시계 방향으로 180도 돌리기',
    action: 'rotate_cw_180',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 5], [5, 2], [3, 1], [1, 3]]
  },
  {
    id: 5,
    category: 'rotation_1',
    title: '시계 방향으로 270도 돌리기',
    action: 'rotate_cw_270',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 5], [5, 1], [2, 1]]
  },
  {
    id: 6,
    category: 'rotation_1',
    title: '시계 방향으로 270도 돌리기',
    action: 'rotate_cw_270',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 3], [5, 5], [5, 2], [4, 1], [1, 1]]
  },
  {
    id: 7,
    category: 'rotation_1',
    title: '시계 반대 방향으로 90도 돌리기',
    action: 'rotate_ccw_90',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 3], [5, 1], [2, 1]]
  },
  {
    id: 8,
    category: 'rotation_1',
    title: '시계 반대 방향으로 90도 돌리기',
    action: 'rotate_ccw_90',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 5], [5, 1]]
  },
  {
    id: 9,
    category: 'rotation_1',
    title: '시계 반대 방향으로 180도 돌리기',
    action: 'rotate_ccw_180',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 3], [1, 1]]
  },
  {
    id: 10,
    category: 'rotation_1',
    title: '시계 반대 방향으로 180도 돌리기',
    action: 'rotate_ccw_180',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [4, 5], [5, 1], [1, 1]]
  },
  {
    id: 11,
    category: 'rotation_1',
    title: '시계 반대 방향으로 270도 돌리기',
    action: 'rotate_ccw_270',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 1], [2, 3], [5, 5], [5, 1]]
  },
  {
    id: 12,
    category: 'rotation_1',
    title: '시계 반대 방향으로 270도 돌리기',
    action: 'rotate_ccw_270',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[2, 5], [5, 5], [4, 1], [1, 1]]
  }
];

const rotation2 = [
  {
    id: 1,
    category: 'rotation_2',
    title: '시계 방향으로 90도 돌리기',
    action: 'rotate_cw_90',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 3], [5, 1], [3, 1], [3, 3]]
  },
  {
    id: 2,
    category: 'rotation_2',
    title: '시계 방향으로 90도 돌리기',
    action: 'rotate_cw_90',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 1], [5, 1], [5, 5], [3, 3], [1, 5]]
  },
  {
    id: 3,
    category: 'rotation_2',
    title: '시계 방향으로 180도 돌리기',
    action: 'rotate_cw_180',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 1], [1, 5], [5, 5], [2, 4], [5, 3], [5, 1]]
  },
  {
    id: 4,
    category: 'rotation_2',
    title: '시계 방향으로 180도 돌리기',
    action: 'rotate_cw_180',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [3, 5], [3, 3], [5, 3], [5, 1], [2, 1], [1, 2]]
  },
  {
    id: 5,
    category: 'rotation_2',
    title: '시계 방향으로 270도 돌리기',
    action: 'rotate_cw_270',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 4], [2, 5], [5, 5], [3, 1], [1, 1]]
  },
  {
    id: 6,
    category: 'rotation_2',
    title: '시계 방향으로 270도 돌리기',
    action: 'rotate_cw_270',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [2, 4], [5, 4], [5, 1], [1, 1]]
  },
  {
    id: 7,
    category: 'rotation_2',
    title: '시계 반대 방향으로 90도 돌리기',
    action: 'rotate_ccw_90',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 5], [5, 4], [2, 4], [2, 3], [5, 3], [5, 1], [1, 1]]
  },
  {
    id: 8,
    category: 'rotation_2',
    title: '시계 반대 방향으로 90도 돌리기',
    action: 'rotate_ccw_90',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [3, 5], [3, 3], [5, 3], [5, 1], [4, 1], [4, 2], [1, 2]]
  },
  {
    id: 9,
    category: 'rotation_2',
    title: '시계 반대 방향으로 180도 돌리기',
    action: 'rotate_ccw_180',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 1], [5, 3], [5, 4], [3, 5], [1, 5]]
  },
  {
    id: 10,
    category: 'rotation_2',
    title: '시계 반대 방향으로 180도 돌리기',
    action: 'rotate_ccw_180',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [4, 3], [4, 1], [5, 1], [5, 5]]
  },
  {
    id: 11,
    category: 'rotation_2',
    title: '시계 반대 방향으로 270도 돌리기',
    action: 'rotate_ccw_270',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [3, 2], [3, 5], [5, 1], [2, 1]]
  },
  {
    id: 12,
    category: 'rotation_2',
    title: '시계 반대 방향으로 270도 돌리기',
    action: 'rotate_ccw_270',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [4, 4], [5, 1], [1, 1], [2, 2]]
  }
];

const flip1 = [
  {
    id: 1,
    category: 'flip_1',
    title: '오른쪽으로 뒤집기',
    action: 'flip_right',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [5, 5], [5, 1], [3, 1]]
  },
  {
    id: 2,
    category: 'flip_1',
    title: '오른쪽으로 뒤집기',
    action: 'flip_right',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [3, 5], [5, 1], [1, 3]]
  },
  {
    id: 3,
    category: 'flip_1',
    title: '왼쪽으로 뒤집기',
    action: 'flip_left',
    layout: 'side_by_side',
    originalGrid: 'right',
    targetGrid: 'left',
    originalVertices: [[1, 5], [3, 5], [5, 3], [2, 2]]
  },
  {
    id: 4,
    category: 'flip_1',
    title: '왼쪽으로 뒤집기',
    action: 'flip_left',
    layout: 'side_by_side',
    originalGrid: 'right',
    targetGrid: 'left',
    originalVertices: [[1, 5], [3, 5], [5, 3], [5, 1], [2, 1]]
  },
  {
    id: 5,
    category: 'flip_1',
    title: '아래쪽으로 뒤집기',
    action: 'flip_down',
    layout: 'stacked',
    originalGrid: 'top',
    targetGrid: 'bottom',
    originalVertices: [[1, 5], [3, 3], [5, 3], [5, 1], [1, 1]]
  },
  {
    id: 6,
    category: 'flip_1',
    title: '아래쪽으로 뒤집기',
    action: 'flip_down',
    layout: 'stacked',
    originalGrid: 'top',
    targetGrid: 'bottom',
    originalVertices: [[2, 5], [5, 5], [3, 1]]
  },
  {
    id: 7,
    category: 'flip_1',
    title: '위쪽으로 뒤집기',
    action: 'flip_up',
    layout: 'stacked',
    originalGrid: 'bottom',
    targetGrid: 'top',
    originalVertices: [[1, 5], [5, 5], [3, 1], [1, 1]]
  },
  {
    id: 8,
    category: 'flip_1',
    title: '위쪽으로 뒤집기',
    action: 'flip_up',
    layout: 'stacked',
    originalGrid: 'bottom',
    targetGrid: 'top',
    originalVertices: [[2, 5], [5, 3], [5, 1], [1, 1], [1, 3]]
  },
  {
    id: 9,
    category: 'flip_1',
    title: '아래쪽으로 뒤집고 오른쪽으로 뒤집기',
    action: 'flip_down_then_right',
    layout: 'double_flip_user_intermediate',
    originalGrid: 'top_left',
    intermediateGrid: 'bottom_left',
    targetGrid: 'bottom_right',
    intermediateAction: 'flip_down',
    finalAction: 'flip_right',
    originalVertices: [[1, 1], [5, 1], [4, 5]]
  },
  {
    id: 10,
    category: 'flip_1',
    title: '위쪽으로 뒤집고 왼쪽으로 뒤집기',
    action: 'flip_up_then_left',
    layout: 'double_flip_user_intermediate',
    originalGrid: 'bottom_right',
    intermediateGrid: 'top_right',
    targetGrid: 'top_left',
    intermediateAction: 'flip_up',
    finalAction: 'flip_left',
    originalVertices: [[1, 5], [5, 5], [5, 1], [2, 2]]
  }
];

const flip2 = [
  {
    id: 1,
    category: 'flip_2',
    title: '오른쪽으로 뒤집기',
    action: 'flip_right',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [4, 5], [5, 1], [3, 1]]
  },
  {
    id: 2,
    category: 'flip_2',
    title: '오른쪽으로 뒤집기',
    action: 'flip_right',
    layout: 'side_by_side',
    originalGrid: 'left',
    targetGrid: 'right',
    originalVertices: [[1, 5], [3, 4], [5, 4], [5, 1], [1, 3]]
  },
  {
    id: 3,
    category: 'flip_2',
    title: '왼쪽으로 뒤집기',
    action: 'flip_left',
    layout: 'side_by_side',
    originalGrid: 'right',
    targetGrid: 'left',
    originalVertices: [[3, 5], [5, 3], [4, 1], [2, 1], [1, 4]]
  },
  {
    id: 4,
    category: 'flip_2',
    title: '왼쪽으로 뒤집기',
    action: 'flip_left',
    layout: 'side_by_side',
    originalGrid: 'right',
    targetGrid: 'left',
    originalVertices: [[1, 5], [3, 3], [3, 5], [5, 3], [5, 1], [2, 1]]
  },
  {
    id: 5,
    category: 'flip_2',
    title: '아래쪽으로 뒤집기',
    action: 'flip_down',
    layout: 'stacked',
    originalGrid: 'top',
    targetGrid: 'bottom',
    originalVertices: [[2, 5], [3, 3], [5, 3], [5, 1], [2, 1]]
  },
  {
    id: 6,
    category: 'flip_2',
    title: '아래쪽으로 뒤집기',
    action: 'flip_down',
    layout: 'stacked',
    originalGrid: 'top',
    targetGrid: 'bottom',
    originalVertices: [[1, 1], [2, 5], [5, 5], [3, 3], [5, 1]]
  },
  {
    id: 7,
    category: 'flip_2',
    title: '위쪽으로 뒤집기',
    action: 'flip_up',
    layout: 'stacked',
    originalGrid: 'bottom',
    targetGrid: 'top',
    originalVertices: [[1, 1], [2, 5], [3, 3], [5, 5], [3, 1]]
  },
  {
    id: 8,
    category: 'flip_2',
    title: '위쪽으로 뒤집기',
    action: 'flip_up',
    layout: 'stacked',
    originalGrid: 'bottom',
    targetGrid: 'top',
    originalVertices: [[1, 1], [1, 5], [3, 5], [5, 4], [3, 1]]
  },
  {
    id: 9,
    category: 'flip_2',
    title: '아래쪽으로 뒤집고 오른쪽으로 뒤집기',
    action: 'flip_down_then_right',
    layout: 'double_flip_user_intermediate',
    originalGrid: 'top_left',
    intermediateGrid: 'bottom_left',
    targetGrid: 'bottom_right',
    intermediateAction: 'flip_down',
    finalAction: 'flip_right',
    originalVertices: [[2, 5], [5, 5], [5, 2], [3, 2], [3, 1], [1, 1]]
  },
  {
    id: 10,
    category: 'flip_2',
    title: '위쪽으로 뒤집고 왼쪽으로 뒤집기',
    action: 'flip_up_then_left',
    layout: 'double_flip_user_intermediate',
    originalGrid: 'bottom_right',
    intermediateGrid: 'top_right',
    targetGrid: 'top_left',
    intermediateAction: 'flip_up',
    finalAction: 'flip_left',
    originalVertices: [[1, 5], [5, 5], [4, 2], [3, 2], [2, 1], [1, 1]]
  }
];

export const problems = [
  ...rotation1,
  ...rotation2,
  ...flip1,
  ...flip2
];
