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
import { TeacherApiService } from "@/api/services/TeacherApiService";
import { Teacher } from "../../../../../types";
import { Checkbox } from "../../../ui/checkbox";
import { CircularLoader } from "../../../loaders/page-level-loader";
import AssignTeacherToClass from "@/components/forms/school/admins/asign-teacher-to-class";
import AssignTeacherToSubject from "@/components/forms/school/admins/asign-teacher-to-subject";
import { debounce } from "@/utils/debounce";
import { handlePageChange } from "@/utils/pagination-utils";
import TeacherOnboardingForm from "@/components/pages/school/admins/teacher-onboarding";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import ModalComponent from "@/components/modals/base/modal-component";
import { TextHelper } from "@/helpers/TextHelper";
import { useRouter } from "next/navigation";
import ChangeClassTeacher from "@/components/forms/school/admins/change-class-teacher";
import TooltipComponent from "@/components/info/tool-tip";

const ActionCell = ({ row }: { row: any }) => {
  const [openAssignTeacherToClassForm, setOpenAssignTeacherToClassForm] = React.useState(false);
  const [openAssignTeacherToSubjectForm, setOpenAssignTeacherToSubjectForm] = React.useState(false);
  const [openOnboardTeacherForm, setOpenOnboardTeacherForm] = React.useState(false);
  const [openChangeClassForm, setOpenChangeClassTeacherForm] = React.useState(false);
  const Session = row.original;
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <TooltipComponent
        trigger={
          <Button
            onClick={() => router.push(`teachers/${Session._id}`)}
            variant="outline"
            size="icon"
            className="hover:text-primary"
          >
            <View size={16} className="hover:text-primary cursor-pointer" />
          </Button>
        }
        message={<span>View Details For {TextHelper.capitalizeWords(Session.first_name)}</span>}
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
          <DropdownMenuItem
            onClick={() => setOpenOnboardTeacherForm(true)}
            className="cursor-pointer"
          >
            Onboard Teacher
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenAssignTeacherToSubjectForm(true)}
            className="cursor-pointer"
          >
            Assign To Subject
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenAssignTeacherToClassForm(true)}
            className="cursor-pointer"
            disabled={!!Session?.class_managing}
          >
            Assign To Class
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenChangeClassTeacherForm(true)}>
            Change Class Managing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Component onboarding teacher */}
      <ModalComponent
        open={openOnboardTeacherForm}
        onClose={() => setOpenOnboardTeacherForm(false)}
        className=""
      >
        <TeacherOnboardingForm
          teacher_id={Session._id}
          onClose={() => {
            setOpenOnboardTeacherForm(false);
          }}
          closeOnSuccess={() => {
            setOpenOnboardTeacherForm(false);
          }}
        />
      </ModalComponent>

      {/* Component for assigning teacher to class */}
      <ModalComponent
        open={openAssignTeacherToClassForm}
        onClose={() => setOpenAssignTeacherToClassForm(false)}
        className=""
      >
        <AssignTeacherToClass
          teacher_id={Session._id}
          onClose={() => {
            setOpenAssignTeacherToClassForm(false);
          }}
          closeOnSuccess={() => {
            setOpenAssignTeacherToClassForm(false);
          }}
        />
      </ModalComponent>

      {/* Component for assigning teacher to subject */}
      <ModalComponent
        open={openAssignTeacherToSubjectForm}
        onClose={() => setOpenAssignTeacherToSubjectForm(false)}
        className=""
      >
        <AssignTeacherToSubject
          teacher_data={Session}
          onClose={() => {
            setOpenAssignTeacherToSubjectForm(false);
          }}
          closeOnSuccess={() => {
            setOpenAssignTeacherToSubjectForm(false);
          }}
        />
      </ModalComponent>

      {/* Handle change class teacher */}
      <ModalComponent
        open={openChangeClassForm}
        onClose={() => setOpenChangeClassTeacherForm(false)}
      >
        <ChangeClassTeacher
          action_from="teacher"
          teacher_id={Session._id}
          onClose={() => setOpenChangeClassTeacherForm(false)}
          closeOnSuccess={() => setOpenChangeClassTeacherForm(false)}
        />
      </ModalComponent>
    </div>
  );
};

export const columns: ColumnDef<Teacher>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const teacher_status: string = row.getValue("status");
      let color;
      switch (teacher_status) {
        case "active":
          color = "text-green-600";
          break;
        case "inactive":
          color = "text-gray-600";
          break;
        case "sacked":
          color = "text-red-600";
          break;
        case "resigned":
          color = "text-yellow-600";
          break;
        default:
          color = "";
          break;
      }

      return <div className={`capitalize ${color}`}>{teacher_status}</div>;
    },
  },
  {
    accessorKey: "is_verified",
    header: "Verified",
    cell: ({ row }) => {
      const student_verification_status: string = row.getValue("is_verified");

      let color = student_verification_status ? "text-green-600" : "text-orange-600";
      return (
        <div className={`capitalize ${color}`}>
          {student_verification_status ? "True" : "False"}
        </div>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          First name
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{TextHelper.capitalize(row.getValue("first_name"))}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Last name
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{TextHelper.capitalize(row.getValue("last_name"))}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Email
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => <div className="text-nowrap">{row.getValue("email")}</div>,
  },
  {
    accessorFn: (row) => row.class_managing?.name,
    id: "class_teacher_manages",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Class Managing
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div
        className={`text-nowrap ${
          row.getValue("class_teacher_manages") ? "text-green-500" : "text-red-600"
        }`}
      >
        {row.getValue("class_teacher_manages") ?? "Not Assigned"}
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
      <div className="text-nowrap capitalize">
        {TextHelper.getFormattedDate(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    accessorKey: "actions",
    header: ({ column }) => {
      return (
        <p className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap">Actions</p>
      );
    },
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export function TeachersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [queryObj, setQueryObj] = React.useState({
    page: 1,
    limit: 10,
    searchParams: "",
  });

  let { data, isLoading, isError, error } = useCustomQuery(
    ["teachers"],
    TeacherApiService.getTeachers,
    queryObj,
  );

  let metaData = {
    totalPages: data?.teachers?.totalPages !== undefined ? data?.teachers?.totalPages : 0,
    totalCount: data?.teachers?.totalCount !== undefined ? data?.teachers?.totalCount : 1,
  };

  data = data?.teachers?.teacherObj !== undefined && data?.teachers?.teacherObj;

  const handleSearchChange = debounce((value: string) => {
    setQueryObj((prev) => ({
      ...prev,
      searchParams: value,
      page: 1,
    }));
  }, 300);

  const updatePage = (newPage: number) => {
    setQueryObj((prev) => ({ ...prev, page: newPage }));
  };

  const disableNext = queryObj.page >= metaData.totalPages;
  const disablePrev = queryObj.page <= 1;

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
          name="searchParams"
          value={queryObj.searchParams}
          onChange={(e) => handleSearchChange(e.target.value)}
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
                  <CircularLoader text="Loading teachers data" />
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
                  No teacher data available.
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
            onClick={() => handlePageChange("prev", queryObj.page, updatePage)}
            disabled={disablePrev}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange("next", queryObj.page, updatePage)}
            disabled={disableNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
