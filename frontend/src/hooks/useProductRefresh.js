import { useEffect } from "react";

const useProductRefresh = (callback) => {
  useEffect(() => {
    const handler = () => {
      callback();
    };

    window.addEventListener("products:update", handler);

    return () => {
      window.removeEventListener("products:update", handler);
    };
  }, [callback]);
};

export default useProductRefresh;