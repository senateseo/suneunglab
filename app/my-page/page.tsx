"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";

// Function to fetch enrolled courses
async function getEnrolledCourses(userId: string): Promise<any[]> {
  try {
    // Fetch data from the new API endpoint
    // Note: Using a relative path works because this fetch runs server-side in Next.js
    // You might need the full URL if fetching client-side or in different environments
    const response = await fetch("/api/users/enrollments?userId=" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      // Log the error for debugging
      console.error(
        `Error fetching enrolled courses: ${response.status} ${response.statusText}`
      );
      // You might want to return an empty array or throw an error
      // depending on how you want to handle errors downstream
      return [];
    }

    const courses: any[] = await response.json();
    return courses;
  } catch (error) {
    console.error("Failed to fetch enrolled courses:", error);
    return []; // Return empty array on error
  }
}

// Make the component async
export default function MyLecturesPage() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchEnrolledCourses = async () => {
        try {
          setIsLoading(true);
          const courses = await getEnrolledCourses(user.id);

          console.log("ENROLLMENT API: 수강 강의 목록", { courses });
          setEnrolledCourses(courses);
        } catch (error) {
          console.error("Failed to fetch enrolled courses:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEnrolledCourses();
    }
  }, [user]);

  // TODO: Add logic to fetch lastAccessed, progress, and nextLesson for each course.
  // The current API only returns basic course info. You'll need to either:
  // 1. Enhance the /api/users/enrollments endpoint to include this data.
  // 2. Fetch progress data separately (e.g., from /api/users/progress) and merge it.
  // For now, we'll use placeholders or default values.

  const coursesWithDummyProgress = enrolledCourses.map((course) => ({
    ...course,
    progress: course.progress, // Placeholder
    image: course.image_url || "/placeholder.svg", // Map image_url
    id: course.id, // Ensure id is present
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">내 강의</h1>
      </div>

      <div className="space-y-6">
        {/* Use the fetched and processed data */}
        {coursesWithDummyProgress.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/4">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground mb-2 md:mb-0"></div>
                    <div className="flex items-center text-sm">
                      {/* Display placeholder or actual data */}
                      <span className="font-medium">
                        {course.progress}% 완료
                      </span>
                    </div>
                  </div>
                  {/* Use placeholder or actual data */}
                  <Progress value={course.progress} className="h-2 mb-4" />
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div></div>
                    <Button className="mt-4 md:mt-0" asChild>
                      {/* Ensure the link uses the correct course ID */}
                      <Link href={`/courses/${course.id}/lectures`}>
                        강의보기
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Use the fetched data length */}
        {coursesWithDummyProgress.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              아직 등록한 강의가 없습니다.
            </p>
            <Button asChild>
              <Link href="/courses">강의 둘러보기</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Define a basic Course type (adjust based on your actual data structure)
// You might want to move this to a shared types file (e.g., @/types/course.ts)
// interface Course {
//   id: string;
//   title: string;
//   description?: string;
//   image_url?: string;
//   category?: string;
//   created_at?: string;
//   // Add other fields returned by your API as needed
// }
