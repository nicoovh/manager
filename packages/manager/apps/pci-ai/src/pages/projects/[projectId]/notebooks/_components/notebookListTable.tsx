import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, RefreshCcw } from 'lucide-react';
import { H2 } from '@/components/typography';

import { ai } from '@/models/types';
import { NotebookProps, notebookApi } from '@/data/aiapi';
import DeleteNotebookModal, {
  DeleteNotebookSubmitData,
} from './deleteNotebookModal';
import StopNotebookModal, { StopNotebookSubmitData } from './stopNotebookModal';
import StartNotebookModal, {
  StartNotebookSubmitData,
} from './startNotebookModal';
import { getColumns } from './notebookListColumns';

interface NotebooksListProps {
  notebooks: ai.notebook.Notebook[];
  projectId: string;
  refetchFn: () => void;
}

export default function NotebooksList({
  notebooks,
  projectId,
  refetchFn,
}: NotebooksListProps) {
  // define state
  const [isOpenModal, setOpenModal] = useState(false);
  const [deletingNotebook, setDeletingNotebook] = useState<
    ai.notebook.Notebook
  >();
  const [stopingNotebook, setStopingNotebook] = useState<
    ai.notebook.Notebook
  >();
  const [startingNotebook, setStartingNotebook] = useState<
    ai.notebook.Notebook
  >();

  // define api links

  const deleteNotebookMutation = useMutation({
    mutationFn: (mutationData: NotebookProps) =>
      notebookApi.deleteNotebook(mutationData),
    onSuccess: () => {
      //close modale
      setOpenModal(false);
      //refresh services list
      refetchFn();
    },
  });

  const stopNotebookMutation = useMutation({
    mutationFn: (mutationData: NotebookProps) =>
      notebookApi.stopNotebook(mutationData),
    onSuccess: () => {
      //close modale
      setOpenModal(false);
      //refresh services list
      refetchFn();
    },
  });

  const startNotebookMutation = useMutation({
    mutationFn: (mutationData: NotebookProps) =>
      notebookApi.startNotebook(mutationData),
    onSuccess: () => {
      //close modale
      setOpenModal(false);
      //refresh services list
      refetchFn();
    },
  });

  const columns: ColumnDef<ai.notebook.Notebook>[] = getColumns({
    onDeleteClicked: (notebook: ai.notebook.Notebook) => {
      setDeletingNotebook(notebook);
      setOpenModal(true);
    },
    onStopClicked: (notebook: ai.notebook.Notebook) => {
      setStopingNotebook(notebook);
      setOpenModal(true);
    },
    onStartClicked: (notebook: ai.notebook.Notebook) => {
      setStartingNotebook(notebook);
      setOpenModal(true);
    },
  });

  const onDeleteSubmit = (data: DeleteNotebookSubmitData) => {
    deleteNotebookMutation.mutate({
      projectId,
      notebookId: data.notebookId,
    });
  };

  const onStopSubmit = (data: StopNotebookSubmitData) => {
    stopNotebookMutation.mutate({
      projectId,
      notebookId: data.notebookId,
    });
  };

  const onStartSubmit = (data: StartNotebookSubmitData) => {
    startNotebookMutation.mutate({
      projectId,
      notebookId: data.notebookId,
    });
  };
  const handleCloseDeleteNotebookModal = () => {
    setOpenModal(false);
    setDeletingNotebook(undefined);
  };

  const handleCloseStopNotebookModal = () => {
    setOpenModal(false);
    setStopingNotebook(undefined);
  };

  const handleCloseStartNotebookModal = () => {
    setOpenModal(false);
    setStartingNotebook(undefined);
  };

  return (
    <>
      <H2>AI Notebooks</H2>
      <>
        <div>
          <div className="flex justify-between w-100 mb-2 items-end">
            <Button variant="outline" size="sm" asChild>
              <Link to="./new">
                <Plus className="w-4 h-4 mr-2" /> Create a new Notebooks
              </Link>
            </Button>
            <div className="flex">
              <Input
                type="text"
                id="search"
                placeholder="Search a notebook"
                className="mr-2"
              />
              <Button variant="outline" onClick={() => refetchFn()}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DataTable columns={columns} data={notebooks} pageSize={5} />
        </div>
        {startingNotebook && (
          <StartNotebookModal
            notebook={startingNotebook}
            open={isOpenModal}
            onClose={handleCloseStartNotebookModal}
            onSubmit={onStartSubmit}
          />
        )}
        {stopingNotebook && (
          <StopNotebookModal
            notebook={stopingNotebook}
            open={isOpenModal}
            onClose={handleCloseStopNotebookModal}
            onSubmit={onStopSubmit}
          />
        )}
        {deletingNotebook && (
          <DeleteNotebookModal
            notebook={deletingNotebook}
            open={isOpenModal}
            onClose={handleCloseDeleteNotebookModal}
            onSubmit={onDeleteSubmit}
          />
        )}
      </>
    </>
  );
}

NotebooksList.Skeleton = function NotebooksListSkeleton() {
  return (
    <>
      <div className="flex justify-between w-100 mb-2 items-end">
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={10} width={100} height={16} />
    </>
  );
};
