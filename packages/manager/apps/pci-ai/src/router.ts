// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/projects/:projectId`
  | `/projects/:projectId/notebooks`
  | `/projects/:projectId/notebooks/:notebookId`
  | `/projects/:projectId/notebooks/:notebookId/attached-data`
  | `/projects/:projectId/notebooks/:notebookId/general-information`
  | `/projects/:projectId/notebooks/new`

export type Params = {
  '/projects/:projectId': { projectId: string }
  '/projects/:projectId/notebooks': { projectId: string }
  '/projects/:projectId/notebooks/:notebookId': { projectId: string; notebookId: string }
  '/projects/:projectId/notebooks/:notebookId/attached-data': { projectId: string; notebookId: string }
  '/projects/:projectId/notebooks/:notebookId/general-information': { projectId: string; notebookId: string }
  '/projects/:projectId/notebooks/new': { projectId: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
