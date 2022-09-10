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
		host: "mail.hidratapharma.com.br",
		port: 465,
		secure: true, 
		auth: {
			user: "contato@hidratapharma.com.br",
			pass: "@hidcontato01"
		}
	});

    // send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"HIDRATA TI" <contato@hidratapharma.com.br>', // sender address
		to: "luis.eduardo@hidratapharma.com.br, dudagervasio@yahoo.com.br", // list of receivers
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