import accountApiRequest from "@/apiRequests/account";
import { useQuery } from "@tanstack/react-query";

export const useAccountProfile = () => {
  return useQuery({
    queryKey: ["accountProfile"],
    queryFn: () => accountApiRequest.me(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 minutes
  });
};
