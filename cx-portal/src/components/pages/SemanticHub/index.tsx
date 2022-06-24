import StageHeader from 'components/shared/frame/StageHeader'
import { Button, PageSnackbar, Typography } from 'cx-portal-shared-components'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import ModelDetailDialog from './ModelDetailDialog'
import ModelTable from './ModelTable'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchModelArtefact,
  fetchSemanticModelById,
} from 'features/semanticModels/actions'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ModelImportDialog from './ModeImportDialog'
import { semanticModelsSelector } from 'features/semanticModels/slice'

export default function SemanticHub() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showModel, setShowModel] = useState<boolean>(false)
  const [importModel, setImportModel] = useState<boolean>(false)
  const [showDeleteError, setShowDeleteError] = useState<boolean>(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState<boolean>(false)
  const { deleteError, deleteModelId } = useSelector(semanticModelsSelector)

  useEffect(() => {
    if (deleteError.length > 0) setShowDeleteError(true)
  }, [deleteError])

  useEffect(() => {
    console.log(deleteModelId)
    if (deleteModelId.length > 0) {
      setShowModel(false)
      setShowDeleteSuccess(true)
    }
  }, [deleteModelId])

  const onModelSelect = (urn: string) => {
    setShowModel(true)
    const encodedUrn = encodeURIComponent(urn)
    dispatch(fetchSemanticModelById(encodedUrn))
    dispatch(fetchModelArtefact({ type: 'diagram', id: encodedUrn }))
    dispatch(fetchModelArtefact({ type: 'ttl', id: encodedUrn }))
    dispatch(fetchModelArtefact({ type: 'json', id: encodedUrn }))
    dispatch(fetchModelArtefact({ type: 'payload', id: encodedUrn }))
    dispatch(fetchModelArtefact({ type: 'docu', id: encodedUrn }))
  }

  return (
    <>
      <StageHeader title={t('content.semantichub.title')} />
      <main className="semantic-models">
        <section>
          <Grid container justifyContent="space-between">
            <Grid item xs={5}>
              <Typography variant="body2" mb={2}>
                {t('content.semantichub.introText_0')}
              </Typography>
              <Typography variant="body2" mb={4}>
                {t('content.semantichub.introText_1')}
              </Typography>
              <Button
                onClick={() => setImportModel(true)}
                startIcon={<AddCircleOutlineIcon fontSize="large" />}
              >
                {t('content.semantichub.addModel')}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <img
                style={{ marginTop: '-200px', border: '16px solid white' }}
                src="/edc-connector-text-image.png"
                width="100%"
                alt={'alt tag info'}
              />
            </Grid>
          </Grid>
        </section>
        <ModelTable onModelSelect={onModelSelect} />
      </main>
      <ModelDetailDialog show={showModel} onClose={() => setShowModel(false)} />
      <ModelImportDialog
        show={importModel}
        onClose={() => setImportModel(false)}
      />
      <PageSnackbar
        open={showDeleteError}
        onCloseNotification={() => setShowDeleteError(false)}
        severity="error"
        title="Error"
        description={deleteError}
        showIcon={true}
        vertical={'bottom'}
        horizontal={'left'}
      />

      <PageSnackbar
        open={showDeleteSuccess}
        onCloseNotification={() => setShowDeleteSuccess(false)}
        severity="success"
        title="Model deleted!"
        showIcon={true}
        vertical={'bottom'}
        horizontal={'left'}
      />
    </>
  )
}
