import Link from "next/link";
import ClientSectionWrapper from "@/components/client-section-wrapper";
import { Button } from "../components/ui/button";

export default function HomePage() {
  // Add this effect to force scroll to top on page load

  const sections = [
    {
      id: "intro",
      content: [
        "고정 1등급이라면",
        "조용히 뒤로가기를 눌러주시고,",
        "",
        <>
          <span className="font-bold">만약 90점 이하 학생이라면,</span>
        </>,
        <>
          <span className="text-red-500 font-bold">딱 3분만 </span>
          <span>시간을 내어</span>
        </>,
        "이 글을 천천히 읽어주세요.",
        "",
        "3분만 투자하시면,",
        <>
          <span className="font-bold">1년 학원비와 시간</span>
          <span>을 아낄 수 있습니다.</span>
        </>,
      ],
      hasImage: false,
    },
    {
      id: "problem",
      content: [
        <>
          <span className="font-bold">약 500,000명</span>
          <span>의 수험생 중</span>
        </>,
        <>
          <span className="font-bold">95%정도</span>
          <span>는 수능 시험 당일에 </span>
        </>,
        "다음과 같은 생각을 합니다.",
        ".",
        ".",
        <>
          <span className=" font-bold">"ㅈ됐다. 글이 안 읽힌다…."</span>
        </>,
      ],
      hasImage: false,
    },
    {
      id: "reality",
      content: [
        "긴장감 넘치는 수능 당일,",
        "1분 1초가 아깝게 느껴지는 그 순간,",
        <>
          <b>추상적인 수능 영어 지문이</b>
        </>,
        <>
          <b className="text-red-500">읽히지 않는 게 당연합니다.</b>
        </>,
        "",
        "재수생 이상은 아실 겁니다.",
        "",
        "글이 눈에 들어오지 않는데,",
        "억지로라도 읽으려고 발버둥을 치는,",
        "그 숨 막히는 시험 시간.",
        "",
        <>
          <span className="font-bold">미치고 환장하겠는데,</span>
        </>,
        "",
        <>
          <span className="font-bold">감독관은 10분 남았다고 하고,</span>
        </>,
        "",
        <>
          <span className="font-bold">당장 울음이 터질 것 같고,</span>
        </>,
        "",
        <>
          <span className="font-bold">날 위해 1년 뒷바라지하신</span>
        </>,
        <>
          <span className="font-bold">부모님 얼굴이 갑자기 떠오르는,</span>
        </>,
        "",
        "그런 하늘이 무너지는 기분을요",
      ],
      hasImage: false,
    },
    {
      id: "opportunity",
      content: [
        "여기까지 글을 읽고 계신다면,",
        "정말 운이 좋으신 겁니다.",
        "",
        <>
          <span>지금부터 제가</span>
          <span className="font-bold"> 원인과 해결방법 </span>
          <span>을</span>
        </>,

        "정확히 알려드릴 테니",
        "집중해 주세요.",
      ],
      hasImage: false,
    },
    {
      id: "reason",
      content: [
        <>
          <span className="font-bold">영어 지문이 읽히지 않고</span>
        </>,
        <>
          <span className="font-bold">튕기는 이유는</span>
        </>,
        "",
        "생각보다 간단합니다.",
        "",
        "",
        "여러분이 잘 아는 이유지만,",
        "늘 '어떻게든 되겠지'하고 '무시'하는 이유이기도 합니다.",
        "",
        "그 이유는 바로",
        "",
        <>
          <b>
            영어를 <span className="text-red-500">감(感)으로 풀어서 </span>
          </b>
          <b>그렇습니다.</b>
        </>,
      ],
      hasImage: false,
    },
    {
      id: "experience",
      content: [
        "저는 여러분을 잘 압니다.",
        "",
        <>
          <p className="font-bold">저도 감으로 풀었던 적이 있고,</p>
        </>,
        <>
          <p className="font-bold">저를 처음 만난 제자들도 그랬으니까요.</p>
        </>,
        "",
        "만약 여러분이 영어를 감으로 풀고 있는데,",
        "특별히 국어 능력이 좋지 않은 이상,",
        "",
        <>
          <p>
            수능 날{" "}
            <span className="text-3xl font-bold text-red-500">
              반드시 망합니다.
            </span>
          </p>
        </>,
        "",
        "제가 바로 산 증인입니다.",
        "",
        "저는 학창 시절",
        "고등학교 3년 내내",
        <>
          <p className="font-bold underline">
            3등급 이하를 받아본 적이 없습니다.
          </p>
        </>,
        "",
        "그리고 수능 날 굳게 믿었던 과목인",
        <>
          <span className="font-bold">영어에 뒤통수</span>를 맞게 됩니다.
        </>,
      ],
      hasImage: false,
    },
    {
      id: "failure",
      content: [
        <>
          당시 제가 시험장에서 느낀 <span className="font-bold">'좌절감'</span>
          은
        </>,
        "말로 표현할 수 없을 만큼 컸습니다.",
        "",
        "그런데 이렇게 수능을 망치고도",
        "저는 깨닫지 못하고,",
        "스스로 이렇게 생각했습니다.",
        "",
        <>
          <p className="font-bold">'내 노력이 부족했나 보다..'</p>
        </>,

        <>
          <p className="font-bold">'더 열심히 해보자, 화이팅!!'</p>
        </>,

        <>
          <p className="font-bold">'난 할 수 있다!!!'</p>
        </>,
      ],
      hasImage: true,
      imageCount: 1,
    },
    {
      id: "second-attempt",
      content: [
        <>
          <span className=" text-red-500 font-bold">진짜 원인</span>은 깨닫지
          못한 채
        </>,
        "마음을 다잡고, 정말 열심히 공부해",
        "수능을 다시 보게 됩니다. (반수)",
        "",
        "당시는 영어가 상대평가였기에,",
        "입시에 있어서 굉장히 중요했던 과목이었습니다.",
        "",
        <>
          <span>
            따라서 하루 <span className="font-bold">공부 시간의</span>
          </span>
        </>,
        <>
          <span>
            <span className="text-red-500 font-bold">30% 이상</span>을 영어에
            투자하면서
          </span>
        </>,
        "",
        "정말 미친 듯이 공부했습니다.",
        "",
        "그리고 결과는",
        ".",
        ".",
      ],
      hasImage: false,
    },
    {
      id: "worse-results",
      content: [
        "현역 때는 그래도",
        "풀 수 있는 문제는 풀었는데,",
        "",
        "반수 때는 정말",
        "쉬운 문제에서 막히기 시작하니,",
        "듣기도 틀리고,",
        "완전 멘탈이 무너져서,",
        "",
        <>
          <span className="font-bold">70분 동안 울다가</span>
        </>,
        <>
          <span className="font-bold">시험 종이 쳤습니다.</span>
        </>,
      ],
      hasImage: true,
      imageCount: 1,
    },
    {
      id: "realization",
      content: [
        "믿어지시나요?",
        "",
        <>
          <span className="font-bold">고등학교 3년 내내 2등급 밑으로</span>
        </>,
        <>
          <span className="font-bold">떨어져 본 적 없던 영어가,</span>
        </>,
        "",
        <>
          <span className="text-red-500 font-bold">수능 날 3등급</span>이 나오고
        </>,
        "",
        <>
          <span className="text-red-500 font-bold">반수 때는 5등급</span>이
          나왔습니다.
        </>,
        "",
        <>
          <span>
            심지어 저는 당시
            <span className=" font-bold"> 9월 모의고사</span>에서
          </span>
        </>,
        <>
          <span className="font-bold">영어 백분위 98%</span>를 찍으면서,
        </>,
        "자신감으로 가득했습니다.",
        "",
        "제 기분은 어땠을지",
        "상상되시나요?",
        "",
        <>
          <span className="font-bold">처참했고, 제 자존감은</span>
        </>,
        "바닥을 찍었습니다.",
        "",
        "그리고 생각했습니다.",
      ],
      hasImage: false,
    },
    {
      id: "reflection",
      content: [
        <>
          <span className="font-bold underline">
            '공부는 그냥 유전이다. 이건 진리야'
          </span>
        </>,
        "",
        "물론 지금도,",
        "공부는 유전자라는 생각에는",
        "변함이 없습니다.",
        "",
        "그런데, 가슴에 손을 얹고 생각해 봅시다.",
        "",
        <>
          <span className="font-bold">
            1. 올바른 방법으로 열심히 했는데 유전자
          </span>
        </>,
        <>
          <span className="font-bold">때문에 성적이 나오지 않는 건가?</span>
        </>,
        "",
        <>
          <span className="font-bold">
            2. 대충 공부하고 유전자 탓이라고 스스로 자위하고 있나?
          </span>
        </>,
        "",
        "후자라면,",
        "생각을 뜯어고치세요.",
        "그래야 성적이 오릅니다.",
      ],
      hasImage: false,
    },
    {
      id: "military",
      content: [
        "시간이 흘러 저는 입대를 하게 되고,",
        <>
          군대에서{" "}
          <span className="text-red-500 font-bold">
            영어 공부법에 대한 깨달음
          </span>
          을 얻게 됩니다.
        </>,
        "",
        "부대마다 다르지만,",
        "군대에서는 공부할 시간이 거의 없습니다.",
        "",
        "하루에 1~2시간밖에 공부할 시간이",
        "없었기 때문에,",
        "당시 급했던 수학과 탐구만 공부하고,",
        "",
        <>
          <span className="font-bold">영어는 '거의' 하지 않았습니다.</span>
        </>,
        "",
        "그리고 전역 후 정확히 9일 후에 본 수능에서",
        "",
        <>
          <span className="font-bold text-3xl">1등급을 받게 됩니다.</span>
        </>,
      ],
      hasImage: false,
    },
    {
      id: "success",
      content: [
        "입대 전 공부를 열심히 했고,",
        "입대 후 물리적 시간이 부족해",
        "공부를 거의 못 했습니다.",
        "",
        <>
          근데 성적은{" "}
          <span className="text-red-500 font-bold">5등급에서 1등급</span>으로
          상승합니다.
        </>,
        "",
        "무엇이 바뀌었을까요?",
        "",
        <>
          <span className="font-bold">'공부 방법'</span>
        </>,
      ],
      hasImage: true,
      imageCount: 1,
    },
    {
      id: "method",
      content: [
        "고등학교 1학년 때 시작하여,",
        "",
        <>
          <span className="font-bold text-red-500">
            7년 만에 깨달은 영어 공부법
          </span>
        </>,
        "",
        "이제는 온라인에서도",
        "본격적으로 풀어보려고 합니다.",
        "",
        "여러분은 저처럼 시행착오를 겪지 마세요.",
        "",
        "제가 확신하는데,",
        "이게 가장 빠르고 정확합니다.",
        "",
        "제가 했던 방법,",
        "그대로 전달해 드리겠습니다.",
        "",
        "저도 했고, 제자들도 했습니다.",
        "여러분도 할 수 있습니다.",
      ],
      hasImage: false,
    },
    {
      id: "testimonials",
      content: [],
      hasImage: true,
      imageCount: 4,
    },
    {
      id: "advice",
      content: [
        "12년 준비한 수능,",
        "",
        <>
          <span className="font-bold">인생이 결정되는 시험</span>을
        </>,
        "",
        <>
          <span className="">제발 '감', '운'에 맡기지 마세요.</span>
        </>,
      ],
      hasImage: false,
    },
    {
      id: "tools",
      content: [
        <>
          <span className="">수능 시험장에서 이런</span>
          <span className="font-bold"> 잡다한 도구</span>는
        </>,
        <>
          <span className="text-red-500 font-bold">절대 통하지 않습니다.</span>
        </>,
        "",
        "1분 1초가 아까운 시험 현장에서",
        <>
          실제로 써먹을 수 없는
          <span className="font-bold"> 의미없는 밑줄 긋기</span>는
        </>,
        "아무 쓸모 없습니다.",
        "",
        <>
          <p className="font-bold">본질적인 실력, </p>
          즉,<span className="font-bold"> 피지컬</span>을 키우셔야 합니다.
        </>,
        "",
        "그래야 어떤 유형 / 지문이 등장해도",
        "뚫어낼 수 있습니다.",
      ],
      hasImage: true,
      imageCount: 1,
    },
    {
      id: "conclusion",
      content: [
        <>
          <p className="font-bold">지금 노베이스인가요?</p>
        </>,
        "",
        <>
          <p className="font-bold">상관 없습니다.</p>
        </>,
        "",
        <>
          <span className="">정확한 방법으로 공부한다면,</span>
        </>,
        "최소한의 시간으로",
        "300% 이상의 효율을 만들 수 있습니다.",
        "",
        "반드시 기억하세요.",
        <>
          정확한 독해만이 <span className="font-bold">안정적인 1등급</span>을
          만듭니다.
        </>,
        "",
        "공부할 준비가 되셨다면,",
        "믿고 따라오세요.",
        "",
        "시키는 대로만 하시면,",
        "성적은 제가 만들어 드리겠습니다.",
        "",
      ],
      hasImage: false,
    },
    {
      id: "callout",
      content: [
        <>
          만약 시키는 <span className="text-red-500 font-bold">'그대로' </span>
          하셨는데,
        </>,
        "성적이 오르지 않았다면",
        <>
          <span className=" font-bold">수강료의 1,000%</span>를
          돌려드리겠습니다.
        </>,
        "",
        <span className="font-bold">그럼 준비되셨나요?</span>,
        "",
        <>
          <Button asChild variant="red" size="lg">
            <Link href={`/courses`} className="text-xl">
              수강하러가기
            </Link>
          </Button>
        </>,
        "",
        <></>,
      ],
      hasImage: false,
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto md:overflow-y-scroll ">
      {sections.map((section, sectionIndex) => (
        <ClientSectionWrapper
          key={section.id}
          section={section}
          index={sectionIndex}
        />
      ))}

      {/* Footer with mobile optimization */}
      <footer className="bg-background border-t py-8 md:py-12 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold">수능연구소</h3>
              <p className="text-muted-foreground">© 2025 </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground"
              >
                소개
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground"
              >
                문의하기
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground"
              >
                이용약관
              </Link>
            </div>
          </div>

          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-muted text-xs text-muted-foreground">
            <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
              <span>상호: 정직과 신뢰</span>
              <span>사업자 등록 번호: 515-11-07817</span>
              <span>대표: 송이삭</span>
              <span>통신판매업신고번호: 2021-용인수지-1155</span>
              <span>
                사업장주소: 경기도 용신시 수지구 고기로 89, 103동 1705호
              </span>
              <span>유선전화번호: 010-3176-6450</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating bottom bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full px-4">
        <div className="max-w-7xl mx-auto bg-background border rounded-lg shadow-md py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="font-semibold text-sm mr-4 truncate max-w-[200px] md:max-w-md md:text-lg">
                수강 준비가 되셨나요?
              </h3>
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground"></div>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href={`/courses`} className="text-sm md:text-base">
                강의 보러가기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
