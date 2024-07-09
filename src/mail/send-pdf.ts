import nodemailer from 'nodemailer';
import { generatePDF } from '../helpers/pdf-generator';
import 'dotenv/config'

require('dotenv').config();

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
  
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendAppointmentEmail(appointment: Appointment, recipientEmail: string) {
  try {
    const pdfPath = await generatePDF(appointment); 

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Detalhes da consulta',
      text: 'Pro favor, encontre em anexo os detalhes da sua consulta.',
      attachments: [
        {
          filename: 'appointment.pdf',
          path: pdfPath
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.response);
  } catch (error) {
    console.error('Error ao enviar email:', error);
  }
}
