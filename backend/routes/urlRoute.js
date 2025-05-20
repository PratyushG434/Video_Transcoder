import { generateUploadUrl } from './generateUploadUrl.js';

const router = express.Router();



router.post('/upload-url', async (req, res) => {
  const { filename, filetype } = req.body;

  if (!filename || !filetype) {
    return res.status(400).json({ error: 'Missing filename or filetype' });
  }

  try {
    const { url, key } = await generateUploadUrl(filename, filetype);
    res.json({ uploadUrl: url, objectKey: key });
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;