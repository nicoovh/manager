import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import {
  useRouteSynchro,
  useRouting,
} from '@ovh-ux/manager-react-shell-client';
import { useQuery } from '@tanstack/react-query';
import {
  getZimbraPlatformList,
  ZimbraPlatformType,
  getZimbraPlatformListQueryKey,
} from '@/api/platform';

import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';

export default function Layout() {
  const location = useLocation();
  const routing = useRouting();

  const { data, isLoading, isError, error } = useQuery<
    ZimbraPlatformType[],
    Error
  >({
    queryKey: [getZimbraPlatformListQueryKey],
    queryFn: () => getZimbraPlatformList(),
  });
  useEffect(() => {
    routing.onHashChange();
  }, [location]);

  useRouteSynchro();

  return (
    <>
      <Outlet />
      {isLoading && <Loading />}
      {isError && <ErrorBanner error={error} />}
      {data?.length === 0 && <Navigate to="onboarding" />}
      {data?.length > 0 &&
        location.pathname === '/' &&
        location.search === '' && <Navigate to={`${data[0].id}`} />}
    </>
  );
}
