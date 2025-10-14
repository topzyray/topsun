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
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { PaymentPendingApproval } from "../../../../../types";
import { Checkbox } from "../../../ui/checkbox";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { PaymentApiService } from "@/api/services/PaymentApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { debounce } from "@/utils/debounce";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { handlePageChange } from "@/utils/pagination-utils";
import SubmitButton from "@/components/buttons/SubmitButton";
import { TextHelper } from "@/helpers/TextHelper";

const ActionCell = ({ row }: { row: any }) => {
  const queryClient = useQueryClient();
  const Session = row.original;

  let { mutate: approveBankPayment, isPending: isApprovingBankPayment } = useCustomMutation(
    PaymentApiService.approveBankPaymentById,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["bankpayments"] });
      },
    },
  );

  const handlePaymentApproval = async (data: PaymentPendingApproval) => {
    approveBankPayment({
      formData: {
        amount_paid: data.amount_paid,
        bank_name: data.bank_name,
        transaction_id: data.transaction_id,
      },
      params: {
        payment_id: data._id,
      },
    });
  };

  return (
    <SubmitButton
      variant="ghost"
      size="sm"
      className="text-green-600"
      onSubmit={() => handlePaymentApproval(Session)}
      text="Approve"
      loading={isApprovingBankPayment}
      disabled={isApprovingBankPayment}
    />
  );
};

export const columns: ColumnDef<PaymentPendingApproval>[] = [
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
    header: ({ column }) => {
      return <p>Status</p>;
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "transaction_id",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Reference
          <ArrowUpDown />
        </p>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("transaction_id")}</div>,
  },
  {
    accessorKey: "bank_name",
    header: ({ column }) => {
      return (
        <p className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap">Bank name</p>
      );
    },
    cell: ({ row }) => {
      return <div className="text-nowrap capitalize">{row.getValue("bank_name")}</div>;
    },
  },
  {
    accessorKey: "amount_paid",
    header: ({ column }) => {
      return <p className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap">Amount</p>;
    },
    cell: ({ row }) => {
      return <div className="capitalize">₦{row.getValue("amount_paid")}</div>;
    },
  },
  {
    id: "date_paid",
    accessorFn: (row) => row.date_paid,
    header: ({ column }) => {
      return <p className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap">Date</p>;
    },
    cell: ({ row }) => {
      return (
        <div className="uppercase">{TextHelper.getFormattedDate(row.getValue("date_paid"))}</div>
      );
    },
  },
  {
    id: "time_paid",
    accessorFn: (row) => row.date_paid,
    header: ({ column }) => {
      return <p className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap">Time</p>;
    },
    cell: ({ row }) => {
      return (
        <div className="text-nowrap capitalize">
          {TextHelper.getFormattedTime(row.getValue("time_paid"))}
        </div>
      );
    },
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

export function PaymentsAwaitingApprovalTable() {
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
    ["bankpayments"],
    PaymentApiService.getAllPaymentsAwaitingApproval,
    queryObj,
  );

  let metaData = {
    totalPages:
      data?.payment_documents?.totalPages !== undefined ? data?.payment_documents?.totalPages : 0,
    totalCount:
      data?.payment_documents?.totalCount !== undefined ? data?.payment_documents?.totalCount : 1,
  };

  data = data?.payment_documents?.resultArray !== undefined && data?.payment_documents?.resultArray;

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
                  <CircularLoader text="Loading payment data" />
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
                  No pending payment data available.
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
