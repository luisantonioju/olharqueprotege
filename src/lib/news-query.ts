import { queryOptions } from "@tanstack/react-query";
import { getNews } from "./news.functions";

export const newsQuery = queryOptions({
  queryKey: ["news"],
  queryFn: () => getNews(),
  staleTime: 15 * 60 * 1000,
  refetchInterval: 15 * 60 * 1000,
});