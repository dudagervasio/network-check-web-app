require('dotenv').config();

const express = require('express');

const { sendMail } = require('./src/services/mailService');

const app = express();

const port = process.env.PORT || 3033;

const config = {

	maxTimeWithNoReport: process.env.MINUTES_WITH_NO_REPORT ? process.env.MINUTES_WITH_NO_REPORT * 60 * 1000 : 2 * 60 * 1000,
	defaultTimeBetweenNoReportEmails: process.env.MINUTES_BETWEEN_NO_REPORT_EMAILS ? process.env.MINUTES_BETWEEN_NO_REPORT_EMAILS * 60 * 1000 : 15 * 60 * 1000,
	intervalForNoReportCheck: process.env.MINUTES_INTERVAL_FOR_NO_REPORT_CHECK ? process.env.MINUTES_INTERVAL_FOR_NO_REPORT_CHECK * 60 * 1000 : 2 * 60 * 1000,
	nodeEnv: process.env.NODE_ENV || 'undefined',
}

const status = {
	lastReport: Date.now(),
	lastSendNoReportMail: 0,
	mailsSent: []
};

/* ROTAS LIBERADAS DE TOKEN */
app.get('/status', (req, res) => {

	res.send({ 
		status, 
		config,
		info: {
			version: 2
		}
	});
});


/* ROTAS COM TOKEN E JSON */
app.use(express.json());

app.use( (req, res, next) => {

/* 	console.log('middleware in action');
	console.log('Got body:', req.body);
	console.log('Got headers:', req.headers);
 */
   
	const token = req.headers.token;

	if (token === process.env.TOKEN){

		next();

	}else{

		res.status(401).json({
		error: 'Invalid request'
		});

	}

});

app.post('/report', async (req, res) => {

	res.status(200).send();

	status.lastReport = Date.now();

	console.log('report received:', req.body);

	if(!req.body.success){

		const info = await sendMail(req.body.message + '\r\n' + 'Env:' + config.nodeEnv);

		console.log('mail report on failure');

		status.mailsSent.push({
			time: Date.now(),
			reason: 'Ping Failure'
		});

		//console.log(info);

	}
	
});

app.listen(port, (err) => {

  console.log(`Example app listening on port ${port}`)

})

setInterval( async () => {

	console.log('run last report check');

	const timeSinceLastReport = Date.now() - status.lastReport;

	if(timeSinceLastReport > config.maxTimeWithNoReport ){

		console.log('much time with no report');

		const timeSinceLastNoReportEmail = Date.now() - status.lastSendNoReportMail;

		if(timeSinceLastNoReportEmail > config.defaultTimeBetweenNoReportEmails){

			console.log('send no report e-mail');

			const info = await sendMail('Report timeout! Muito tempo sem receber informação do servidor!' + '\r\n' + 'Env:' + config.nodeEnv);

			status.lastSendNoReportMail = Date.now();

			status.mailsSent.push({
				time: Date.now(),
				reason: 'No Report'
			});

			console.log('mail', info);

		}
	}
	
}, config.intervalForNoReportCheck );