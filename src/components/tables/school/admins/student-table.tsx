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
import { Student } from "../../../../../types";
import { Checkbox } from "../../../ui/checkbox";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { StudentApiService } from "@/api/services/StudentApiService";
import { debounce } from "@/utils/debounce";
import { handlePageChange } from "@/utils/pagination-utils";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { TextHelper } from "@/helpers/TextHelper";
import { useRouter } from "next/navigation";
import ModalComponent from "@/components/modals/base/modal-component";
import AddFeeForStudent from "@/components/forms/school/admins/add-fee-for-student";
import LinkStudentWithParent from "@/components/forms/school/admins/link-student-with-parent";
import TooltipComponent from "@/components/info/tool-tip";

const ActionCell = ({ row }: { row: any }) => {
  const [openLinkStudentWithParentForm, setOpenLinkStudentWithParentForm] = React.useState(false);
  const [openAddFeeForm, setOpenAddFeeForm] = React.useState(false);
  const router = useRouter();
  const Session = row.original;

  return (
    <div className="flex items-center gap-1">
      <TooltipComponent
        trigger={
          <Button
            onClick={() => router.push(`students/${Session._id}`)}
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
          <DropdownMenuItem
            onClick={() => setOpenLinkStudentWithParentForm(true)}
            className="cursor-pointer"
          >
            Link Parent
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenAddFeeForm(true)}
            className="cursor-pointer"
            disabled={Session.latest_payment_document === null}
          >
            Add Fee
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Component for linking student with parent */}
      <ModalComponent
        open={openLinkStudentWithParentForm}
        onClose={() => setOpenLinkStudentWithParentForm(false)}
        className=""
      >
        <LinkStudentWithParent
          action_from="student"
          student_data={Session}
          onClose={() => {
            setOpenLinkStudentWithParentForm(false);
          }}
          closeOnSuccess={() => {
            setOpenLinkStudentWithParentForm(false);
          }}
        />
      </ModalComponent>

      {/* Component for adding payment for student */}
      <ModalComponent open={openAddFeeForm} onClose={() => setOpenAddFeeForm(false)} className="">
        <AddFeeForStudent
          student_id={Session._id}
          onClose={() => {
            setOpenAddFeeForm(false);
          }}
          closeOnSuccess={() => {
            setOpenAddFeeForm(false);
          }}
        />
      </ModalComponent>
    </div>
  );
};

export const columns: ColumnDef<Student>[] = [
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
      const student_status: string = row.getValue("status");
      let color;
      switch (student_status) {
        case "active":
          color = "text-green-600";
          break;
        case "graduated":
          color = "text-blue-600";
          break;
        case "expelled":
          color = "text-red-600";
          break;
        default:
          color = "";
          break;
      }

      return <div className={`capitalize ${color}`}>{student_status}</div>;
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
          First Name
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-max capitalize">
        {TextHelper.capitalize(row.getValue("first_name"))}
      </div>
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
          Last Name
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-max capitalize">{TextHelper.capitalize(row.getValue("last_name"))}</div>
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
    cell: ({ row }) => <div className="max-w-max text-nowrap">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "current_class_level",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Current Level
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div
        className={`text-nowrap capitalize ${
          !row.getValue("current_class_level") && "text-yellow-500"
        }`}
      >
        {row.getValue("current_class_level") ?? "Not Enrolled"}
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
    header: () => {
      return (
        <p className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap">Actions</p>
      );
    },
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export function StudentTable() {
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
    ["students"],
    StudentApiService.getAllStudentInASchool,
    queryObj,
  );

  let metaData = {
    totalPages: data?.students?.totalPages !== undefined ? data?.students?.totalPages : 0,
    totalCount: data?.students?.totalCount !== undefined ? data?.students?.totalCount : 1,
  };

  data = data?.students?.studentObj !== undefined && data?.students?.studentObj;

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
                  <CircularLoader text="Loading students data" />
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
                  No student data available.
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
