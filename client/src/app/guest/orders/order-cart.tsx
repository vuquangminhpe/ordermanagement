"use client";
import Image from "next/image";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestOrderListQuery } from "@/queries/useGuest";
import MenuOrder from "../menu/menu-order";

export default function OrdersCart() {
  const { data: dataCarts, refetch } = useGuestOrderListQuery();
  const dataCart = dataCarts?.payload?.data ?? [];

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
              className="flex gap-4 p-4 rounded-lg transition-all duration-200"
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
                <div className="flex-shrink-0 ml-auto flex justify-center items-center">
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
                dataCart.reduce(
                  (total, dish) =>
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
