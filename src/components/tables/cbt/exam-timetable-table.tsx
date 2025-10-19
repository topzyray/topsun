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
import {
  ArrowUpDown,
  BadgeInfoIcon,
  ChevronDown,
  Edit,
  MoreHorizontal,
  Trash,
  X,
} from "lucide-react";

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
import { ClassExamTimetable, ScheduledTimetableSubject } from "../../../../types";
import { Checkbox } from "@/components/ui/checkbox";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { TextHelper } from "@/helpers/TextHelper";
import { CbtApiService } from "@/api/services/CbtApiService";
import { GlobalContext } from "@/providers/global-state-provider";
import { ExamStatusTypeEnum } from "@/api/enums/ExamStatusTypeEnum";
import { UpdateTermClassTimetableForm } from "@/components/forms/cbt/updateTermClassTimetableForm";
import toast from "react-hot-toast";
import TooltipComponent from "@/components/info/tool-tip";

const ActionCell = ({ row }: { row: any }) => {
  const Session = row.original;

  const handleEndExam = (examData: any) => {
    // TODO
    // Add all the logic to end this exam
    console.log(examData);

    toast("This feature is pending! ID to delete: " + examData?._id, {
      style: {
        backgroundColor: "lightgreen",
      },
      icon: <BadgeInfoIcon size={15} />,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-2">
        <UpdateTermClassTimetableForm
          trigger={
            <TooltipComponent
              trigger={
                <Button variant="outline" size="sm">
                  <Edit size={16} />
                </Button>
              }
              message={<span>Edit Exam</span>}
            />
          }
          initialData={Session}
          onSuccess={() => {}}
        />

        <TooltipComponent
          trigger={
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                handleEndExam(Session);
              }}
            >
              <X size={16} />
            </Button>
          }
          message={<span>End Exam</span>}
        />

        <TooltipComponent
          trigger={
            <Button
              variant="destructive"
              size="sm"
              // onClick={() => onDelete(business.id)}
            >
              <Trash size={16} />
            </Button>
          }
          message={<span>Delete Entry</span>}
        />
      </div>
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

export const columns: ColumnDef<ScheduledTimetableSubject>[] = [
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
    accessorKey: "exam_subject_status",
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
    cell: ({ row }) => {
      const examSubjectStatus: string = row.getValue("exam_subject_status");
      let statusColor: string = "";
      switch (examSubjectStatus) {
        case ExamStatusTypeEnum.NOT_STARTED:
          statusColor = "text-red-600";
          break;
        case ExamStatusTypeEnum.ONGOING:
          statusColor = "text-green-600";
          break;
        case ExamStatusTypeEnum.ENDED:
          statusColor = "text-red-600";
          break;
        case ExamStatusTypeEnum.SUBMITTED:
          statusColor = "text-gray-600";
          break;
        default:
          statusColor = "";
          break;
      }

      return (
        <div className={`text-nowrap capitalize ${statusColor}`}>
          {examSubjectStatus && examSubjectStatus.split("_").join(" ")}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.subject_id?.name,
    id: "subject_name",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Subject
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => <div className="text-nowrap capitalize">{row.getValue("subject_name")}</div>,
  },
  {
    accessorKey: "is_subject_question_set",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          OBJ Questions Exist
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div
        className={`text-nowrap capitalize ${
          row.getValue("is_subject_question_set") ? "text-green-600" : "text-red-600"
        }`}
      >
        {row.getValue("is_subject_question_set") ? "Yes" : "No"}
      </div>
    ),
  },
  {
    accessorKey: "authorized_students",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Students Authorized
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => {
      const authorized_students: string[] | [] = row.getValue("authorized_students");
      return <div className="text-nowrap capitalize">{authorized_students.length}</div>;
    },
  },
  {
    accessorKey: "students_that_have_started",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Students Writing
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => {
      const students_that_have_started: string[] | [] = row.getValue("students_that_have_started");
      return <div className="text-nowrap capitalize">{students_that_have_started.length}</div>;
    },
  },
  {
    accessorKey: "students_that_have_submitted",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Students Submitted
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => {
      const students_that_have_submitted: string[] | [] = row.getValue(
        "students_that_have_submitted",
      );
      return <div className="text-nowrap capitalize">{students_that_have_submitted.length}</div>;
    },
  },
  {
    accessorFn: (row) => row?.start_time,
    id: "exam_date",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Exam Date
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="text-nowrap capitalize">
        {TextHelper.getFormattedDate(row.getValue("exam_date"))}
      </div>
    ),
  },
  {
    accessorFn: (row) => row?.start_time,
    id: "exam_start_time",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Start Time
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="text-nowrap capitalize">
        {TextHelper.getFormattedTime(row.getValue("exam_start_time"))}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Duration
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="text-nowrap">{TextHelper.getFormattedDuration(row.getValue("duration"))}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    accessorKey: "actions",
    header: () => {
      return (
        <p className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap">Actions</p>
      );
    },
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export function ExamTimetableTable({ params }: { params: Record<string, any> }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { activeSessionData } = React.useContext(GlobalContext);

  let { data, isLoading, isError, error } = useCustomQuery(
    ["timetable", params.class_id],
    () =>
      CbtApiService.getTermClassExamTimetable({
        academic_session_id: activeSessionData?.activeSession?._id as string,
        class_id: params.class_id,
        term: activeSessionData?.activeTerm?.name as string,
      }),
    {},
    activeSessionData?.activeSession?._id !== undefined ||
      activeSessionData?.activeTerm?.name !== undefined,
  );

  const classTimetable: ClassExamTimetable = data?.timetable != undefined && data?.timetable;
  data = data?.timetable != undefined && data?.timetable;

  data =
    classTimetable?.scheduled_subjects !== undefined &&
    classTimetable?.scheduled_subjects.length &&
    classTimetable?.scheduled_subjects;

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
          value={(table.getColumn("subject_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("subject_name")?.setFilterValue(event.target.value)}
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
                <TableCell colSpan={columns.length} className="h-24">
                  <CircularLoader text="Loading timetable data" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-600 capitalize"
                >
                  {extractErrorMessage(error)}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <CircularLoader text="Please wait" />
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
