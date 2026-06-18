export const getData = (res) => res?.data?.data ?? null;
export const getList = (res, key) => res?.data?.[key] ?? res?.data?.data ?? [];