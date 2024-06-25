import React from 'react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';

export interface DescriptionProps {
  children?: string;
}
export const Description: React.FC<DescriptionProps> = ({
  children,
}: DescriptionProps) => {
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._100}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {children}
    </OsdsText>
  );
};

export default Description;
