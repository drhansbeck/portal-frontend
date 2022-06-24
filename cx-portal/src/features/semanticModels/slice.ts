import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'features/store'
import {
  fetchSemanticModelById,
  fetchSemanticModels,
  postSemanticModel,
  fetchModelArtefact,
  changeOpenApiUrl,
  deleteSemanticModelById,
} from './actions'
import { ModelList, SemanticModel, SemanticModelsInitialState } from './types'

const defaultModels: ModelList = {
  items: [],
  totalItems: 0,
  itemCount: 0,
  currentPage: 0,
  totalPages: 0,
}

const initialState: SemanticModelsInitialState = {
  modelList: defaultModels,
  loadingModelList: false,
  model: null,
  loadingModel: false,
  diagram: '',
  ttlFile: '',
  jsonFile: '',
  docuFile: '',
  payloadFile: '',
  artefactError: '',
  uploadedModel: null,
  uploading: false,
  uploadError: '',
  openApiLink: '',
  openApiError: '',
  error: '',
  deleteModelId: '',
  deleteError: '',
}

const modelsSlice = createSlice({
  name: 'semanticModels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSemanticModels.pending, (state) => {
      state.modelList = defaultModels
      state.loadingModelList = true
      state.error = ''
    })
    builder.addCase(fetchSemanticModels.fulfilled, (state, { payload }) => {
      state.modelList = payload as ModelList
      state.loadingModelList = false
      state.error = ''
    })
    builder.addCase(fetchSemanticModels.rejected, (state, action) => {
      state.modelList = defaultModels
      state.loadingModelList = false
      state.error = action.error.message as string
    })
    builder.addCase(fetchSemanticModelById.pending, (state) => {
      state.model = null
      state.loadingModel = true
      state.error = ''
    })
    builder.addCase(fetchSemanticModelById.fulfilled, (state, { payload }) => {
      state.model = payload as SemanticModel
      state.loadingModel = false
      state.error = ''
    })
    builder.addCase(fetchSemanticModelById.rejected, (state, action) => {
      state.model = null
      state.loadingModel = false
      state.error = action.error.message as string
    })
    builder.addCase(postSemanticModel.pending, (state) => {
      state.uploading = true
      state.uploadedModel = null
      state.error = ''
    })
    builder.addCase(postSemanticModel.fulfilled, (state, { payload }) => {
      state.uploading = false
      state.uploadedModel = payload
      state.error = ''
    })
    builder.addCase(postSemanticModel.rejected, (state, action) => {
      state.uploading = false
      state.uploadedModel = null
      state.uploadError = action.error.message as string
    })
    builder.addCase(fetchModelArtefact.pending, (state, action) => {
      setFileType(action.meta.arg.type, state, '')
      state.artefactError = ''
    })
    builder.addCase(fetchModelArtefact.fulfilled, (state, action) => {
      const value = URL.createObjectURL(action.payload)
      setFileType(action.meta.arg.type, state, value)
      state.artefactError = ''
    })
    builder.addCase(fetchModelArtefact.rejected, (state, action) => {
      setFileType(action.meta.arg.type, state, '')
      state.artefactError = action.error.message as string
    })
    builder.addCase(changeOpenApiUrl.fulfilled, (state, action) => {
      state.openApiLink = URL.createObjectURL(action.payload)
      state.openApiError = ''
    })
    builder.addCase(changeOpenApiUrl.rejected, (state, action) => {
      state.openApiLink = ''
      state.openApiError = action.error.message as string
    })
    builder.addCase(deleteSemanticModelById.fulfilled, (state, { payload }) => {
      state.deleteModelId = payload
      state.deleteError = ''
    })
    builder.addCase(deleteSemanticModelById.rejected, (state, action) => {
      state.deleteModelId = ''
      state.deleteError = action.error.message as string
    })
  },
})

const setFileType = (
  type: string,
  state: SemanticModelsInitialState,
  value: string
) => {
  switch (type) {
    case 'diagram': {
      state.diagram = value
      break
    }
    case 'ttl': {
      state.ttlFile = value
      break
    }
    case 'json': {
      state.jsonFile = value
      break
    }
    case 'docu': {
      state.docuFile = value
      break
    }
    case 'payload': {
      state.payloadFile = value
      break
    }
  }
}

export const semanticModelsSelector = (
  state: RootState
): SemanticModelsInitialState => state.semanticModels

export default modelsSlice
