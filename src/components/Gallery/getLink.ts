import { paths, operations, components } from '../../gallery_api_schema_client';
import { config } from '../../config/config';

export function getGalleryLink(
  galleryId: components['schemas']['GalleryPublic']['id'] | null
): string {
  if (config.frontendRoutes.galleries === undefined) {
    throw new Error(
      'Frontend routes for galleries are not defined in the config.'
    );
  } else {
    if (!galleryId) {
      return config.frontendRoutes.galleries;
    } else {
      return `${config.frontendRoutes.galleries}/${galleryId}`;
    }
  }
}
