import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ManagerText, ManagerTextProps } from './ManagerText';
import { render } from '../../utils/test.provider';
import fr_FR from './translations/Messages_fr_FR.json';
import { useIsAuthorized } from '../../hooks/iam';

jest.mock('../../hooks/iam');

const renderComponent = (props: ManagerTextProps) => {
  return render(<ManagerText {...props} />);
};
const mockedUseCustomHook = useIsAuthorized as jest.Mock<boolean>;

describe('ManagerText tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('should display manager text', () => {
    it('with true value for useIsAuthorized', () => {
      mockedUseCustomHook.mockReturnValue(true);
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-components:vrz-a878-dsflkds-fdsfsd',
        action: 'manager-components:apiovh:manager-components/get-display',
        children: <div>foo-manager-text</div>,
      });
      expect(screen.getAllByText('foo-manager-text')).not.toBeNull();
    });
  });
  describe('should display error manager text', () => {
    it('with false value for useIsAuthorized', () => {
      mockedUseCustomHook.mockReturnValue(true);
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-components:vrz-a878-dsflkds-fdsfsd',
        action: 'manager-components:apiovh:manager-components/get-display',
        children: <div>foo-manager-text</div>,
      });
      expect(screen.findByText(fr_FR.common_iam_get_message)).not.toBeNull();
    });
  });
});
