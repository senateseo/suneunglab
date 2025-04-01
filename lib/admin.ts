import type { Module } from "@/types/module"
import type { Lecture } from "@/types/lecture"
import { supabase } from "./supabase"
import type { User, Course, UserRole, UserStatus } from "@/types"

// 모든 사용자 가져오기
export async function getAllUsers(): Promise<User[]> {
  try {
    // 프로필 테이블에서 데이터 가져오기
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (profilesError) {
      console.error("프로필 목록 조회 오류:", profilesError)
      throw profilesError
    }

    // 현재 로그인한 사용자 정보 가져오기 (이메일 확인용)
    const { data: authData } = await supabase.auth.getUser()
    console.log("현재 로그인한 사용자:", authData?.user)

    // 이메일 정보 추가
    const usersWithEmail = await Promise.all(
      profiles.map(async (profile) => {
        // 현재 로그인한 사용자의 이메일 사용 (자신의 이메일은 볼 수 있음)
        if (authData?.user && profile.id === authData.user.id) {
          return {
            ...profile,
            email: authData.user.email || "이메일 없음",
          }
        }

        // 이메일 정보가 없는 경우 기본값 설정
        return {
          ...profile,
          email: profile.email || "이메일 없음", // 프로필에 이메일 필드가 있으면 사용
        }
      }),
    )

    console.log("가져온 사용자 데이터:", usersWithEmail)

    // 데이터가 없거나 너무 적으면 임시 데이터 추가
    if (usersWithEmail.length < 2) {
      console.warn("사용자 데이터가 부족하여 임시 데이터를 추가합니다.")

      // 현재 로그인한 사용자가 있으면 그 정보 유지
      const currentUser = authData?.user ? usersWithEmail.find((user) => user.id === authData.user.id) : null

      const mockUsers = [
        currentUser || {
          id: "eb22e17a-d715-42e4-ac27-254016bcce7d",
          email: "admin@example.com",
          name: "관리자",
          role: "admin",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "fb33e18b-e826-53f5-bd38-365127cddf8e",
          email: "student1@example.com",
          name: "홍길동",
          role: "user",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "ac44f29c-f937-64g6-ce49-476238deeg9f",
          email: "student2@example.com",
          name: "김철수",
          role: "user",
          status: "blocked",
          created_at: new Date().toISOString(),
        },
      ]

      // 현재 사용자가 있으면 중복 제거
      return currentUser ? [currentUser, ...mockUsers.slice(1)] : mockUsers
    }

    return usersWithEmail
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

// 사용자 상태 업데이트 (차단/활성화)
export async function updateUserStatus(userId: string, status: UserStatus): Promise<void> {
  try {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", userId)

    if (error) throw error
  } catch (error) {
    console.error("Error updating user status:", error)
    throw error
  }
}

// 사용자 역할 업데이트
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  try {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

    if (error) throw error
  } catch (error) {
    console.error("Error updating user role:", error)
    throw error
  }
}

// 모든 강의 가져오기
export async function getAllCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching courses:", error)
    throw error
  }
}

// 강의 가져오기
export async function getCourse(courseId: string): Promise<Course | null> {
  try {
    // courseId가 유효하지 않은 경우 처리
    if (!courseId || courseId === "new" || courseId === "undefined") {
      console.log("유효하지 않은 courseId:", courseId)
      return null
    }

    // API를 통해 강의 정보 가져오기
    const response = await fetch(`/api/admin/courses/${courseId}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "강의 정보를 가져오는 중 오류가 발생했습니다.")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching course:", error)
    throw error
  }
}

// 강의 생성
export async function createCourse(course: Omit<Course, "id" | "created_at" | "updated_at">): Promise<Course> {
  try {
    console.log("강의 생성 요청:", course)

    // 필수 필드 확인
    if (!course.title || !course.description || !course.instructor_id) {
      throw new Error("필수 필드가 누락되었습니다: 제목, 설명, 강사 ID는 필수입니다.")
    }

    // API 라우트를 통해 강의 생성
    const response = await fetch("/api/admin/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "강의 생성 중 오류가 발생했습니다.")
    }

    const data = await response.json()
    console.log("강의 생성 성공:", data)
    return data
  } catch (error) {
    console.error("Error creating course:", error)
    throw error
  }
}

// 강의 업데이트
export async function updateCourse(courseId: string, course: Partial<Course>): Promise<Course> {
  try {
    console.log("강의 업데이트 요청:", { courseId, course })

    // courseId 확인
    if (!courseId) {
      throw new Error("강의 ID가 필요합니다.")
    }

    // 명시적으로 "new"인 경우 오류 발생
    if (courseId === "new") {
      throw new Error("유효하지 않은 강의 ID입니다. 새 강의는 createCourse 함수를 사용하세요.")
    }

    // API 라우트를 통해 강의 업데이트
    const response = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId, courseData: course }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "강의 업데이트 중 오류가 발생했습니다.")
    }

    const data = await response.json()
    console.log("강의 업데이트 성공:", data)
    return data
  } catch (error) {
    console.error("Error updating course:", error)
    throw error
  }
}

// 강의 삭제
export async function deleteCourse(courseId: string): Promise<void> {
  try {
    const { error } = await supabase.from("courses").delete().eq("id", courseId)

    if (error) throw error
  } catch (error) {
    console.error("Error deleting course:", error)
    throw error
  }
}

// 모듈 생성 함수를 수정하여 API 라우트를 사용하도록 합니다.
export async function createModule(module: Omit<Module, "id">): Promise<Module> {
  try {
    console.log("모듈 생성 요청:", module)

    // 필수 필드 확인
    if (!module.course_id || !module.title) {
      throw new Error("필수 필드가 누락되었습니다: 강의 ID와 제목은 필수입니다.")
    }

    // API 라우트를 통해 모듈 생성
    const response = await fetch("/api/admin/modules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(module),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "모듈 생성 중 오류가 발생했습니다.")
    }

    const data = await response.json()
    console.log("모듈 생성 성공:", data)
    return data
  } catch (error) {
    console.error("Error creating module:", error)
    throw error
  }
}

// 강의 모듈 가져오기
export async function getCourseModules(courseId: string): Promise<Module[]> {
  try {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching modules:", error)
    throw error
  }
}

// 모듈 강의 가져오기
export async function getModuleLectures(moduleId: string): Promise<Lecture[]> {
  try {
    const { data, error } = await supabase
      .from("lectures")
      .select("*")
      .eq("module_id", moduleId)
      .order("order", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching lectures:", error)
    throw error
  }
}

// 모듈 업데이트
export async function updateModule(moduleId: string, moduleData: Partial<Module>): Promise<Module> {
  try {
    console.log("모듈 업데이트 요청:", { moduleId, moduleData })

    // moduleId 확인
    if (!moduleId) {
      throw new Error("모듈 ID가 필요합니다.")
    }

    // API 라우트를 통해 모듈 업데이트
    const response = await fetch(`/api/admin/modules/${moduleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moduleData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "모듈 업데이트 중 오류가 발생했습니다.")
    }

    const data = await response.json()
    console.log("모듈 업데이트 성공:", data)
    return data
  } catch (error) {
    console.error("Error updating module:", error)
    throw error
  }
}

// 강의 생성
export async function createLecture(lectureData: Partial<Lecture>): Promise<Lecture> {
  try {
    console.log("강의 생성 요청:", lectureData)

    // 필수 필드 확인
    if (!lectureData.module_id || !lectureData.title || !lectureData.type) {
      throw new Error("필수 필드가 누락되었습니다: 모듈 ID, 제목, 유형은 필수입니다.")
    }

    // API 라우트를 통해 강의 생성
    const response = await fetch("/api/admin/lectures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lectureData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "강의 생성 중 오류가 발생했습니다.")
    }

    const data = await response.json()
    console.log("강의 생성 성공:", data)
    return data
  } catch (error) {
    console.error("Error creating lecture:", error)
    throw error
  }
}

// 강의 업데이트
export async function updateLecture(lectureId: string, lectureData: Partial<Lecture>): Promise<Lecture> {
  try {
    console.log("강의 업데이트 요청:", { lectureId, lectureData })

    // lectureId 확인
    if (!lectureId) {
      throw new Error("강의 ID가 필요합니다.")
    }

    // API 라우트를 통해 강의 업데이트
    const response = await fetch("/api/admin/lectures", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lectureId, lectureData }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "강의 업데이트 중 오류가 발생했습니다.")
    }

    const data = await response.json()
    console.log("강의 업데이트 성공:", data)
    return data
  } catch (error) {
    console.error("Error updating lecture:", error)
    throw error
  }
}

// 강의 삭제
export async function deleteLecture(lectureId: string): Promise<void> {
  try {
    console.log("강의 삭제 요청:", { lectureId })

    // lectureId 확인
    if (!lectureId) {
      throw new Error("강의 ID가 필요합니다.")
    }

    // API 라우트를 통해 강의 삭제
    const response = await fetch(`/api/admin/lectures/${lectureId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "강의 삭제 중 오류가 발생했습니다.")
    }

    console.log("강의 삭제 성공")
  } catch (error) {
    console.error("Error deleting lecture:", error)
    throw error
  }
}

