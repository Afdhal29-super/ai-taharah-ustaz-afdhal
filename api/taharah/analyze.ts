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

    // 🔑 API KEY dari Vercel env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 🤖 MODEL BETUL (fix error 404 tadi)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    // 🧠 CALL GEMINI
    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || "image/jpeg",
        },
      },
      "Analisis jenis air untuk fiqh taharah. Jawab ringkas dan jelas dalam Bahasa Melayu.",
    ]);

    const text = result.response.text();

    return res.status(200).json({
      objek: "Objek dikesan",
      kategori_fiqh: "Taharah",
      status_penggunaan: "Sesuai / Tidak sesuai",
      keyakinan: "85%",
      analisis_ai: text,
      penerangan_pendidikan: "Rujukan fiqh air mutlak, mutaghayyir dan mutanajjis",
      cadangan: "Gunakan jika air suci dan tidak tercemar",
      amaran: "Sila semak dengan guru atau rujukan kitab fiqh",
    });

  } catch (err) {
    console.error("GEMINI ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
