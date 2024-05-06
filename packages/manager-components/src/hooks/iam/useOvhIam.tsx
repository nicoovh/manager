import { useState, useEffect } from 'react';
import { apiClient } from '@ovh-ux/manager-core-api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { IamInterface } from './iam.interface';

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

export function useAuthorizationsIam({
  actions,
  urns,
  isTrigger = true,
}: IamInterface) {
  const [authorizedActions, setAuthorizedActions] = useState([]);
  const { data } = useQuery({
    queryKey: ['iam-authorization', urns, actions],
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

export function useAuthorizationIam(
  actions: string[],
  urn: string,
  isTrigger = true,
) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { data, isLoading, isFetched } = useQuery({
    queryKey: [urn, actions],
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
