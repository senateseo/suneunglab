"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory]); // 카테고리가 변경될 때마다 강의 목록 다시 가져오기

  async function fetchCourses() {
    try {
      setIsLoading(true);

      // 서버 API를 통해 강의 목록 가져오기
      let url = "/api/admin/courses-list?published=true";
      if (selectedCategory !== "all") {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "강의 목록을 가져오는 중 오류가 발생했습니다."
        );
      }

      const data = await response.json();
      console.log("코스 페이지: 강의 목록 가져오기 성공", data);

      // 강의 데이터 설정
      setCourses(data || []);

      // 카테고리 추출 (모든 강의에서 카테고리 추출)
      if (selectedCategory === "all" && data && data.length > 0) {
        const uniqueCategories = [
          ...new Set(data.map((course: any) => course.category)),
        ].filter(Boolean);
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "오류 발생",
        description: "강의 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCategoryChange = (category: any) => {
    setSelectedCategory(category);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">강의</h1>
          <p className="text-muted-foreground text-lg">
            고품질 강의 컬렉션을 둘러보세요
          </p>
        </div>

        {/* <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => handleCategoryChange("all")}
            className={selectedCategory === "all" ? "bg-primary text-primary-foreground" : ""}
          >
            모든 강의
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryChange(category)}
              className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
            >
              {category}
            </Button>
          ))}
        </div> */}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden flex flex-col h-full">
              <div className="h-48 bg-muted animate-pulse"></div>
              <CardHeader>
                <div className="h-6 w-24 bg-muted animate-pulse mb-2"></div>
                <div className="h-6 w-full bg-muted animate-pulse"></div>
                <div className="h-4 w-full bg-muted animate-pulse"></div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse"></div>
                  <div className="h-4 w-32 bg-muted animate-pulse"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-10 w-full bg-muted animate-pulse"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            현재 등록된 강의가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }) {
  const getLevelColor = (level) => {
    switch (level) {
      case "초급":
        return "bg-green-100 text-green-800";
      case "중급":
        return "bg-blue-100 text-blue-800";
      case "고급":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative">
        <img
          src={
            course.image_url ||
            course.image ||
            "/placeholder.svg?height=200&width=400"
          }
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <Badge
          className={`absolute top-3 right-3 ${getLevelColor(course.level)}`}
        >
          {course.level}
        </Badge>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {course.category}
          </Badge>
        </div>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{(course.enrolled || 0).toLocaleString()}명 수강 중</span>
          </div> */}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/courses/${course.id}`}>
            <BookOpen className="mr-2 h-4 w-4" /> 강의 보기
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
