import React, {
  PropsWithChildren,
  RefAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
} from 'react';
import { JSX, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';
import { useTranslation } from 'react-i18next';
import './translations';

import { useAuthorizationIam } from '../../hooks/iam';

export type ManagerTextProps = PropsWithChildren<{
  action?: string;
  urn?: string;
}>;

export const ManagerText = ({
  children,
  action,
  urn,
  ...restProps
}: ManagerTextProps &
  any &
  ForwardRefExoticComponent<
    JSX.OsdsText &
      Omit<HTMLAttributes<HTMLOsdsTextElement>, 'style'> &
      StyleReactProps &
      RefAttributes<HTMLOsdsTextElement>
  >) => {
  const { t } = useTranslation('iam');
  console.info('manager Text action : ', action);
  const { isAuthorized } = useAuthorizationIam([action], urn);
  if (!isAuthorized) {
    return (
      <OsdsTooltip>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.error}
          size={ODS_TEXT_SIZE._300}
          {...restProps}
        >
          {t('iam_hidden_text').toUpperCase()}
        </OsdsText>
        <OsdsTooltipContent slot="tooltip-content">
          <div>{t('common_iam_actions_message')}</div>
        </OsdsTooltipContent>
      </OsdsTooltip>
    );
  }
  return <OsdsText {...restProps}>{children}</OsdsText>;
};
