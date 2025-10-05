import PagesHero from "@/components/atoms/pages-hero";
import GetStartedGoogleForm from "@/components/forms/public/get-started-school-google-form";

export default function GetStartedPage() {
  return (
    <>
      <PagesHero text="Schedule A Call" />
      <div className="h-full w-full bg-gradient-to-tr from-slate-50 to-blue-50 py-24 pt-8 dark:from-slate-900 dark:to-slate-800">
        <GetStartedGoogleForm />
      </div>
    </>
  );
}
