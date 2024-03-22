import { MoreHorizontal } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { GenericUser } from '@/api/databases/users';
import { useServiceData } from '../../layout';
import { database } from '@/models/database';

interface UserActionsProps {
  user: GenericUser;
  onDeleteClicked: (user: GenericUser) => void;
  onResetPasswordClicked: (user: GenericUser) => void;
  onEditClicked: (user: GenericUser) => void;
}

const UserActions = ({
  user,
  onDeleteClicked,
  onResetPasswordClicked,
  onEditClicked,
}: UserActionsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  return (
    <div className="w-full text-right pr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="menu" size="menu">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {service.capabilities.users?.update && (
            <DropdownMenuItem
              variant="primary"
              disabled={
                service.capabilities.users?.update ===
                database.service.capability.StateEnum.disabled
              }
              onClick={() => onEditClicked(user)}
            >
              {t('tableActionsMenuEdit')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant="primary"
            disabled={
              service.capabilities.users?.update ===
              database.service.capability.StateEnum.disabled
            }
            onClick={() => onResetPasswordClicked(user)}
          >
            {t('tableActionsMenuResetPassword')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {service.capabilities.users?.delete && (
            <DropdownMenuItem
              variant="destructive"
              disabled={
                service.capabilities.users?.delete ===
                database.service.capability.StateEnum.disabled
              }
              onClick={() => onDeleteClicked(user)}
            >
              {t('tableActionsMenuDelete')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserActions;
