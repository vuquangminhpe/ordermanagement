import Link from "next/link";
import { cookies } from "next/headers";
const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true,
  },
];

export default function NavItems({ className }: { className?: string }) {
  const cookieStore = cookies();

  return menuItems.map(async (item) => {
    if (
      (item.authRequired === false &&
        Boolean((await cookieStore).get("accessToken"))) ||
      (item.authRequired === true &&
        !Boolean((await cookieStore).get("accessToken")))
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
