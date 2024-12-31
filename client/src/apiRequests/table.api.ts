import http from "@/lib/http";
import {
  CreateTableBodyType,
  TableListResType,
} from "@/schemaValidations/table.schema";

const tableApiRequest = {
  list: () => http.get<TableListResType>("/tables"),
  getDetailTable: (number: number) =>
    http.get<TableListResType>(`/tables/${number}`),
  addTable: (body: CreateTableBodyType) =>
    http.post<TableListResType>("/tables", body),
  updateTable: ({
    number,
    ...body
  }: CreateTableBodyType & { number: number }) =>
    http.put<TableListResType>(`/tables/${number}`, body),
  deleteTable: (number: number) =>
    http.delete<TableListResType>(`/tables/${number}`),
};
export default tableApiRequest;
