import PDFDocument from 'pdfkit';
import fs from 'fs';  

export async function generatePDF(appointmentData: any, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(fileName);
  
      doc.pipe(writeStream);
  
      doc.fontSize(14).text('Appointment Details', { align: 'center' }).moveDown();
  
      appointmentData.forEach((data: any) => {
        doc.fontSize(12).text(`Appointment ID: ${data.id}`);
        doc.fontSize(10).text(`Date: ${data.date}`);
        doc.fontSize(10).text(`Time: ${data.start_time} - ${data.end_time}`);
        doc.fontSize(10).text(`Doctor: ${data.doctor.name}`);
        doc.fontSize(10).text(`Specialty: ${data.doctor.specialty}`);
        doc.fontSize(10).text(`Clinic: ${data.clinic}`);
        doc.moveDown();
      });
  
      doc.end();
  
      writeStream.on('finish', () => {
        console.log(`PDF generated: ${fileName}`);
        resolve();
      });
  
      writeStream.on('error', (err) => {
        console.error('Error generating PDF:', err);
        reject(err);
      });
    });
  }