import dishApiRequests from "@/apiRequests/dishs";
import {
  CreateDishBodyType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllDishes = () => {
  return useQuery({ queryKey: ["dishes"], queryFn: dishApiRequests.list });
};
export const useGetDishDetail = (id: number) => {
  return useQuery({
    queryKey: ["dish", id],
    queryFn: () => dishApiRequests.getDetailDish(id),
  });
};
export const useCreateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDishBodyType) => dishApiRequests.createDish(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dish-created"] });
    },
  });
};
export const useEditDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishApiRequests.editDish({ id, ...body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dish-edited"] });
    },
  });
};
export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dishApiRequests.deleteDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dish-deleted"] });
    },
  });
};
