export const unwrapProducts = (res) => {
  return (
    res?.data?.data?.products ||
    res?.data?.data ||
    res?.data?.products ||
    res?.data ||
    []
  );
};