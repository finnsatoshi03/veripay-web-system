export const formatInitials = (name: string) => {
  const parts = name.split(" ");
  const firstInitial = parts[0]?.[0] || "";
  const lastInitial = parts[parts.length - 1]?.[0] || "";
  return `${firstInitial}${lastInitial}`;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatMonthYear = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");

  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${period}`;
};

export const formatNotionDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatPlaceValue = (amount: number) => {
  return amount
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/^/, "₱");
};
