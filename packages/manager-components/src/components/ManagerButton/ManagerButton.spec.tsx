import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ManagerButton, ManagerButtonProps } from './ManagerButton';
import { render } from '../../utils/test.provider';
import fr_FR from './translations/Messages_fr_FR.json';
import { useIsAuthorized } from '../../hooks/iam';

jest.mock('../../hooks/iam');

const renderComponent = (props: ManagerButtonProps) => {
  return render(<ManagerButton {...props} />);
};
const mockedUseCustomHook = useIsAuthorized as jest.Mock<boolean>;

describe('ManagerButton tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('should display manager button', () => {
    it('with true value for useIsAuthorized', () => {
      mockedUseCustomHook.mockReturnValue(true);
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-components:vrz-a878-dsflkds-fdsfsd',
        action: 'manager-components:apiovh:manager-components/attach-action',
        children: <div>foo-manager-button</div>,
      });
      expect(screen.getAllByText('foo-manager-button')).not.toBeNull();
    });
    it('with false value for useIsAuthorized', () => {
      mockedUseCustomHook.mockReturnValue(false);
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-components:vrz-a878-dsflkds-fdsfsd',
        action: 'manager-components:apiovh:manager-components/attach',
        children: <div>foo-manager-button</div>,
      });
      expect(screen.getAllByText('foo-manager-button')).not.toBeNull();
    });
  });
  describe('should display tooltip', () => {
    it('with false value for useIsAuthorized', () => {
      mockedUseCustomHook.mockReturnValue(false);
      renderComponent({
        urn: 'urn:v9:eu:resource:manager-components:vrz-a878-dsflkds-fdsfsd',
        action: 'manager-components:apiovh:manager-components/attach-action',
        children: <div>foo-manager-button</div>,
      });
      expect(screen.getAllByText('foo-manager-button')).not.toBeNull();
      const button = screen.getByText('foo-manager-button');
      fireEvent.mouseOver(button);
      expect(
        screen.getAllByText(fr_FR.common_iam_actions_message),
      ).not.toBeNull();
    });
  });
});
