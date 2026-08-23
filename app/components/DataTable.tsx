import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Columns opt into right-alignment through `meta.align` so numeric columns line
 * up on their decimal point without every cell repeating the class.
 */
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: "left" | "right" | "center";
    className?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleRowClick?: (v: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  skeletonRows?: number;
  className?: string;
}

const alignClass = (align?: "left" | "right" | "center") =>
  align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

export default function DataTable<TData, TValue>({
  columns,
  data,
  handleRowClick,
  placeholder,
  isLoading = false,
  skeletonRows = 8,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        "relative overflow-auto rounded-xl border border-line bg-surface",
        className
      )}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    alignClass(header.column.columnDef.meta?.align),
                    header.column.columnDef.meta?.className
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                {columns.map((_column, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton
                      className="h-3.5"
                      style={{ width: cellIndex === 0 ? "60%" : "45%" }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() =>
                  handleRowClick?.((row.original as { id: string }).id)
                }
                className={handleRowClick ? "cursor-pointer" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      alignClass(cell.column.columnDef.meta?.align),
                      cell.column.columnDef.meta?.className
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-sm text-ink-muted"
              >
                {placeholder || "No results"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
