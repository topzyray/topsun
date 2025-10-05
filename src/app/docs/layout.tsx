import DocsHeader from "@/components/pages/docs/docs-header";
import { DocsSidebar } from "@/components/pages/docs/docs-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <DocsSidebar />
      <main className="relative max-h-screen w-full">
        <DocsHeader />
        <section className="flex pt-14">
          <section className="w-full p-4 sm:p-6">{children}</section>
        </section>
      </main>
    </SidebarProvider>
  );
}
