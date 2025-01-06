import orderApiRequest from "@/apiRequests/orders.api";
import {
  GetOrdersQueryParamsType,
  PayGuestOrdersBodyType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & {
      orderId: number;
    }) => orderApiRequest.updateOrders(orderId, body),
  });
};
export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ["orderList", queryParams],
    queryFn: () => orderApiRequest.getOrderList(queryParams),
  });
};
export const useGetOrderDetailQuery = ({
  orderId,
  enabled,
}: {
  orderId: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => orderApiRequest.getOrderDetail(orderId),
    enabled,
  });
};

export const usePayGuestOrderMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) => orderApiRequest.pay(body),
  });
};
