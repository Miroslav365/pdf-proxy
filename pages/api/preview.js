const ALLOWED_HOSTNAMES = [
  'storage.base44.com',
  'qtrypzzcjebvfcihiynt.supabase.co',
  'www.w3.org'
  // dodaj po potrebi
];

const { URL } = require('url');

export default async function handler(req, res) {
  let url;
  if (req.method === "GET") {
    url = req.query.url;
  } else if (req.method === "POST") {
    url = req.body.url;
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  // Varnostna kontrola
  try {
    const parsedUrl = new URL(url);
    if (!ALLOWED_HOSTNAMES.includes(parsedUrl.hostname)) {
      return res.status(403).json({ error: "Forbidden host" });
    }
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(500).json({ error: "Failed to fetch PDF" });

    // Preveri ali je PDF
    if (!response.headers.get('content-type').includes('pdf')) {
      return res.status(415).json({ error: "Only PDF allowed" });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    return res.status(200).send(buffer);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
