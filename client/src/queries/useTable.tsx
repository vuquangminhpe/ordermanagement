import tableApiRequest from "@/apiRequests/table.api";
import { CreateTableBodyType } from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllTables = () => {
  return useQuery({ queryKey: ["tables"], queryFn: tableApiRequest.list });
};
export const useGetTableDetail = (number: number) => {
  return useQuery({
    queryKey: ["table", number],
    queryFn: () => tableApiRequest.getDetailTable(number),
  });
};
export const useCreateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTableBodyType) => tableApiRequest.addTable(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table-created"] });
    },
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      number,
      ...body
    }: CreateTableBodyType & { number: number }) =>
      tableApiRequest.updateTable({ number, ...body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table-edited"] });
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (number: number) => tableApiRequest.deleteTable(number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table-deleted"] });
    },
  });
};
