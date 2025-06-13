type ProgressCallback = (progress: number) => void;

export async function uploadFile<TResponse>(
  url: string,
  file: File,
  onProgress: ProgressCallback
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to a network error'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'));
    });

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Accept', 'application/json');

    const formData = new FormData();
    formData.append('file', file);

    xhr.send(formData);
  });
}
