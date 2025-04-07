import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Shield, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
        <p className="text-muted-foreground">
          수능연구소의 개인정보 수집 및 이용에 관한 안내입니다.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>개인정보취급방침</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              수능연구소(이하 '회사'는) 고객님의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다. 
              회사는 개인정보취급방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 
              개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>
            
            <p>
              회사는 회원의 개인정보보호를 매우 중요시하며, 『정보통신망이용촉진등에 관한 법률』상의 개인정보보호 규정 및 
              정보통신부가 제정한 『개인정보보호지침』을 준수하고 있습니다.
            </p>
            
            <p>
              개인정보취급방침은 정부의 법률 및 지침의 변경과 당사의 약관 및 내부 정책에 따라 변경될 수 있으며 
              이를 개정하는 경우 회사는 변경사항에 대하여 즉시 홈페이지에 게시합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>수집하는 개인정보 항목 및 수집방법</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">(1) 개인정보 수집 항목</h3>
              <p className="mb-4">
                회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
              </p>
              
              <div className="pl-4 space-y-4">
                <div>
                  <h4 className="font-medium">1) 회원가입시 수집하는 개인정보 항목</h4>
                  <p>- 필수항목 : 성명, 생년월일, 아이디, 비밀번호, 이메일 주소, 휴대폰 번호, 전화번호, 성별</p>
                </div>
                
                <div>
                  <h4 className="font-medium">2) 유료 서비스 이용시 수집하는 결제정보 항목</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>신용카드 결제시: 카드사명, 카드번호, 회사명 등</li>
                    <li>휴대전화 결제시: 이동전화번호, 통신사, 결제승인번호, 회사명 등</li>
                    <li>계좌이체시: 은행명, 계좌번호, 회사명 등</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">3) 서비스 이용 과정 중 자동으로 수집하는 개인정보 항목</h4>
                  <p>- 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">(2) 개인정보 수집방법</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>홈페이지를 통한 회원가입, 문의 게시판</li>
                <li>전화,팩스,회사 내에서의 신청서 등을 통한 오프라인 상에서의 수집</li>
                <li>생성정보 수집 툴을 통한 자동수집</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>개인정보의 수집 및 이용 목적</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">(1) 수집 및 이용 목적</h3>
              <p className="mb-4">
                회사는 다음과 같은 목적을 위하여 개인정보를 수집하고 있습니다.
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">성명, 아이디, 비밀번호:</span> 회원제 서비스 이용에 따른 본인 식별 절차에 이용
                </li>
                <li>
                  <span className="font-medium">성명, 아이디, 이메일주소, 전화번호:</span> 고지사항 전달, 본인 의사 확인, 불만 처리 등 원활한 의사소통 경로의 확보
                </li>
                <li>
                  <span className="font-medium">성명, 아이디, 생년월일, 은행계좌정보, 신용카드정보:</span> 유료 정보 이용 및 상품구매에 대한 요금 결제
                </li>
                <li>
                  <span className="font-medium">성명, 아이디, 주소, 전화번호, 휴대폰 번호:</span> 청구서
                </li>
                <li>
                  <span className="font-medium">성명, 아이디, 생년월일(연령대, 생년월일), 성별</span>
                </li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">(2) 민감한 개인정보 수집 제한</h3>
              <p>
                회사는 이용자의 기본적 인권 침해의 우려가 있는 민감한 개인정보(인종 및 민족, 사상 및 신조, 출신지 및 본적지, 정치적 성향 및 범죄기록, 건강상태 및 성생활 등)는 수집하지 않습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>개인정보의 보유 및 이용기간</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">(1) 원칙적 보유 및 이용기간</h3>
              <p className="mb-4">
                원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만, 회사는 불량 회원의 부정한 이용의 재발을 방지하거나 국가 정보기관의 수사 협조,온라인 유료 콘텐츠의 수강 이력 보존, 명예 훼손 기타 권리 침해 관련 분쟁에 관한 자료 보존을 위해 해당 정보를 일정 기간 동안 보관합니다.
              </p>
              
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium">보존 항목:</span> 성명, 생년월일, 아이디, 수강이력정보</li>
                <li><span className="font-medium">보존 근거:</span> 불량 이용자의 재가입방지, 명예 훼손 등 권리 침해 분쟁 및 수사에 대한 협조, 추후 재가입시 회원제 서비스 이용에 따른 본인 식별절차에 이용</li>
                <li><span className="font-medium">보존 기간:</span> 보존 필요성 종료시까지</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">(2) 법령에 따른 보존기간</h3>
              <p className="mb-4">
                관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
              </p>
              
              <ul className="list-disc pl-5 space-y-1">
                <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래등에서의 소비자보호에 관한 법률)</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래등에서의 소비자보호에 관한 법률)</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래등에서의 소비자보호에 관한 법률)</li>
                <li>신용정보의 수집/처리 및 이용 등에 관한 기록: 3년 (신용정보의 이용 및 보호에 관한 법률)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>이용자 및 법정대리인의 권리와 그 행사방법</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.
            </p>
            <p className="mb-4">
              이용자들의 개인정보 조회,수정을 위해서는 '개인정보변경'(또는 '회원정보수정' 등)을,
              가입해지(동의철회)를 위해서는 고객센터 혹은 개인정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.
            </p>
            <p className="mb-4">
              귀하가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다.
              또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체없이 통지하여 정정이 이루어지도록 하겠습니다.
            </p>
            <p>
              회사는 이용자의 요청에 의해 해지 또는 삭제된 개인정보는 "회사가 수집하는 개인정보의 보유 및 이용기간"에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>개인정보의 제공 및 위탁</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              회사는 고객의 별도 동의가 있는 경우나 법령에 규정된 경우를 제외하고는 고객의 개인정보를 제3자에게 제공하지 않습니다.
            </p>
            <p className="mb-4">
              회사는 제3자 서비스와의 연결을 위해 개인정보를 제공하고 있습니다.
            </p>
            <p>
              회사는 고객의 사전 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 고객이 외부 제휴사 등의 서비스를 이용하기 위하여 필요한 범위 내에서 고객의 동의를 얻은 후에 개인정보를 제3자에게 제공하고 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 