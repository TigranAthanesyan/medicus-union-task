import { ConsultationStatus, ConsultationType } from "@/types";

export const STATUS_COLOR_MAP: Record<ConsultationStatus, string> = {
  [ConsultationStatus.Pending]: "#f59e0b",
  [ConsultationStatus.Confirmed]: "#10b981",
  [ConsultationStatus.Declined]: "#ef4444",
  [ConsultationStatus.Completed]: "#6366f1",
  [ConsultationStatus.Cancelled]: "#6b7280",
} as const;

export const STATUS_ICON_MAP: Record<ConsultationStatus, string> = {
  [ConsultationStatus.Pending]: "⏳",
  [ConsultationStatus.Confirmed]: "✅",
  [ConsultationStatus.Declined]: "❌",
  [ConsultationStatus.Completed]: "🏁",
  [ConsultationStatus.Cancelled]: "🚫",
} as const;

export const TYPE_ICON_MAP: Record<ConsultationType, string> = {
  [ConsultationType.Video]: "📹",
  [ConsultationType.Audio]: "📞",
  [ConsultationType.Chat]: "💬",
} as const;
