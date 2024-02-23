import { useEffect, useState, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router';
import { database } from '@/models/database';
import {
  Engine,
  Flavor,
  NetworkOptionValue,
  Plan,
  Region,
  Version,
} from '@/models/order-funnel';
import { order } from '@/models/catalog';
import { createTree } from '@/lib/availabilitiesHelper';
import { generateName } from '@/lib/nameGenerator';
import { useVrack } from './useVrack';

const getSuggestedItemOrDefault = (
  suggestion: database.Suggestion,
  item: 'plan' | 'region' | 'flavor',
  listItems: Plan[] | Region[] | Flavor[],
  currentValue?: string,
) => {
  if (listItems.length === 0) return '';
  const suggestedItem = suggestion[item];
  // return current value is possible, to avoid changing user selection
  if (currentValue && listItems.find((i) => i.name === currentValue)) {
    return currentValue;
  }
  // otherwise, use default, or first
  return listItems.find((i) => i.name === suggestedItem)
    ? suggestedItem
    : listItems[0].name;
};

export function useOrderFunnel(
  availabilities: database.Availability[],
  capabilities: database.Capabilities,
  engineCapabilities: database.EngineCapabilities[],
  regionCapabilities: database.RegionCapabilities[],
  suggestions: database.Suggestion[],
  catalog: order.publicOrder.Catalog,
) {
  const { projectId } = useParams();
  const orderSchema = z.object({
    engineWithVersion: z.object({
      engine: z.string(),
      version: z.string(),
    }),
    plan: z.string(),
    region: z.string(),
    flavor: z.string(),
    additionalStorage: z.number(),
    nbNodes: z.number(),
    ipRestrictions: z
      .array(
        z.object({
          ip: z.string(),
          description: z.string(),
        }),
      )
      .min(1, 'please confugure at least 1 ip'),
    network: z
      .object({
        type: z.enum([
          database.NetworkTypeEnum.public,
          database.NetworkTypeEnum.private,
        ]),
        networkId: z.string().optional(),
        subnetId: z.string().optional(),
      })
      .refine(
        (data) => {
          if (data.type === database.NetworkTypeEnum.private) {
            return data.networkId !== undefined && data.subnetId !== undefined;
          }
          return true;
        },
        {
          message:
            "For private network, both 'networkId' and 'subnetId' are required.",
        },
      ),
    name: z.string(),
  });
  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: generateName(),
      engineWithVersion: { engine: '', version: '' },
      plan: '',
      region: '',
      flavor: '',
      nbNodes: 0,
      additionalStorage: 0,
      ipRestrictions: [],
      network: {
        type: database.NetworkTypeEnum.public,
        networkId: undefined,
        subnetId: undefined,
      } as NetworkOptionValue,
    },
  });

  const name = form.watch('name');
  const engineWithVersion = form.watch('engineWithVersion');
  const plan = form.watch('plan');
  const region = form.watch('region');
  const flavor = form.watch('flavor');
  const nbNodes = form.watch('nbNodes');
  const additionalStorage = form.watch('additionalStorage');
  const ips = form.watch('ipRestrictions');
  const network = form.watch('network');

  const networksData = useVrack(projectId, region, network.networkId);

  const [price, setPrice] = useState({
    hourly: { price: 0, tax: 0 },
    monthly: { price: 0, tax: 0 },
  });

  // Create the list of available engines
  const listEngines = useMemo(
    () =>
      createTree(
        availabilities,
        capabilities,
        engineCapabilities,
        regionCapabilities,
        suggestions,
        catalog,
      ),
    [availabilities, capabilities],
  );
  // Create the list of available plans
  const listPlans = useMemo(
    () =>
      listEngines
        ?.find((e: Engine) => e.name === engineWithVersion.engine)
        ?.versions.find((v: Version) => v.name === engineWithVersion.version)
        ?.plans || [],
    [listEngines, engineWithVersion],
  );
  // Create the list of available regions
  const listRegions = useMemo(
    () => listPlans?.find((p: Plan) => p.name === plan)?.regions || [],
    [listPlans, plan],
  );
  // Create the list of available flavors
  const listFlavors = useMemo(
    () => listRegions?.find((r: Region) => r.name === region)?.flavors || [],
    [listRegions, region],
  );

  const engineObject: Engine | undefined = useMemo(
    () => listEngines.find((e) => e.name === engineWithVersion.engine),
    [listEngines, engineWithVersion.engine],
  );
  const versionObject: Version | undefined = useMemo(
    () =>
      engineObject?.versions.find((v) => v.name === engineWithVersion.version),
    [engineObject, engineWithVersion.version],
  );
  const planObject: Plan | undefined = useMemo(
    () => listPlans.find((p) => p.name === plan),
    [listPlans, plan],
  );
  const regionObject: Region | undefined = useMemo(
    () => listRegions.find((r) => r.name === region),
    [listRegions, region],
  );
  const flavorObject: Flavor | undefined = useMemo(
    () => listFlavors.find((f) => f.name === flavor),
    [listFlavors, flavor],
  );

  // find the availability corresponding to selected items
  const availability: database.Availability | undefined = useMemo(
    () =>
      availabilities.find(
        (a) =>
          a.engine === engineWithVersion.engine &&
          a.version === engineWithVersion.version &&
          a.plan === plan &&
          a.region === region &&
          a.specifications.flavor === flavor,
      ),
    [availabilities, engineWithVersion, plan, region, flavor],
  );

  // compute pricing when availability, nbNodes and additionalStorage changes
  useEffect(() => {
    if (!availability) return;
    const offerPricing = flavorObject.pricing;
    const newPrice = {
      hourly: {
        price: offerPricing.hourly.price * nbNodes,
        tax: offerPricing.hourly.tax * nbNodes,
      },
      monthly: {
        price: offerPricing.monthly.price * nbNodes,
        tax: offerPricing.monthly.tax * nbNodes,
      },
    };
    if (flavorObject.storage?.pricing) {
      const storageFactor =
        engineObject.storageMode ===
        database.capabilities.engine.storage.StrategyEnum.distributed
          ? 1
          : nbNodes;
      const { pricing: storagePrices } = flavorObject.storage;
      newPrice.hourly.price +=
        additionalStorage * storagePrices.hourly.price * storageFactor;
      newPrice.hourly.tax +=
        additionalStorage * storagePrices.hourly.tax * storageFactor;
      newPrice.monthly.price +=
        additionalStorage * storagePrices.monthly.price * storageFactor;
      newPrice.monthly.tax +=
        additionalStorage * storagePrices.monthly.tax * storageFactor;
    }

    setPrice(newPrice);
  }, [availability, nbNodes, additionalStorage, engineObject]);

  // select an engine and a version when listEngines is changed
  useEffect(() => {
    const engineAndVersion = { engine: '', version: '' };
    const suggestedEngine = suggestions.find((s) => s.default);
    const defaultEngine =
      listEngines.find((e) => e.name === suggestedEngine.engine) ??
      listEngines[0];
    const { defaultVersion } = defaultEngine;
    engineAndVersion.engine = defaultEngine.name;
    engineAndVersion.version = defaultVersion;
    form.setValue('engineWithVersion', engineAndVersion);
  }, [listEngines]);
  // update plan
  useEffect(() => {
    form.setValue(
      'plan',
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engineWithVersion.engine),
        'plan',
        listPlans,
      ),
    );
  }, [listPlans, suggestions, engineWithVersion.engine]);
  // update nodes when plan changes
  useEffect(() => {
    if (!planObject) return;
    form.setValue('nbNodes', planObject.nodes.minimum);
  }, [plan, listPlans]);
  // update region
  useEffect(() => {
    form.setValue(
      'region',
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engineWithVersion.engine),
        'region',
        listRegions,
        region,
      ),
    );
  }, [listRegions, suggestions, engineWithVersion.engine, region]);
  // update flavor
  useEffect(() => {
    form.setValue(
      'flavor',
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engineWithVersion.engine),
        'flavor',
        listFlavors,
        flavor,
      ),
    );
  }, [listFlavors, suggestions, engineWithVersion.engine, flavor]);
  // reset storage when flavor is changed
  useEffect(() => {
    form.setValue('additionalStorage', 0);
  }, [flavor]);

  useEffect(() => {
    if (network.networkId) networksData.setId(network.networkId);
  }, [network.networkId]);

  return {
    form,
    lists: {
      engines: listEngines,
      plans: listPlans,
      regions: listRegions,
      flavors: listFlavors,
      networks: networksData.networks,
      subnets: networksData.subnets,
    },
    result: {
      availability,
      price,
      name,
      engine: engineObject,
      version: versionObject,
      plan: planObject,
      region: regionObject,
      flavor: flavorObject,
      nodes: nbNodes,
      additionalStorage,
      ipRestrictions: ips,
    },
  };
}
