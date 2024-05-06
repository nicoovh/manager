import { useState, useEffect } from 'react';
import { apiClient } from '@ovh-ux/manager-core-api';
import {
  useInfiniteQuery,
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { IamInterface, PageInterface, PageReduceIam } from './iam.interface';

export const fetchAuthorizationsCheck = async ({
  actions,
  urns,
}: {
  actions: string[];
  urns: string[];
}) => {
  const { data } = await apiClient.v2.post(`/iam/authorization/check`, {
    actions,
    resourceURNs: urns,
  });
  return data;
};

export const fetchAuthorizationCheck = async (
  actions: string[],
  urn: string,
) => {
  const { data } = await apiClient.v2.post(
    `/iam/resource/${urn}/authorization/check`,
    {
      actions,
    },
  );
  return data;
};

function reducePages(pages: PageInterface[]) {
  const mergedPages = pages.reduce(
    (acc: PageReduceIam, page: PageInterface) => {
      if (acc[page.resourceURN]) {
        acc[page.resourceURN].authorizedActions = [
          ...new Set([
            ...acc[page.resourceURN].authorizedActions,
            ...page.authorizedActions,
          ]),
        ];
        acc[page.resourceURN].unauthorizedActions = [
          ...new Set([
            ...acc[page.resourceURN].unauthorizedActions,
            ...page.unauthorizedActions,
          ]),
        ];
      } else {
        acc[page.resourceURN] = {
          ...page,
          authorizedActions: [...new Set(page.authorizedActions)],
          unauthorizedActions: [...new Set(page.unauthorizedActions)],
        };
      }
      return acc;
    },
    {},
  );
  const uniquePages = Object.values(mergedPages);
  return uniquePages;
}
export function useInfiniteAuthorizationsIam({
  actions = [],
  urns = [],
  isTrigger = true,
  pageIndex = 0,
}: IamInterface) {
  const [authorizedActions, setAuthorizedActions] = useState([]);
  const [previousPageIndices, setPreviousPageIndices] = useState([]);

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['iam-authorization-infinite'],
    queryFn: () => fetchAuthorizationsCheck({ actions, urns }),
    initialPageParam: pageIndex,
    enabled: urns.length > 0 && actions.length > 0 && isTrigger,
    getNextPageParam: () => pageIndex,
  });

  useEffect(() => {
    if (data) {
      const pagesFlatten = data?.pages.map((page) => page).flat();
      setAuthorizedActions(reducePages(pagesFlatten));
      setPreviousPageIndices(data?.pageParams);
    }
  }, [data]);

  return { authorizedActions, fetchNextPage, previousPageIndices };
}

export function useIsAuthorized(action: string, urn: string) {
  const { authorizedActions } = useInfiniteAuthorizationsIam({});

  let urnMapped: boolean[] = [];
  if (authorizedActions && Object.values(authorizedActions).length > 0) {
    urnMapped = authorizedActions?.map(
      (element: PageInterface) =>
        element.resourceURN === urn &&
        element.authorizedActions.indexOf(action) > -1,
    );
  }
  return urnMapped.indexOf(true) > -1;
}

export function useAuthorizationsIam({
  actions,
  urns,
  isTrigger = true,
}: IamInterface) {
  const [authorizedActions, setAuthorizedActions] = useState([]);
  const { data } = useQuery({
    queryKey: ['iam-authorization', urns],
    queryFn: () => fetchAuthorizationsCheck({ actions, urns }),
    enabled: urns.length > 0 && actions.length > 0 && isTrigger,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      setAuthorizedActions(data);
    }
  }, [data]);

  return authorizedActions;
}

export function useAuthorizationIam(
  actions: string[],
  urn: string,
  isTrigger = true,
) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { data, isLoading, isFetched } = useQuery({
    queryKey: [urn, actions[0]],
    queryFn: () => fetchAuthorizationCheck(actions, urn),
    enabled: urn && actions && actions.length > 0 && isTrigger,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      const { authorizedActions } = data;
      if (authorizedActions.length > 0) {
        setIsAuthorized(true);
      }
    }
  }, [data]);

  return { isAuthorized, isLoading, isFetched };
}
