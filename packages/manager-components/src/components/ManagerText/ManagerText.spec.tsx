import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ManagerText, ManagerTextProps } from './ManagerText';
import { render } from '../../utils/test.provider';
import fr_FR from './translations/Messages_fr_FR.json';
import { useAuthorizationIam } from '../../hooks/iam';

jest.mock('../../hooks/iam');

const renderComponent = (props: ManagerTextProps) => {
  return render(<ManagerText {...props} />);
};
const mockedUseCustomHook = useAuthorizationIam as jest.Mock<object>;

describe('ManagerText tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('should display manager text', () => {
    it('with true value for useAuthorizationIam', () => {
      mockedUseCustomHook.mockReturnValue({ isAuthorized: true });
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-components:vrz-a878-dsflkds-fdsfsd',
        iamAction: 'manager-components:apiovh:manager-components/get-display',
        children: <div>foo-manager-text</div>,
      });
      expect(screen.getAllByText('foo-manager-text')).not.toBeNull();
    });
  });
  describe('should display error manager text', () => {
    it('with false value for useAuthorizationIam', () => {
      mockedUseCustomHook.mockReturnValue({ isAuthorized: false });
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-components:vrz-a878-dsflkds-fdsfsd',
        iamAction: 'manager-components:apiovh:manager-components/get-display',
        children: <div>foo-manager-text</div>,
      });
      expect(screen.findByText(fr_FR.iam_hidden_text)).not.toBeNull();
    });
  });
});
