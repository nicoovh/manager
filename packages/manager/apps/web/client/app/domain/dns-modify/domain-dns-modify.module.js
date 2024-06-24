import 'angular-translate';
import controller from './domain-dns-modify.controller';
import hostnameValidator from './domain-dns-modify.directive';
import template from './domain-dns-modify.html';
import routing, { componentName } from './domain-dns-modify.state';

angular
  .module(componentName, [])
  .directive('hostnameValidator', hostnameValidator)
  .component(componentName, {
    controller,
    template,
    controllerAs: '$ctrl',
    bindings: {
      modifiedDnsList: '<',
    },
  })
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default componentName;
