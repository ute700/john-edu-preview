/** Browser persistence boundary. Protected data is never silently overwritten. */
export function createStorageAdapter(storage) {
  let unavailable = false;
  if (storage === undefined) {
    try { storage = globalThis.localStorage; } catch { unavailable = true; }
  }
  if (!storage) unavailable = true;
  const issues = new Map();
  function protect(key, status = 'corrupt') { issues.set(key, status); }
  function read(key, validate) {
    if (unavailable) return null;
    try {
      const text = storage.getItem(key);
      if (text === null) return null;
      let value;
      try { value = JSON.parse(text); } catch { protect(key); return null; }
      const status = validate(value);
      if (status !== true) { protect(key, status || 'corrupt'); return null; }
      return value;
    } catch { unavailable = true; return null; }
  }
  function write(key, value) {
    if (unavailable || issues.has(key)) return false;
    try { storage.setItem(key, JSON.stringify(value)); return true; }
    catch { unavailable = true; return false; }
  }
  function getStatus(key) {
    const status = issues.get(key) || (unavailable ? 'unavailable' : 'ready');
    const message = status === 'ready' ? '' : status === 'unavailable'
      ? '브라우저 저장을 사용할 수 없어 현재 학습은 이 화면에서만 유지됩니다. 새로고침 전에 기록을 확인해 주세요.'
      : status === 'unsupported'
        ? '다른 버전의 저장 기록을 발견했습니다. 원본은 보존했으며 현재 학습 변경은 저장하지 않습니다.'
        : '저장 기록 일부를 읽을 수 없습니다. 원본은 보존했으며 현재 학습 변경은 저장하지 않습니다. 기록 복구를 요청해 주세요.';
    return { status, message, available: status === 'ready' };
  }
  return { read, write, protect, getStatus };
}
