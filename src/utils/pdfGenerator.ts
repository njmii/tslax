import { PDFDocument, rgb } from 'pdf-lib';
import type { Client } from '../store/clients';
import type { SettingsState } from '../store/settings';

export const generateCancellationForm = async (client: Client, settings: SettingsState) => {
  try {
    // Fetch the existing PDF
    const existingPdfBytes = await fetch('/cancellation_form.pdf').then((res) => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();

    const drawText = (text: string, x: number, y: number) => {
      firstPage.drawText(text || '', {
        x,
        y: height - y,
        size: 12,
        color: rgb(0, 0, 0),
      });
    };

    // Client Details
    drawText(client.name, 130, 100);
    drawText(client.icNo, 120, 130);
    drawText(client.telNumber, 130, 160);
    drawText(client.address, 110, 190);
    drawText(client.email, 100, 220);

    // Bank Details
    drawText(client.bankName, 130, 270);
    drawText(client.bankNumber, 140, 300);

    // Agent Details
    drawText(settings.agentName, 130, 350);
    drawText(settings.agentId, 110, 380);
    drawText(settings.agentIc, 110, 410);

    // Witness Details
    drawText(settings.witnessName, 140, 460);
    drawText(settings.witnessIc, 120, 490);

    // Helper to draw images
    const drawSignature = async (dataUrl: string, x: number, y: number) => {
      if (!dataUrl) return;
      try {
        const imgBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (c) => c.charCodeAt(0));
        const image = await pdfDoc.embedPng(imgBytes);

        // Scale down image to fit in a box
        const maxDims = { width: 120, height: 60 };
        const imgDims = image.scaleToFit(maxDims.width, maxDims.height);

        firstPage.drawImage(image, {
          x,
          y: height - y,
          width: imgDims.width,
          height: imgDims.height,
        });
      } catch (err) {
        console.error('Failed to embed signature', err);
      }
    };

    // Draw Signatures (y is top-down coordinate we used in helper)
    await drawSignature(client.signature, 50, 580);
    await drawSignature(settings.agentSignature, 250, 580);
    await drawSignature(settings.witnessSignature, 450, 580);

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Create a Blob and trigger download
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cancellation_Form_${client.name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Check console for details.');
  }
};
