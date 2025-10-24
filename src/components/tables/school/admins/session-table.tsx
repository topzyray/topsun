"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionApiService } from "@/api/services/SessionApiService";
import AddNewTerm from "@/components/forms/school/admins/add-term";
import { Session, Term } from "../../../../../types";
import { Checkbox } from "../../../ui/checkbox";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import ModalComponent from "@/components/modals/base/modal-component";
import { useRouter } from "next/navigation";
import { TextHelper } from "@/helpers/TextHelper";
import { GlobalContext } from "@/providers/global-state-provider";
import TooltipComponent from "@/components/info/tool-tip";
import EndSessionAlert from "@/components/modals/end-session-alert";
import { useAuth } from "@/api/hooks/use-auth.hook";

const ActionCell = ({ row }: { row: any }) => {
  const [openNewTermForm, setOpenNewTermForm] = React.useState(false);
  const [openDeleteSessionConfirmation, setOpenDeleteSessionConfirmation] = React.useState(false);
  const { activeSessionData } = React.useContext(GlobalContext);
  const router = useRouter();
  const userDetails = useAuth()?.userDetails;
  const Session = row.original;

  return (
    <div className="flex items-center gap-1">
      <TooltipComponent
        trigger={
          <Button
            onClick={() => router.push(`sessions/${Session._id}`)}
            variant="outline"
            size="icon"
            className="hover:text-primary"
          >
            <View size={16} className="hover:text-primary cursor-pointer" />
          </Button>
        }
        message={<span>View Details</span>}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(Session._id)}
            className="cursor-copy"
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {userDetails?.role === "super_admin" && (
            <>
              <DropdownMenuItem
                disabled={Session.is_active == false || activeSessionData?.activeTerm?.is_active}
                onClick={() => setOpenNewTermForm(true)}
                className="cursor-pointer"
              >
                Create Term
              </DropdownMenuItem>

              <TooltipComponent
                trigger={
                  <DropdownMenuItem
                    className={`${Session.is_active && "text-red-600 hover:text-red-600"}`}
                    disabled={Session.is_active === false}
                    onClick={() => setOpenDeleteSessionConfirmation(true)}
                  >
                    End Session
                  </DropdownMenuItem>
                }
                message={<p className="text-base text-red-600">This action cannot be undone</p>}
              />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Component for creating term */}
      <ModalComponent open={openNewTermForm} onClose={() => setOpenNewTermForm(false)}>
        <AddNewTerm
          session_id={Session._id}
          onClose={() => {
            setOpenNewTermForm(false);
          }}
          closeOnSuccess={() => {
            setOpenNewTermForm(false);
          }}
        />
      </ModalComponent>

      {/* End session alert */}
      <ModalComponent
        open={openDeleteSessionConfirmation}
        onClose={() => setOpenDeleteSessionConfirmation(false)}
      >
        <EndSessionAlert
          session={Session}
          onClose={() => setOpenDeleteSessionConfirmation(false)}
          onSuccess={() => setOpenDeleteSessionConfirmation(false)}
        />
      </ModalComponent>
    </div>
  );
};

export const columns: ColumnDef<Session>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Status
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("is_active") ? (
          <span className="text-green-600">Active</span>
        ) : (
          <span className="text-red-600">Ended</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "academic_session",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Session
          <ArrowUpDown size={18} />
        </p>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("academic_session")}</div>,
  },
  {
    accessorKey: "terms",
    header: () => {
      return (
        <p
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Terms
        </p>
      );
    },
    cell: ({ row }) => {
      const term_data: Term[] = row.getValue("terms");
      return (
        <ul className="flex list-disc flex-col items-start justify-start">{term_data.length}</ul>
      );
    },
  },
  {
    accessorKey: "is_promotion_done",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Promotion
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-max text-center capitalize">
        {row.getValue("is_promotion_done") ? (
          <span className="text-green-600">✅</span>
        ) : (
          <span className="text-red-600">⛔</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Date Created
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-max text-center text-nowrap capitalize">
        {TextHelper.getFormattedDate(row.getValue("createdAt"))}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    accessorKey: "actions",
    header: () => {
      return (
        <p
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Actions
        </p>
      );
    },
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export function SessionTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  let { data, isLoading, isError, error } = useCustomQuery(
    ["sessions"],
    SessionApiService.getSessionsForASchool,
  );

  data = data?.session !== undefined && data?.session;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search"
          value={(table.getColumn("academic_session")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("academic_session")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <CircularLoader text="Loading sessions data" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-red-600">
                  {extractErrorMessage(error)}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No session available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
