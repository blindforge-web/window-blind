import type {
  ActionFeedbackState,
  AdminAuthActionState,
  OfflineOrderActionState,
} from "@/lib/types";

export const initialOfflineOrderState: OfflineOrderActionState = {
  status: "idle",
};

export const initialAdminAuthState: AdminAuthActionState = {
  status: "idle",
};

export const initialActionFeedbackState: ActionFeedbackState = {
  status: "idle",
};
