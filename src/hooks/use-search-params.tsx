import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useSearchParamsUtil() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const pushToRoute = useCallback(
    (route: string, paramName: string, paramValue: string) => {
      const queryString = createQueryString(paramName, paramValue);
      router.push(`${route}?${queryString}`);
    },
    [router, createQueryString]
  );

  return { createQueryString, searchParams, pushToRoute };
}
