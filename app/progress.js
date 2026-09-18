export const STORAGE_KEY = 'john-edu:representative-unit:v1';
export const LESSON_IDS = ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5'];

/** Browser-only prototype. This is not a secure assessment or entitlement service. */
export function createProgressStore({ lessons, storage, now = () => new Date().toISOString() } = {}) {
  const lessonIds = (lessons || []).map(lesson => lesson.id);
  if (new Set(lessonIds).size !== lessonIds.length || lessonIds.some(id => typeof id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(id) || id === '__proto__') || LESSON_IDS.some((id,index) => lessonIds[index] !== id)) throw new Error('Invalid lesson sequence');
  const definitions = new Map((lessons || []).map(lesson => [lesson.id, lesson.quiz]));
  const assessments = new Map(lessons.map(lesson=>[lesson.id,lesson.assessment]));
  const isSelfCheck = id => assessments.get(id)?.type === 'selfCheck';
  const isCompleted = id => attempts[id].some(answer=>isSelfCheck(id) ? answer.type==='selfCheck'&&answer.confirmed===true : answer.correct===true);
  for (const id of lessonIds) {
    if (isSelfCheck(id)) {
      const activity=assessments.get(id);
      if (typeof activity.prompt!=='string'||!activity.prompt.trim()||typeof activity.modelAnswer!=='string'||!activity.modelAnswer.trim()) throw new Error(`Invalid self check: ${id}`);
      continue;
    }
    const quiz = definitions.get(id);
    if (!quiz?.options?.some(option => option.id === quiz.correctOptionId)) throw new Error(`Invalid quiz: ${id}`);
  }
  let storageAvailable = true;
  if (storage === undefined) {
    try { storage = globalThis.localStorage; } catch { storageAvailable = false; }
  }
  if (!storage) storageAvailable = false;
  let attempts = Object.fromEntries(lessonIds.map(id => [id, []]));

  function restore(raw) {
    if (!raw || raw.version !== 1 || typeof raw.attempts !== 'object' || !raw.attempts) return;
    for (let index = 0; index < lessonIds.length; index++) {
      const id = lessonIds[index];
      if (index && !isCompleted(lessonIds[index-1])) break;
      if (!Array.isArray(raw.attempts[id])) continue;
      const quiz = definitions.get(id);
      for (const answer of raw.attempts[id]) {
        if(isSelfCheck(id)) {
          if(answer?.type==='selfCheck'&&answer.confirmed===true&&typeof answer.at==='string'&&Number.isFinite(Date.parse(answer.at))){attempts[id].push({type:'selfCheck',confirmed:true,at:answer.at});break;}
          continue;
        }
        if (!answer || !quiz.options.some(option => option.id === answer.optionId) || typeof answer.at !== 'string' || !Number.isFinite(Date.parse(answer.at))) continue;
        const correct = answer.optionId === quiz.correctOptionId;
        attempts[id].push({ optionId: answer.optionId, correct, at: answer.at });
        if (correct) break;
      }
    }
  }
  try { if (storageAvailable) restore(JSON.parse(storage.getItem(STORAGE_KEY))); }
  catch (error) { if (!(error instanceof SyntaxError)) storageAvailable = false; }

  function save() {
    if (!storageAvailable) return;
    try { storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, attempts })); }
    catch { storageAvailable = false; }
  }
  function getState() {
    const completedLessonIds = lessonIds.filter(isCompleted);
    return {
      version: 1,
      attempts: JSON.parse(JSON.stringify(attempts)),
      completedLessonIds,
      representativeUnitCompleted: LESSON_IDS.every(id => completedLessonIds.includes(id)),
      fullCourseCompleted: lessonIds.length === 165 && lessonIds.every((id,index)=>id === `lesson-${index+1}`) && completedLessonIds.length === 165,
      storageAvailable
    };
  }
  function getLessonStatus(id) {
    const index = lessonIds.indexOf(id);
    if (index === -1) throw new Error('Unknown lesson');
    if (isCompleted(id)) return 'completed';
    return index === 0 || isCompleted(lessonIds[index-1]) ? 'available' : 'locked';
  }
  function submitAnswer(id, optionId) {
    const status = getLessonStatus(id);
    if (status === 'locked') throw new Error('Lesson is locked');
    if (isSelfCheck(id)) throw new Error('Self check requires explicit confirmation');
    const quiz = definitions.get(id);
    if (!quiz.options.some(option => option.id === optionId)) throw new Error('Unknown option');
    if (status === 'completed') return { correct: optionId === quiz.correctOptionId, completed: true, attemptCount: attempts[id].length, showExtraExample: false, alreadyCompleted: true, state: getState() };
    const correct = optionId === quiz.correctOptionId;
    attempts[id].push({ optionId, correct, at: now() });
    save();
    return { correct, completed: correct, attemptCount: attempts[id].length, showExtraExample: !correct && attempts[id].filter(a => !a.correct).length >= 2, state: getState() };
  }
  function submitSelfCheck(id) {
    const status=getLessonStatus(id);
    if(status==='locked')throw new Error('Lesson is locked');
    if(!isSelfCheck(id))throw new Error('Lesson requires a quiz answer');
    if(status==='completed')return {completed:true,alreadyCompleted:true,assessmentType:'selfCheck',state:getState()};
    attempts[id].push({type:'selfCheck',confirmed:true,at:now()});save();
    return {completed:true,assessmentType:'selfCheck',state:getState()};
  }
  function reset() { attempts = Object.fromEntries(lessonIds.map(id => [id, []])); save(); return getState(); }
  return { getState, getLessonStatus, submitAnswer, submitSelfCheck, reset };
}
