import illustration from '@/assets/images/sidebar/network.png';
import { Node } from '../node';

const networkUniverse: Node = {
  id: 'network',
  translation: 'sidebar_network',
  shortTranslation: 'sidebar_network_short',
  illustration,
  features: [
    'vrack:bare-metal-cloud',
    'ip',
    'veeam-cloud-connect',
    'ip-load-balancer',
    'dedicated-cdn',
    'network-security',
    'vrack-services',
  ],
};

networkUniverse.children = [
  {
    id: 'vrack',
    universe: networkUniverse,
    translation: 'sidebar_vrack',
    serviceType: 'VRACK',
    routing: {
      application: 'dedicated',
      hash: '#/vrack',
    },
    features: ['vrack:bare-metal-cloud'],
  },
  {
    id: 'ip',
    universe: networkUniverse,
    translation: 'sidebar_ip',
    serviceType: 'IP_SERVICE',
    routing: {
      application: 'dedicated',
      hash: '#/ip',
    },
    features: ['ip'],
  },
  {
    id: 'dedicated-network-security',
    universe: networkUniverse,
    translation: 'sidebar_network_security',
    serviceType: 'NETWORK_SECURITY',
    routing: {
      application: 'dedicated',
      hash: '#/network-security',
    },
    features: ['network-security'],
  },
  {
    id: 'ovhvrack-services',
    universe: networkUniverse,
    translation: 'sidebar_vrack_services',
    serviceType: 'VRACKSERVICES',
    routing: {
      application: 'vrack-services',
      hash: '#/',
    },
    features: ['vrack-services'],
  },
  {
    id: 'ovhcloud-connect',
    universe: networkUniverse,
    translation: 'sidebar_cloud_connect',
    serviceType: 'OVHCLOUDCONNECT',
    routing: {
      application: 'dedicated',
      hash: '#/cloud-connect',
    },
    features: ['cloud-connect'],
  },
  {
    id: 'iplb',
    universe: networkUniverse,
    translation: 'sidebar_iplb',
    serviceType: 'IPLOADBALANCING',
    routing: {
      application: 'dedicated',
      hash: '#/iplb',
    },
    features: ['ip-load-balancer'],
  },
  {
    id: 'cdn',
    universe: networkUniverse,
    translation: 'sidebar_cdn',
    serviceType: 'CDN_DEDICATED',
    routing: {
      application: 'dedicated',
      hash: '#/configuration/cdn',
    },
    features: ['dedicated-cdn'],
  },
];

export default networkUniverse;
