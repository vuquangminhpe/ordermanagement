import dishApiRequests from "@/apiRequests/dishs.api";
import { wrapServerApi } from "@/lib/utils";
import DishDetail from "../../(auth)/dishes/[id]/dish-detail";
import Modal from "./modal";

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
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
}
