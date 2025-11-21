"use server";

interface ParsedLoanData {
  date?: string;
  amount?: number;
  months?: number;
  name?: string;
}

export async function parseLoanCard(base64Image: string): Promise<ParsedLoanData> {
  const apiKey = process.env.OCR_SPACE_API_KEY; // Add this to your .env
  
  const formData = new FormData();
  formData.append("base64Image", base64Image);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("isTable", "true");
  formData.append("OCREngine", "2"); // Engine 2 is better for numbers/handwriting

  try {
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: { apikey: apiKey || "helloworld" },
      body: formData,
    });

    const data = await res.json();
    
    if (data.IsErroredOnProcessing) {
      throw new Error("OCR Error: " + data.ErrorMessage);
    }

    const rawText = data.ParsedResults?.[0]?.ParsedText || "";
    return extractFieldsFromText(rawText);

  } catch (error) {
    console.error("OCR Failed:", error);
    return {}; // Return empty if failed, let user type manually
  }
}

// The Heuristic Parser (Regex logic based on your notebook)
function extractFieldsFromText(text: string): ParsedLoanData {
  const result: ParsedLoanData = {};
  const lines = text.split('\n');

  for (const line of lines) {
    const cleanLine = line.trim();
    
    // 1. Find Date (Matches "Nov 7, 2025" or "11/07/2025")
    if (cleanLine.match(/Date/i)) {
      // Try to grab the text after "Date:"
      const datePart = cleanLine.replace(/Date[:.]?/i, "").trim();
      if (datePart) result.date = datePart;
    }

    // 2. Find Amount (Matches "5,000" or "5000")
    if (cleanLine.match(/Amount|Principal/i)) {
      const numMatch = cleanLine.match(/[\d,]+\.?\d*/);
      if (numMatch) {
        result.amount = parseFloat(numMatch[0].replace(/,/g, ''));
      }
    }

    // 3. Find Terms (Matches "2 months")
    if (cleanLine.match(/Terms|Months/i)) {
      const monthMatch = cleanLine.match(/(\d+)\s*months?/i);
      if (monthMatch) {
        result.months = parseInt(monthMatch[1]);
      }
    }

    // 4. Find Name (Matches "Name: Ronald")
    if (cleanLine.match(/Name/i)) {
      result.name = cleanLine.replace(/Name[:.]?/i, "").trim();
    }
  }

  return result;
}