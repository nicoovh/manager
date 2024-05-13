import {
  useEnvironment,
  useNavigation,
} from '@ovh-ux/manager-react-shell-client';
import { Card, OnboardingLayout } from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  OdsBreadcrumbAttributeItem,
} from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsText } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { TProject } from '@/api/data/project';
import { GUIDES } from './onboarding.constants';
import OnBoardingGuard from './OnboardingGuard';

export default function OnBoardingPage() {
  const { t } = useTranslation(['onboarding', 'common']);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { ovhSubsidiary } = useEnvironment().getUser();
  const project = useRouteLoaderData('public-ips') as TProject;
  const [urlProject, setUrlProject] = useState('');

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: urlProject,
      label: project?.description,
    },
    {
      label: t('pci_projects_project_network_private'),
    },
  ];

  return (
    <OnBoardingGuard projectId={projectId}>
      <>
        {project && <OsdsBreadcrumb items={breadcrumbItems} />}

        <OnboardingLayout
          title={t('pci_projects_project_network_private')}
          img={{ src: '/assets/private-networks.png' }}
          description={
            <>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {t('pci_projects_project_network_private_vrack_empty')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                className="mt-6 block"
              >
                {t('pci_projects_project_network_private_vrack_deploy')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-4 block"
              >
                {t('pci_projects_project_network_private_vrack_explanation_1')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                className="mt-6 block"
              >
                {t('pci_projects_project_network_private_vrack_explanation_2')}
              </OsdsText>
            </>
          }
          orderButtonLabel={t('pci_projects_project_network_private_create', {
            ns: 'common',
          })}
          onOrderButtonClick={() => navigate('../new')}
        >
          <aside className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12">
            {GUIDES.map((guide) => {
              const card = {
                id: guide.id,
                href: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
                texts: {
                  title: t(
                    `pci_projects_project_network_private_vrack_guides_${guide.id}_title`,
                  ),
                  category: t('onboarding_guide_title'),
                },
              };

              return <Card key={card.id} href={card.href} texts={card.texts} />;
            })}
          </aside>
        </OnboardingLayout>
        <Outlet />
      </>
    </OnBoardingGuard>
  );
}
