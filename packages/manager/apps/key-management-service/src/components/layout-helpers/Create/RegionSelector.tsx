import React, { useContext, Dispatch, SetStateAction, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsText,
  OsdsSelect,
  OsdsSelectOption,
  OsdsFormField,
  OsdsButton,
  OsdsIcon,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';

import {
  ODS_SPINNER_SIZE,
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_SELECT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ErrorBanner } from '@ovhcloud/manager-components';
import { useOrderCatalogOKMS } from '@/hooks/useOrderCatalogOKMS';
import { ROUTES_URLS } from '@/routes/routes.constants';

export type RegionSelectorProps = {
  setOrderInitiated: () => void;
  selectRegion: Dispatch<SetStateAction<string>>;
  selectedRegion: string | null;
};

const RegionSelector = ({
  setOrderInitiated,
  selectRegion,
  selectedRegion,
}: RegionSelectorProps) => {
  const { t } = useTranslation('key-management-service/create');
  const { environment } = useContext(ShellContext);
  const {
    data: orderCatalogOKMS,
    isError,
    error,
    isLoading,
  } = useOrderCatalogOKMS(environment.getUser().ovhSubsidiary);
  const navigate = useNavigate();

  if (isError && error) {
    return (
      <Suspense>
        <ErrorBanner error={error.response} />
      </Suspense>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-6">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('key_management_service_create_region_title')}
        </OsdsText>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('key_management_service_create_region_description')}
        </OsdsText>

        <OsdsFormField inline className="mb-5">
          <div slot="label">
            {isLoading && (
              <OsdsSpinner className="mr-3" inline size={ODS_SPINNER_SIZE.sm} />
            )}
          </div>
          {orderCatalogOKMS && !isLoading && (
            <OsdsSelect
              inline
              size={ODS_SELECT_SIZE.md}
              onOdsValueChange={(v) => {
                selectRegion(v.detail.value.toString());
              }}
            >
              <span slot="placeholder">
                {t('key_management_service_create_select_placeholder')}
              </span>
              {orderCatalogOKMS.plans[0].configurations[0].values.map(
                (region) => {
                  return (
                    <OsdsSelectOption value={region} key={region}>
                      {t(
                        `key_management_service_create_region_${region.toLowerCase()}`,
                      )}
                    </OsdsSelectOption>
                  );
                },
              )}
            </OsdsSelect>
          )}
        </OsdsFormField>
      </div>
      <div className="flex flex-row mt-6">
        <OsdsButton
          className="mr-1"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            navigate(ROUTES_URLS.root);
          }}
        >
          {t('key_management_service_create_cta_cancel')}
        </OsdsButton>
        <OsdsButton
          className="mr-1"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={selectedRegion ? undefined : true}
          onClick={() => {
            setOrderInitiated();
          }}
        >
          <span slot="start">
            <OsdsIcon
              name={ODS_ICON_NAME.EXTERNAL_LINK}
              size={ODS_ICON_SIZE.xs}
              contrasted
            ></OsdsIcon>
          </span>
          {t('key_management_service_create_cta_order')}
        </OsdsButton>
      </div>
    </>
  );
};

export default RegionSelector;
