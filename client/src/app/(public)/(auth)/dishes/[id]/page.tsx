import dishApiRequests from "@/apiRequests/dishs.api";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import Image from "next/image";
import DishDetail from "./dish-detail";

export default async function DishPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await wrapServerApi(() =>
    dishApiRequests.getDetailDish(Number(id))
  );

  const dish = data?.payload?.data;
  return <DishDetail dish={dish} />;
}
