import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart, Users, Calendar, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground py-20 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">수능연구소</h1>
            <p className="text-xl mb-8 opacity-90">
              최고의 강사진과 함께하는 체계적인 수능 대비 학습 플랫폼으로 여러분의 대학 입시를 준비하세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/courses">강의 둘러보기</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-primary-foreground text-primary" asChild>
                <Link href="/auth/login">로그인</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-background w-full">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">하나의 플랫폼에서 필요한 모든 것</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10" />}
              title="강의 관리"
              description="교육 콘텐츠를 쉽게 생성, 구성 및 제공합니다."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="사용자 관리"
              description="학생을 등록하고, 진행 상황을 추적하며, 다양한 역할을 관리합니다."
            />
            <FeatureCard
              icon={<BarChart className="h-10 w-10" />}
              title="분석 및 보고서"
              description="학생 성과와 참여도에 대한 상세한 인사이트를 얻으세요."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10" />}
              title="일정 관리"
              description="강의, 과제 및 이벤트를 계획하고 일정을 관리합니다."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted w-full">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">학습 경험을 변화시킬 준비가 되셨나요?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            수천 개의 조직이 우리 플랫폼을 사용하여 탁월한 학습 경험을 제공하고 있습니다.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">
              시작하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold">수능연구소</h3>
              <p className="text-muted-foreground">© 2025 모든 권리 보유</p>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                소개
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                문의하기
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

