"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Save, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getModuleLectures, updateModule, createLecture, updateLecture, deleteLecture } from "@/lib/admin"
import type { Module, Lecture } from "@/types"

export default function ModuleEditPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const courseId = params?.courseId as string
  const moduleId = params?.moduleId as string

  const [module, setModule] = useState<Partial<Module>>({
    id: moduleId,
    course_id: courseId,
    title: "",
    order: 0,
  })

  const [lectures, setLectures] = useState<Lecture[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // 새 강의 추가를 위한 상태
  const [newLecture, setNewLecture] = useState<Partial<Lecture>>({
    title: "",
    description: "",
    video_url: "",
    duration: "",
    type: "video",
    order: 0,
  })

  // 강의 편집을 위한 상태
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")

  useEffect(() => {
    fetchModuleData()
  }, [courseId, moduleId])

  async function fetchModuleData() {
    try {
      setIsLoading(true)

      // 모듈 정보 가져오기
      const response = await fetch(`/api/admin/modules/${moduleId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "모듈 정보를 가져오는 중 오류가 발생했습니다.")
      }

      const moduleData = await response.json()
      setModule(moduleData)

      // 강의 목록 가져오기
      const lecturesData = await getModuleLectures(moduleId)
      setLectures(lecturesData)

      // 새 강의의 기본 순서 설정
      if (lecturesData.length > 0) {
        setNewLecture((prev) => ({
          ...prev,
          order: lecturesData.length + 1,
        }))
      }
    } catch (error) {
      console.error("Error fetching module data:", error)
      toast({
        title: "오류 발생",
        description: "모듈 데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleModuleInputChange = (e) => {
    const { name, value } = e.target
    setModule({ ...module, [name]: value })
  }

  const handleLectureInputChange = (e, isNewLecture = true) => {
    const { name, value } = e.target
    if (isNewLecture) {
      setNewLecture({ ...newLecture, [name]: value })
    } else {
      setEditingLecture({ ...editingLecture, [name]: value })
    }
  }

  const handleLectureSelectChange = (name, value, isNewLecture = true) => {
    if (isNewLecture) {
      setNewLecture({ ...newLecture, [name]: value })
    } else {
      setEditingLecture({ ...editingLecture, [name]: value })
    }
  }

  const handleUpdateModule = async () => {
    if (!module.title) {
      toast({
        title: "필수 정보 누락",
        description: "모듈 제목을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const updatedModule = await updateModule(moduleId, {
        title: module.title,
        order: module.order,
      })

      toast({
        title: "모듈 업데이트 완료",
        description: "모듈 정보가 성공적으로 업데이트되었습니다.",
      })

      setModule(updatedModule)
    } catch (error) {
      console.error("Error updating module:", error)
      toast({
        title: "오류 발생",
        description: "모듈 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddLecture = async () => {
    if (!newLecture.title || !newLecture.type) {
      toast({
        title: "필수 정보 누락",
        description: "강의 제목과 유형은 필수입니다.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const lectureData = {
        ...newLecture,
        module_id: moduleId,
        order: lectures.length + 1,
      }

      const createdLecture = await createLecture(lectureData)

      setLectures([...lectures, createdLecture])

      // 입력 필드 초기화
      setNewLecture({
        title: "",
        description: "",
        video_url: "",
        duration: "",
        type: "video",
        order: lectures.length + 2,
      })

      setIsDialogOpen(false)

      toast({
        title: "강의 추가 완료",
        description: "새 강의가 성공적으로 추가되었습니다.",
      })
    } catch (error) {
      console.error("Error adding lecture:", error)
      toast({
        title: "오류 발생",
        description: "강의 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateLecture = async () => {
    if (!editingLecture || !editingLecture.title || !editingLecture.type) {
      toast({
        title: "필수 정보 누락",
        description: "강의 제목과 유형은 필수입니다.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const updatedLecture = await updateLecture(editingLecture.id, editingLecture)

      // 강의 목록 업데이트
      setLectures(lectures.map((lecture) => (lecture.id === updatedLecture.id ? updatedLecture : lecture)))

      setIsDialogOpen(false)
      setEditingLecture(null)

      toast({
        title: "강의 업데이트 완료",
        description: "강의 정보가 성공적으로 업데이트되었습니다.",
      })
    } catch (error) {
      console.error("Error updating lecture:", error)
      toast({
        title: "오류 발생",
        description: "강의 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteLecture = async (lectureId: string) => {
    if (!confirm("정말로 이 강의를 삭제하시겠습니까?")) {
      return
    }

    try {
      await deleteLecture(lectureId)

      // 강의 목록에서 삭제된 강의 제거
      setLectures(lectures.filter((lecture) => lecture.id !== lectureId))

      toast({
        title: "강의 삭제 완료",
        description: "강의가 성공적으로 삭제되었습니다.",
      })
    } catch (error) {
      console.error("Error deleting lecture:", error)
      toast({
        title: "오류 발생",
        description: "강의 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleMoveLecture = async (lectureId: string, direction: "up" | "down") => {
    const lectureIndex = lectures.findIndex((lecture) => lecture.id === lectureId)

    if ((direction === "up" && lectureIndex === 0) || (direction === "down" && lectureIndex === lectures.length - 1)) {
      return
    }

    const newLectures = [...lectures]
    const targetIndex = direction === "up" ? lectureIndex - 1 : lectureIndex + 1

    // 순서 교환
    const temp = newLectures[lectureIndex].order
    newLectures[lectureIndex].order = newLectures[targetIndex].order
    newLectures[targetIndex].order = temp[
      // 배열에서 위치 교환
      (newLectures[lectureIndex], newLectures[targetIndex])
    ] = [newLectures[targetIndex], newLectures[lectureIndex]]

    setLectures(newLectures)

    try {
      // 두 강의의 순서 업데이트
      await updateLecture(newLectures[lectureIndex].id, { order: newLectures[lectureIndex].order })
      await updateLecture(newLectures[targetIndex].id, { order: newLectures[targetIndex].order })
    } catch (error) {
      console.error("Error updating lecture order:", error)
      toast({
        title: "오류 발생",
        description: "강의 순서 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })

      // 오류 발생 시 원래 순서로 복원
      fetchModuleData()
    }
  }

  const openAddLectureDialog = () => {
    setDialogMode("add")
    setNewLecture({
      title: "",
      description: "",
      video_url: "",
      duration: "",
      type: "video",
      order: lectures.length + 1,
    })
    setIsDialogOpen(true)
  }

  const openEditLectureDialog = (lecture: Lecture) => {
    setDialogMode("edit")
    setEditingLecture(lecture)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return <div className="text-center py-8">모듈 정보를 불러오는 중...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => router.push(`/admin/courses/edit/${courseId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            강의로 돌아가기
          </Button>
          <h1 className="text-3xl font-bold">모듈 관리</h1>
        </div>
        <Button onClick={handleUpdateModule} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "저장 중..." : "모듈 저장"}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* 모듈 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>모듈 정보</CardTitle>
            <CardDescription>모듈의 기본 정보를 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">모듈 제목 *</Label>
              <Input
                id="title"
                name="title"
                value={module.title}
                onChange={handleModuleInputChange}
                placeholder="모듈 제목을 입력하세요"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* 강의 목록 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>강의 목록</CardTitle>
              <CardDescription>이 모듈에 포함된 강의를 관리합니다.</CardDescription>
            </div>
            <Button onClick={openAddLectureDialog}>
              <Plus className="h-4 w-4 mr-2" />새 강의 추가
            </Button>
          </CardHeader>
          <CardContent>
            {lectures.length === 0 ? (
              <div className="text-center py-8 border rounded-md bg-muted/30">
                <p className="text-muted-foreground">아직 강의가 없습니다. 새 강의를 추가하세요.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">순서</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>길이</TableHead>
                      <TableHead className="w-[120px]">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lectures.map((lecture, index) => (
                      <TableRow key={lecture.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{lecture.title}</TableCell>
                        <TableCell>
                          {lecture.type === "video" ? "비디오" : lecture.type === "assignment" ? "과제" : "퀴즈"}
                        </TableCell>
                        <TableCell>{lecture.duration || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveLecture(lecture.id, "up")}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveLecture(lecture.id, "down")}
                              disabled={index === lectures.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditLectureDialog(lecture)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLecture(lecture.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 강의 추가/편집 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "새 강의 추가" : "강의 편집"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "add" ? "새 강의 정보를 입력하세요." : "강의 정보를 수정하세요."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lecture-title">강의 제목 *</Label>
              <Input
                id="lecture-title"
                name="title"
                value={dialogMode === "add" ? newLecture.title : editingLecture?.title}
                onChange={(e) => handleLectureInputChange(e, dialogMode === "add")}
                placeholder="강의 제목을 입력하세요"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lecture-type">강의 유형 *</Label>
              <Select
                value={dialogMode === "add" ? newLecture.type : editingLecture?.type}
                onValueChange={(value) => handleLectureSelectChange("type", value, dialogMode === "add")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="강의 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">비디오</SelectItem>
                  <SelectItem value="assignment">과제</SelectItem>
                  <SelectItem value="quiz">퀴즈</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lecture-description">설명</Label>
              <Textarea
                id="lecture-description"
                name="description"
                value={dialogMode === "add" ? newLecture.description : editingLecture?.description}
                onChange={(e) => handleLectureInputChange(e, dialogMode === "add")}
                placeholder="강의에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lecture-video-url">비디오 URL</Label>
                <Input
                  id="lecture-video-url"
                  name="video_url"
                  value={dialogMode === "add" ? newLecture.video_url : editingLecture?.video_url}
                  onChange={(e) => handleLectureInputChange(e, dialogMode === "add")}
                  placeholder="비디오 URL을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lecture-duration">길이</Label>
                <Input
                  id="lecture-duration"
                  name="duration"
                  value={dialogMode === "add" ? newLecture.duration : editingLecture?.duration}
                  onChange={(e) => handleLectureInputChange(e, dialogMode === "add")}
                  placeholder="예: 10분"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={dialogMode === "add" ? handleAddLecture : handleUpdateLecture} disabled={isSaving}>
              {isSaving ? "저장 중..." : dialogMode === "add" ? "강의 추가" : "강의 업데이트"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

