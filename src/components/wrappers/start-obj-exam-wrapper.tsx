import { WithExamAccess } from "@/components/guards/with-exam-access";
import StartOBJExam from "../pages/cbt/students/start-obj-exam";

export default function StartOBJExamWrapper({ params }: { params: any }) {
  return (
    <WithExamAccess subjectId={params.subject_id}>
      <StartOBJExam params={params} />
    </WithExamAccess>
  );
}
