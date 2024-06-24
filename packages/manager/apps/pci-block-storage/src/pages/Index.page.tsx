import {
  redirect,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ListingPage from '@/pages/list/List.page';
import OnBoardingPage from '@/pages/onboarding/OnBoarding.page';
import { useAllVolumes } from '@/api/hooks/useVolume';
import HidePreloader from '@/core/HidePreloader';
import DeletePage from '@/pages/delete/DeleteStorage.page';

export default function IndexPage() {
  const { projectId } = useParams();
  const { data: volumes, isFetched } = useAllVolumes(projectId);
  const navigate = useNavigate();
  const location = useLocation();

  const [shouldNavigate, setShouldNavigate] = useState<boolean>(true);

  const reRoute = () => {
    if (volumes.length) {
      if (/onboarding/.test(location.pathname)) {
        navigate(`/pci/projects/${projectId}/storages/blocks`);
      } else {
        setShouldNavigate(false);
      }
    } else if (!/onboarding/.test(location.pathname)) {
      navigate(`/pci/projects/${projectId}/storages/blocks/onboarding`);
    } else {
      setShouldNavigate(false);
    }
  };

  useEffect(() => {
    if (isFetched) {
      reRoute();
    }
  }, [isFetched, location.pathname]);

  useEffect(() => {
    if (isFetched) reRoute();
  }, []);

  const isShowLoader = !isFetched || shouldNavigate;

  return (
    <Routes>
      {isShowLoader ? (
        <Route path={'*'} element={<HidePreloader />}></Route>
      ) : (
        <>
          {volumes.length ? (
            <Route
              path={''}
              element={<ListingPage />}
              handle={{ tracking: 'blocks' }}
            >
              <Route
                path={'delete'}
                loader={({ params, request }) => {
                  // this redirection is added to be iso with angularJS app URLs
                  const storageId = new URL(request.url).searchParams.get(
                    'storageId',
                  );
                  return redirect(
                    `/pci/projects/${params.projectId}/storages/blocks/delete/${storageId}`,
                  );
                }}
              ></Route>
              <Route
                path={'delete/:volumeId'}
                element={<DeletePage />}
                handle={{ tracking: 'delete' }}
              ></Route>
            </Route>
          ) : (
            <Route path={'onboarding'} element={<OnBoardingPage />} />
          )}
          <Route path={'*'} element={<>Not found page</>} />
        </>
      )}
    </Routes>
  );
}
