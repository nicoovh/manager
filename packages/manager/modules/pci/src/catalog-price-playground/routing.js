export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('catalog-price-playground', {
    url: '/catalog-price-playground',
    component: 'pciCatalogPricePlayground',
  });
};
