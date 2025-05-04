import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Helper function to calculate progress for a single course
async function calculateCourseProgress(courseId: string, userId: string): Promise<number> {
  try {
    // 1. Get all module IDs for the course
    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("id")
      .eq("course_id", courseId)

    if (modulesError || !modules || modules.length === 0) {
      if (modulesError) console.error(`Error fetching modules for course ${courseId}:`, modulesError)
      return 0 // No modules, no progress
    }
    const moduleIds = modules.map((m) => m.id)

    // 2. Get all lecture IDs for these modules
    const { data: lectures, error: lecturesError } = await supabase
      .from("lectures")
      .select("id")
      .in("module_id", moduleIds)

    if (lecturesError || !lectures || lectures.length === 0) {
      if (lecturesError) console.error(`Error fetching lectures for course ${courseId}:`, lecturesError)
      return 0 // No lectures, no progress
    }
    const lectureIds = lectures.map((l) => l.id)
    const totalLectures = lectureIds.length

    // 3. Get completed lecture progress for this user and these lectures
    const { count: completedCount, error: progressError } = await supabase
      .from("lecture_progress")
      .select("*", { count: "exact", head: true }) // Only count, don't fetch data
      .eq("user_id", userId)
      .in("lecture_id", lectureIds)
      .eq("completed", true)


    if (progressError) {
      console.error(`Error fetching progress for user ${userId}, course ${courseId}:`, progressError)
      return 0 // Treat error as 0 progress for safety
    }

    // 4. Calculate percentage
    const progress = totalLectures > 0 ? Math.round(( (completedCount ?? 0) / totalLectures) * 100) : 0
    return progress

  } catch (error) {
      console.error(`Unexpected error calculating progress for course ${courseId}:`, error);
      return 0;
  }
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "사용자 ID가 필요합니다." }, { status: 400 })
    }

    console.log(`API: Fetching enrollments for user ${userId}`)

    // 1. Query enrollments joined with basic course details
    const { data: enrollmentsData, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select(
        `
        course_id,
        courses (
          id,
          title,
          description,
          image_url,
          category,
          created_at
        )
      `,
      )
      .eq("user_id", userId)

    if (enrollmentsError) {
      console.error("API: Error fetching enrollments:", enrollmentsError)
      return NextResponse.json({ error: enrollmentsError.message }, { status: 500 })
    }

    if (!enrollmentsData) {
        return NextResponse.json([]) // No enrollments found
    }

    // 2. Calculate progress for each course concurrently
    const coursesWithProgressPromises = enrollmentsData.map(async (enrollment) => {
        if (!enrollment.courses) return null; // Handle cases where course data might be missing

        const course = enrollment.courses;
        const progress = await calculateCourseProgress(course.id, userId);

        return {
            ...course,
            progress: progress,
        };
    });

    const enrolledCoursesWithProgress = (await Promise.all(coursesWithProgressPromises))
                                          .filter(course => course !== null); // Filter out any nulls


    console.log(`API: Found ${enrolledCoursesWithProgress.length} enrollments with progress for user ${userId}`)

    // 3. Return the list of courses with calculated progress
    return NextResponse.json(enrolledCoursesWithProgress)

  } catch (error: any) {
    console.error("API: Unexpected error fetching enrollments:", error)
    return NextResponse.json(
      { error: error.message || "등록된 강의 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
} 