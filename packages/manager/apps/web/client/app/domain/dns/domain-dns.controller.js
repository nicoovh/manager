import DNS_STATUS from './domain-dns.constants';

export default class DomainDnsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $filter,
    $q,
    $stateParams,
    $translate,
    Alerter,
    Domain,
    WucUser,
    WucValidator,
    constants,
    goToDnsAnycast,
    goToTerminateAnycast,
    goToDnsModify,
  ) {
    this.$scope = $scope;
    this.$filter = $filter;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Domain = Domain;
    this.WucUser = WucUser;
    this.WucValidator = WucValidator;
    this.constants = constants;
    this.goToDnsAnycast = goToDnsAnycast;
    this.goToTerminateAnycast = goToTerminateAnycast;
    this.goToDnsModify = goToDnsModify;
  }

  $onInit() {
    this.allowModification = false;
    // this.atLeastOneDns = true;
    // this.atLeastOneToRemove = true;
    this.dns = {
      original: null,
      nameServers: null,
      isAnycastSubscribed: false,
      isUpdatingNameServers: false,
    };
    this.isDnssecEnable = false;
    this.loading = {
      all: false,
      nameServers: false,
    };
    this.urls = {
      zoneCheck: this.constants.urls.TOOLS.ZONE_CHECK,
    };

    this.constants.DNS_STATUS = DNS_STATUS;

    this.$scope.$on('Domain.Dns.Reload', () => this.init());
    this.$scope.getDns = () => this.getDns();

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

    this.init();
  }

  init() {
    this.loading.all = true;
    return this.Domain.getSelected(this.$stateParams.productId)
      .then((domain) => {
        this.domain = domain;
        this.isDnssecEnable = domain.dnssecStatus === 'ENABLED';
        this.getDns();
        this.hasAnycast();
      })
      .catch(() => {
        this.loading.all = false;
      });
  }

  getDns() {
    this.loading.nameServers = true;
    this.dns.nameServers = [];

    return this.Domain.getResource(this.$stateParams.productId)
      .then((data) => {
        const resource = data;

        // TODO: to delete when schemas are prodded
        resource.currentState.dnsConfiguration = {
          minDNS: '2',
          maxDNS: '8',
          hostSupported: true,
          glueRecordIPv6Supported: true,
          configurationType: 'mixed',
          nameServers: [
            {
              nameServerType: 'external',
              nameServer: 'ns1.iptwins.net',
            },
            {
              nameServerType: 'external',
              nameServer: 'ns1.example.fr',
              ipv6: '2001:0000:130F:0000:0000:09C0:876A:130B',
            },
          ],
        };

        resource.targetSpec.dnsConfiguration = {
          nameServers: [
            {
              nameServer: 'ns2.example.fr',
              ipv4: '1.2.3.4',
            },
            {
              nameServer: 'ns1.example.fr',
              ipv6: '2001:0000:130F:0000:0000:09C0:876A:130B',
            },
          ],
        };
        // end TODO

        /* 
        The name servers statuses should be computed from the resource targetSpec 
        and currentState, just as in the following example:
        ------------------------------------------------------------------
        CurrentState     TargetSpec          Status
        ------------------------------------------------------------------
        ns1.toto.fr      ns1.toto.fr         - ns1.toto.fr      Enabled
        ns2.toto.fr      ns2.toto.fr         - ns2.toto.fr      Enabled
        ------------------------------------------------------------------
        ns1.toto.fr      dns111.ovh.net      - ns1.toto.fr      Deleting   
        ns2.toto.fr      dns111.ovh.net      - ns2.toto.fr      Deleting   
                                             - dns111.ovh.net   Activating 
                                             - ns111.ovh.net    Activating 
        ------------------------------------------------------------------
        ns1.toto.fr      ns1.toto.fr         - ns1.toto.fr      Enabled    
        ns2.toto.fr      ns3.toto.fr         - ns2.toto.fr      Deleting   
                                             - ns3.toto.fr      Activating
        ------------------------------------------------------------------
        ns1.toto.fr      []                  - ns1.toto.fr      Deleting
        ns2.toto.fr                          - ns2.toto.fr      Deleting
        ------------------------------------------------------------------
        */

        const currentStateNameServers =
          resource.currentState?.dnsConfiguration?.nameServers || [];

        const targetSpecNameServers =
          resource.targetSpec?.dnsConfiguration?.nameServers || [];

        // Find out if a given name server item is present in another array
        const arrayContains = (otherArray, item) => {
          return otherArray.some(
            (otherArrayItem) =>
              item.nameServer === otherArrayItem.nameServer &&
              item.ipv4 === otherArrayItem.ipv4 &&
              item.ipv6 === otherArrayItem.ipv6,
          );
        };

        if (currentStateNameServers) {
          currentStateNameServers.forEach((ns) => {
            const nameServer = {
              name: ns.nameServer,
              ip: '',
              status: DNS_STATUS.ACTIVATED,
            };

            if (ns.ipv4) {
              nameServer.ip = ns.ipv4;
            } else if (ns.ipv6) {
              nameServer.ip = ns.ipv6;
            }

            if (!arrayContains(targetSpecNameServers, ns)) {
              nameServer.status = DNS_STATUS.DELETING;
            }

            this.dns.nameServers.push(nameServer);
          });
        }

        if (targetSpecNameServers) {
          targetSpecNameServers.forEach((ns) => {
            if (arrayContains(currentStateNameServers, ns)) {
              // If the name server is also present in the currentState,
              // we do not want to add it a second time
              return;
            }

            const nameServer = {
              name: ns.nameServer,
              ip: '',
              status: DNS_STATUS.ADDING,
            };

            if (ns.ipv4) {
              nameServer.ip = ns.ipv4;
            } else if (ns.ipv6) {
              nameServer.ip = ns.ipv6;
            }

            this.dns.nameServers.push(nameServer);
          });
        }

        // Check if there is a pending update of the name servers
        this.dns.nameServers.forEach((ns) => {
          if (ns.status !== DNS_STATUS.ACTIVATED) {
            this.dns.isUpdatingNameServers = true;
          }
        });
      })
      .finally(() => {
        this.loading.all = false;
      });
  }

  hasAnycast() {
    return this.Domain.getDnsAnycast(this.$stateParams.productId).then(
      (data) => {
        if (data?.status === 'enabled') {
          this.dns.isAnycastSubscribed = true;
        }
      },
    );
  }

  checkPendingPropagation(dnsServers) {
    this.displayPropagationInfo = dnsServers.some(
      (server) => server.toDelete || !server.isUsed,
    );
  }
}
