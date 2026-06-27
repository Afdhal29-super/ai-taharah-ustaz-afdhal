import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Tiada gambar" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || "image/jpeg",
        },
      },
      "Analisis jenis air untuk fiqh taharah. Jawab ringkas.",
    ]);

    const text = result.response.text();

    return res.status(200).json({
      objek: "Objek dikesan",
      kategori_fiqh: "Taharah",
      status_penggunaan: "Sesuai / Tidak sesuai",
      keyakinan: "80%",
      analisis_ai: text,
      penerangan_pendidikan: "Rujukan fiqh air mutlak/mutaghayyir/mutanajjis",
      cadangan: "Gunakan jika suci",
      amaran: "Sila semak dengan guru",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
