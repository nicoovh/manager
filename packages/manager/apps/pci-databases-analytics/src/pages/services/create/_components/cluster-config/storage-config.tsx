import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatStorage } from '@/lib/bytesHelper';
import { database } from '@/models/database';
import { P, Span } from '@/components/typography';

interface StorageConfigProps {
  availability: database.Availability;
  value: number;
  onChange: (newValue: number) => void;
}
const DEFAULT_UNIT = 'GB';
const StorageConfig = React.forwardRef<HTMLInputElement, StorageConfigProps>(
  ({ availability, value, onChange }, ref) => {
    const { t } = useTranslation('pci-databases-analytics/components/cluster');
    if (!availability.specifications.storage) return <></>;
    const { storage, flavor } = availability.specifications;
    const { minimum, maximum, step } = storage;
    if (maximum.value === 0 || minimum.value === maximum.value || !step) {
      return <></>;
    }
    const minAddable = 0;
    const maxAddable = maximum.value - minimum.value;
    return (
      <div>
        <P>
          {t('storageFlavorDescription', {
            flavor,
            includedStorage: formatStorage(minimum),
            maxAdditionalStorage: formatStorage({
              value: maxAddable,
              unit: DEFAULT_UNIT,
            }),
            step: formatStorage(step),
          })}
        </P>
        <Label htmlFor="storage-select">{t('inputStorageLabel')}</Label>
        <div className="flex flex-col">
          <div className="flex justify-between mb-2">
            <Span>{t('inputStorageNoneValue')}</Span>
            <Span>
              {formatStorage({
                value: maxAddable,
                unit: DEFAULT_UNIT,
              })}
            </Span>
          </div>
          <Slider
            ref={ref}
            onValueChange={([newValue]) => onChange(newValue)}
            id="storage-select"
            name="storage-select"
            defaultValue={[minimum.value]}
            value={[value]}
            min={minAddable}
            max={maxAddable}
            step={step?.value || 1}
          />
          <div className="flex w-full justify-center mt-2">
            <Span className="font-bold">
              {formatStorage({
                value,
                unit: DEFAULT_UNIT,
              })}
            </Span>
          </div>
        </div>
      </div>
    );
  },
);
StorageConfig.displayName = 'StorageConfig';
export default StorageConfig;
