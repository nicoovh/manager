export const componentName = 'domainDnsModifyConfirm';

const state = {
  url: '/confirm',
  views: {
    modal: { component: componentName },
  },
  layout: 'modal',
  resolve: {
    previousState: /* @ngInject */ ($transition$) => $transition$.$from(),
    goBack: /* @ngInject */ ($state, previousState) => () => {
      return $state.go(
        previousState.name
          ? previousState.name
          : 'app.domain.product.dns_modify',
      );
    },
    breadcrumb: /* @ngInject */ ($translate) => $translate.instant(''),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.dns_modify.confirm', { ...state });
  $stateProvider.state('app.alldom.domain.dns_modify.confirm', { ...state });
};
