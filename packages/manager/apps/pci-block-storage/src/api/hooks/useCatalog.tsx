import { useQuery } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { getCatalog } from '@/api/data/catalog';

export const useCatalog = () => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  return useQuery({
    queryKey: ['catalog', ovhSubsidiary],
    queryFn: () => getCatalog(ovhSubsidiary),
  });
};
