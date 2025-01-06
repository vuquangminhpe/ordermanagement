"use client";
import Image from "next/image";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestOrderListQuery } from "@/queries/useGuest";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { OrderStatus } from "@/constants/type";
import { PayGuestOrdersResType } from "@/schemaValidations/order.schema";
import { toast } from "@/components/ui/use-toast";

export default function OrdersCart() {
  const { data: dataCarts, refetch } = useGuestOrderListQuery();

  const dataCart = dataCarts?.payload?.data ?? [];

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(`${socket.id} connected`);
    }

    function onDisconnect() {
      console.log(`${socket.id} disconnected`);
    }
    function onOrderUpdate(data: any) {
      if (data) {
        refetch();
      }
    }
    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      if (guest) {
        toast({
          description: `Payment for ${guest.name} successfully`,
        });
        refetch();
      }
    }
    socket.on("update-order", onOrderUpdate);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("payment", onPayment);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onOrderUpdate);
      socket.off("payment", onPayment);
    };
  }, [refetch]);
  return (
    <div className="p-6  rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6">Your Order</h2>

      {dataCart.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {dataCart?.map((dish) => (
            <div
              key={dish.id}
              className="flex gap-4 max-md:flex-col p-4 rounded-lg transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <Image
                  src={dish.dishSnapshot.image}
                  alt={dish.dishSnapshot.name}
                  height={100}
                  width={100}
                  quality={100}
                  className="object-cover w-[80px] h-[80px] rounded-lg"
                />
              </div>
              <div className="flex-1 flex max-md:flex-col gap-2">
                <div className="flex-1 space-y-2">
                  <h3 className="text-md font-semibold">
                    {dish.dishSnapshot.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(dish.dishSnapshot.price)} x {dish.quantity}
                  </p>
                  <p className="text-md font-bold">
                    {formatCurrency(dish.dishSnapshot.price * dish.quantity)}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-auto max-sm:ml-0 font-bold rounded-xl flex justify-center items-center border border-black p-2">
                  {getVietnameseOrderStatus(dish.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {dataCart.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold ">Total</span>
            <span className="text-lg font-bold ">
              {formatCurrency(
                dataCart
                  ?.filter((item) => item.status !== OrderStatus.Rejected)
                  .reduce(
                    (total: any, dish: any) =>
                      total + dish.dishSnapshot.price * dish.quantity,
                    0
                  )
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
