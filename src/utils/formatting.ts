export const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffMs = now.getTime() - messageDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return diffMins < 1 ? "now" : `${diffMins}m`;
  } else if (diffHours < 24) {
    return `${Math.floor(diffHours)}h`;
  } else if (diffDays < 7) {
    return `${Math.floor(diffDays)}d`;
  } else {
    return messageDate.toLocaleDateString();
  }
};

export const truncateMessage = (content: string, maxLength: number = 50) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};

// Format: YYYY-MM-DD
export const getDateString = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// Format: HH:MM
export const getTimeString = (hours: number, minutes: number) => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return "$";
  }
};