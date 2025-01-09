import dishApiRequests from "@/apiRequests/dishs.api";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";

export default async function DishDetail({
  dish,
}: {
  dish: DishResType["data"] | undefined;
}) {
  if (!dish)
    return (
      <div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold">
            Món ăn không tồn tại
          </h1>
        </div>
      </div>
    );
  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
      <div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>

      <div>{dish.description}</div>
    </div>
  );
}
