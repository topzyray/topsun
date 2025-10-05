import StartOBJExam from "@/components/pages/cbt/students/start-obj-exam";

export default async function StartOBJExamPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return (
    <div>
      <StartOBJExam params={await params} />
    </div>
  );
}
