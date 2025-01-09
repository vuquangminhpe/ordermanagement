"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  return (
    <div>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) {
            route.back();
          }
        }}
      >
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </div>
  );
}
