export class FileParser {

  static async parsePdf(buffer: Buffer): Promise<string> {
    try {
      // 🔥 Simple text extraction fallback
      const text = buffer.toString("utf8");

      if (!text || text.length < 50) {
        return "PDF detected, but advanced parsing is limited. Please paste text for full analysis.";
      }

      return text;
    } catch (error) {
      console.error("PDF parsing error:", error);
      return "Unable to process PDF. Please paste text.";
    }
  }

  static parseTxt(buffer: Buffer): string {
    return buffer.toString("utf8");
  }

  static async extractText(file: any): Promise<string> {
    const mimeType = file.mimetype;

    if (mimeType === "application/pdf") {
      return await this.parsePdf(file.buffer);
    }

    if (mimeType === "text/plain") {
      return this.parseTxt(file.buffer);
    }

    return "Unsupported file type.";
  }
}