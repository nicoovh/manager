import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useProject, PciProject } from '@/api';

export type BreadcrumbItem = {
  label: string | undefined;
  href?: string;
};

export interface BreadcrumbProps {
  rootLabel?: string;
  appName?: string;
  projectId?: string;
  items?: BreadcrumbItem[];
}

export const usePciBreadcrumb = ({
  projectId,
  appName,
  items,
}: BreadcrumbProps) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const [appRoot, setAppRoot] = useState<BreadcrumbItem[]>([]);
  const { project } = useProject({ projectId });

  useEffect(() => {
    const { description } = project as PciProject;
    const fetchRoot = async () => {
      try {
        const response = (await shell?.navigation.getURL(
          'public-cloud',
          `#/pci/projects/${projectId}`,
          {},
        )) as string;
        const rootItem = {
          label: description,
          href: response as string,
        };
        const appRoot = {
          label: appName,
          href: response.split('public-cloud')[1],
        };
        setRoot([rootItem]);
        setAppRoot([appRoot]);
      } catch (error) {
        console.error('Error fetching root URL:', error);
      }
    };
    if (project) fetchRoot();
  }, [project]);

  return [...root, ...appRoot];
};

export const useBreadcrumb = ({ rootLabel, appName }: BreadcrumbProps) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const [paths, setPaths] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = await shell?.navigation.getURL(appName, '#/', {});
        const rootItem = {
          label: rootLabel,
          href: String(response),
        };
        setRoot([rootItem]);
      } catch (error) {
        console.error('Error fetching root URL:', error);
      }
    };
    fetchRoot();
  }, [rootLabel, appName, shell?.navigation]);

  useEffect(() => {
    const pathsTab = pathnames.map((value) => ({
      label: value,
      href: `/#/${appName}/${value}`,
    }));
    setPaths(pathsTab);
  }, [location]);

  return [...root, ...paths];
};
