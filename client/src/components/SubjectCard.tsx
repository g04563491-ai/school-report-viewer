import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Star } from "lucide-react";

interface SubjectCardProps {
  subject: string;
  level: string;
  result: string;
  grade: string;
  whatWentWell: string;
  evenBetterIf: string;
  effort: number;
  teacher: string;
}

export default function SubjectCard({
  subject,
  level,
  result,
  grade,
  whatWentWell,
  evenBetterIf,
  effort,
  teacher,
}: SubjectCardProps) {
  const [revealed, setRevealed] = useState(false);

  const renderEffortStars = (effortLevel: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= effortLevel
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden transition-smooth hover:shadow-lg hover:scale-105 hover:-translate-y-1">
      <div className="p-6">
        {/* Header: Subject name and effort */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{subject}</h3>
            {level && (
              <p className="text-sm text-muted-foreground">Level: {level}</p>
            )}
          </div>
        </div>

        {/* Effort indicator */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Effort:
          </span>
          {renderEffortStars(effort)}
        </div>

        {/* Spoiler section */}
        <div className="mb-4 space-y-3">
          {!revealed ? (
            <div className="rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 p-4 text-center">
              <div className="mb-2 text-sm font-semibold text-primary">
                🚨 Spoiler Alert 🚨
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Click to reveal your grade and teacher's comment
              </p>
              <Button
                onClick={() => setRevealed(true)}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Eye size={16} />
                Reveal Grade
              </Button>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Grade display */}
              <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-4">
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Your Grade
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {grade}
                  </span>
                  {result && (
                    <span className="text-sm text-muted-foreground">
                      ({result}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Teacher name */}
              <div className="text-sm">
                <span className="font-medium text-foreground">Teacher: </span>
                <span className="text-muted-foreground">{teacher}</span>
              </div>

              {/* What went well */}
              <div>
                <h4 className="mb-1 text-sm font-semibold text-primary">
                  ✨ What Went Well
                </h4>
                <p className="text-sm leading-relaxed text-foreground">
                  {whatWentWell}
                </p>
              </div>

              {/* Even better if */}
              <div>
                <h4 className="mb-1 text-sm font-semibold text-accent">
                  🚀 Even Better If
                </h4>
                <p className="text-sm leading-relaxed text-foreground">
                  {evenBetterIf}
                </p>
              </div>

              {/* Hide button */}
              <Button
                onClick={() => setRevealed(false)}
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <EyeOff size={16} />
                Hide Grade
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
