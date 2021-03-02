import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';

import routing from './otrs.routes';
import service from './otrs.service';
import htmlStringLinkyFilter from './filter/html-string-linky.filter';

const moduleName = 'ovhManagerOtrs';

angular
  .module(moduleName, [
    'ngOvhUtils',
    ngOvhOtrs,
    'ngRoute',
    ovhManagerCore,
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(
    /* @ngInject */ (OtrsPopupProvider, coreURLBuilderProvider) => {
      OtrsPopupProvider.setBaseUrlTickets(
        coreURLBuilderProvider.buildURL('dedicated', '#/ticket'),
      );
    },
  )
  .filter('htmlStringLinky', htmlStringLinkyFilter)
  .service('Otrs', service)
  .config(routing)
  .run(/* @ngInject */ (Otrs) => Otrs.init())
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
