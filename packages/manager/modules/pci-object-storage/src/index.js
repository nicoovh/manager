import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import objects from './objects';
import users from './users';
import regions from './regions';
import component from './object-storage.component';

import routing from './object-storage.routing';
import service from './object-storage.service';
import storageUsersService from './storages/storage-users.service';

const moduleName = 'ovhManagerPciStoragesObjectStorage';

angular
  .module(moduleName, [
    objects,
    users,
    regions,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    ngOvhCloudUniverseComponents,
  ])
  .config(routing)
  .component('pciProjectStorageObjectStorage', component)
  .service('PciStoragesObjectStorageService', service)
  .service('PciStoragesUsersService', storageUsersService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
