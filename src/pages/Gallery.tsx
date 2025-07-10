import React, { useEffect, useContext, useState, Children } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DeviceContext } from '../contexts/Device';
import {
  paths,
  operations,
  components,
} from '../types/gallery/api_schema_client';
import { updateAuthFromFetchResponse, useApiCall } from '../utils/api';
import { ModalsContext } from '../contexts/Modals';
import { AuthContext } from '../contexts/Auth';
import { Button1 } from '../components/Utils/Button';
import { setFileUploaderModal } from '../components/Gallery/FileUploader';

import {
  deleteGallery,
  getGalleryPage,
  postGallerySync,
} from '../services/api-services/gallery';

import { IoCloudUploadOutline } from 'react-icons/io5';
import { setAddGalleryModal } from '../components/Gallery/AddGallery';
import { getGalleryLink } from '../components/Gallery/getLink';
import { Link } from 'react-router-dom';
import { ToastContext } from '../contexts/Toast';
import { config } from '../config/config';
import { get } from 'http';

interface Props {
  root?: boolean;
}

export function Gallery({ root = false }: Props) {
  const modalsContext = useContext(ModalsContext);
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);
  const navigate = useNavigate();

  const galleryId: components['schemas']['GalleryPrivate']['id'] | undefined =
    useParams().galleryId;

  const { data, loading, response, refetch } = useApiCall(
    getGalleryPage,
    [galleryId],
    {
      params: {
        query: {
          ...(galleryId !== undefined && { gallery_id: galleryId }),
        },
      },
    }
  );

  async function handleSyncGallery(
    gallery: components['schemas']['GalleryPublic']
  ) {
    let toastId = toastContext.makePending({
      message: `Syncing gallery ${gallery.date ? `${gallery.date} ` : ''}${
        gallery.name
      }`,
    });

    const { data, error, response } = updateAuthFromFetchResponse(
      await postGallerySync.request({
        params: {
          path: {
            gallery_id: gallery.id,
          },
        },
      }),
      authContext
    );

    if (data !== undefined) {
      toastContext.update(toastId, {
        message: 'Gallery synced with local',
        type: 'success',
      });
    } else if (error !== undefined) {
      toastContext.update(toastId, {
        message: 'Error syncing gallery with local',
        type: 'error',
      });
    }
    refetch();
  }

  async function handleDeleteGallery(
    gallery: components['schemas']['GalleryPublic']
  ) {
    let toastId = toastContext.makePending({
      message: `Delete gallery ${gallery.date} ${gallery.name}`,
    });

    const { data, error, response } = updateAuthFromFetchResponse(
      await deleteGallery.request({
        params: {
          path: {
            gallery_id: gallery.id,
          },
        },
      }),
      authContext
    );

    if (data !== undefined) {
      toastContext.update(toastId, {
        message: 'Gallery deleted',
        type: 'success',
      });
      navigate(config.frontendRoutes.galleries ?? '/');
    } else if (error !== undefined) {
      toastContext.update(toastId, {
        message: 'Error deleting gallery',
        type: 'error',
      });
    }
  }

  return (
    <>
      <div className="flex flex-row space-x-2 ">
        {(data === undefined ? [] : data.parents).map((gallery, index) => (
          <span key={gallery.id} className="flex flex-row space-x-2">
            <Link to={getGalleryLink(gallery.id)}>
              <p className="underline" key={gallery.id}>
                {gallery.name}
              </p>
            </Link>
            <p>/</p>
          </span>
        ))}
      </div>
      <div className="flex flex-row justify-between items-center">
        <h1>{data === undefined ? 'Gallery' : data.gallery.name}</h1>
        <Button1
          disabled={data === undefined}
          onClick={() =>
            data !== undefined &&
            setAddGalleryModal({
              modalsContext,
              onSuccess: (gallery) => {
                refetch();
              },
              parentGalleryId: data.gallery.id,
            })
          }
        >
          Make Gallery
        </Button1>
        <Button1
          disabled={data === undefined}
          onClick={() =>
            data !== undefined &&
            setFileUploaderModal(modalsContext, data.gallery)
          }
        >
          <div className="flex flex-row items-center space-x-2">
            <IoCloudUploadOutline />
            Upload Files
          </div>
        </Button1>
        <Button1
          disabled={data === undefined}
          onClick={() => data !== undefined && handleSyncGallery(data.gallery)}
        >
          Sync with Local
        </Button1>
        <Button1
          onClick={() =>
            data !== undefined && handleDeleteGallery(data.gallery)
          }
          disabled={data === undefined || data.gallery.parent_id === null}
        >
          Delete Gallery
        </Button1>
      </div>
      <div>
        {(data === undefined ? [] : data.children).map((gallery) => (
          <div key={gallery.id}>
            <Link to={getGalleryLink(gallery.id)}>
              <p className="underline" key={gallery.id}>
                {gallery.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
