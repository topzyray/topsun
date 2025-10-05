import SetOBJQuestions from "@/components/pages/school/set-obj-questions";

export default async function SetOBJQuestionsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <SetOBJQuestions params={await params} />;
}
