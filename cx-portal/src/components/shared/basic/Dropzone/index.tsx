/********************************************************************************
 * Copyright (c) 2021,2022 BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import { DropArea, Typography } from 'cx-portal-shared-components'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { Preview } from './components/Preview'

export const Dropzone = ({
  onChange,
  showPreviewAlone = false,
  children,
  acceptFormat = { 'image/*': [] },
  maxFilesToUpload = 1,
  files,
  maxFileSize,
}: {
  onChange: (files: File[]) => void
  files?: File[]
  showPreviewAlone?: boolean
  preview?: (files: File[]) => JSX.Element
  children?: JSX.Element[] | JSX.Element
  acceptFormat?: any
  maxFilesToUpload?: number
  maxFileSize?: number
}) => {
  const { t } = useTranslation()

  const [dropped, setDropped] = useState<File[]>([])

  const currentFiles = files ?? dropped

  const isSingleUpload = maxFilesToUpload === 1

  const isDisabled = isSingleUpload
    ? false
    : currentFiles.length === maxFilesToUpload

  const onDropAccepted = useCallback(
    (files: File[]) => {
      const nextFiles = isSingleUpload ? files : [...dropped, ...files]

      setDropped(nextFiles)
      onChange(nextFiles)
    },
    [dropped, isSingleUpload, onChange]
  )

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDropAccepted,
    disabled: isDisabled || showPreviewAlone,
    maxFiles: isSingleUpload ? 0 : maxFilesToUpload,
    accept: acceptFormat,
    multiple: false,
    maxSize: maxFileSize,
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {!showPreviewAlone && (
        <DropArea
          disabled={isDisabled}
          translations={{
            title: t('shared.dropzone.title'),
            subTitle: t('shared.dropzone.subTitle'),
          }}
        />
      )}
      {fileRejections?.map(({ errors }, index: number) => (
        <Typography
          variant="body2"
          sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 1 }}
          key={index}
        >
          {errors && errors[0]?.message}
        </Typography>
      ))}

      <Preview files={currentFiles} />

      {children}
    </div>
  )
}
