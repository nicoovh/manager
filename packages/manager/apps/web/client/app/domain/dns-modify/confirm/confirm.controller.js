export default class DomainDnsModifyConfirmCtrl {
  /* @ngInject */
  constructor(Domain, $scope) {
    this.Domain = Domain;
    this.loading = false;
    this.$scope = $scope;
  }

  $onInit() {
    this.$scope.$on('modifiedDnsList', (event, modifiedDnsList) => {
      this.modifiedDnsList = modifiedDnsList;
      console.log('Modified DNS List:', this.modifiedDnsList);
    });
    console.log(this.modifiedDnsList);
    console.log(this.$scope);
  }

  confirm() {
    this.loading = true;
    console.log('confirm');
    //     return this.Domain.terminateDnsAnycast(this.domainName, {
    //       automatic: true,
    //       deleteAtExpiration: true,
    //       forced: false,
    //     })
    //       .then(() => this.goBack())
    //       .catch((err) => this.setError(err?.data?.message))
    //       .finally(() => {
    //         this.goBack();
    //         this.loading = false;
    //       });
  }
}
