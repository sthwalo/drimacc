import Tesseract from 'tesseract.js';

export class OCRProcessor {
    /**
     * Processes the given image file using OCR to extract text.
     * @param file The image file to process.
     * @param lang The language of the text in the image.
     * @returns The extracted text.
     */
    async extractText(file: File, lang: string = 'eng'): Promise<string> {
        try {
            const result = await Tesseract.recognize(
                file,
                lang,
                {
                    logger: m => console.log(m) // Optional: log progress to console
                }
            );
            return result.data.text;
        } catch (error) {
            console.error('OCR processing failed:', error);
            throw error; // Rethrow the error for further handling
        }
    }
}
