import { Role } from "@/constants/type";
import {
  Home,
  LineChart,
  ShoppingCart,
  Users2,
  Salad,
  Table,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/orders",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "Bàn ăn",
    Icon: Table,
    href: "/manage/tables",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: "/manage/dishes",
    role: [Role.Owner, Role.Employee],
  },

  {
    title: "Phân tích",
    Icon: LineChart,
    href: "/manage/analytics",
    role: [Role.Owner],
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "/manage/accounts",
    role: [Role.Owner],
  },
];

export default menuItems;
