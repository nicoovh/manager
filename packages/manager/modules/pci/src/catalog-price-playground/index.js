import angular from 'angular';
import uiKit from '@ovh-ux/ui-kit';
import catalogPrice from '@ovh-ux/manager-catalog-price';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerPciComponentsCatalogPricePlayground';

angular
  .module(moduleName, [uiKit, catalogPrice])
  .config(routing)
  .component('pciCatalogPricePlayground', component);

export default moduleName;
