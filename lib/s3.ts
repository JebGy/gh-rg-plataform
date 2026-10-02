import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PDFDocument } from 'pdf-lib';

const endpoint =
  process.env.MINIO_ENDPOINT_INTERNAL ||
  process.env.MINIO_ENDPOINT ||
  'https://ti-miniossma.tc5u8q.easypanel.host';
const region = process.env.MINIO_REGION || 'us-east-1';
const accessKeyId = process.env.MINIO_ACCESS_KEY_ID || 'admin';
const secretAccessKey = process.env.MINIO_SECRET_ACCESS_KEY || 'password';
export const BUCKET_NAME = process.env.MINIO_BUCKET || 'ssma-2026';

export const s3Client = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

export async function uploadPalfingerCv({
  fileBuffer,
  fileName,
  mimeType = 'application/pdf',
  candidateDni,
  candidateName,
}: {
  fileBuffer: Buffer;
  fileName: string;
  mimeType?: string;
  candidateDni?: string;
  candidateName?: string;
}): Promise<{
  fileKey: string;
  fileName: string;
  downloadUrl: string;
  directUrl: string;
  sizeBytes: number;
}> {
  let finalBuffer = fileBuffer;
  let finalSize = fileBuffer.length;

  const isPdf =
    mimeType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      if (compressedBytes.byteLength < fileBuffer.length) {
        finalBuffer = Buffer.from(compressedBytes);
        finalSize = finalBuffer.length;
      }
    } catch (err) {
      console.warn('[s3-palfinger] Advertencia al comprimir PDF, se usa original:', err);
    }
  }

  const sanitizedDni = candidateDni ? candidateDni.replace(/[^0-9]/g, '') : 'doc';
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const folder = 'Capacitaciones PALFINGER 2026';
  const fileKey = `${folder}/${Date.now()}_${sanitizedDni}_${sanitizedName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: finalBuffer,
      ContentType: mimeType,
    })
  );

  // Generar URL prefirmada (válida por 7 días = 604800s)
  let downloadUrl = '';
  try {
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(fileName)}"`,
    });
    downloadUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 7 * 24 * 3600 });
  } catch (urlErr) {
    console.warn('[s3-palfinger] No se pudo generar presigned URL inmediata:', urlErr);
    downloadUrl = `${endpoint}/${BUCKET_NAME}/${encodeURIComponent(fileKey)}`;
  }

  const directUrl = `${endpoint}/${BUCKET_NAME}/${encodeURIComponent(fileKey)}`;

  return {
    fileKey,
    fileName,
    downloadUrl,
    directUrl,
    sizeBytes: finalSize,
  };
}

export async function getCvDownloadUrl(fileKey: string, fileName?: string): Promise<string> {
  const finalName = fileName || fileKey.split('/').pop() || 'documento.pdf';
  const getCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ResponseContentDisposition: `attachment; filename="${encodeURIComponent(finalName)}"`,
  });
  return await getSignedUrl(s3Client, getCommand, { expiresIn: 7 * 24 * 3600 });
}
