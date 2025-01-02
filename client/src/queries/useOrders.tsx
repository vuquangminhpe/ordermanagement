import orderApiRequest from "@/apiRequests/orders.api";
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & {
      orderId: number;
    }) => orderApiRequest.updateOrders(orderId, body),
  });
};
export const useGetOrderListQuery = () => {
  return useQuery({
    queryKey: ["orderList"],
    queryFn: orderApiRequest.getOrderList,
  });
};
