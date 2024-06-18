import { useMutation, useQuery } from '@tanstack/react-query';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import { useCatalogPrice, useProject } from '@ovhcloud/manager-components';
import {
  deleteVolume,
  getAllVolumes,
  getVolume,
  getVolumeSnapshot,
  paginateResults,
  sortResults,
  TVolume,
  TVolumeSnapshot,
  VolumeOptions,
} from '@/api/data/volume';
import queryClient from '@/queryClient';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';
import { useCatalog } from '@/api/hooks/useCatalog';
import { TPricing } from '@/api/data/catalog';
import { UCENTS_FACTOR } from '@/hooks/currency-constants';

export const useAllVolumes = (projectId: string) => {
  const { translateRegion } = useTranslatedMicroRegions();
  return useQuery({
    queryKey: ['project', projectId, 'volumes'],
    queryFn: () => getAllVolumes(projectId),
    select: (data) =>
      data.map((volume: TVolume) => {
        let statusGroup = '';
        if (['available', 'in-use'].includes(volume.status)) {
          statusGroup = 'ACTIVE';
        }
        if (
          [
            'creating',
            'attaching',
            'detaching',
            'deleting',
            'backing-up',
            'restoring-backup',
            'snapshotting',
            'awaiting-transfer',
          ].includes(volume.status)
        ) {
          statusGroup = 'PENDING';
        }
        if (
          [
            'error',
            'error_deleting',
            'error_restoring',
            'error_extending',
          ].includes(volume.status)
        ) {
          statusGroup = 'ERROR';
        }
        return {
          ...volume,
          statusGroup,
          regionName: translateRegion(volume.region),
        };
      }),
  });
};

export const useVolumes = (
  projectId: string,
  { pagination, sorting }: VolumeOptions,
  filters: Filter[] = [],
) => {
  const { data: volumes, error, isLoading, isPending } = useAllVolumes(
    projectId,
  );

  return useMemo(
    () => ({
      isLoading,
      isPending,
      error,
      data: paginateResults<TVolume>(
        sortResults(applyFilters(volumes || [], filters), sorting),
        pagination,
      ),
    }),
    [isLoading, isPending, error, volumes, pagination, sorting, filters],
  );
};

export const getVolumeQueryKey = (projectId: string, volumeId: string) => [
  'volume',
  projectId,
  volumeId,
];

export const getVolumeQuery = (projectId: string, volumeId: string) => ({
  queryKey: getVolumeQueryKey(projectId, volumeId),
  queryFn: (): Promise<TVolume> => getVolume(projectId, volumeId),
});

export const useVolume = (projectId: string, volumeId: string) =>
  useQuery({ ...getVolumeQuery(projectId, volumeId) });

export const getVolumeSnapshotQueryKey = (projectId: string) => [
  'volume-snapshot',
  projectId,
];

export const useVolumeSnapshot = (projectId: string) =>
  useQuery({
    queryKey: ['volume-snapshot', projectId],
    queryFn: (): Promise<TVolumeSnapshot[]> => getVolumeSnapshot(projectId),
  });

interface DeleteVolumeProps {
  projectId: string;
  volumeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useDeleteVolume = ({
  projectId,
  volumeId,
  onError,
  onSuccess,
}: DeleteVolumeProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteVolume(projectId, volumeId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getVolumeQueryKey(projectId, volumeId),
      });
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'volumes'],
      });
      onSuccess();
    },
  });
  return {
    deleteVolume: () => mutation.mutate(),
    ...mutation,
  };
};

export const convertUcentsToCurrency = (value: number, interval = 1) =>
  value / interval / UCENTS_FACTOR;

export const usePriceTransformer = () => {
  const { getFormattedCatalogPrice } = useCatalogPrice();
  return (price: TPricing, currencyCode: string) => ({
    ...price,
    priceInUcents: price.price,
    intervalUnit: price.interval,
    price: {
      currencyCode,
      text: getFormattedCatalogPrice(price.price),
      value: convertUcentsToCurrency(price.price),
    },
  });
};

export const useGetVolumePrice = (projectId: string, volumeId: string) => {
  const { data: volume } = useVolume(projectId, volumeId);
  const { data: project } = useProject(projectId);
  const { data: catalog } = useCatalog();
  const priceFormatter = usePriceTransformer();
  const relatedCatalog: Record<string, TPricing> = useMemo(() => {
    if (!catalog || !project || !volume) {
      return {};
    }
    const projectPlan = catalog.plans.find((plan) => {
      console.log(plan);
      return plan.planCode === project.planCode;
    });
    if (!projectPlan) {
      console.log('Fail to get project plan');
      return {};
    }
    const pricesMap = {};
    projectPlan.addonFamilies.forEach((family) => {
      family.addons.forEach((planCode) => {
        const addon = catalog.addons.find(
          (addonCatalog) => addonCatalog.planCode === planCode,
        );
        const pricing =
          addon.pricings.find(
            ({ capacities }) =>
              capacities.includes('renew') ||
              capacities.includes('consumption'),
          ) || ({} as TPricing);
        pricesMap[planCode] = priceFormatter(
          pricing,
          catalog.locale.currencyCode,
        );
      });
    });
    return pricesMap;
  }, [catalog, project, volume]);

  return useMemo(() => {
    if (!relatedCatalog?.length) {
      return {};
    }
    const productCatalog: TPricing =
      relatedCatalog[`volume.${volume.type}.consumption.${volume.region}`] ||
      relatedCatalog[`volume.${volume.type}.consumption`];

    return {};
  }, [volume, project, catalog, relatedCatalog]);
};
