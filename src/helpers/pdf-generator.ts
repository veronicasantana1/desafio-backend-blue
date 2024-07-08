import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

var pdf = require('html-pdf');

interface Appointment {
  date: Date;
  id_user: number;
  id_doctor: number;
  id_clinic: number;
}

export async function generatePDF(appointment: Appointment): Promise<void> {
  const formattedDate = dayjs(appointment.date).format('DD/MM/YYYY HH:mm');
  const appointmentContent = `
    <div>
      <h1 style='color:red'>Appointment</h1>
      <hr>
      <p>Date: ${formattedDate}</p>
      <p>Doctor ID: ${appointment.id_doctor}</p>
      <p>Clinic ID: ${appointment.id_clinic}</p>
    </div>
  `;

  pdf.create(appointmentContent, {}).toFile('appointment.pdf', (err: any) => {
    if (err) {
      console.error(err);
      return;
    }});

  console.log('PDF gerado com sucesso');
}

