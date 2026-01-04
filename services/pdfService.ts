
import * as pdfjsLib from 'pdfjs-dist';

/**
 * PDF.js can be tricky to import in ESM environments.
 * We look for the main library object on the module object or its default export.
 */
const anyLib = pdfjsLib as any;
const pdfjs = anyLib.getDocument ? anyLib : (anyLib.default || anyLib);

// Set worker source to a reliable CDN that matches the library version
if (pdfjs.GlobalWorkerOptions) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
} else {
  console.error('PDF.js GlobalWorkerOptions not found during initialization.');
}

export const extractTextFromPdf = async (file: File): Promise<string> => {
  console.log(`Starting extraction for: ${file.name}`);
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    
    if (!pdfjs.getDocument) {
      throw new Error("PDF.js library failed to load correctly.");
    }

    const loadingTask = pdfjs.getDocument({
      data: typedArray,
      useSystemFonts: true,
      disableFontFace: false,
    });
    
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`);

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => (item as any).str || '')
        .join(' ');
        
      fullText += pageText + ' ';
      
      if (i % 10 === 0 || i === pdf.numPages) {
        console.log(`Progress: ${Math.round((i / pdf.numPages) * 100)}%`);
      }
    }

    // Clean up text: replace multiple spaces/newlines with a single space
    const finalResult = fullText.trim().replace(/\s+/g, ' ');
    if (finalResult.length === 0) {
      throw new Error("No readable text found. This PDF might be an image scan or protected.");
    }

    console.log(`Extraction complete. Length: ${finalResult.length} chars.`);
    return finalResult;
  } catch (error: any) {
    console.error('PDF Service Error:', error);
    throw new Error(error.message || 'An unknown error occurred during PDF processing.');
  }
};
