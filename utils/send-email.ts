const nodemailer = require('nodemailer');
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(email: string, msg: string, subject?: string) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    SES: new AWS.SES({
      apiVersion: '2010-12-01',
    }),
  });
  // let transporter = nodemailer.createTransport({
  //   host: 'smtp.office365.com',
  //   port: '587',
  //   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  //   secureConnection: false,
  //   tls: { ciphers: 'SSLv3' },
  // });

  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: `Financial Snapshot <${process.env.EMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: subject || 'Your Weekly Financial Report', // Subject line
      html: msg, // html body
    });

    console.log('Message sent: %s', info.messageId);
    return info.messageId;
  } catch (error) {
    return error.message;
  }
}
