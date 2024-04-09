export default class PCICatalogPricePlayground {
  /* @ngInject */
  constructor($http, $timeout, coreConfig) {
    this.$http = $http;
    this.$timeout = $timeout;
    this.loading = true;
    this.plans = [];
    this.plan = null;
    this.coreConfig = coreConfig;
    this.setFormat('FR');
  }

  $onInit() {
    this.$http
      .get(`/order/catalog/public/nasha?ovhSubsidiary=FR`)
      .then(({ data: catalog }) => {
        this.plans = catalog.plans.filter(({ pricings }) =>
          pricings.some(({ price }) => Boolean(price)),
        );
        [this.plan] = this.plans;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  setFormat(format) {
    this.format = format;
    this.coreConfig.getUser().ovhSubsidiary = format;
    this.coreConfig.getUser().currency.code = {
      CZ: 'EUR',
      ES: 'EUR',
      GB: 'GBP',
      FR: 'EUR',
      IE: 'EUR',
      IT: 'EUR',
      LT: 'EUR',
      MA: 'MAD',
      NL: 'EUR',
      PL: 'PLN',
      PT: 'EUR',
      TN: 'TND',
      DE: 'EUR',
      FI: 'EUR',
      SN: 'XOF',
      ASIA: 'USD',
      AU: 'AUD',
      IN: 'INR',
      SG: 'SGD',
      CA: 'CAD',
      QC: 'CAD',
      WE: 'USD',
      WS: 'USD',
      US: 'USD',
    }[format];
    this.recompile();
  }

  recompile() {
    this.recompiling = true;
    this.$timeout(() => {
      this.recompiling = false;
    });
  }
}
