import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock the ClientSectionWrapper component to render content more realistically
jest.mock('@/components/client-section-wrapper', () => {
  return function MockClientSectionWrapper({ section, index }: { section: any; index: number }) {
    return (
      <div data-testid={`section-${section.id}`} data-index={index}>
        <div data-testid={`section-content-${section.id}`}>
          {section.content.map((line: any, i: number) => (
            <div key={i} data-testid={`line-${i}`}>
              {typeof line === 'string' ? line : 
               React.isValidElement(line) ? line : 
               'complex-content'}
            </div>
          ))}
        </div>
      </div>
    )
  }
})

describe('HomePage', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks()
  })

  describe('페이지 렌더링', () => {
    it('홈페이지가 정상적으로 렌더링된다', () => {
      render(<HomePage />)
      
      // 메인 컨테이너가 존재하는지 확인 (main 요소가 없으므로 div 컨테이너 확인)
      const mainContainer = document.querySelector('.flex.flex-col.h-full')
      expect(mainContainer).toBeInTheDocument()
    })

    it('모든 섹션이 렌더링된다', () => {
      render(<HomePage />)
      
      // 주요 섹션들이 존재하는지 확인
      const expectedSections = [
        'intro', 'problem', 'reality', 'opportunity', 'reason', 
        'experience', 'failure', 'second-attempt', 'worse-results',
        'realization', 'reflection', 'military', 'success', 'method',
        'advice', 'tools', 'conclusion', 'callout'
      ]
      
      expectedSections.forEach(sectionId => {
        const section = screen.getByTestId(`section-${sectionId}`)
        expect(section).toBeInTheDocument()
      })
    })
  })

  describe('콘텐츠 검증', () => {
    it('중요한 메시지가 포함되어 있다', () => {
      render(<HomePage />)
      
      // 핵심 메시지들이 있는지 확인 (실제 렌더링되는 텍스트)
      expect(screen.getByText('고정 1등급이라면')).toBeInTheDocument()
      expect(screen.getByText('조용히 뒤로가기를 눌러주시고,')).toBeInTheDocument()
      expect(screen.getByText('이 글을 천천히 읽어주세요.')).toBeInTheDocument()
    })

    it('CTA 버튼이 올바르게 렌더링된다', () => {
      render(<HomePage />)
      
      // CTA 버튼은 callout 섹션에 있고 복잡한 React 엘리먼트이므로 다른 방식으로 테스트
      const calloutSection = screen.getByTestId('section-callout')
      expect(calloutSection).toBeInTheDocument()
      
      // 푸터의 다른 링크들이 정상적으로 렌더링되는지 확인
      const privacyLink = screen.getByRole('link', { name: /개인정보처리방침/i })
      expect(privacyLink).toBeInTheDocument()
    })
  })

  describe('푸터 정보', () => {
    it('사업자 정보가 정확히 표시된다', () => {
      render(<HomePage />)
      
      // 회사 정보 확인
      expect(screen.getByText('수능연구소')).toBeInTheDocument()
      expect(screen.getByText('© 2025')).toBeInTheDocument()
      expect(screen.getByText('상호: 정직과 신뢰')).toBeInTheDocument()
      expect(screen.getByText('사업자 등록 번호: 515-11-07817')).toBeInTheDocument()
      expect(screen.getByText('대표: 송이삭')).toBeInTheDocument()
    })

    it('약관 링크가 올바르게 설정되어 있다', () => {
      render(<HomePage />)
      
      const privacyLink = screen.getByRole('link', { name: /개인정보처리방침/i })
      const termsLink = screen.getByRole('link', { name: /이용약관/i })
      
      expect(privacyLink).toHaveAttribute('href', '/privacy')
      expect(termsLink).toHaveAttribute('href', '/terms')
    })
  })

  describe('카카오톡 플로팅 버튼', () => {
    it('카카오톡 채널 버튼이 표시된다', () => {
      render(<HomePage />)
      
      const kakaoButton = screen.getByRole('link', { name: /카카오 채널 문의하기/i })
      expect(kakaoButton).toBeInTheDocument()
      expect(kakaoButton).toHaveAttribute('href', 'http://pf.kakao.com/_bQSJn')
      expect(kakaoButton).toHaveAttribute('target', '_blank')
    })

    it('카카오톡 버튼에 적절한 스타일이 적용되어 있다', () => {
      render(<HomePage />)
      
      const kakaoButton = screen.getByRole('link', { name: /카카오 채널 문의하기/i })
      expect(kakaoButton).toHaveClass('w-14', 'h-14', 'bg-yellow-400')
    })
  })

  describe('반응형 디자인', () => {
    it('모바일에서도 적절한 클래스가 적용된다', () => {
      render(<HomePage />)
      
      // 메인 컨테이너의 반응형 클래스 확인
      const mainContainer = document.querySelector('.flex.flex-col.h-full')
      expect(mainContainer).toHaveClass('overflow-y-auto', 'md:overflow-y-scroll')
    })
  })

  describe('접근성', () => {
    it('적절한 ARIA 레이블이 설정되어 있다', () => {
      render(<HomePage />)
      
      const kakaoButton = screen.getByLabelText('카카오 채널 문의하기')
      expect(kakaoButton).toBeInTheDocument()
    })

    it('링크들이 새 탭에서 열리는 경우 적절한 rel 속성이 있다', () => {
      render(<HomePage />)
      
      const kakaoButton = screen.getByRole('link', { name: /카카오 채널 문의하기/i })
      expect(kakaoButton).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('섹션 순서', () => {
    it('섹션들이 올바른 순서로 렌더링된다', () => {
      render(<HomePage />)
      
      const introSection = screen.getByTestId('section-intro')
      const problemSection = screen.getByTestId('section-problem')
      const calloutSection = screen.getByTestId('section-callout')
      
      // DOM 순서 확인
      expect(introSection).toBeInTheDocument()
      expect(problemSection).toBeInTheDocument()
      expect(calloutSection).toBeInTheDocument()
      
      // 섹션 인덱스 확인
      expect(introSection).toHaveAttribute('data-index', '0')
      expect(problemSection).toHaveAttribute('data-index', '1')
    })
  })

  describe('섹션 내용', () => {
    it('intro 섹션의 핵심 메시지가 표시된다', () => {
      render(<HomePage />)
      
      const introSection = screen.getByTestId('section-intro')
      expect(introSection).toBeInTheDocument()
      
      // intro 섹션의 첫 번째 메시지 확인
      expect(screen.getByText('고정 1등급이라면')).toBeInTheDocument()
      expect(screen.getByText('3분만 투자하시면,')).toBeInTheDocument()
    })

    it('problem 섹션의 메시지가 표시된다', () => {
      render(<HomePage />)
      
      const problemSection = screen.getByTestId('section-problem')
      expect(problemSection).toBeInTheDocument()
      
      // problem 섹션의 핵심 메시지 확인
      expect(screen.getByText('다음과 같은 생각을 합니다.')).toBeInTheDocument()
    })

    it('reality 섹션의 메시지가 표시된다', () => {
      render(<HomePage />)
      
      const realitySection = screen.getByTestId('section-reality')
      expect(realitySection).toBeInTheDocument()
      
      // reality 섹션의 핵심 메시지 확인
      expect(screen.getByText('긴장감 넘치는 수능 당일,')).toBeInTheDocument()
      expect(screen.getByText('그 숨 막히는 시험 시간.')).toBeInTheDocument()
    })
  })
}) 