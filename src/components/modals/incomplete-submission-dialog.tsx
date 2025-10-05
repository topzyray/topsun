import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SanitizedQuestion } from "../../../types";
import SubmitButton from "../buttons/SubmitButton";
import { MutableRefObject } from "react";
import CancelButton from "../buttons/CancelButton";

interface IncompleteSubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitAnyway: () => void;
  isSubmitting: boolean;
  hasSubmittedRef: MutableRefObject<boolean>;
  unansweredQuestions: SanitizedQuestion[];
  allQuestions: SanitizedQuestion[];
  goToQuestion: (questionId: string) => void;
}

export default function IncompleteSubmissionDialog({
  open,
  onClose,
  onSubmitAnyway,
  isSubmitting,
  hasSubmittedRef,
  unansweredQuestions,
  allQuestions,
  goToQuestion,
}: IncompleteSubmissionDialogProps) {
  const percentage = Math.round((unansweredQuestions.length / allQuestions.length) * 100);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xs sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unanswered Questions</DialogTitle>
          <DialogDescription>
            <p>
              You have <span className="font-semibold">{unansweredQuestions.length}</span>{" "}
              unanswered question{unansweredQuestions.length !== 1 ? "s" : ""}.
            </p>
            <p className="mt-1">
              That is <span className="font-semibold text-red-600">{percentage}%</span> of the exam.
            </p>
            <div className="flex flex-wrap gap-2">
              {unansweredQuestions.map((q) => (
                <button
                  key={q._id}
                  onClick={() => {
                    goToQuestion(q._id);
                    onClose();
                  }}
                  className="h-10 w-10 rounded-full bg-red-200 text-sm font-medium text-red-800 hover:bg-red-300"
                >
                  {q.question_shuffled_number}
                </button>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <CancelButton text="Cancel" variant="outline" onClose={onClose} />
          </DialogClose>

          <SubmitButton
            loading={isSubmitting}
            text="Submit Anyway"
            disabled={isSubmitting || hasSubmittedRef.current}
            onSubmit={onSubmitAnyway}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
