import React, { useEffect, useContext } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { Routes } from './routes';
import queryClient from '../query.client';

odsSetup();

function App() {
  const { shell } = useContext(ShellContext);
  const router = createHashRouter(Routes);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
