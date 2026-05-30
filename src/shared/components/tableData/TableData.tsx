  import { DataTable, type DataTableValue } from "primereact/datatable";
import { Column } from "primereact/column";

    interface ColumnProps<T> {
    header: string;
    body: (rowData: T, options?: any) => React.ReactNode;
    }

    interface ReusableTableProps<T> {
    data: T[];
    columns: ColumnProps<T>[];
    }

    const TableData=<T  extends DataTableValue>({data,columns}:ReusableTableProps<T>)=>{
        console.log(data)
        console.log(columns)
        return (
        <DataTable value={data}   paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      tableStyle={{ minWidth: "50rem" }}>
            {columns.map((col,index)=>(
                <Column key={index} header={col.header} body={col.body}/>  
           ))}
        </DataTable>
        )
    }



    export default TableData;