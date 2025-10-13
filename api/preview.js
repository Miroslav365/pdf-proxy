export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing 'url' parameter");
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type") || "application/pdf";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline; filename=preview.pdf");

    response.body.pipe(res);
  } catch (error) {
    console.error("PDF proxy error:", error);
    res.status(500).send("Error fetching PDF");
  }
}