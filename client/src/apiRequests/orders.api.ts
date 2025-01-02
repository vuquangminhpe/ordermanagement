import http from "@/lib/http";
import {
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";

const orderApiRequest = {
  getOrderList: () => http.get<GetOrdersResType>("/orders"),
  updateOrders: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
  deleteOrders: (orderId: number) =>
    http.delete<GetOrdersResType>(`/orders/${orderId}`),
};
export default orderApiRequest;
