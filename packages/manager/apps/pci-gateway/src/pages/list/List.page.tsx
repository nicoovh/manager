import {
  Datagrid,
  DataGridTextCell,
  FilterAdd,
  FilterList,
  isDiscoveryProject,
  Notifications,
  PciDiscoveryBanner,
  PciGuidesHeader,
  useColumnFilters,
  useDataGrid,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useAggregatedGateway } from '@/api/hooks/useGateway';
import useProject from '@/api/hooks/useProject';
import { Gateway } from '@/interface';
import PrivateIPs from '@/components/list/PrivateIPs.component';
import Actions from '@/components/list/Actions.component';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const { t: tFilter } = useTranslation('filter');
  const [projectUrl, setProjectUrl] = useState('');
  const [privateNetworkUrl, setPrivateNetworkUrl] = useState('');

  const navigation = useNavigation();
  const { projectId } = useParams();
  const [searchField, setSearchField] = useState('');
  const { data: project } = useProject(projectId || '');
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const filterPopoverRef = useRef(undefined);

  const { pagination, setPagination } = useDataGrid();

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
    navigation
      .getURL(
        'public-cloud',
        `#/pci/projects/${projectId}/private-networks`,
        {},
      )
      .then((data) => {
        setPrivateNetworkUrl(data as string);
      });
  }, [projectId, navigation]);

  const columns = [
    {
      id: 'name',
      cell: (props: Gateway) => {
        return (
          <>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              color={ODS_THEME_COLOR_INTENT.text}
              className={'block'}
            >
              {props.name}
            </OsdsText>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className={'block'}
            >
              {props.id}
            </OsdsText>
          </>
        );
      },
      label: t('pci_projects_project_public_gateway_name'),
    },
    {
      id: 'region',
      cell: (props: Gateway) => {
        return <DataGridTextCell>{props.region}</DataGridTextCell>;
      },
      label: t('pci_projects_project_public_gateway_region'),
    },
    {
      id: 'networksConnected',
      cell: (props: Gateway) => {
        return (
          <OsdsLink
            href={privateNetworkUrl}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {props.connectedNetworkCount}
          </OsdsLink>
        );
      },
      label: t('pci_projects_project_public_gateway_networks_connected'),
    },
    {
      id: 'formattedIps',
      cell: (props: Gateway) => {
        return <DataGridTextCell>{props.formattedIps}</DataGridTextCell>;
      },
      label: t('pci_projects_project_public_gateway_public_ip'),
    },
    {
      id: 'flavour',
      cell: (props: Gateway) => {
        return <DataGridTextCell>{props.model}</DataGridTextCell>;
      },
      label: t('pci_projects_project_public_gateway_flavour'),
    },
    {
      id: 'status',
      cell: (props: Gateway) => {
        return <DataGridTextCell>{props.status}</DataGridTextCell>;
      },
      label: t('pci_projects_project_public_gateway_status'),
    },
    {
      id: 'privateIPs',
      cell: (props: Gateway) => {
        return <PrivateIPs interfaces={props.interfaces} />;
      },
      label: t('pci_projects_project_public_gateway_private_ip'),
    },
    {
      id: 'actions',
      cell: () => {
        return (
          <div className="min-w-16">
            <Actions projectId={projectId} />
          </div>
        );
      },
      label: t(''),
    },
  ];

  const { data: aggregatedGateways, isLoading, error } = useAggregatedGateway(
    projectId,
    {
      pagination,
    },
    filters,
  );
  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              label: t('pci_projects_project_public_gateway_title'),
            },
          ]}
        />
      )}
      <div className="header mb-6 mt-8">
        <div className="flex items-center justify-between">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('pci_projects_project_public_gateway_title')}
          </OsdsText>
          <PciGuidesHeader category="instances"></PciGuidesHeader>
        </div>
      </div>
      <div>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          {t('pci_projects_project_public_gateways_intro_part_1')}
        </OsdsText>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          className={'mt-3'}
        >
          <ul>
            <li>{t('pci_projects_project_public_gateways_intro_part_2')}</li>
            <li>{t('pci_projects_project_public_gateways_intro_part_3')}</li>
          </ul>
        </OsdsText>
      </div>

      <OsdsDivider></OsdsDivider>
      <Notifications />
      <div className="mb-5">
        {isDiscoveryProject(project) && (
          <PciDiscoveryBanner projectId={projectId} />
        )}
      </div>
      <div className={'sm:flex items-center justify-between mt-4'}>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="xs:mb-0.5 sm:mb-0"
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className={'mr-2'}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('pci_projects_project_public_gateway_create')}
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
                key: 'name',
                value: detail.inputValue,
                comparator: FilterComparator.Includes,
                label: t('pci_projects_project_public_gateway_name'),
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
              {tFilter('common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'name',
                    label: t('pci_projects_project_public_gateway_name'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'region',
                    label: t('pci_projects_project_public_gateway_region'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'formattedIps',
                    label: t('pci_projects_project_public_gateway_public_ip'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'model',
                    label: t('pci_projects_project_public_gateway_flavour'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'status',
                    label: t('pci_projects_project_public_gateway_status'),
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
      {isLoading && (
        <div className="text-center">
          <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!isLoading && !error && (
        <div>
          <Datagrid
            columns={columns}
            items={aggregatedGateways?.rows || []}
            totalItems={aggregatedGateways?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      )}
      <Outlet />
    </>
  );
}
