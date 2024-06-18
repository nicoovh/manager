import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useCatalogPrice,
  useProject,
  useProjectLocalRegions,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import {
  OsdsBreadcrumb,
  OsdsFormField,
  OsdsInput,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useEffect, useState } from 'react';
import { useGetVolumePrice, useVolume } from '@/api/hooks/useVolume';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';
import ChipRegion from '@/components/edit/ChipRegion.component';
import Quantity from '@/components/edit/Quantity.component';

export default function EditPage() {
  const { t } = useTranslation();
  const { t: tEdit } = useTranslation('edit');
  const { t: tVolumeEdit } = useTranslation('volume-edit');
  const { projectId, volumeId } = useParams();
  const { data: project } = useProject(projectId || '');
  const priceMaps = useGetVolumePrice(projectId, volumeId);
  console.log(priceMaps);
  const {
    data: volume,
    isLoading: isLoadingVolume,
    isPending: isPendingVolume,
  } = useVolume(projectId, volumeId);
  const projectUrl = useProjectUrl('public-cloud');
  const { translateRegion } = useTranslatedMicroRegions();
  const {
    data: localRegions,
    isPending: isPendingLocal,
    isLoading: isLoadingLocal,
  } = useProjectLocalRegions(projectId || '');
  const [formState, setFormState] = useState({
    name: volume?.name,
    size: volume?.size,
  });
  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(4);
  const [hasError, setHasError] = useState(false);
  const isLoading =
    isLoadingVolume || isPendingVolume || isPendingLocal || isLoadingLocal;
  useEffect(() => {
    if (volume) {
      setFormState({
        name: volume.name,
        size: volume.size,
      });
    }
  }, [volume]);
  useEffect(() => {
    setHasError(formState.size < 10 || formState.size > 4000);
  }, [formState]);
  return (
    <>
      {project && !isLoading ? (
        <>
          <OsdsBreadcrumb
            items={[
              {
                href: projectUrl,
                label: project.description,
              },
              {
                label: t('pci_projects_project_storages_blocks_title'),
                href: `${projectUrl}/storages/blocks`,
              },
              {
                label: volume.name,
                disabled: true,
              },
              {
                label: tEdit(
                  'pci_projects_project_storages_blocks_block_edit_title',
                ),
              },
            ]}
          />
          <div className="header mb-6 mt-8">
            <div className="flex items-center justify-between">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {tEdit('pci_projects_project_storages_blocks_block_edit_title')}
              </OsdsText>
            </div>
          </div>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
            color={ODS_THEME_COLOR_INTENT.promotion}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            className={'font-bold'}
          >
            {t('pci_projects_project_storages_blocks_region_label')}
          </OsdsText>
          <div className={'flex'}>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className={'mr-4'}
            >
              {translateRegion(volume.region)}
            </OsdsText>
            <ChipRegion region={volume.region} localRegions={localRegions} />
          </div>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
            color={ODS_THEME_COLOR_INTENT.promotion}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            className={'font-bold block mt-8'}
          >
            {tVolumeEdit(
              'pci_projects_project_storages_blocks_block_volume-edit_type_label',
            )}
          </OsdsText>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {volume.type}
          </OsdsText>
          <OsdsFormField className={'mt-8'}>
            <div slot="label">
              <OsdsText
                level={ODS_TEXT_LEVEL.caption}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                color={ODS_THEME_COLOR_INTENT.text}
                className={'font-bold'}
              >
                {tVolumeEdit(
                  'pci_projects_project_storages_blocks_block_volume-edit_name_label',
                )}
              </OsdsText>
            </div>
            <OsdsInput
              type={ODS_INPUT_TYPE.text}
              value={formState.name}
              className={'w-1/3'}
              color={ODS_THEME_COLOR_INTENT.primary}
              onOdsValueChange={(event) =>
                setFormState({ ...formState, name: event.detail.value })
              }
            />
          </OsdsFormField>
          <OsdsFormField className={'mt-8'}>
            <div slot="label">
              <OsdsText
                level={ODS_TEXT_LEVEL.caption}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                color={ODS_THEME_COLOR_INTENT.text}
                className={'font-bold'}
              >
                {tVolumeEdit(
                  'pci_projects_project_storages_blocks_block_volume-edit_size_label',
                )}
              </OsdsText>
            </div>
            <Quantity
              value={volume.size}
              min={10}
              max={4000}
              error={hasError}
              onUpdateQuantity={(quantity) =>
                setFormState({
                  ...formState,
                  size: quantity,
                })
              }
            />

            {/* <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
              size={ODS_THEME_TYPOGRAPHY_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {priceMaps.value}
              {getFormattedHourlyCatalogPrice(priceMaps.value)} (
              {getFormattedMonthlyCatalogPrice(priceMaps.value)})<span>*</span>
            </OsdsText> */}
          </OsdsFormField>
        </>
      ) : (
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline={true} />
      )}
    </>
  );
}
