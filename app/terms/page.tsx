import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

export default function TermPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">이용약관 및 환불 정책</h1>
        <p className="text-muted-foreground">
          온라인 강좌 이용에 관한 약관 및 환불 정책입니다.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>환불 정책</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="font-medium">
            ① 회사는 온라인 강좌 등에 대해 원칙적으로 다음과 같은 환불규정을 적용합니다.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border px-4 py-2 text-left">구분</th>
                  <th className="border px-4 py-2 text-left">반환사유 발생일</th>
                  <th className="border px-4 py-2 text-left">반환금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2" rowSpan={1}>
                    학원의 교습정지, 자진폐원, 등록말소 등
                  </td>
                  <td className="border px-4 py-2">
                    교습을 할 수 없거나 교습장소를 제공할 수 없게 된 날
                  </td>
                  <td className="border px-4 py-2">
                    이미 납부한 교습비 등을 일할 계산한 금액
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2" rowSpan={7}>
                    회원이 본인의 의사로 수강을 포기한 경우
                  </td>
                  <td className="border px-4 py-2 font-medium" colSpan={2}>
                    교습기간이 1개월 이내인 경우
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">교습시작 전</td>
                  <td className="border px-4 py-2">
                    이미 납부한 교습비 등의 전액
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">총 교습시간의 1/3 경과 전</td>
                  <td className="border px-4 py-2">
                    이미 납부한 교습비 등의 2/3에 해당하는 금액
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">총 교습시간의 1/2 경과 전</td>
                  <td className="border px-4 py-2">
                    이미 납부한 교습비 등의 1/2에 해당하는 금액
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">총 교습시간의 1/2 경과 후</td>
                  <td className="border px-4 py-2">반환하지 않음</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-medium" colSpan={2}>
                    교습기간이 1개월을 초과하는 경우
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">교습 시작 전</td>
                  <td className="border px-4 py-2">
                    이미 납부한 교습비 등의 전액
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2">교습 시작 후</td>
                  <td className="border px-4 py-2">
                    반환사유가 발생한 해당 월의 반환대상 교습비 등(교습기간이 1개월 이내인 경우의 기준에 따라 산출한 금액을 말한다)과 나머지 월의 교습비 등의 전액을 합산한 금액
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Separator />
          
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-medium">비고</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                총 교습시간은 교습기간 중의 총 교습시간을 말하며, 반환금액의 산정은 반환사유가 발생한 날까지 경과된 교습시간을 기준으로 한다.
              </li>
              <li>
                원격교습의 경우 반환금액은 교습내용을 실제 수강한 부분(인터넷으로 수강하거나 학습기기로 저장한 것을 말한다)에 해당하는 금액을 뺀 금액으로 한다.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 