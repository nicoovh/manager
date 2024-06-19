import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useEffect } from 'react';
import ListingPage from '@/pages/list/List.page';
import OnBoardingPage from '@/pages/onboarding/OnBoarding.page';
import { useAllVolumes } from '@/api/hooks/useVolume';

export default function IndexPage() {
  const { projectId } = useParams();
  const {
    data: volumes,
    isPending: isPendingVolume,
    isLoading: isLoadingVolume,
  } = useAllVolumes(projectId);
  const navigate = useNavigate();
  const isLoading = isPendingVolume || isLoadingVolume;
  console.log('coucou');
  useEffect(() => {
    if (!isLoading) {
      console.log('demarrage useEffect');
      if (volumes && volumes.length > 0) {
        console.log('volumes existants');
        navigate(``);
        console.log('beubeu');
      } else {
        console.log('pas de volumes');
        navigate(`./onboarding`);
      }
    }
  }, [navigate, isLoading, volumes]);
  return isLoading ? (
    <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline={true} />
  ) : (
    <>
      <Routes>
        <Route path={``} element={<ListingPage />} />
        <Route path={'./onboarding'} element={<OnBoardingPage />} />
      </Routes>
      <Outlet />
    </>
  );
}
