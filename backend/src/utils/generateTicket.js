export const generateTicketNumber = () => {
  const now = new Date();

  const datePart = now.toISOString().slice(0,10).replace(/-/g, "");
  const timePart = now.getTime().toString().slice(-5);

  return `TKT-${datePart}-${timePart}`;
};