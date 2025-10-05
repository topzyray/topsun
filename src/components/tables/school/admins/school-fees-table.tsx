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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

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
import { SchoolFee, Session } from "../../../../../types";
import { Checkbox } from "../../../ui/checkbox";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { FeesApiService } from "@/api/services/FeesApiService";
import UpdateSchoolFee from "../../../forms/school/admins/update-school-fee";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import ModalComponent from "@/components/modals/base/modal-component";
import { TextHelper } from "@/helpers/TextHelper";
import { useRouter } from "next/navigation";
import AddSchoolFeeForm from "@/components/forms/school/admins/add-school-fee";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SessionApiService } from "@/api/services/SessionApiService";
import ErrorBox from "@/components/atoms/error-box";
import { debounce } from "@/utils/debounce";
import { handlePageChange } from "@/utils/pagination-utils";
import { useAuth } from "@/api/hooks/use-auth.hook";
import TooltipComponent from "@/components/info/tool-tip";
import { Separator } from "@/components/ui/separator";

const ActionCell = ({ row }: { row: any }) => {
  const [openFeeUpdateForm, setOpenFeeUpdateForm] = React.useState({
    school_fee: false,
  });
  const Session = row.original;
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
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
          {/* <DropdownMenuItem
            onClick={() =>
              setOpenFeeUpdateForm((prev) => ({
                ...prev,
                school_fee: true,
              }))
            }
          >
            Update Fee
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <ModalComponent
        open={openFeeUpdateForm.school_fee}
        onClose={() =>
          setOpenFeeUpdateForm((prev) => ({
            ...prev,
            school_fee: false,
          }))
        }
      >
        <UpdateSchoolFee
          fee={Session}
          onClose={() => {
            setOpenFeeUpdateForm((prev) => ({
              ...prev,
              school_fee: false,
            }));
          }}
          closeOnSuccess={() => {
            setOpenFeeUpdateForm((prev) => ({
              ...prev,
              school_fee: false,
            }));
          }}
        />
      </ModalComponent> */}
    </div>
  );
};

export const columns: ColumnDef<SchoolFee>[] = [
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
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Level
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("level")}</div>,
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
      return <div className="text-nowrap capitalize">{term.split("_").join(" ")}</div>;
    },
  },
  {
    accessorFn: (row) => row.school_fee.fee_name,
    id: "fee_name",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Fee Name
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => {
      const feeName: string = row.getValue("fee_name");
      return <div className="text-nowrap capitalize">{feeName.split("_").join(" ")}</div>;
    },
  },
  {
    accessorFn: (row) => row.school_fee.amount,
    id: "amount",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Amount
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => <div className="capitalize">₦{row.getValue("amount")}</div>,
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
      <div className="capitalize">{TextHelper.getFormattedDate(row.getValue("createdAt"))}</div>
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

export function SchoolFeeTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [queryObj, setQueryObj] = React.useState({
    academic_session: "",
    term: "",
    page: 1,
    limit: 10,
    searchParams: "",
  });

  let { data, isLoading, isError, error } = useCustomQuery(
    ["schoolFees"],
    FeesApiService.getSchoolFeesInASchool,
    queryObj,
  );

  let metaData = {
    totalPages: data?.school_fees?.totalPages !== undefined ? data?.school_fees?.totalPages : 0,
    totalCount: data?.school_fees?.totalCount !== undefined ? data?.school_fees?.totalCount : 1,
  };

  data = data?.school_fees?.feesArray !== undefined && data?.school_fees?.feesArray;

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

  let {
    data: sessionData,
    isLoading: loadingSessionData,
    isError: isSessionError,
    error: sessionError,
  } = useCustomQuery(["sessions"], SessionApiService.getSessionsForASchool);

  const sessionArr: Session[] = sessionData?.session !== undefined && sessionData?.session;

  return (
    <div className="w-full">
      <CreateSchoolFeeComponent />

      <div className="mt-4 flex items-center gap-4">
        {loadingSessionData ? (
          <CircularLoader text="Loading filters" />
        ) : sessionArr.length > 0 ? (
          <>
            <Select
              onValueChange={(value) => {
                setQueryObj((prev) => ({ ...prev, academic_session: value }));
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Academic Sesison</SelectLabel>
                  {sessionArr &&
                    sessionArr.length > 0 &&
                    sessionArr.map((session) => (
                      <SelectItem key={session._id} value={session._id}>
                        {session.academic_session}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                setQueryObj((prev) => ({ ...prev, term: value }));
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Term</SelectLabel>
                  {[
                    { label: "First Term", value: "first_term" },
                    { label: "Second Term", value: "second_term" },
                    { label: "Third Term", value: "third_term" },
                  ].map((item) => (
                    <SelectItem key={item.label} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        ) : isSessionError ? (
          <ErrorBox error={sessionError} />
        ) : null}
      </div>

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
                  <CircularLoader text="Loading school fees data" />
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
                  No school fee data available.
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

function CreateSchoolFeeComponent() {
  const [openNewFeeForm, setOpenNewFeeForm] = React.useState(false);
  const { userDetails } = useAuth();

  return (
    <div className="space-y-2">
      {userDetails?.role === "super_admin" && (
        <TooltipComponent
          trigger={
            <Button type="button" onClick={() => setOpenNewFeeForm(true)}>
              Create School Fee
            </Button>
          }
          message={<p>This creates school fee</p>}
        />
      )}

      <Separator />

      {/* Handles school fee creation */}
      <ModalComponent open={openNewFeeForm} onClose={() => setOpenNewFeeForm(false)}>
        <AddSchoolFeeForm
          onClose={() => setOpenNewFeeForm(false)}
          closeOnSuccess={() => setOpenNewFeeForm(false)}
        />
      </ModalComponent>
    </div>
  );
}
