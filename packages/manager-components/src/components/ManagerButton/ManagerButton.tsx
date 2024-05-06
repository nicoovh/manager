import React, { PropsWithChildren } from 'react';
import {
  OsdsButton,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import './translations';

import { useAuthorizationIam } from '../../hooks/iam';

export type ManagerButtonProps = PropsWithChildren<{
  action?: string;
  urn?: string;
}>;

export const ManagerButton = ({
  children,
  action,
  urn,
  ...restProps
}: ManagerButtonProps & any) => {
  const { t } = useTranslation('iam');
  const { isAuthorized } = useAuthorizationIam([action], urn);

  if (!isAuthorized) {
    return (
      <OsdsTooltip>
        <OsdsButton
          {...restProps}
          disabled={restProps.disabled || isAuthorized ? undefined : true}
        >
          {children}
        </OsdsButton>
        <OsdsTooltipContent slot="tooltip-content">
          <div>{t('common_iam_actions_message')}</div>
        </OsdsTooltipContent>
      </OsdsTooltip>
    );
  }
  return <OsdsButton {...restProps}>{children}</OsdsButton>;
};
