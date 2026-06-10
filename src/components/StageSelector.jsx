import { problems } from '../data/problems';

const CATEGORIES = [
  { key: 'rotation_1', name: '도형 돌리기 1', description: '기본 도형을 시계/반시계 방향으로 돌리기' },
  { key: 'rotation_2', name: '도형 돌리기 2', description: '복잡한 도형을 여러 각도로 돌리기' },
  { key: 'flip_1', name: '도형 뒤집기 1', description: '기본 좌우/상하 뒤집기와 연속 뒤집기' },
  { key: 'flip_2', name: '도형 뒤집기 2', description: '복잡한 도형의 좌우/상하 뒤집기' }
];

export default function StageSelector({
  solvedStages = {},
  allStagesCleared = false,
  onOpenCertificate,
  onSelectProblem
}) {
  const getProgress = (categoryKey) => {
    const categoryProblems = problems.filter(p => p.category === categoryKey);
    const total = categoryProblems.length;
    const solved = categoryProblems.filter(p => solvedStages[`${categoryKey}_${p.id}`] === true).length;

    return {
      solved,
      total,
      percentage: total > 0 ? Math.round((solved / total) * 100) : 0
    };
  };

  return (
      <div className="stage-selector-container">
      <div className="glass-panel intro-panel">
        <div>
          <h1>초등 평면도형 이동 학습</h1>
          <p>
            도형을 돌리고 뒤집으며 공간 지각 능력을 익혀 보세요. 문제를 선택해 정답 도형을 직접 그릴 수 있습니다.
          </p>
        </div>
        {allStagesCleared && (
          <button className="btn btn-primary" onClick={onOpenCertificate}>
            인증서 보기
          </button>
        )}
      </div>

      {CATEGORIES.map((cat) => {
        const { solved, total, percentage } = getProgress(cat.key);
        const catProblems = problems.filter(p => p.category === cat.key);

        return (
          <section key={cat.key} className="category-section">
            <div className="category-header">
              <div>
                <h2 className="category-title">{cat.name}</h2>
                <span className="category-description">{cat.description}</span>
              </div>

              <div className="progress-summary">
                <span>{solved} / {total} 완료 ({percentage}%)</span>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            </div>

            <div className="stage-grid">
              {catProblems.map((prob) => {
                const compositeKey = `${cat.key}_${prob.id}`;
                const isSolved = solvedStages[compositeKey] === true;

                return (
                  <button
                    key={compositeKey}
                    className={`glass-panel stage-card ${isSolved ? 'solved' : 'solving'}`}
                    onClick={() => onSelectProblem(prob)}
                  >
                    <span className="stage-card-label">문제</span>
                    <span className="stage-card-number">{prob.id}</span>
                    {isSolved && <span className="badge">완료</span>}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
