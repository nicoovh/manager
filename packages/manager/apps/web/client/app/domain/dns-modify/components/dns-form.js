import template from './dns-form.html';

function DnsFormController() {
  const ctrl = this;

  ctrl.dnsEntry = {
    nameServer: '',
    ip: '',
  };

  ctrl.$onInit = () => {
    ctrl.dnsEntry.nameServer = ctrl.nameServer || '';
    ctrl.dnsEntry.ip = ctrl.ip || '';
  };

  ctrl.onFormSubmit = () => {
    ctrl.onSubmit({ dnsEntry: ctrl.dnsEntry });
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
