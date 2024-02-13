import { apiClient } from "@ovh-ux/manager-core-api";
import { ai } from "@/models/types";


export interface NotebookProps {
    projectId: string,
    notebookId: string,
};

export interface JobProps {
    projectId: string,
    jobId: string,
};

export interface DataSyncProps {
    projectId: string,
    productId: string,
    dataSyncSpec?: {
        direction: string,
    },
};


export interface LabelsProps {
    projectId: string,
    notebookId: string,
    notebookSpec: {
        labels: Record<string, string>,
    },
};

export interface OrderNbProps {
    projectId: string,
    notebookSpec: {
        env: {
            editorId: string,
            frameworkId: string,
            frameworkVersion?: string,
        },
        name?: string,
        region: string,
        unsecureHttp: boolean,
        resources: {
            flavor: string,
            cpu?: number,
            gpu?: number,
        },
    };
};

export const aiApi = {
    getRegions: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/capabilities/region`,
    ).then(res => res.data as ai.capabilities.Region[])
    ,
    getFlavors: async (projectId: string, region: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/capabilities/region/${region}/flavor`,
    ).then(res => res.data as ai.capabilities.Flavor[])
    ,
};

export const notebookApi = {
    getNotebooks: async (projectId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/notebook`,
            {
                headers: {
                    'X-Pagination-Mode': 'CachedObjectList-Pages',
                    'X-Pagination-Size': '50000',
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.notebook.Notebook[])
    ,
    getNotebook: async (projectId: string, notebookId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}`,
            {
                headers: {
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.notebook.Notebook)
    ,
    getNbCapaEditors: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/notebook/capabilities/editor`,
    ).then(res => res.data as ai.notebook.Editor[])
    ,
    getNbCapaFrameworks: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/notebook/capabilities/framework`,
    ).then(res => res.data as ai.notebook.Framework[])
    ,
    deleteNotebook: async ({
        projectId,
        notebookId,
    }: NotebookProps
    ) => {
        await apiClient.v6.delete(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}`,
        )
    },
    stopNotebook: async ({
        projectId,
        notebookId,
    }: NotebookProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}/stop`,
        )
    },
    startNotebook: async ({
        projectId,
        notebookId,
    }: NotebookProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}/start`,
        )
    },
    manualDataSync: async ({
        projectId,
        productId,
        dataSyncSpec,
    }: DataSyncProps
    ) => {
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/notebook/${productId}/datasync`,
            dataSyncSpec,
        )
            .then((res) => res.data as string);
    },
    orderNotebook: async ({
        projectId,
        notebookSpec,
    }: OrderNbProps
    ) => {
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/notebook/`,
            notebookSpec,
        )
            .then((res) => res.data as string);
    },
    updateNotebook: async ({
        projectId,
        notebookId,
        notebookSpec,
    }: LabelsProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}`,
            notebookSpec,
        )
            .then((res) => res.data as string);
    }
};

export const jobsApi = {
    getJobs: async (projectId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/job`,
            {
                headers: {
                    'X-Pagination-Mode': 'CachedObjectList-Pages',
                    'X-Pagination-Size': '50000',
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.job.Job[])
    ,
    getJob: async (projectId: string, jobId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/job/${jobId}`,
            {
                headers: {
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.job.Job)
    ,
    deleteJob: async ({
        projectId,
        jobId,
    }: JobProps
    ) => {
        await apiClient.v6.delete(
            `/cloud/project/${projectId}/ai/job/${jobId}`,
        )
    },
    stopJob: async ({
        projectId,
        jobId,
    }: JobProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/job/${jobId}/stop`,
        )
    },
    startJob: async ({
        projectId,
        jobId,
    }: JobProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/job/${jobId}/start`,
        )
    },
    manualDataSync: async ({
        projectId,
        productId,
        dataSyncSpec,
    }: DataSyncProps
    ) => {
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/job/${productId}/datasync`,
            dataSyncSpec,
        )
            .then((res) => res.data as string);
    },
    getLogs: async (projectId: string, jobId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/job/${jobId}/log`,
            {
                headers: {
                    'Pragma': 'no-cache',
                },
            },
        ).then(res => res.data as ai.Logs)
    ,
};
