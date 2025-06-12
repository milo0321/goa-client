import { getDocument } from 'pdfjs-dist';

export const parsePdfText = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += `\n${text}`;
  }

  return fullText;
};