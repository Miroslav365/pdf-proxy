import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).send("Missing URL");

  const pdfRes = await fetch(url);
  if (!pdfRes.ok) return res.status(500).send("Failed to fetch PDF");

  res.setHeader('Content-Type', 'application/pdf');
  pdfRes.body.pipe(res);
}
