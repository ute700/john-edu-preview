import { getCourseMapState } from './course-map.js';

const BADGE_DEFINITIONS = Object.freeze([
  { id: 'stage-1-sparrow', stage: 1, name: '참새' },
  { id: 'stage-2-dove', stage: 2, name: '비둘기' },
  { id: 'stage-3-falcon', stage: 3, name: '매' },
  { id: 'stage-4-eagle', stage: 4, name: '독수리' },
  { id: 'stage-5-phoenix', stage: 5, name: '불사조' }
].map(Object.freeze));

/** Achievements are derived from validated sequential progress; never separately persisted. */
export function getBadges(progressState) {
  const course = getCourseMapState(progressState);
  return BADGE_DEFINITIONS.map(definition => {
    const stage = course.stages.find(item => item.stage === definition.stage);
    const units = course.units.filter(unit => unit.stage === definition.stage);
    const completedLessons = units.reduce((sum, unit) => sum + unit.completedLessonCount, 0);
    const totalLessons = units.reduce((sum, unit) => sum + unit.lessonCount, 0);
    return { ...definition, bird: definition.id.split('-').at(-1), title: `${definition.name} 배지`, stageTitle: stage.title,
      earned: stage.completed, completedLessons, totalLessons,
      completedUnits: units.filter(unit => unit.status === 'completed').length, totalUnits: units.length,
      condition: `${stage.title}의 모든 ${totalLessons}강 완료`,
      progressPercent: Math.round(completedLessons / totalLessons * 100), percent: Math.round(completedLessons / totalLessons * 100) };
  });
}

export function getBadgeSummary(progressState) {
  const badges = getBadges(progressState);
  return { badges, latestEarned: badges.filter(badge => badge.earned).at(-1) || null, nextBadge: badges.find(badge => !badge.earned) || null };
}
