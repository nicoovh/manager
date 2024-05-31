import React from 'react';
import Onboarding from './index';
import { render, waitFor } from '../../utils/test/test.provider';
import translation from '../../public/translations/pci-file-storage/onboarding/Messages_fr_FR.json';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ projectId: 'xxx' }),
}));

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('xxx')),
    data: [],
  })),
}));

jest.spyOn(React, 'useEffect').mockImplementation((t) => jest.fn(t));

const setupSpecTest = async () => waitFor(() => render(<Onboarding />));

describe('Onboarding', () => {
  it('renders without error', async () => {
    const screen = await setupSpecTest();
    const title = screen.getByText(translation.title);
    const description = screen.getByText(translation.description);
    const createButton = screen.getByText(translation.moreInfoButtonLabel);
    expect(title).not.toBeNull();
    expect(description).not.toBeNull();
    expect(createButton).not.toBeNull();
  });
});
