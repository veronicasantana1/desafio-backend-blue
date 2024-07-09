import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import path from "path";

dayjs.extend(utc);

var pdf = require('html-pdf');

interface Appointment {
  date: Date,
  user : { name: string, cpf: string, phone: number, email: string },
    doctor: {
      crm : string,
      name: string,
      specialty: string,
    },
    clinic: {name: string, address: string, phone: number},
}

export async function generatePDF(appointment: Appointment): Promise<string> {
  const formattedDate = dayjs(appointment.date).utc().format('DD/MM/YYYY HH:mm');  
  const appointmentContent = `
  <div style="font-family: Arial, sans-serif; margin: 20px;">
    <h1 style="color: red; text-align: center;">Detalhes da consulta</h1>
    <hr>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px;">Descrição</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Informação</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Data e hora</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formattedDate}</td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Informações do paciente</strong></td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Nome</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.user.name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">CPF</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.user.cpf}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Telefone</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.user.phone}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.user.email}</td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Informações do médico</strong></td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">CRM</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.doctor.crm}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Nome</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.doctor.name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Especialidade</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.doctor.specialty}</td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Informações da clínica</strong></td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Nome</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.clinic.name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Endereço</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.clinic.address}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Telefone</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${appointment.clinic.phone}</td>
      </tr>
    </table>
  </div>
`;

const pdfPath = path.join('consulta.pdf');

pdf.create(appointmentContent, {}).toFile(pdfPath, (err: any, res: any) => {
  if (err) {
    console.error('Erro ao gerar PDF:', err);
    return;
  }
  console.log('PDF gerado com sucesso:');
});

return pdfPath;
}

