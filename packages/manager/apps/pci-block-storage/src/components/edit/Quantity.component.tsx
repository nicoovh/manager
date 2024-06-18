import {
  OsdsButton,
  OsdsIcon,
  OsdsInput,
  OsdsQuantity,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TEXT_ALIGN,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useEffect, useState } from 'react';

export type QuantityProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  error?: boolean;
  onUpdateQuantity: (quantity: number) => void;
};
export default function Quantity({
  value,
  min,
  max,
  step,
  error,
  onUpdateQuantity,
}: Readonly<QuantityProps>) {
  const [quantity, setQuantity] = useState(value);
  const [canDownUo, setCanDownUp] = useState({
    canDown: quantity <= min,
    canUp: quantity >= max,
  });
  useEffect(() => {
    setCanDownUp({
      canDown: quantity <= min,
      canUp: quantity >= max,
    });
  }, [quantity, min, max]);
  // console.log('min atteint', quantity <= min, quantity);
  // @TODO fix issues when if we up one time quantity, the min button is still disabled but the statement is ok
  return (
    <OsdsQuantity>
      <OsdsButton
        slot="minus"
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        textAlign={ODS_BUTTON_TEXT_ALIGN.center}
        disabled={canDownUo.canDown}
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          name={ODS_ICON_NAME.MINUS}
          color={ODS_THEME_COLOR_INTENT.default}
          contrasted={true}
        />
      </OsdsButton>

      <OsdsInput
        type={ODS_INPUT_TYPE.number}
        color={
          error ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.primary
        }
        error={error}
        min={min || 1}
        max={max || 10}
        step={step || 1}
        value={quantity}
        default-value={quantity}
        className={error ? 'bg-red-50' : ''}
        size={ODS_INPUT_SIZE.md}
        onOdsValueChange={(event) => {
          const newQuantity = parseInt(event.detail.value, 10);
          setQuantity(newQuantity);
          onUpdateQuantity(newQuantity);
        }}
      />

      <OsdsButton
        slot="plus"
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        textAlign={ODS_BUTTON_TEXT_ALIGN.center}
        disabled={canDownUo.canUp}
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          name={ODS_ICON_NAME.PLUS}
          color={ODS_THEME_COLOR_INTENT.default}
          contrasted={true}
        ></OsdsIcon>
      </OsdsButton>
    </OsdsQuantity>
  );
}
