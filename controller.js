// This file contains all the logic of the sending mail functionality.
// This service is using nodemailer for sending mails but we need to configure first a SMTP server
// and consume it from this service.

const nodemailer = require('nodemailer');

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: (process.env.SMTP_SECURE === 'true'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    tls: {
      cipers: 'SSLv3'
    }
  });
}

send = (req, res) => {
  // This method sends a mail request to the SMTP server with all the information provided
  var body = req.body;

  try {
    // Let's check if the provided data is enough to send the mail correctly
    if (!body.toEmail || typeof body.toEmail !== 'string') {
      return res.status(400).send({
        message: 'Parameter toEmail is missing.'
      });
    }

    if (!body.subject || typeof body.subject !== 'string') {
      return res.status(400).send({
        message: 'Parameter subject is missing.'
      });
    }

    let mail = {
      from: `${(body.fromName || process.env.FROM_NAME)}<${process.env.FROM_EMAIL}>`,
      to: body.toEmail,
      subject: body.subject,
      text: body.text || "",
      html: body.html || ""
    }

    transporter().sendMail(mail, (err, response) => {
      if ( err ) {
        console.log('[!] Error: ');
        console.error(err.message);
        return res.status(500).send({message: 'The service could not send the mail.'});
      }


      console.log(`[*] Mail (${response.messageId}) has been sent: ${response.response}`);
      return res.status(200).send({
        message: 'The mail has been successfully sent!',
        mailId: response.messageId
      });
    });

  } catch (err) {
    console.log('[!] An error has occur while sending an email.');
    console.log('[!] Error: ');
    console.error(err.message);
    return res.status(500).send({ message: "Something went wrong! Check log for more details"});
  }


}


module.exports = {
  send
}
