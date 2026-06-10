export const certificateLevels = [
  {
    level: 1,
    title: '입문',
    subtitle: '도형 첫걸음 학습자',
    formula: 'A',
    colors: ['#f97316', '#fed7aa'],
    accessory: 'pencil'
  },
  {
    level: 2,
    title: '초급',
    subtitle: '좌표 새싹 탐험가',
    formula: 'x,y',
    colors: ['#ec4899', '#fbcfe8'],
    accessory: 'dots'
  },
  {
    level: 3,
    title: '기본',
    subtitle: '선분 길찾기 해결사',
    formula: 'AB',
    colors: ['#06b6d4', '#cffafe'],
    accessory: 'ruler'
  },
  {
    level: 4,
    title: '성장',
    subtitle: '각도 관찰 연구원',
    formula: '90°',
    colors: ['#8b5cf6', '#ddd6fe'],
    accessory: 'angle'
  },
  {
    level: 5,
    title: '중급',
    subtitle: '격자 좌표 전략가',
    formula: '(3,5)',
    colors: ['#10b981', '#bbf7d0'],
    accessory: 'grid'
  },
  {
    level: 6,
    title: '숙련',
    subtitle: '대칭 분석 전문가',
    formula: '↔',
    colors: ['#0ea5e9', '#bae6fd'],
    accessory: 'mirror'
  },
  {
    level: 7,
    title: '고급',
    subtitle: '회전 설계 전문가',
    formula: '270°',
    colors: ['#f59e0b', '#fde68a'],
    accessory: 'compass'
  },
  {
    level: 8,
    title: '전문가',
    subtitle: '도형 변환 연구가',
    formula: 'T(x)',
    colors: ['#14b8a6', '#ccfbf1'],
    accessory: 'matrix'
  },
  {
    level: 9,
    title: '달인',
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
