import accountApiRequest from "@/apiRequests/account.api";
import {
  AccountResType,
  GetGuestListQueryParamsType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: () => accountApiRequest.me(),
  });
};
export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  });
};

export const useAccountList = () => {
  return useQuery({
    queryKey: ["account-get-list"],
    queryFn: accountApiRequest.list,
  });
};

export const useGetDetailsAccount = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["account-get-account", id],
    queryFn: () => accountApiRequest.getEmployee(id),
  });
};

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-add-list"] });
    },
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & {
      id: number;
    }) => accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-update-list"] });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-delete-list"] });
    },
  });
};

export const useGetGuestListQuery = (
  queryParams: GetGuestListQueryParamsType
) => {
  return useQuery({
    queryKey: ["account-guest-list", queryParams],
    queryFn: () => accountApiRequest.guestList(queryParams),
  });
};
export const useCreateGuestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.createGuest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["create-account-guest-list"],
      });
    },
  });
};
