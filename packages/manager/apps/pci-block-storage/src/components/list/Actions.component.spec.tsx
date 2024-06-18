import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useHref } from 'react-router-dom';
import ActionsComponent from '@/components/list/Actions.component';
import { TVolume } from '@/api/data/volume';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
}));
const mockVolume: TVolume = {
  id: '1',
  attachedTo: [],
  creationDate: '2022-01-01',
  name: 'Test Volume',
  description: 'This is a test volume',
  size: 100,
  status: 'active',
  statusGroup: 'active',
  region: 'us-west-2',
  bootable: false,
  planCode: 'plan',
  type: 'ssd',
  regionName: 'US West 2',
};
describe('ActionsComponent', () => {
  it('ActionsComponent renders correct button with correct links', () => {
    vi.mocked(useHref)
      .mockReturnValueOnce('./1/edit')
      .mockReturnValueOnce('./delete/1');
    const { getByTestId } = render(
      <ActionsComponent volume={mockVolume} projectUrl="/project" />,
    );
    expect(getByTestId('actionComponent-edit-button')).toHaveAttribute(
      'href',
      './1/edit',
    );

    expect(getByTestId('actionComponent-create-backup-button')).toHaveAttribute(
      'href',
      '/project/storages/volume-backup/create?volume=1',
    );

    expect(getByTestId('actionComponent-remove-button')).toHaveAttribute(
      'href',
      './delete/1',
    );
  });
});
