import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Pastikan hanya request POST dibenarkan
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Tiada gambar" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key tidak ditemui" });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ GUNA MODEL LATEST YANG DISOKONG
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = `
Analisis gambar ini untuk Fiqh Taharah.
Berikan:
- jenis air
- status (sah/tidak sah)
- penjelasan ringkas
Jawapan Bahasa Melayu.
`;

    // ✅ BUANG HEADER BASE64 JIKA ADA (contoh: "data:image/jpeg;base64,")
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    // Hantar data ke Gemini
    const result = await model.generateContent([
      {
        inlineData: {
          data: cleanBase64, // Guna data yang telah dibersihkan
          mimeType: mimeType || "image/jpeg",
        },
      },
      prompt,
    ]);

    // Dapatkan teks respons dari AI
    const text = result.response.text();

    // Hantar respons kembali ke frontend
    return res.status(200).json({
      objek: "Objek dikesan",
      kategori_fiqh: "Taharah",
      status_penggunaan: "Sesuai / Tidak sesuai",
      keyakinan: "85%",
      analisis_ai: text,
      penerangan_pendidikan: "Fiqh Air Mutlak / Musta'mal / Mutanajjis",
      cadangan: "Gunakan jika air suci",
      amaran: "Rujuk guru jika ragu",
    });

  } catch (err) {
    console.error("ERROR GEMINI:", err);

    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
}
