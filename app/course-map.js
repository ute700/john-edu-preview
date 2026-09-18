// Full manuscript structure. Map previews never change learning progress.
export const COURSE_STAGES = Object.freeze([
  { stage: 1, title: '베이스캠프', stageTitle: '베이스캠프 — 돈과 생활의 기초', unitCount: 5 },
  { stage: 2, title: '숲길', stageTitle: '숲길 — 금융생활과 자산 보호', unitCount: 4 },
  { stage: 3, title: '능선', stageTitle: '능선 — 경제와 투자상품', unitCount: 4 },
  { stage: 4, title: '고지대', stageTitle: '고지대 — 기업분석과 가치투자', unitCount: 4 },
  { stage: 5, title: '정상과 그 이후', stageTitle: '정상과 그 이후 — 평생 자산관리', unitCount: 4 }
].map(Object.freeze));

const manuscriptUnits = [
  [['금융교육의 필요성',5],['돈의 탄생과 구매력',8],['돈의 시간가치와 복리',6],['소득·소비·저축',5],['재무상태와 인생계획',6]],
  [['은행·결제·저축상품',7],['신용·대출·부채',8],['보험과 위험관리',8],['금융사기와 소비자보호',7]],
  [['경제와 금융시장',8],['주식과 기업',8],['채권·펀드·ETF',9],['부동산과 기타자산',9]],
  [['가치투자와 투자심리',8],['기업과 사업모델',8],['재무제표 분석',12],['기업가치와 투자 판단',9]],
  [['포트폴리오와 투자 실행',9],['세금과 절세계좌',9],['연금·은퇴·생애 재무',8],['금융정보와 나의 원칙',8]]
];
let globalIndex = 0;
let lessonIndex = 0;
export const COURSE_UNITS = Object.freeze(manuscriptUnits.flatMap((units,stageIndex) => units.map(([title,lessonCount],index) => Object.freeze({
  id: `stage-${stageIndex+1}-unit-${index+1}`, title,
  stage: stageIndex+1, stageTitle: COURSE_STAGES[stageIndex].stageTitle,
  unitIndex: index+1, globalIndex: ++globalIndex, lessonCount,
  isSummit: stageIndex === 4 && index === 3,
  available: true,
  lessonIds: Object.freeze(Array.from({length:lessonCount},()=>`lesson-${++lessonIndex}`))
}))));

const firstLessonIds = ['lesson-1','lesson-2','lesson-3','lesson-4','lesson-5'];
const publishedLessonIds = COURSE_UNITS.filter(unit => unit.available).flatMap(unit => unit.lessonIds);
export function getCourseMapState(progressState) {
  const supplied = progressState?.completedLessonIds;
  const validIds = Array.isArray(supplied) && supplied.length <= publishedLessonIds.length && supplied.every(id => typeof id === 'string' && publishedLessonIds.includes(id)) && new Set(supplied).size === supplied.length;
  const completedLessons = [];
  if (validIds) for (const id of publishedLessonIds) { if (!supplied.includes(id)) break; completedLessons.push(id); }
  const firstUnitCompleted = progressState?.representativeUnitCompleted === true && firstLessonIds.every(id => completedLessons.includes(id));
  const secondUnitCompleted = firstUnitCompleted && COURSE_UNITS[1].lessonIds.every(id => completedLessons.includes(id));
  const units = COURSE_UNITS.map((unit,index) => {
    const completed = firstUnitCompleted && unit.lessonIds.every(id => completedLessons.includes(id));
    const unlocked = index === 0 || (firstUnitCompleted && COURSE_UNITS[index-1].lessonIds.every(id => completedLessons.includes(id)));
    return {...unit,completedLessonCount:unit.lessonIds.filter(id=>completedLessons.includes(id)).length,status:completed?'completed':unlocked?'available':'locked'};
  });
  const stages = COURSE_STAGES.map(stage=>({...stage,completed:units.filter(unit=>unit.stage===stage.stage).every(unit=>unit.status==='completed')}));
  const fullCompletion = units.every(unit=>unit.status==='completed') && completedLessons.length === 165;
  return {
    units,
    stages,
    completedUnitCount: units.filter(unit=>unit.status==='completed').length,
    totalUnits: COURSE_UNITS.length,
    totalLessons: COURSE_UNITS.reduce((sum,unit)=>sum+unit.lessonCount,0),
    firstUnitCompleted,
    secondUnitCompleted,
    firstUnitCompletedLessonCount: firstLessonIds.filter(id => completedLessons.includes(id)).length,
    stage1Completed: stages[0].completed,
    summitReached: fullCompletion,
    overallCourseCompleted: fullCompletion,
    currentUnitId: (units.find(unit=>unit.status==='available') || units[20]).id,
    summitUnitId: COURSE_UNITS[20].id
  };
}
