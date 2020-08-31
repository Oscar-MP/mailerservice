// This file contains all the logic of the sending mail functionality.
// This service is using nodemailer for sending mails but we need to configure first a SMTP server
// and consume it from this service.

const nodemailer  = require('nodemailer');
const fs          = require('fs');

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

info = (req, res) => {
  return res.json({
    message: 'You have requested the mailer service successfully. Everything seems to work OK.',
    version: '0.3.0'
  });
}

send = (req, res) => {
  // This method sends a mail request to the SMTP server with all the information provided
  var body = req.body;

  try {
    // Let's check if the provided data is enough to send the mail correctly

    if ( (validated_content = validateEmailContent(body)) !== true ) {
      return res.status(400).send(validated_content);
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

getStatus = (req, res) => {
  // This function return a server status based on if the service can stablish conection with the SMTP server and if
  // everything works.
  // This is used by an api gateway to know the state of the service


}

notFound = (req, res) => {
  // This function is called when a route is not found
  return res.status(404).send({
    message: 'The route doesn`t exists'
  });
}

getList = (req, res) => {
  // Obtains all the data about a specific mail list
  // Contacts with the reader service and take the mail list from it
  let id = req.params.id;

}

putList = (req, res) => {
  // Creates or updates a mail list
  var body = req.body;
}

removeList = (req, res) => {
  // Removes a mail list

}

broadcastMail = (req, res) => {
  // Send a mail to all contacts from a mail list

  var body              = req.body;
  var mailListId        = req.params.id;
  // Obtenemos la lista de mails

  try {
    getMailList(mailListId).then(
      listData => {
        if ( listData.contacts.length === 0 ) {
          // There is no contacts in the mail list so we cannot send emails to anyone
          return res.status(400).send({
            message: 'The list is empty'
          });
        }

        // Setting the source email in order to check the parameters
        body.fromName = body.fromName || listData.fromName;

        for ( let contact of listData.contacts ) {

          if (!contact.address) break;

          body.toEmail = contact.address;

          if ( (validated_content = validateEmailContent(body)) !== true ) {
            return res.status(400).send(validated_content);
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
              console.error('[!] Could not sent the email! Logging this');
              return;
            }

            console.log(`[*] Mail (${response.messageId}) has been sent: ${response.response}`);
            return res.status(200).send({
              message: 'The mail has been successfully sent!',
              mailId: response.messageId
            });
          });
        }
        return res.status(200).send({
          message: 'The broadcast has been triggered.',
          emailAmount: listData.contacts.length
        });

      }
    );
  } catch ( err ) {
    console.error("There was an error: ", err);
  }

}

function getMailList( id ) {
  // Obtains all the contacts from the mail list.
  const source_data = `./lists/${id}.json`;

  return new Promise((resolve, reject) => {
    fs.readFile(source_data, (err, data) => {
      if (err) {
        throw err;
      }

      resolve(JSON.parse(data));
    })
  });
}

function validateEmailContent(data) {
  // Checks that there is all the needed parameters to send an email. This function checks is there is an email, subject, etc..
  // Let's check if the provided data is enough to send the mail correctly

  var missing_params = [];

  if ( !data.toEmail || typeof data.toEmail !== 'string' ) missing_params.push('toEmail');

  if (!data.subject || typeof data.subject !== 'string') missing_params.push('subject');

  return missing_params.length === 0 ? true : { message: `Parameter ${missing_params.join(', ')} is missing.`};
}

module.exports = {
  info,
  send,
  getStatus,
  notFound,
  getList,
  putList,
  removeList,
  broadcastMail
}
