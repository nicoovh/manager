import uiRouter from '@uirouter/angularjs';
import sshAddCloud from './add/cloud/user-ssh-add-cloud.module';
import sshDelete from './delete/user-ssh-delete.module';
import sshView from './view/user-ssh-view.module';
import sshkeyMinFilter from './sshkeyMin';
import routing from './ssh.routing';
import service from './user-ssh.service';

const moduleName = 'ovhManagerBillingSshKeys';

angular
  .module(moduleName, [sshAddCloud, sshDelete, sshView, uiRouter])
  .config(routing)
  .filter('sshkeyMin', sshkeyMinFilter)
  .service('UseraccountSshService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
