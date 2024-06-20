import { redirect } from 'react-router-dom';
import { getProjectQuery } from '@ovhcloud/manager-components';
import queryClient from '@/queryClient';

const lazyRouteConfig = (importFn: CallableFunction) => ({
  lazy: async () => {
    const { default: moduleDefault, ...moduleExports } = await importFn();

    return {
      Component: moduleDefault,
      ...moduleExports,
    };
  },
});

export interface RouteHandle {
  tracking?: string;
}

export const ROUTE_PATHS = {
  root: '/pci/projects/:projectId/storages/blocks',
  onboarding: '/pci/projects/:projectId/storages/blocks/onboarding',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'blocks',
    path: ROUTE_PATHS.root,
    loader: async ({ params }) =>
      queryClient.fetchQuery(getProjectQuery(params.projectId)),
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '*',
        handle: {
          tracking: 'blocks',
        },
        ...lazyRouteConfig(() => import('@/pages/Index.page')),
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
