import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const dishApiRequests = {
  list: () => http.get<DishListResType>("/dishes"),
  getDetailDish: (id: number) => http.get<DishResType>(`/dishes/${id}`),
  createDish: (body: CreateDishBodyType) =>
    http.post<DishResType>("/dishes", body),
  editDish: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
    http.put<DishResType>(`/dishes/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`/dishes/${id}`),
};
export default dishApiRequests;
