import controller from './confirm.controller';
import template from './confirm.html';
import routing, { componentName } from './confirm.state';

angular
  .module(componentName, [])
  .component(componentName, {
    controller,
    template,
    controllerAs: '$ctrl',
    bindings: {
      goBack: '<',
    },
  })
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default componentName;
