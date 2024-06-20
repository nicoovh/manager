import React from 'react';
import { Headers, HeadersProps } from '../../content';
import { Description, LinkType, Links, Subtitle } from '../../typography';
import { PageLayout } from '../layout/layout.component';
import { useTranslation } from 'react-i18next';
import './translations';

export interface DashboardLayoutProps {
  breadcrumb?: React.ReactElement;
  content?: React.ReactElement;
  header?: HeadersProps;
  message?: React.ReactElement;
  description?: string;
  subtitle?: string;
  subdescription?: string;
  backLinkLabel?: string;
  onBackLinkClick?: () => void;
  tabs?: React.ReactElement;
  onClickReturn?: () => void;
}

export const DashboardLayout = ({
  backLinkLabel,
  onBackLinkClick,
  breadcrumb,
  description,
  subtitle,
  subdescription,
  message,
  content,
  header,
  tabs,
}: DashboardLayoutProps) => {
  const { t } = useTranslation('dashboard_template');
  return (
    <PageLayout>
      <div className="mb-6">{breadcrumb}</div>
      {header && <Headers {...header} />}
      <Links
        className="mb-8"
        onClickReturn={() => {
          onBackLinkClick?.();
          window.history.back();
        }}
        label={backLinkLabel || t('dashboard_template_back_link')}
        type={LinkType.back}
      />
      {description && <Description className="mb-9">{description}</Description>}
      {message && <div className="mb-8">{message}</div>}
      {subtitle && <Subtitle className="block mb-6">{subtitle}</Subtitle>}
      {subdescription && (
        <Description className="mb-8">{subdescription}</Description>
      )}
      <div className="mb-6">{tabs}</div>
      <div>{content}</div>
    </PageLayout>
  );
};
