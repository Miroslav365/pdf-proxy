export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch PDF" });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); // ali attachment za prenos

    return res.status(200).send(buffer);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
