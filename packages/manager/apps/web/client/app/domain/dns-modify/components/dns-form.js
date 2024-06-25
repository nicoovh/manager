import template from './dns-form.html';

function DnsFormController() {
  const initModel = () => {
    this.dnsEntry = {
      nameServer: '',
      ip: '',
    };
  };

  this.$onInit = () => {
    initModel();
    this.dnsEntry.nameServer = this.nameServer || '';
    this.dnsEntry.ip = this.ip || '';
  };

  this.onFormSubmit = () => {
    this.onSubmit({ dnsEntry: this.dnsEntry });
    initModel();
  };
}

angular.module('dnsForm', []).component('dnsForm', {
  template,
  controller: DnsFormController,
  bindings: {
    onSubmit: '&',
    modifiedDnsList: '&',
    nameServer: '<',
    ip: '<',
  },
});

export default 'dnsForm';
