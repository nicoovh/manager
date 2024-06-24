import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsClipboardAttribute } from '@ovhcloud/ods-components';
import { OsdsClipboard, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './translations';

export const Clipboard: React.FC<OdsClipboardAttribute> = ({
  disabled,
  inline,
  value,
}) => {
  const { t } = useTranslation('clipboard');

  return (
    <OsdsClipboard
      value={value}
      inline={inline}
      disabled={disabled}
      data-testid="clipboard"
    >
      <span slot="success-message">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.success}
          data-testid="clipboard-success"
        >
          {t('clipboard_copy_success')}
        </OsdsText>
      </span>
      <span slot="error-message">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.error}
          data-testid="clipboard-error"
        >
          {t('clipboard_copy_error')}
        </OsdsText>
      </span>
    </OsdsClipboard>
  );
};
