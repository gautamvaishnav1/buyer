import { DataTable, type DataTableValue } from "primereact/datatable";
import { Column } from "primereact/column";

interface ColumnProps<T> {
  header: string;
  body: (rowData: T, options?: unknown) => React.ReactNode;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: ColumnProps<T>[];
}

const TableData = <T extends DataTableValue>({
  data,
  columns,
}: ReusableTableProps<T>) => {
  return (
    <div className="table-scroll">
      <DataTable
        value={data}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first}–{last} of {totalRecords}"
        paginatorClassName="mgmt-paginator"
        tableStyle={{ minWidth: "100%" }}
        className="responsive-datatable"
      >
        {columns.map((col, index) => (
          <Column key={index} header={col.header} body={col.body} />
        ))}
      </DataTable>
    </div>
  );
};

export default TableData;
