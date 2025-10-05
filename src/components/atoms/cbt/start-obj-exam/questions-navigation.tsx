import { Card, CardContent } from "@/components/ui/card";
import { Dispatch, SetStateAction } from "react";
import { SanitizedQuestion } from "../../../../../types";
import { Switch } from "@/components/ui/switch";
import TooltipComponent from "@/components/info/tool-tip";
import { Separator } from "@/components/ui/separator";

interface QuestionNavigation {
  getQuestionStatus: (id: string) => "answered" | "unanswered";
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  PAGE_SIZE: number;
  questions: SanitizedQuestion[];
  showOnlyUnanswered: any;
  setShowOnlyUnanswered: any;
  className?: string;
}
export default function QuestionNavigation({
  getQuestionStatus,
  page,
  setPage,
  PAGE_SIZE,
  questions,
  showOnlyUnanswered,
  setShowOnlyUnanswered,
  className,
}: QuestionNavigation) {
  return (
    <Card
      className={`sticky top-20 hidden w-full max-w-sm py-6 shadow-md lg:mt-10 lg:block ${className}`}
    >
      <CardContent className="space-y-4 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="hidden text-lg font-semibold lg:block lg:text-xl">Quick Naviagation</h2>
          <div className="flex items-center gap-2">
            <span className="text-lg lg:text-sm">
              {!showOnlyUnanswered ? "Unanswered Only" : "Show All"}
            </span>
            <Switch checked={showOnlyUnanswered} onCheckedChange={setShowOnlyUnanswered} />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-5 gap-2">
          {questions
            .filter((q) => (showOnlyUnanswered ? getQuestionStatus(q._id) === "unanswered" : true))
            .map((q) => {
              const isAnswered = getQuestionStatus(q._id) === "answered";
              const globalIndex = questions.findIndex((x) => x._id === q._id);
              const isActive = page === Math.floor(globalIndex / PAGE_SIZE);

              return (
                <TooltipComponent
                  key={q._id}
                  trigger={
                    <button
                      type="button"
                      onClick={() => setPage(Math.floor(globalIndex / PAGE_SIZE))}
                      className={`h-10 w-10 rounded-full text-base font-medium transition-colors ${
                        isAnswered
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-200 text-red-700 hover:bg-red-300"
                      } ${isActive ? "ring-primary ring-2" : ""} `}
                    >
                      {q.question_shuffled_number}
                    </button>
                  }
                  message={<p className="max-w-[200px] text-sm">{q.question_text}</p>}
                />
              );
            })}
        </div>

        <p className="text-muted-foreground mt-4 text-center text-sm">
          <span className="text-xl font-bold text-green-600">●</span> Answered &nbsp;|&nbsp;
          <span className="text-xl font-bold text-red-200">●</span> Unanswered
        </p>
      </CardContent>
    </Card>
  );
}
