import {
  redirect,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { lazy, useEffect } from 'react';
import ListingPage from '@/pages/list/List.page';
import OnBoardingPage from '@/pages/onboarding/OnBoarding.page';
import { useAllVolumes } from '@/api/hooks/useVolume';
import HidePreloader from '@/core/HidePreloader';

const DeleteStorage = lazy(() => import('./delete/DeleteStorage.page'));

export default function IndexPage() {
  const { projectId } = useParams();
  const { data, isPending } = useAllVolumes(projectId);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // redirect to onboarding page
    if (!isPending && !data?.length) {
      navigate(`/pci/projects/${projectId}/storages/blocks/onboarding`);
    }
    // redirect to listing page
    if (!isPending && data?.length && /onboarding/.test(location.pathname)) {
      navigate(`/pci/projects/${projectId}/storages/blocks`);
    }
  }, [isPending, location.pathname]);
  return isPending ? (
    <HidePreloader />
  ) : (
    <Routes>
      {data.length && (
        <Route path={''} element={<ListingPage />}>
          <Route
            path="delete"
            loader={() => {
              console.log('LOADER');
              return true;
            }}
            element={<h1>HELLO WORLD</h1>}
          />
          <Route
            path="delete/:volumeId"
            element={<DeleteStorage />}
            handle={{ tracking: 'delete' }}
          />
        </Route>
      )}
      {!data?.length && (
        <Route path={'./onboarding'} element={<OnBoardingPage />} />
      )}
      <Route path="*" element={null} />
    </Routes>
  );
}
