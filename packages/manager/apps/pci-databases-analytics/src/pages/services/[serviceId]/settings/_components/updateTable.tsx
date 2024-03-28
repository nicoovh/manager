import { MinusCircle, PlusCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { database } from '@/models/database';
import { useServiceData } from '../../layout';
import {
  FullCapabilities,
  useGetAvailabilities,
  useGetFullCapabilities,
} from '@/hooks/api/availabilities.api.hooks';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/links';
import { formatStorage } from '@/lib/bytesHelper';
import { useModale } from '@/hooks/useModale';
import UpdateVersion from '../update/_components/modals/updateVersion';
import UpdatePlan from '../update/_components/modals/updatePlan';
import UpdateFlavor from '../update/_components/modals/updateFlavor';
import AddNode from '../update/_components/modals/addNode';
import DeleteNode from '../update/_components/modals/removeNode';
import UpdateStorage from '../update/_components/modals/updateStorage';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import { updateTags } from '@/lib/tagsHelper';

const UpdateTable = () => {
  const { service, projectId } = useServiceData();
  const catalogQuery = useGetCatalog();
  const capabilitiesQuery = useGetFullCapabilities(projectId);
  const availabilitiesVersionQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.version,
  );
  const availabilitiesPlanQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.plan,
  );
  const availabilitiesFlavorQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.flavor,
  );
  const updateVersionModal = useModale('update-version');
  const updatePlanModal = useModale('update-plan');
  const updateFlavorModal = useModale('update-flavor');
  const updateStorageModal = useModale('update-storage');
  const addNode = useModale('add-node');
  const deleteNode = useModale('delete-node');

  const capabilities: FullCapabilities = useMemo(() => {
    if (!capabilitiesQuery.data)
      return {
        flavors: [],
        disks: [],
        engines: [],
        options: [],
        plans: [],
        regions: [],
      };
    const { flavors, plans, regions, ...rest } = capabilitiesQuery.data;

    return {
      ...rest,
      flavors: updateTags(flavors, service.flavor),
      plans: updateTags(plans, service.plan),
      regions: updateTags(regions, service.nodes[0].region),
    } as FullCapabilities;
  }, [capabilitiesQuery.data, service]);

  return (
    <>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">Version</TableCell>
            <TableCell>
              {humanizeEngine(service.engine)} {service.version}
            </TableCell>
            {availabilitiesVersionQuery.data?.length > 1 && (
              <TableCell className="text-right">
                <Button
                  variant="default"
                  size="default"
                  className="py-0 h-auto"
                  onClick={() => updateVersionModal.open()}
                >
                  Update
                </Button>
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Plan</TableCell>
            <TableCell>{service.plan}</TableCell>
            {availabilitiesPlanQuery.data?.length > 1 && (
              <TableCell className="text-right">
                <Button
                  variant="default"
                  size="default"
                  className="py-0 h-auto"
                  onClick={() => updatePlanModal.open()}
                >
                  Update
                </Button>
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Flavor</TableCell>
            <TableCell>{service.flavor}</TableCell>
            {availabilitiesFlavorQuery.data?.length > 1 && (
              <TableCell className="text-right">
                <Button
                  variant="default"
                  size="default"
                  className="py-0 h-auto"
                  onClick={() => updateFlavorModal.open()}
                >
                  Update
                </Button>
              </TableCell>
            )}
          </TableRow>
          {service.storage?.size.value > 0 && (
            <TableRow>
              <TableCell className="font-semibold">Storage</TableCell>
              <TableCell>
                {formatStorage(service.storage.size)} {service.storage.type}
              </TableCell>
              {availabilitiesFlavorQuery.data?.length > 1 && (
                <TableCell className="text-right">
                  <Button
                    variant="default"
                    size="default"
                    className="py-0 h-auto"
                    onClick={() => updateStorageModal.open()}
                  >
                    Update
                  </Button>
                </TableCell>
              )}
            </TableRow>
          )}
          <TableRow>
            <TableCell className="font-semibold">Nodes</TableCell>
            <TableCell>{service.nodes.length}</TableCell>
            {availabilitiesFlavorQuery.data?.length > 1 && (
              <TableCell className="flex gap-2 justify-end">
                <Button
                  variant={'ghost'}
                  size="table"
                  className="p-0 h-auto text-destructive"
                  onClick={() => deleteNode.open()}
                >
                  <MinusCircle />
                </Button>
                <Button
                  variant={'ghost'}
                  size="table"
                  className="p-0 h-auto text-primary"
                  onClick={() => addNode.open()}
                >
                  <PlusCircle />
                </Button>
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
      {/* Modals */}
      {catalogQuery.isSuccess && capabilitiesQuery.isSuccess && (
        <>
          {availabilitiesVersionQuery.isSuccess && (
            <UpdateVersion
              availabilities={availabilitiesVersionQuery.data}
              controller={updateVersionModal.controller}
              capabilities={capabilities}
              catalog={catalogQuery.data}
              onError={() => {}}
              onSuccess={() => {}}
            />
          )}
          {availabilitiesPlanQuery.isSuccess && (
            <UpdatePlan
              availabilities={availabilitiesPlanQuery.data}
              controller={updatePlanModal.controller}
              capabilities={capabilities}
              catalog={catalogQuery.data}
              onError={() => {}}
              onSuccess={() => {}}
            />
          )}
          {availabilitiesFlavorQuery.isSuccess && (
            <>
              <UpdateFlavor
                availabilities={availabilitiesFlavorQuery.data}
                controller={updateFlavorModal.controller}
                capabilities={capabilities}
                catalog={catalogQuery.data}
                onError={() => {}}
                onSuccess={() => {}}
              />
              <UpdateStorage
                availabilities={[
                  availabilitiesFlavorQuery.data.find(
                    (f) => f.specifications.flavor === service.flavor,
                  ),
                ]}
                controller={updateStorageModal.controller}
                onError={() => {}}
                onSuccess={() => {}}
              />
            </>
          )}
        </>
      )}
      <AddNode
        controller={addNode.controller}
        onError={() => {}}
        onSuccess={() => {}}
      />
      <DeleteNode
        controller={deleteNode.controller}
        onError={() => {}}
        onSuccess={() => {}}
      />
    </>
  );
};

export default UpdateTable;
