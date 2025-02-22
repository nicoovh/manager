import filter from 'lodash/filter';
import set from 'lodash/set';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import values from 'lodash/values';
import 'moment';

import IplbHomeUpdateQuotaTemplate from './updateQuota/iplb-update-quota.html';
import {
  INFO_LINK,
  MESSAGE_DISPLAY_DATE,
  LB_TEMPORARY_WARNING_BANNER_FEATURE,
} from './iplb-home.constants';

export default class IpLoadBalancerHomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    coreConfig,
    coreURLBuilder,
    ChartFactory,
    CucControllerHelper,
    CucCloudMessage,
    CucFeatureAvailabilityService,
    IpLoadBalancerActionService,
    IpLoadBalancerConstant,
    IpLoadBalancerHomeService,
    IpLoadBalancerHomeStatusService,
    IpLoadBalancerMetricsService,
    IpLoadBalancerZoneAddService,
    IpLoadBalancerZoneDeleteService,
    IpLoadBalancerVrackHelper,
    IpLoadBalancerVrackService,
    ovhManagerRegionService,
    CucVrackService,
    ovhFeatureFlipping,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.ChartFactory = ChartFactory;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.IpLoadBalancerActionService = IpLoadBalancerActionService;
    this.IpLoadBalancerConstant = IpLoadBalancerConstant;
    this.IpLoadBalancerHomeService = IpLoadBalancerHomeService;
    this.IpLoadBalancerHomeStatusService = IpLoadBalancerHomeStatusService;
    this.IpLoadBalancerMetricsService = IpLoadBalancerMetricsService;
    this.IpLoadBalancerZoneAddService = IpLoadBalancerZoneAddService;
    this.IpLoadBalancerZoneDeleteService = IpLoadBalancerZoneDeleteService;
    this.IpLoadBalancerVrackHelper = IpLoadBalancerVrackHelper;
    this.IpLoadBalancerVrackService = IpLoadBalancerVrackService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.VrackService = CucVrackService;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.serviceName = this.$stateParams.serviceName;

    this.initLoaders();
  }

  $onInit() {
    this.configuration.load();
    this.vrackCreationRules.load();

    this.information.load();
    this.subscription.load();

    this.iplbStatus.load();
    this.usage.load();

    this.orderableZones.load();
    this.deletableZones.load();

    this.initActions();
    this.initGraph();

    this.serviceActions = {
      text: this.$translate.instant('iplb_status_apply'),
      callback: () => this.$state.go('iplb.detail.configuration'),
      isAvailable: () => true,
    };

    this.frontendsActions = {
      text: this.$translate.instant('iplb_status_details'),
      callback: () => this.$state.go('iplb.detail.frontends'),
      isAvailable: () => true,
    };

    this.farmsActions = {
      text: this.$translate.instant('iplb_status_details'),
      callback: () => this.$state.go('iplb.detail.server-farm'),
      isAvailable: () => true,
    };
  }

  initLoaders() {
    this.information = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerHomeService.getInformations(this.serviceName),
    });

    this.configuration = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerHomeService.getConfiguration(this.serviceName),
      successHandler: () => this.getRegionsGroup(this.configuration.data.zone),
    });

    this.vrackCreationRules = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerVrackService.getNetworkCreationRules(
          this.serviceName,
        ),
    });

    this.subscription = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerHomeService.getSubscription(this.serviceName).then(
          (subscriptionInfos) => {
            set(
              subscriptionInfos,
              'creationFormated',
              moment(subscriptionInfos.creation).format('LL'),
            );
            set(
              subscriptionInfos,
              'expirationFormated',
              moment(subscriptionInfos.expiration).format('LL'),
            );
            this.showBillingEvolMessages(subscriptionInfos);
            return subscriptionInfos;
          },
        ),
    });

    this.iplbStatus = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerHomeStatusService.getIPLBStatus(this.serviceName, {
          toArray: true,
        }),
    });

    this.usage = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerHomeService.getUsage(this.serviceName),
    });

    this.orderableZones = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerZoneAddService.getOrderableZones(this.serviceName),
    });

    this.deletableZones = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerZoneDeleteService.getDeletableZones(
          this.serviceName,
        ),
    });
  }

  initActions() {
    this.actions = {
      showFailoverIp: {
        callback: () =>
          this.IpLoadBalancerActionService.showFailoverIpDetail(
            this.serviceName,
          ),
      },
      showNatIp: {
        callback: () =>
          this.IpLoadBalancerActionService.showNatIpDetail(this.serviceName),
      },
      changeName: {
        text: this.$translate.instant('iplb_edit'),
        callback: () =>
          this.CucControllerHelper.modal.showNameChangeModal({
            serviceName: this.serviceName,
            displayName: this.configuration.data.displayName,
            onSave: (newDisplayName) =>
              this.IpLoadBalancerHomeService.updateName(
                this.serviceName,
                newDisplayName,
              ).then(() => this.configuration.load()),
          }),
        isAvailable: () =>
          !this.configuration.loading && !this.configuration.hasErrors,
      },
      changeCipher: {
        text: this.$translate.instant('iplb_edit'),
        callback: () =>
          this.IpLoadBalancerActionService.cipherChange(this.serviceName, () =>
            this.configuration.load(),
          ),
        isAvailable: () =>
          !this.configuration.loading && !this.configuration.hasErrors,
      },
      activateVrack: {
        text: this.$translate.instant('iplb_activate'),
        callback: () =>
          this.VrackService.selectVrack().then((result) =>
            this.IpLoadBalancerVrackHelper.associateVrack(
              this.serviceName,
              result.serviceName,
              this.vrackCreationRules.data,
            ),
          ),
        isAvailable: () =>
          !this.vrackCreationRules.loading &&
          !this.vrackCreationRules.hasErrors &&
          this.vrackCreationRules.data.vrackEligibility &&
          this.vrackCreationRules.data.status === 'inactive',
      },
      deActivateVrack: {
        text: this.$translate.instant('iplb_deactivate'),
        callback: () =>
          this.VrackService.unlinkVrackModal().then(() =>
            this.IpLoadBalancerVrackHelper.deAssociateVrack(
              this.serviceName,
              this.vrackCreationRules.data,
            ),
          ),
        isAvailable: () =>
          !this.vrackCreationRules.loading &&
          !this.vrackCreationRules.hasErrors &&
          this.vrackCreationRules.data.status === 'active',
      },
      changeOffer: {
        // TODO: Implementation of modal for changing offer
        text: this.$translate.instant('iplb_edit'),
        isAvailable: () => false,
      },
      manageAutorenew: {
        text: this.$translate.instant('iplb_manage'),
        href: this.coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew', {
          searchText: this.serviceName,
          selectedType: 'IP_LOADBALANCING',
        }),
        isAvailable: () =>
          !this.subscription.loading && !this.subscription.hasErrors,
      },
      manageContact: {
        text: this.$translate.instant('iplb_manage'),
        href: this.coreURLBuilder.buildURL('dedicated', '#/contacts/services', {
          serviceName: this.serviceName,
          tab: 'SERVICES',
        }),
        isAvailable: () =>
          this.CucFeatureAvailabilityService.hasFeature('CONTACTS', 'manage') &&
          !this.subscription.loading &&
          !this.subscription.hasErrors,
      },
      addZone: {
        text: this.$translate.instant('iplb_add'),
        callback: () =>
          this.$state.go('iplb.detail.zone.add', {
            serviceName: this.serviceName,
          }),
        isAvailable: () =>
          !this.orderableZones.loading && this.orderableZones.data.length > 0,
      },
      deleteZone: {
        text: this.$translate.instant('iplb_delete'),
        callback: () =>
          this.$state.go('iplb.detail.zone.delete', {
            serviceName: this.serviceName,
          }),
        isAvailable: () =>
          !this.deletableZones.loading &&
          filter(
            this.deletableZones.data,
            (zone) => zone.selectable.value !== false,
          ).length -
            1 >=
            1,
      },
    };
  }

  showBillingEvolMessages(subscriptionInfos) {
    this.ovhFeatureFlipping
      .checkFeatureAvailability(LB_TEMPORARY_WARNING_BANNER_FEATURE)
      .then((tempWarnBannerFeatureResult) => {
        const isTempWarnBannerAvailable = tempWarnBannerFeatureResult.isFeatureAvailable(
          LB_TEMPORARY_WARNING_BANNER_FEATURE,
        );
        // displayed when this feature is available and only if the
        // Load balancer is created befor the date 2023-04-01.
        if (
          isTempWarnBannerAvailable &&
          moment(subscriptionInfos?.creation).isBefore(MESSAGE_DISPLAY_DATE)
        ) {
          this.displayBillingIssuesWarnMessage();
          this.displayBillingEvolutionInfoMessage();
        }
      });
  }

  updateQuotaAlert(quota) {
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          template: IplbHomeUpdateQuotaTemplate,
          controller: 'IpLoadBalancerUpdateQuotaCtrl',
          controllerAs: 'IpLoadBalancerUpdateQuotaCtrl',
          resolve: {
            quota: () => quota,
          },
        },
      })
      .then(() => {
        this.usage.load();
      });
  }

  initGraph() {
    this.metricsList = this.IpLoadBalancerConstant.graphs;
    this.metric = head(this.metricsList);
    this.graph = new this.ChartFactory({
      data: {
        datasets: [],
        labels: [],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            id: 'y-axis-1',
            type: 'linear',
            ticks: {
              min: 0,
              minStep: 1,
              beginAtZero: true,
            },
          },
        },
        elements: {
          line: {
            fill: false,
            borderColor: '#3DD1F0',
            borderWidth: 4,
            tension: 0.5,
          },
          point: {
            radius: 0,
          },
        },
      },
    });
    this.loadGraph();
  }

  loadGraph() {
    const downsampleAggregation = this.metric === 'conn' ? 'sum' : 'max';
    this.loadingGraph = true;
    this.IpLoadBalancerMetricsService.getData(this.metric, '40m-ago', null, {
      // http://opentsdb.net/docs/build/html/user_guide/query/downsampling.html
      downsample: `5m-${downsampleAggregation}`,
    })
      .then((data) => {
        if (data.length && data[0].dps) {
          this.data = values(data[0].dps);
          this.graph.data.labels = [];
          this.data.forEach((value, index) => {
            this.graph.data.labels.unshift(`${index * 5}m`);
          });
          this.graph.data.datasets = [{ data: values(data[0].dps) }];
        }
      })
      .finally(() => {
        this.loadingGraph = false;
      });
  }

  getGraphTitle(metric) {
    return this.$translate.instant(`iplb_graph_name_${metric}`);
  }

  getRegionsGroup(regions) {
    this.regionsGroup = [];
    if (regions) {
      this.detailedRegions = !isArray(regions)
        ? [this.ovhManagerRegionService.getRegion(regions)]
        : map(regions, (region) =>
            this.ovhManagerRegionService.getRegion(region),
          );
    }

    this.regionsGroup = groupBy(this.detailedRegions, 'country');
  }

  hasMultipleRegions() {
    return isArray(this.detailedRegions) && this.detailedRegions.length > 1;
  }

  displayBillingEvolutionInfoMessage() {
    const message = this.$translate.instant(
      'iplb_home_tile_configuration_billing_evolution_message_info',
    );
    const linkLabel = this.$translate.instant(
      'iplb_home_tile_configuration_billing_more_information_label',
    );
    const linkURL =
      INFO_LINK[this.coreConfig.getUser()?.ovhSubsidiary] || INFO_LINK.DEFAULT;
    const link = `<a target="_blank" rel="noopener"href=${linkURL}>${linkLabel}</a>`;

    this.CucCloudMessage.info({
      textHtml: `${message} ${link}`,
    });
  }

  displayBillingIssuesWarnMessage() {
    const message1 = this.$translate.instant(
      'iplb_home_tile_configuration_billing_issues_message_warn_1',
    );
    const message2 = this.$translate.instant(
      'iplb_home_tile_configuration_billing_issues_message_warn_2',
    );
    const linkLabel = this.$translate.instant(
      'iplb_home_tile_configuration_billing_here_label',
    );
    const linkURL = INFO_LINK[this.coreConfig.getUser()?.ovhSubsidiary];
    const link = `<a target="_blank" rel="noopener"href=${linkURL}>${linkLabel}</a>`;

    this.CucCloudMessage.warning({
      textHtml: `<p>${message1}</p><p>${message2} ${link}.</p>`,
    });
  }
}
