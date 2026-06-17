import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubjectCard from "@/components/SubjectCard";
import reportData from "../data/report.json";
import { Search, X } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Filter assessments based on search query
  const filteredAssessments = useMemo(() => {
    return reportData.assessments.filter((assessment) =>
      assessment.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Group assessments by grade
  const assessmentsByGrade = useMemo(() => {
    const grouped: Record<string, typeof reportData.assessments> = {};
    filteredAssessments.forEach((assessment) => {
      const grade = assessment.grade || "N/A";
      if (!grouped[grade]) {
        grouped[grade] = [];
      }
      grouped[grade].push(assessment);
    });
    return grouped;
  }, [filteredAssessments]);

  const gradeOrder = ["A", "B", "C", "D", "E", "F", "N/A"];
  const sortedGrades = gradeOrder.filter((grade) => grade in assessmentsByGrade);

  // Calculate statistics
  const stats = useMemo(() => {
    const graded = reportData.assessments.filter((a) => a.grade && a.grade !== "N/A");
    const aCount = graded.filter((a) => a.grade === "A").length;
    const bCount = graded.filter((a) => a.grade === "B").length;
    const avgEffort = Math.round(
      reportData.assessments.reduce((sum: number, a) => sum + a.effort, 0) /
        reportData.assessments.length
    );

    return { aCount, bCount, avgEffort, totalSubjects: reportData.assessments.length };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-2 text-center text-sm font-semibold text-primary">
            📚 School Report Viewer
          </div>
          <h1 className="mb-2 text-center text-4xl md:text-5xl font-bold text-foreground">
            Your Academic Journey
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Explore your achievements and discover growth opportunities
          </p>

          {/* Student Info */}
          <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-border p-6 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {reportData.student}
            </h2>
            <p className="text-muted-foreground">Class {reportData.class}</p>
            <p className="text-sm text-muted-foreground">
              {reportData.school}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-white/50 px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">
                {stats.totalSubjects}
              </div>
              <div className="text-xs text-muted-foreground">Subjects</div>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-accent">
                {stats.aCount}
              </div>
              <div className="text-xs text-muted-foreground">Grade A's</div>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">
                {stats.bCount}
              </div>
              <div className="text-xs text-muted-foreground">Grade B's</div>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">
                {stats.avgEffort}/5
              </div>
              <div className="text-xs text-muted-foreground">Avg Effort</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="border-b border-border bg-white px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Found {filteredAssessments.length} subject
              {filteredAssessments.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </section>

      {/* Subjects Section */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          {filteredAssessments.length === 0 ? (
            <div className="rounded-lg border border-border bg-white p-8 text-center">
              <p className="text-lg text-muted-foreground">
                No subjects found matching "{searchQuery}"
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <Tabs defaultValue={sortedGrades[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 mb-6">
                {sortedGrades.map((grade) => (
                  <TabsTrigger key={grade} value={grade} className="text-xs md:text-sm">
                    {grade}
                    <span className="ml-1 text-xs font-semibold">
                      ({assessmentsByGrade[grade].length})
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {sortedGrades.map((grade) => (
                <TabsContent key={grade} value={grade} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {assessmentsByGrade[grade].map((assessment: typeof reportData.assessments[0], idx: number) => (
                      <div
                        key={idx}
                        className="animate-in fade-in slide-in-from-bottom-2"
                        style={{
                          animationDelay: `${idx * 50}ms`,
                        }}
                      >
                        <SubjectCard
                          subject={assessment.subject}
                          level={assessment.level}
                          result={assessment.result}
                          grade={assessment.grade}
                          whatWentWell={assessment.what_went_well}
                          evenBetterIf={assessment.even_better_if}
                          effort={assessment.effort}
                          teacher={assessment.teacher}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      {/* Tutor Comment Section */}
      <section className="border-t border-border bg-gradient-to-br from-primary/5 to-accent/5 px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-border p-8">
            <h3 className="mb-4 text-2xl font-bold text-foreground">
              📝 Tutor's Comment
            </h3>
            <p className="leading-relaxed text-foreground">
              {reportData.tutor_comment}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          School Report Viewer • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
