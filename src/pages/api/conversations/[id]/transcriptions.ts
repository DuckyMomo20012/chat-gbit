import fs from 'fs';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getTranscriptions } from '@/lib/openai';

export const config = {
  api: {
    bodyParser: false,
  },
};

const EXTENSION_MAP: { [key: string]: string } = {
  'audio/webm;codecs=opus': 'webm',
};

export const transcriptionBodySchema = z.object({
  model: z.string(),
  audio: z.unknown(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
          transcriptionBodySchema.parse({
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

    try {
      const response = await getTranscriptions({
        model: formFields.model as string,
        file,
      });

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }

    fs.rm(newFilepath, (rmErr) => {
      if (rmErr) throw rmErr;
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Bad request' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default handler;
