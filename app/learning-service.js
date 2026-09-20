import { createProgressStore, STORAGE_KEY } from './progress.js';
import { createStorageAdapter } from './storage.js';
import { getCourseMapState } from './course-map.js';
import { getBadges as deriveBadges, getBadgeSummary as deriveBadgeSummary } from './badges.js';

export const LOCATION_KEY = 'john-edu:learning-location:v1';

/** UI-facing learning operations; no DOM or network dependencies. */
export function createLearningService({ lessons, storage, now = () => new Date().toISOString() }) {
  const adapter = createStorageAdapter(storage);
  const progress = createProgressStore({ lessons, adapter, now });
  const known = new Map(lessons.map(lesson => [lesson.id, lesson]));
  const validLocation = value => value && known.has(value.lessonId) && ['lesson', 'quiz'].includes(value.view) && Number.isInteger(value.page) && value.page >= 0;
  let location = adapter.read(LOCATION_KEY, value => value === null ? true : value?.version !== 1 ? 'unsupported' : validLocation(value) ? true : 'corrupt');
  const getCourseState = () => getCourseMapState(progress.getState());
  const getBadges = () => deriveBadges(progress.getState());
  const getBadgeSummary = () => deriveBadgeSummary(progress.getState());
  function getUnitContext(unitId) {
    const state = progress.getState(), course = getCourseMapState(state);
    const unit = course.units.find(item => item.id === unitId) || course.units[0];
    const entries = lessons.map((lesson, index) => ({ lesson, index })).filter(({ lesson }) => unit.lessonIds.includes(lesson.id));
    const done = entries.filter(({ lesson }) => state.completedLessonIds.includes(lesson.id)).length;
    return { unit, entries, done, total: entries.length, complete: entries.length > 0 && done === entries.length, course, state };
  }
  function getResumeLocation() {
    if (validLocation(location) && progress.getLessonStatus(location.lessonId) !== 'locked') return { lessonId: location.lessonId, view: location.view, page: location.page };
    const lesson = lessons.find(item => progress.getLessonStatus(item.id) === 'available') || lessons.at(-1);
    return { lessonId: lesson.id, view: 'lesson', page: 0 };
  }
  function saveLocation(value) {
    if (!validLocation(value) || progress.getLessonStatus(value.lessonId) === 'locked') return false;
    location = { version: 1, lessonId: value.lessonId, view: value.view, page: value.page, at: now() };
    adapter.write(LOCATION_KEY, location);
    return true;
  }
  function getRecentLearning(limit = 3) {
    const state = progress.getState();
    return lessons.filter(lesson => state.attempts[lesson.id].length).map(lesson => {
      const attempts = state.attempts[lesson.id];
      return { lessonId: lesson.id, title: lesson.title, at: attempts.at(-1).at, completed: state.completedLessonIds.includes(lesson.id), attemptCount: attempts.length };
    }).sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, Math.max(0, limit));
  }
  function getStorageNotice() {
    return [adapter.getStatus(STORAGE_KEY).message, adapter.getStatus(LOCATION_KEY).message].filter((message, index, values) => message && values.indexOf(message) === index).join(' ');
  }
  function getDashboardState() {
    const state = progress.getState(), course = getCourseMapState(state), resume = getResumeLocation();
    const currentLesson = known.get(resume.lessonId);
    const currentUnit = course.units.find(unit => unit.lessonIds.includes(resume.lessonId));
    return { course, currentUnit, currentLesson, completedLessonCount: state.completedLessonIds.length, totalLessons: lessons.length,
      unitPercent: Math.round(course.completedUnitCount / course.totalUnits * 100), lessonPercent: Math.round(state.completedLessonIds.length / lessons.length * 100),
      hasStarted: Boolean(location) || Object.values(state.attempts).some(values => values.length), allCompleted: state.fullCourseCompleted,
      resume, recentLessons: getRecentLearning(), storageNotice: getStorageNotice() };
  }
  function reset() { location = null; adapter.write(LOCATION_KEY, null); return progress.reset(); }
  return { ...progress, reset, getCourseState, getUnitContext, getResumeLocation, saveLocation, rememberLocation: saveLocation, getRecentLearning, getStorageNotice, getDashboardState, getBadges, getBadgeSummary };
}
