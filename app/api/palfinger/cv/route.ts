import { NextRequest, NextResponse } from 'next/server';
import { getCvDownloadUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const filename = searchParams.get('filename') || 'CV_Postulante.pdf';

    if (!key) {
      return NextResponse.json({ error: 'Falta el parámetro key' }, { status: 400 });
    }

    const downloadUrl = await getCvDownloadUrl(key, filename);
    return NextResponse.redirect(downloadUrl);
  } catch (error: any) {
    console.error('Error redirecting to CV download:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al obtener enlace de descarga' },
      { status: 500 }
    );
  }
}
