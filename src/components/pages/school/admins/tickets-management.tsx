import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/buttons/BackButton";
import { TicketsTable } from "@/components/tables/school/admins/tickets-table";

export default function TicketsManagementComponent() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All tickets</h2>
        </div>

        <Separator />
        <div>
          <TicketsTable />
        </div>
      </div>
    </div>
  );
}
