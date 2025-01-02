"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetAllDishes } from "@/queries/useDishes";
import { formatCurrency } from "@/lib/utils";
import Quantity from "./quantity";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { useRouter } from "next/navigation";
import { DishStatus } from "@/constants/type";
interface MenuOrderProps {
  refetch: () => void;
}
export default function MenuOrder({ refetch }: MenuOrderProps) {
  const { data: dataAllDishes } = useGetAllDishes();
  const route = useRouter();
  const dataAllDish = dataAllDishes?.payload?.data ?? [];
  const orderGuestMutation = useGuestOrderMutation();
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const totalItems = orders.reduce((acc, order) => acc + order.quantity, 0);

  const totalPrice = orders.reduce(
    (acc, order) =>
      acc + (dataAllDish.find((dish) => dish.id === order.dishId)?.price || 0),
    0
  );
  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  console.log(orders);
  const handleOrder = async () => {
    try {
      await orderGuestMutation.mutateAsync(orders, {
        onSuccess: (data) => {
          refetch();
          route.push("/guest/orders");
          setOrders([]);
        },
        onError: (error) => {
          console.error(error);
        },
      });
      setOrders([]);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      {dataAllDish
        .filter((dish) => dish.status !== DishStatus.Hidden)
        ?.map((dish) => (
          <div key={dish.id} className="flex gap-4">
            <div className="flex-shrink-0 relative">
              <span className="absolute inset-0 flex items-center justify-center">
                {dish.status === DishStatus.Unavailable && (
                  <div className="z-50 text-red-500 font-bold">Hết món</div>
                )}
              </span>
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className={`object-cover w-[80px] h-[80px] rounded-md ${
                  dish.status === DishStatus.Unavailable && "filter grayscale"
                }`}
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold">
                {formatCurrency(dish.price)}
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              {dish.status !== DishStatus.Unavailable && (
                <Quantity
                  value={
                    orders.find((order) => order.dishId === dish.id)
                      ?.quantity ?? 0
                  }
                  onChange={(value) => handleQuantityChange(dish.id, value)}
                />
              )}
            </div>
          </div>
        ))}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={handleOrder}
          disabled={totalItems === 0}
        >
          <span>Giỏ hàng · {totalItems} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
