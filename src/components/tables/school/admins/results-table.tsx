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
import { TermResult } from "../../../../../types";
import { Checkbox } from "../../../ui/checkbox";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useRouter } from "next/navigation";
import { ResultApiService } from "@/api/services/ResultApiService";
import TooltipComponent from "@/components/info/tool-tip";

const ActionCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const Session = row.original;

  return (
    <div className="flex items-center gap-1">
      <TooltipComponent
        trigger={
          <Button
            onClick={() => router.push(`results/${Session._id}`)}
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<TermResult>[] = [
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
    accessorFn: (row) => row.academicDetails.academic_session,
    id: "academic_session",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          <TooltipComponent
            trigger={<span>Session</span>}
            message={<span>Academic Session</span>}
          />
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="text-nowrap capitalize">{row.getValue("academic_session")}</div>
    ),
  },
  {
    accessorKey: "term",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Term
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => {
      const term: string = row.getValue("term");
      return <div className="text-nowrap capitalize">{term && term.split("_").join(" ")}</div>;
    },
  },
  {
    accessorFn: (row) => row.classDetails.name,
    id: "class_name",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Class Name
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => <div className="text-nowrap capitalize">{row.getValue("class_name")}</div>,
  },
  {
    accessorKey: "class_position",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Class Position
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-nowrap capitalize">{row.getValue("class_position") || "Pending"}</div>
      );
    },
  },
  {
    accessorKey: "cumulative_score",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          <TooltipComponent
            trigger={<span>Cum. Score</span>}
            message={<span>Cumulative Score</span>}
          />
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => {
      return <div className="text-nowrap capitalize">{row.getValue("cumulative_score")}</div>;
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return (
  //       <p
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="flex items-center gap-2 text-nowrap cursor-pointer max-w-max"
  //       >
  //         Date Created
  //         <ArrowUpDown size={16} />
  //       </p>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="capitalize text-nowrap">
  //       {TextHelper.getFormattedDate(row.getValue("createdAt"))}
  //     </div>
  //   ),
  // },
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

export function ResultsTable({ student_id }: Record<string, any>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  let { data, isLoading, isError, error } = useCustomQuery(
    ["results"],
    () => ResultApiService.getAllResultsOfAStudent(student_id),
    { id: student_id },
  );

  data = data?.results !== undefined && data?.results;

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
                  <CircularLoader text="Loading results data" />
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
                  No result data available.
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
