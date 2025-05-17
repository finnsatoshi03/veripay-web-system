export const formatInitials = (name: string) => {
  const parts = name.split(" ");
  const firstInitial = parts[0]?.[0] || "";
  const lastInitial = parts[parts.length - 1]?.[0] || "";
  return `${firstInitial}${lastInitial}`;
};
