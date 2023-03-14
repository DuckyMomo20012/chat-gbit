import fs from 'fs';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { openai } from '@/lib/openai';

export const config = {
  api: {
    bodyParser: false,
  },
};

const EXTENSION_MAP: { [key: string]: string } = {
  'audio/webm;codecs=opus': 'webm',
};

const bodySchema = z.object({
  model: z.enum(['whisper-1']),
  audio: z.unknown(),
});

export default async function getTranscriptions(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const form = formidable({
      keepExtensions: true,
    });
    const [formFields, formFiles] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        try {
          bodySchema.parse({
            ...fields,
            ...files,
          });
        } catch (parseError) {
          reject(parseError);
        }

        resolve([fields, files]);
      });
    });

    const audio = formFiles.audio as formidable.File;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newFilepath = `${audio.filepath}.${EXTENSION_MAP[audio.mimetype!]}`;

    fs.rename(audio.filepath, newFilepath, (renameErr) => {
      if (renameErr) throw renameErr;
    });
    const file = fs.createReadStream(newFilepath);

    const response = await openai.createTranscription(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      file as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formFields.model as any,
    );

    res.status(200).json(response.data);

    fs.rm(newFilepath, (rmErr) => {
      if (rmErr) throw rmErr;
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
