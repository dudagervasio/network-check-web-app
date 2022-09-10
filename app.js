require('dotenv').config();

console.log('Running APP.JS');

const express = require('express');

const { sendMail } = require('./src/services/mailService');

const CyclicDb = require("cyclic-dynamodb");

const db = CyclicDb("clumsy-pear-vestmentsCyclicDB");

const status = db.collection("status");

( async () => {

	await status.set("report", {
		lastReport: Date.now(),
		lastSendNoReportMail: 0
	})

	console.log('Initial status seted');
}
)();

const app = express();

const port = process.env.PORT || 3033;

const config = {

	maxTimeWithNoReport: process.env.MINUTES_WITH_NO_REPORT ? process.env.MINUTES_WITH_NO_REPORT * 60 * 1000 : 2 * 60 * 1000,
	defaultTimeBetweenNoReportEmails: process.env.MINUTES_BETWEEN_NO_REPORT_EMAILS ? process.env.MINUTES_BETWEEN_NO_REPORT_EMAILS * 60 * 1000 : 15 * 60 * 1000,
	intervalForNoReportCheck: process.env.MINUTES_INTERVAL_FOR_NO_REPORT_CHECK ? process.env.MINUTES_INTERVAL_FOR_NO_REPORT_CHECK * 60 * 1000 : 2 * 60 * 1000,
	intervalForReportEmail: process.env.MINUTES_INTERVAL_FOR_REPORT_EMAIL ? process.env.MINUTES_INTERVAL_FOR_REPORT_EMAIL * 60 * 1000 : 1 * 60 * 60 * 1000,
	nodeEnv: process.env.NODE_ENV || 'undefined',
}

/* const status = {
	lastReport: Date.now(),
	lastSendNoReportMail: 0,
	mailsSent: [],
}; */

/* ROTAS LIBERADAS DE TOKEN */
app.get('/status', async (req, res) => {

	let _status = await status.get("report");

	res.send({ 
		_status, 
		config,
		info: {
			version: 3
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

	let { props } = await status.get("report");

	await status.set("report", {
		lastReport: Date.now(),
		lastSendNoReportMail: props.lastSendNoReportMail
	});

	console.log('report received:', req.body);

	if(!req.body.success){

		const info = await sendMail(req.body.message + '\r\n' + 'Env:' + config.nodeEnv);

		console.log('mail report on failure');

/* 		status.mailsSent.push({
			time: Date.now(),
			reason: 'Ping Failure'
		});
 */
		//console.log(info);

	}
	
});

app.listen(port, (err) => {

  console.log(`Example app listening on port ${port}`)

})

setInterval( async () => {

	console.log('run last report check');

	let { props } = await status.get("report");

	const timeSinceLastReport = Date.now() - props.lastReport;

	if(timeSinceLastReport > config.maxTimeWithNoReport ){

		console.log('much time with no report');

		const timeSinceLastNoReportEmail = Date.now() - props.lastSendNoReportMail;

		if(timeSinceLastNoReportEmail > config.defaultTimeBetweenNoReportEmails){

			console.log('send no report e-mail');

			const info = await sendMail('Report timeout! Muito tempo sem receber informação do servidor!' + '\r\n' + 'Env:' + config.nodeEnv);
			
			console.log('mail', info);

			await status.set("report", {
				lastReport: props.lastReport,
				lastSendNoReportMail: Date.now()
			})
		
/* 			status.mailsSent.push({
				time: Date.now(),
				reason: 'No Report'
			});
 */

		}
	}
	
}, config.intervalForNoReportCheck );

setInterval( async () => {

	console.log('run report email');

/* 	let text = 'Report e-mail \r\n';

	text += status.mailsSent.length === 0 ? 'Nenhum e-mail enviado!' : JSON.stringify( status.mailsSent );

	const info = await sendMail(text + ' \r\n\r\n ' + 'Env:' + config.nodeEnv, 'NETWORK REPORT');

	status.mailsSent = [];
 */	
}, config.intervalForReportEmail );