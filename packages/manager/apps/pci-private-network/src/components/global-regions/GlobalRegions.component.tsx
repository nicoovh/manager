import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsMessage,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FilterAdd,
  FilterList,
  useColumnFilters,
  Notifications,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';

import { useProjectRegions } from '@/api/hooks/useRegions';
import {
  useAggregatedNonLocalNetworks,
  useGlobalRegionsNetworks,
} from '@/api/hooks/useNetwork';
import { useGateways } from '@/api/hooks/useGateway';
import GlobalRegionsDatagrid from './GlobalRegionsDatagrid';

export type TGlobalRegions = {
  projectId: string;
  projectUrl: string;
};

export default function GlobalRegionsComponent({
  projectId,
  projectUrl,
}: Readonly<TGlobalRegions>) {
  const { t } = useTranslation(['common', 'error', 'filter']);

  const [searchField, setSearchField] = useState('');
  const { pagination, setPagination } = useDatagridSearchParams();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const filterPopoverRef = useRef(undefined);

  const { data: regions } = useProjectRegions(projectId);

  const { data: gateways } = useGateways(projectId);
  const { data: aggregatedNetworks } = useAggregatedNonLocalNetworks(
    projectId,
    regions,
  );

  const {
    data: networks,
    error,
    isLoading: networksLoading,
    isPending: networksPending,
  } = useGlobalRegionsNetworks(
    projectId,
    aggregatedNetworks || [],
    gateways || [],
    pagination,
    filters,
  );

  const isLoading = networksLoading || networksPending;

  return (
    <div>
      <Notifications />
      <OsdsDivider />
      <div className="sm:flex items-center justify-between">
        <OsdsButton
          className="mr-1 xs:mb-1 sm:mb-0"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="mr-3"
          />
          {t('pci_projects_project_network_private_create')}
        </OsdsButton>

        <div className="justify-between flex">
          <OsdsSearchBar
            className={'w-[70%]'}
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
              addFilter({
                key: 'search',
                value: detail.inputValue,
                comparator: FilterComparator.Includes,
                label: '',
              });
              setSearchField('');
            }}
          />
          <OsdsPopover ref={filterPopoverRef}>
            <OsdsButton
              slot="popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.FILTER}
                size={ODS_ICON_SIZE.xs}
                className={'mr-2'}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {t('common_criteria_adder_filter_label', { ns: 'filter' })}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'vlanId',
                    label: t('pci_projects_project_network_private_vlan_id'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'name',
                    label: t('pci_projects_project_network_private_name'),
                    comparators: FilterCategories.String,
                  },
                ]}
                onAddFilter={(addedFilter, column) => {
                  setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize,
                  });
                  addFilter({
                    ...addedFilter,
                    label: column.label,
                  });
                  filterPopoverRef.current?.closeSurface();
                }}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>
      </div>

      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>

      {error && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          {t('manager_error_page_default', { ns: 'error' })}
        </OsdsMessage>
      )}

      {isLoading && !error && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!error && !isLoading && (
        <div className="mt-8">
          <GlobalRegionsDatagrid
            projectUrl={projectUrl}
            items={networks.rows}
            totalItems={networks.totalRows || 0}
            pagination={pagination}
            pageCount={networks.pageCount || 0}
            onPaginationChange={setPagination}
          />
        </div>
      )}
    </div>
  );
}
