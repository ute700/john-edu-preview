import { learningSection, comparisonTable, learningFlow } from './learning-blocks.js';

// An approved presentation pilot for lesson-1's existing example page only.
// The source lesson, page count, assessment, and progress service remain unchanged.
export function renderLesson1Pilot() {
  return `<div class="lesson1-pilot">
    <p class="learning-goal">오늘 볼 내용 · 미리 마련한 돈이 갑작스러운 상황에서 어떻게 도움이 되는지 알아봐요.</p>
    ${learningSection('급할 때 쓸 돈을 따로 준비해요', [
      '갑자기 돈이 필요할 때 쓰려고 따로 준비한 돈을 비상자금이라고 해요. 예상하지 못한 교통비나 학용품비가 생기면, 어떻게 대응할지 생각할 여유를 줄 수 있어요.',
      '돈이 부족하다면 믿을 수 있는 보호자나 교사에게 도움을 요청할 수 있어요. 혼자 해결해야 하는 것은 아니에요.'
    ])}
    <section class="learning-block learning-block--comparison">
      <h3>같은 생활비, 다른 준비</h3>
      <p id="pilot-case-conditions" class="learning-case-context">어른 두 사람의 학습용 가상 사례예요. 두 사람 모두 다른 수입과 부채가 없고, 한 달 꼭 필요한 생활비가 150만 원이라고 가정해요.</p>
      ${comparisonTable('가람과 나래의 비상자금 비교', ['비교 기준', '가람', '나래'], [
        ['한 달 꼭 필요한 생활비', '150만 원', '150만 원'],
        ['바로 쓸 수 있는 비상자금', '450만 원', '0원'],
        ['다른 수입 없이 이 돈으로 생활할 수 있는 기간', '약 3개월', '별도 지원·자금 마련 필요'],
        ['검토할 대응', '준비한 돈으로 생활하며 다음 일 찾기', '지출 조정, 지원제도, 도움·자금 마련 검토']
      ])}
      <p class="learning-calculation"><span>기간을 계산해 보면</span><strong>450만 원 ÷ 한 달 150만 원 = 3개월</strong></p>
      ${learningSection('이 조건도 함께 기억해요', [
        '3개월분이 누구에게나 충분하다는 뜻은 아니에요. 필요한 금액과 기간은 각자의 상황에 따라 달라요.',
        '준비한 돈이 다르다고 성실함이나 사람의 가치가 다른 것은 아니에요. 수입이 부족하거나 돌봄·의료비 부담이 크면 저축이 어려울 수 있어요. 지원제도와 상담을 확인하는 것도 대응 방법이에요.'
      ], 'conditions')}
    </section>
    ${learningFlow(['갑작스러운 지출이 생김', '준비한 돈과 받을 수 있는 도움 확인', '대응 방법 비교'])}
    ${learningSection('오늘의 핵심', [
      '미리 준비한 돈은 급한 상황에서 선택할 시간을 늘려 줄 수 있어요.',
      '비상자금이 모든 문제를 해결하는 것은 아니에요.'
    ], 'key')}
    ${learningSection('잠깐, 생각해 보기', [
      '갑자기 돈이 필요하면, 사용할 돈과 도움을 어디에서 확인할 수 있을까요?',
      '마음속으로 생각하거나 개인 노트에 적어 보세요. 이 질문은 채점하지 않으며, 답변을 입력하거나 저장하지 않아요.'
    ], 'reflection')}
  </div>`;
}
