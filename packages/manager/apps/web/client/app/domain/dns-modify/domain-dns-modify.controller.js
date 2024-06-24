import remove from 'lodash/remove';

import {
  APIV2_CONFIGURATION_TYPES,
  COMPONENTS_PATH_PREFIX,
  CONFIGURATION_TYPES,
  FORM_FIELD_NAMES,
  VALIDATION_REGEX,
} from './domain-dns-modify.constants';

export default class DomainDnsModifyCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $filter,
    $q,
    $stateParams,
    $translate,
    Domain,
    WucUser,
    constants,
  ) {
    this.$scope = $scope;
    this.$filter = $filter;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Domain = Domain;
    this.WucUser = WucUser;
    this.constants = constants;
  }

  $onInit() {
    this.allowModification = false;
    this.dns = {
      original: [],
      originalNames: [],
      registryConfiguration: null,
    };
    this.isZone = false;
    this.zone = null;
    this.isDnssecEnable = false;
    this.loading = {
      all: false,
      current: false,
    };
    this.urls = {
      zoneCheck: this.constants.urls.TOOLS.ZONE_CHECK,
    };

    this.goBack = this.goBack || (() => {});

    this.$scope.$on('Domain.Dns.Reload', () => this.init());
    this.$scope.getCurrentDns = () => this.getCurrentDns();

    this.$q
      .all({
        serviceInfo: this.Domain.getServiceInfo(this.$stateParams.productId),
        user: this.WucUser.getUser(),
      })
      .then(({ serviceInfo, user }) => {
        this.allowModification =
          serviceInfo &&
          user &&
          (serviceInfo.contactTech === user.nichandle ||
            serviceInfo.contactAdmin === user.nichandle);
      });

    this.constants = {
      APIV2_CONFIGURATION_TYPES,
      CONFIGURATION_TYPES,
      FORM_FIELD_NAMES,
      VALIDATION_REGEX,
      COMPONENTS_PATH_PREFIX,
    };

    this.resource = null;

    this.selectedConfiguration = null;

    this.init();
    this.initFormControls();
  }

  init() {
    this.loading.all = true;
    return this.Domain.getSelected(this.$stateParams.productId)
      .then((domain) => {
        this.domain = domain;
        this.Domain.getResource(this.$stateParams.productId).then((data) => {
          this.getCurrentDns(data);
          this.getDnsRegistryConfiguration(data);
          this.resource = data;
        });
        this.Domain.getZoneByZoneName(this.$stateParams.productId).then(
          (zone) => {
            if (zone) {
              this.isZone = true;
              this.zone = zone;
            }
          },
        );
      })
      .finally(() => {
        this.loading.all = false;
      });
  }

  initFormControls() {
    this.initModel();

    this.modifiedDnsList = [];
    this.showAddForm = true;
    this.forms = [true];
    this.isCurrentDnsDisabled = true;
    this.isNewDnsDisabled = false;
    this.isDuplicatedError = true;

    this.newDnsFormId = 'newDnsFormId';
    this.newDnsFormName = 'newDnsFormName';
    this.currentDnsFormId = 'currentDnsFormId';
    this.currentDnsFormName = 'currentDnsFormName';
  }

  initModel() {
    this.newDnsEntry = {
      nameServer: '',
      ip: '',
    };
  }

  getCurrentDns(resource) {
    this.loading.current = true;

    // TODO: to delete when schemas are prodded
    const resourceCopy = resource;
    resourceCopy.currentState.dnsConfiguration = {
      minDNS: 2,
      maxDNS: 8,
      hostSupported: true,
      glueRecordIPv6Supported: true,
      configurationType: 'EXTERNAL',
      nameServers: [
        {
          nameServerType: 'EXTERNAL',
          nameServer: 'ns1.iptwins.net',
        },
        {
          nameServerType: 'external',
          nameServer: 'ns1.example.fr',
          ipv6: '2001:0000:130F:0000:0000:09C0:876A:130B',
        },
      ],
    };
    // end TODO

    resourceCopy.currentState.dnsConfiguration.nameServers.forEach((ns) => {
      const nameServer = {
        nameServer: ns.nameServer,
      };
      if (ns.ipv4) {
        nameServer.ip = ns.ipv4;
      } else if (ns.ipv6) {
        nameServer.ip = ns.ipv6;
      }

      // Keep only the host names to remind the customer which ones are in use
      this.dns.originalNames.push(ns.nameServer);
      // Keep the original values to be able to reset the form
      this.dns.original.push(nameServer);
      // Pre-fill the form with existing values
      this.modifiedDnsList.push(nameServer);
    });

    switch (resourceCopy.currentState.dnsConfiguration.configurationType) {
      case this.constants.APIV2_CONFIGURATION_TYPES.MIXED:
        this.selectedConfiguration = this.constants.CONFIGURATION_TYPES.MIXED;
        break;
      case this.constants.APIV2_CONFIGURATION_TYPES.EXTERNAL:
        this.selectedConfiguration = this.constants.CONFIGURATION_TYPES.EXTERNAL;
        break;
      case this.constants.APIV2_CONFIGURATION_TYPES.EMPTY:
        this.selectedConfiguration = this.constants.CONFIGURATION_TYPES.EMPTY;
        break;
      default:
        this.selectedConfiguration = this.constants.CONFIGURATION_TYPES.INTERNAL;
        break;
    }
  }

  getDnsRegistryConfiguration(resource) {
    // TODO: to delete when schemas are prodded
    const resourceCopy = resource;
    resourceCopy.currentState.dnsConfiguration = {
      minDNS: 2,
      maxDNS: 3,
      hostSupported: true,
      glueRecordIPv6Supported: true,
      configurationType: 'EXTERNAL',
      nameServers: [
        {
          nameServerType: 'EXTERNAL',
          nameServer: 'ns1.iptwins.net',
        },
        {
          nameServerType: 'EXTERNAL',
          nameServer: 'ns1.example.fr',
          ipv6: '2001:0000:130F:0000:0000:09C0:876A:130B',
        },
      ],
    };
    // end TODO

    const dnsConfig = resourceCopy.currentState.dnsConfiguration;
    this.dns.registryConfiguration = {
      minNumberOfDns: dnsConfig.minDNS,
      maxNumberOfDns: dnsConfig.maxDNS,
    };
  }

  onFormRemove(index) {
    remove(this.modifiedDnsList, (_, i) => i === index);
    this.onFormsChange();
  }

  applyConfiguration() {
    const inputs = [];
    this.modifiedDnsList.forEach((ns) => {
      const nameServer = {
        nameServer: ns.nameServer,
      };

      const { ip } = ns;

      if (ip) {
        if (ip.match(this.constants.VALIDATION_REGEX.IPV4)) {
          nameServer.ipv4 = ip;
        }

        if (ip.match(this.constants.VALIDATION_REGEX.IPV6)) {
          nameServer.ipv6 = ip;
        }
      }

      inputs.push(nameServer);
    });

    if (
      inputs.length >= this.dns.registryConfiguration.minNumberOfDns &&
      inputs.length <= this.dns.registryConfiguration.maxNumberOfDns
    ) {
      // TODO: make an other call to Domain.GetResource to retrieve the checksum
      const payload = {
        checksum: this.resource.checksum,
        targetSpec: {
          ...this.resource.targetSpec,
          dnsConfiguration: {
            nameServers: inputs,
          },
        },
      };
      this.Domain.updateResource(this.$stateParams.productId, payload);
    } else {
      // TODO: display error
    }
  }

  onFormsChange() {
    this.showAddForm =
      this.modifiedDnsList.length <
      this.dns.registryConfiguration.maxNumberOfDns;
    this.initModel();
  }

  onFormSubmit(form) {
    const isDuplicated = this.modifiedDnsList.some(
      (ns) => ns.nameServer === form.hostnameField.$modelValue,
    );

    if (isDuplicated) {
      this.isDuplicatedError = true;
    }

    if (form.$valid) {
      this.modifiedDnsList.push({
        nameServer: form.hostnameField.$modelValue,
        ip: form.ipField?.$modelValue,
      });

      this.onFormsChange();
    }
  }

  cancelModification() {
    // Empty the table of modified DNS and re-fill it with the original ones
    this.modifiedDnsList = [];
    this.dns.original.forEach((ns) => {
      this.modifiedDnsList.push(ns);
    });
    this.onFormsChange();
  }
}
