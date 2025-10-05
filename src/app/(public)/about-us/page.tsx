import PagesHero from "@/components/atoms/pages-hero";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="h-full min-h-screen w-full">
      <div>
        <PagesHero text="About Us" />
      </div>
      <div className="mx-auto h-full w-full bg-gradient-to-tr from-slate-50 to-blue-50 py-0 lg:py-8 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto flex w-full flex-col">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10">
            <section className="space-y-12 px-4 md:px-20">
              {/* Intro */}
              <div className="mx-auto max-w-4xl space-y-4 text-center">
                <p className="text-lg">
                  At <strong>Klazikschools</strong>, we believe that education thrives when school
                  operations run smoothly. Our platform is a comprehensive, cloud-based multi-school
                  management system designed to connect administrators, teachers, students, and
                  parents under one powerful, easy-to-use digital roof.
                </p>
              </div>

              {/* Who We Are */}
              <Card className="bg-gradient-to-lr flex h-full flex-col items-center gap-8 rounded-2xl border border-gray-100 from-white to-gray-50 p-4 shadow-lg transition-all duration-300 hover:shadow-2xl md:flex-row lg:p-8 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                <div className="mt-6 w-full md:mt-0 md:w-1/2">
                  <Image
                    src="/svgs/team_work.svg"
                    alt="Our Team"
                    width={600}
                    height={500}
                    className="h-full w-full rounded-2xl object-cover shadow-lg"
                  />
                </div>
                <CardContent className="mt-0 w-full space-y-4 md:mt-6 md:w-1/2">
                  <h3 className="text-2xl font-semibold">Who We Are</h3>
                  <p>
                    We are a team of passionate developers, educators, and technology experts
                    dedicated to solving the everyday challenges faced by schools. Our goal is
                    simple: to help educational institutions streamline operations, enhance
                    communication, and make data-driven decisions with confidence.
                  </p>
                </CardContent>
              </Card>

              {/* What We Do */}
              <Card className="bg-gradient-to-lr flex h-full flex-col-reverse items-center gap-8 rounded-2xl border border-gray-100 from-white to-gray-50 p-4 shadow-lg transition-all duration-300 hover:shadow-2xl md:flex-row lg:p-8 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="mt-0 w-full space-y-4 md:mt-6 md:w-1/2">
                  <h3 className="text-2xl font-semibold">What We Do</h3>
                  <ul className="list-disc space-y-2 text-base md:pl-5">
                    <li>Centralized student and staff management</li>
                    <li>Automated attendance tracking</li>
                    <li>Grade and performance reporting</li>
                    <li>Class scheduling and timetables</li>
                    <li>Fee and payment management</li>
                    <li>Real-time communication and support</li>
                    <li>Parent and student portals</li>
                  </ul>
                </CardContent>
                <div className="mt-6 w-full md:mt-0 md:w-1/2">
                  <Image
                    src="/svgs/dashboard.svg"
                    alt="Dashboard"
                    width={600}
                    height={400}
                    className="rounded-2xl object-cover shadow-lg"
                  />
                </div>
              </Card>

              {/* Mission */}
              <Card className="bg-gradient-to-lr h-full rounded-2xl border border-gray-100 from-white to-gray-50 p-4 shadow-lg transition-all duration-300 hover:shadow-2xl lg:p-8 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                <CardContent>
                  <h3 className="mb-2 text-2xl font-semibold">Our Mission</h3>
                  <p>
                    To empower schools with modern technology that simplifies administrative tasks,
                    improves transparency, and supports academic excellence across multiple
                    campuses.
                  </p>
                </CardContent>
              </Card>

              {/* Vision */}
              <Card className="bg-gradient-to-lr h-full rounded-2xl border border-gray-100 from-white to-gray-50 p-4 shadow-lg transition-all duration-300 hover:shadow-2xl lg:p-8 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                <CardContent>
                  <h3 className="mb-2 text-2xl font-semibold">Our Vision</h3>
                  <p>
                    To become the leading school management solution globally by offering
                    innovation, reliability, and outstanding customer support.
                  </p>
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card className="bg-gradient-to-lr h-full rounded-2xl border border-gray-100 from-white to-gray-50 p-4 shadow-lg transition-all duration-300 hover:shadow-2xl lg:p-8 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                <CardContent>
                  <h3 className="mb-4 text-2xl font-semibold">Why Choose Us?</h3>
                  <ul className="list-disc space-y-2 pl-5 text-base">
                    <li>Built for multi-school operations</li>
                    <li>User-friendly interface</li>
                    <li>Robust data security and privacy standards</li>
                    <li>24/7 support and onboarding assistance</li>
                    <li>Regular updates and new features based on your feedback</li>
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
