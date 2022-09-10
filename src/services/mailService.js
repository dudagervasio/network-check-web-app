require('dotenv').config();

const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(text, subject = 'NETWORK PROBLEM') {

/* 	let transporter = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "650700a5a63290",
			pass: "97b9aa221f2bc4"
		}
	});
 */
	let transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		secure: true, 
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS
		}
	});

    // send mail with defined transport object
	let info = await transporter.sendMail({
		from: process.env.MAIL_FROM, // sender address
		to: process.env.MAIL_TO, // list of receivers
		subject, // Subject line
		text, // plain text body
		html: "<b>" + text.replace('\r\n', '<br>') + "</b>", // html body
	  });
	
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  return info;

}

//sendMail('bla bla').catch((err) => { console.log('ERRO MESMO'); console.error(err)});

module.exports = { sendMail };