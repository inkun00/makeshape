export const certificateLevels = [
  {
    level: 1,
    title: '기초',
    subtitle: '도형 씨앗 수학자',
    formula: 'A',
    colors: ['#f97316', '#fed7aa'],
    accessory: 'pencil'
  },
  {
    level: 2,
    title: '점잇기',
    subtitle: '좌표 점잇기 탐험가',
    formula: 'x,y',
    colors: ['#ec4899', '#fbcfe8'],
    accessory: 'dots'
  },
  {
    level: 3,
    title: '선분',
    subtitle: '선분 길찾기 연구원',
    formula: 'AB',
    colors: ['#06b6d4', '#cffafe'],
    accessory: 'ruler'
  },
  {
    level: 4,
    title: '각도',
    subtitle: '직각 관찰 마법사',
    formula: '90°',
    colors: ['#8b5cf6', '#ddd6fe'],
    accessory: 'angle'
  },
  {
    level: 5,
    title: '좌표',
    subtitle: '격자 좌표 해결사',
    formula: '(3,5)',
    colors: ['#10b981', '#bbf7d0'],
    accessory: 'grid'
  },
  {
    level: 6,
    title: '대칭',
    subtitle: '거울 대칭 분석가',
    formula: '↔',
    colors: ['#0ea5e9', '#bae6fd'],
    accessory: 'mirror'
  },
  {
    level: 7,
    title: '회전',
    subtitle: '나침반 회전 전략가',
    formula: '270°',
    colors: ['#f59e0b', '#fde68a'],
    accessory: 'compass'
  },
  {
    level: 8,
    title: '변환',
    subtitle: '도형 변환 설계자',
    formula: 'T(x)',
    colors: ['#14b8a6', '#ccfbf1'],
    accessory: 'matrix'
  },
  {
    level: 9,
    title: '공간',
    subtitle: '공간 감각 수학자',
    formula: 'xyz',
    colors: ['#6366f1', '#c7d2fe'],
    accessory: 'cube'
  },
  {
    level: 10,
    title: '마스터',
    subtitle: '도형 이동 마스터',
    formula: 'Σ★',
    colors: ['#7c3aed', '#fef3c7'],
    accessory: 'crown'
  }
];

export function getCertificateLevel(totalPenalty) {
  const safePenalty = Number.isFinite(totalPenalty) ? Math.max(0, totalPenalty) : 0;
  const level = Math.max(1, 10 - Math.floor(Math.max(0, safePenalty - 1) / 10));
  return certificateLevels.find(item => item.level === level) || certificateLevels[0];
}
