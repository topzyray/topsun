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
import { AssessmentDocument } from "../../../../../types";
import { Checkbox } from "../../../ui/checkbox";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { TextHelper } from "@/helpers/TextHelper";
import { CbtApiService } from "@/api/services/CbtApiService";
import { debounce } from "@/utils/debounce";
import { handlePageChange } from "@/utils/pagination-utils";
import TooltipComponent from "@/components/info/tool-tip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CancelButton from "@/components/buttons/CancelButton";
import { Separator } from "@/components/ui/separator";

const ActionCell = ({ row }: { row: any }) => {
  const [openSingleExamDoc, setOpenSingleExamDoc] = React.useState<boolean>(false);
  const Session = row.original;

  return (
    <div className="flex items-center gap-3">
      <Button
        size="sm"
        variant="link"
        onClick={() => setOpenSingleExamDoc(true)}
        className="px-0 text-sm font-normal"
      >
        Details
      </Button>
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

      <AssessmentDocumentDetailsModal
        exam_document_id={Session._id}
        open={openSingleExamDoc}
        onClose={() => setOpenSingleExamDoc(false)}
      />
    </div>
  );
};

export const columns: ColumnDef<AssessmentDocument>[] = [
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
      <div
        className={`text-nowrap capitalize ${
          row.getValue("is_active") ? "text-green-600" : "text-red-600"
        }`}
      >
        {row.getValue("is_active") ? "Active" : "Not Active"}
      </div>
    ),
  },
  {
    accessorKey: "assessment_type",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Assessment Type
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => (
      <div className="text-nowrap capitalize">{row.getValue("assessment_type")}</div>
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
      return <div className={`text-nowrap capitalize`}>{term && term.replace("_", " ")}</div>;
    },
  },
  {
    accessorKey: "min_obj_questions",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Min. Questions
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => {
      return <div className={`text-nowrap capitalize`}>{row.getValue("min_obj_questions")}</div>;
    },
  },
  {
    accessorKey: "max_obj_questions",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Max. Questions
          <ArrowUpDown size={16} />
        </p>
      );
    },
    cell: ({ row }) => {
      return <div className={`text-nowrap capitalize`}>{row.getValue("max_obj_questions")}</div>;
    },
  },
  {
    accessorKey: "number_of_questions_per_student",
    header: ({ column }) => {
      return (
        <TooltipComponent
          trigger={
            <p
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
            >
              Que. Per Student
              <ArrowUpDown size={16} />
            </p>
          }
          message={<span>Number of Questions per student</span>}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className={`text-nowrap capitalize`}>
          {row.getValue("number_of_questions_per_student")}
        </div>
      );
    },
  },
  {
    accessorKey: "expected_obj_number_of_options",
    header: ({ column }) => {
      return (
        <TooltipComponent
          trigger={
            <p
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
            >
              No. of Options
              <ArrowUpDown size={16} />
            </p>
          }
          message={<span>Expected number of options</span>}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className={`text-nowrap capitalize`}>
          {row.getValue("expected_obj_number_of_options")}
        </div>
      );
    },
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
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex max-w-max cursor-pointer items-center gap-2 text-nowrap"
        >
          Actions
        </p>
      );
    },
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export function AssessmentsDocumentTable() {
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
    ["assessments"],
    CbtApiService.getAllAssessmentDocument,
    queryObj,
  );

  let metaData = {
    totalPages:
      data?.exam_documents?.totalPages !== undefined ? data?.exam_documents?.totalPages : 0,
    totalCount:
      data?.exam_documents?.totalCount !== undefined ? data?.exam_documents?.totalCount : 1,
  };

  data = data?.exam_documents?.examObj !== undefined && data?.exam_documents?.examObj;

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
                  <CircularLoader text="Loading assessment document data" />
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
                  No assessment document data availabe.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of
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

function AssessmentDocumentDetailsModal({
  exam_document_id,
  open,
  onClose,
}: {
  exam_document_id: string;
  open: boolean;
  onClose: () => void;
}) {
  let { data, isLoading, isError, error } = useCustomQuery(
    ["studentById"],
    () => CbtApiService.getAssessmentDocumentById({ exam_document_id }),
    { id: exam_document_id },
  );

  let assessmentDocData = data?.exam_document !== undefined && data?.exam_document;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <ScrollArea className="h-full max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="uppercase">Assessment Document Details</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>

          <Separator />

          <section className="my-4">
            {isLoading && <CircularLoader text="Fetching assessment document details" />}

            {assessmentDocData && assessmentDocData !== null && (
              <section>
                <Table className="border">
                  <TableBody>
                    {/* <TableRow>
                      <TableHead>ID</TableHead>
                      <TableCell className="uppercase">{assessmentDocData?._id}</TableCell>
                    </TableRow> */}
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableCell
                        className={`uppercase ${assessmentDocData?.is_active ? "text-green-600" : "text-red-600"}`}
                      >
                        {assessmentDocData?.is_active ? "Active" : "Not Active"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Assessment Type</TableHead>
                      <TableCell className="uppercase">
                        {assessmentDocData?.assessment_type}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Term</TableHead>
                      <TableCell className="uppercase">
                        {assessmentDocData?.term.replace("_", " ")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Minimum Questions</TableHead>
                      <TableCell className="uppercase">
                        {assessmentDocData?.min_obj_questions}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Maximum Questions</TableHead>
                      <TableCell className="uppercase">
                        {assessmentDocData?.max_obj_questions}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Questions Per Students</TableHead>
                      <TableCell className="uppercase">
                        {assessmentDocData?.number_of_questions_per_student}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Expected of Options</TableHead>
                      <TableCell className="uppercase">
                        {assessmentDocData?.expected_obj_number_of_options}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Date Created</TableHead>
                      <TableCell className="uppercase">
                        {TextHelper.getFormattedDate(assessmentDocData?.createdAt)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>
            )}

            {isError && (
              <div className="bg-sidebar max-w-md space-y-3 rounded p-6 text-red-600">
                <p>{extractErrorMessage(error)}</p>
              </div>
            )}
          </section>

          <DialogFooter>
            <DialogClose asChild>
              <CancelButton
                onClose={() => {
                  onClose();
                }}
              />
            </DialogClose>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
