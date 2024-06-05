import { useSearchParams, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetAvailabilities,
  useGetFullCapabilities,
  useGetSuggestions,
} from '@/hooks/api/availabilities.api.hooks';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import LegalMentions from '@/pages/_components/legalMentions';
import OrderFunnel from './_components/order-funnel';
import { database } from '@/models/database';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import { OvhLink } from '@/components/links';
import Guides from '@/components/guides';
import { GuideSections } from '@/models/guide';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey={`breadcrumb`}
      namespace="pci-databases-analytics/services/new"
    />
  );
}

const Service = () => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const [searchParams] = useSearchParams();
  const { projectId, category } = useParams();
  const availabilitiesQuery = useGetAvailabilities(
    projectId,
    null,
    null,
    null,
    { refetchOnWindowFocus: false },
  );
  const suggestionsQuery = useGetSuggestions(projectId, {
    refetchOnWindowFocus: false,
  });
  const capabilitiesQuery = useGetFullCapabilities(projectId, {
    refetchOnWindowFocus: false,
  });
  const catalogQuery = useGetCatalog({ refetchOnWindowFocus: false });
  const loading =
    availabilitiesQuery.isLoading ||
    suggestionsQuery.isLoading ||
    capabilitiesQuery.isLoading ||
    catalogQuery.isLoading;

  // if we have en engine set in query params, override suggestions
  const stepEngine = searchParams.get('STEP_1');
  const suggestions =
    stepEngine && suggestionsQuery.data?.find((f) => f.engine === stepEngine)
      ? suggestionsQuery.data.map((s) =>
          s.engine === stepEngine
            ? {
                ...s,
                default: true,
                plan: searchParams.get('STEP_2') ?? s.plan,
                region: searchParams.get('STEP_3') ?? s.region,
                flavor: searchParams.get('STEP_4') ?? s.flavor,
              }
            : {
                ...s,
                default: false,
              },
        )
      : suggestionsQuery.data;
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.funnel} noEngineFilter />
      </div>
      <p>
        <Trans
          t={t}
          i18nKey={'description'}
          components={{
            anchor: (
              <OvhLink
                application="public-cloud"
                path={`#/pci/projects/${projectId}/private-networks`}
              ></OvhLink>
            ),
          }}
        ></Trans>
      </p>
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent">
            <Skeleton className="w-80 h-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
            </div>
          </div>
          <Skeleton className="w-full h-[600px]" />
        </div>
      ) : (
        <OrderFunnel
          availabilities={availabilitiesQuery.data.filter((a) =>
            category === database.CategoryEnum.all
              ? a
              : a.category === category,
          )}
          capabilities={capabilitiesQuery.data}
          suggestions={suggestions}
          catalog={catalogQuery.data}
        />
      )}
      <LegalMentions className="mt-4" />
    </>
  );
};

export default Service;
