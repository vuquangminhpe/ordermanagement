import dishApiRequests from "@/apiRequests/dishs.api";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import Image from "next/image";

export default async function DishPage({
  params: { id },
}: {
  params: { id: string };
}) {
  console.log(id);
  const data = await wrapServerApi(() =>
    dishApiRequests.getDetailDish(Number(id))
  );
  if (!data)
    return (
      <div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold">
            Món ăn không tồn tại
          </h1>
        </div>
      </div>
    );
  const dish = data.payload.data;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
      <div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        alt={dish.name}
        width={700}
        height={700}
        quality={100}
        className="object-cover w-full h-full max-w-[1080px] max-h-[1080px]"
      />
      <div>{dish.description}</div>
    </div>
  );
}
