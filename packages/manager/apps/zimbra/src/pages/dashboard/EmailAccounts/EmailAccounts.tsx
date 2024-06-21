import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  DatagridColumn,
  Links,
  LinkType,
  ManagerButton,
  Notifications,
} from '@ovhcloud/manager-components';
import { Outlet } from 'react-router-dom';

import {
  useOrganization,
  useOverridePage,
  useGenerateUrl,
  useAccountList,
  usePlatform,
} from '@/hooks';
import LabelChip from '@/components/LabelChip';
import guidesConstants from '@/guides.constants';
import ActionButtonEmail from './ActionButtonEmail';
import { convertOctets } from '@/utils';

export type EmailsItem = {
  id: string;
  email: string;
  offer: string;
  organizationId: string;
  organizationLabel: string;
  used: number;
  available: number;
};

const columns: DatagridColumn<EmailsItem>[] = [
  {
    id: 'email account',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {item.email}
      </OsdsText>
    ),
    label: 'zimbra_emails_datagrid_email_label',
  },
  {
    id: 'organization',
    cell: (item) =>
      item.organizationLabel && (
        <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>
      ),
    label: 'zimbra_emails_datagrid_organization_label',
  },
  {
    id: 'offer',
    cell: (item) =>
      item.offer && (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
        >
          {item.offer}
        </OsdsText>
      ),
    label: 'zimbra_emails_datagrid_offer_label',
  },
  {
    id: 'quota',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {convertOctets(item.used)} / {convertOctets(item.available)}
      </OsdsText>
    ),
    label: 'zimbra_emails_datagrid_quota',
  },
  {
    id: 'tooltip',
    cell: (item: EmailsItem) => <ActionButtonEmail emailsItem={item} />,
    label: '',
  },
];

export default function EmailAccounts() {
  const { t } = useTranslation('emails');
  const { platformUrn } = usePlatform();
  const { data: organization } = useOrganization();
  const { data } = useAccountList({
    organizationId: organization?.id,
  });
  const isOverriddedPage = useOverridePage();

  const items: EmailsItem[] =
    data?.map((item) => ({
      id: item.id,
      email: item.currentState.email,
      offer: item.currentState.offer,
      organizationId: item.targetSpec.organizationId,
      organizationLabel: item.targetSpec.organizationLabel,
      used: item.targetSpec.quota.used,
      available: item.targetSpec.quota.available,
    })) ?? [];

  const webmailUrl = guidesConstants.GUIDES_LIST.webmail.url;

  const hrefAddEmailAccount = useGenerateUrl('./add', 'href');

  return (
    <>
      <Outlet />
      <div className="py-6 mt-8">
        <Notifications />
        {!isOverriddedPage && (
          <>
            <div className="mb-8">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                hue={ODS_TEXT_COLOR_HUE._500}
                size={ODS_TEXT_SIZE._200}
                className="font-bold mr-4"
              >
                {t('zimbra_emails_datagrid_webmail_label')}
              </OsdsText>
              <Links
                href={webmailUrl}
                type={LinkType.external}
                label={webmailUrl}
                target={OdsHTMLAnchorElementTarget._blank}
              ></Links>
            </div>
            <ManagerButton
              color={ODS_THEME_COLOR_INTENT.primary}
              inline={true}
              size={ODS_BUTTON_SIZE.sm}
              urn={platformUrn}
              iamActions={['zimbra:apiovh:platform/account/create']}
              href={hrefAddEmailAccount}
            >
              <span slot="start">
                <OsdsIcon
                  name={ODS_ICON_NAME.PLUS}
                  size={ODS_ICON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  contrasted
                ></OsdsIcon>
              </span>
              <span slot="end">{t('zimbra_emails_account_add')}</span>
            </ManagerButton>
            <Datagrid
              columns={columns.map((column) => ({
                ...column,
                label: t(column.label),
              }))}
              items={items}
              totalItems={items.length}
            />
          </>
        )}
      </div>
    </>
  );
}
