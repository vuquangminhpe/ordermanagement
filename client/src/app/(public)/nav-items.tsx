"use client";
import Link from "next/link";
import { RoleType } from "@/types/jwt.types";
import { useAppContext } from "@/components/app-provider";
import { cn, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter } from "next/navigation";
import { Role } from "@/constants/type";

const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "Đơn hàng",
    href: "/guest/orders",
    role: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole, disconnectSocket } = useAppContext();
  const route = useRouter();
  const logoutMutation = useLogoutMutation();
  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      setRole();
      disconnectSocket();
      route.push("/");
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {menuItems
        .filter((item) => {
          const isAuth = item.role ? role && item.role.includes(role) : true;
          const isHiddenWhenLoggedIn = item.hideWhenLogin && role;
          return isAuth && !isHiddenWhenLoggedIn;
        })
        .map((item) => (
          <Link href={item.href} key={item.href} className={className}>
            {item.title}
          </Link>
        ))}
      {role && (
        <div className={cn(className, "cursor-pointer")} onClick={logout}>
          Đăng xuất
        </div>
      )}
    </>
  );
}
