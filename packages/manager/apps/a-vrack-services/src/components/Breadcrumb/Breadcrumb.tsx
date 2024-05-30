import React from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import {
  useBreadcrumb,
  BreadcrumbItem,
} from '@/hooks/breadcrumb/useBreadcrumb';
import appConfig from '@/a-vrack-services.config';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ customRootLabel }: BreadcrumbProps): JSX.Element {
  const label = customRootLabel || appConfig.rootLabel;

  const breadcrumbItems = useBreadcrumb({
    rootLabel: label,
    appName: 'a-vrack-services',
  });
  return <OsdsBreadcrumb items={breadcrumbItems} />;
}

export default Breadcrumb;
