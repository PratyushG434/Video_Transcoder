import { generateUploadUrl } from "../utils/generateSignedURL.js";


export async function generateUploadURL(req, res)
{
  
    try {
      const { url, key } = await generateUploadUrl(filename, filetype);
      res.json({ uploadUrl: url, objectKey: key });
    } catch (err) {
      console.error('Error generating pre-signed URL:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }