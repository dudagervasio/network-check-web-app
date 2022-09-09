require('dotenv').config();

const express = require('express');

const { sendMail } = require('./src/services/mailService');
const app = express();

const port = process.env.PORT || 3033;

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

const status = {
	lastReport: Date.now(),
	error: false,
	count: 0
};

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/report', async (req, res) => {

	res.status(200).send();

	status.lastReport = Date.now();

	//console.log('Got body:', req.body);

	if(!req.body.success){

		const info = await sendMail(req.body.message);

		//console.log('mail');
		//console.log(info);

	}
	
});

app.listen(port, (err) => {

  console.log(`Example app listening on port ${port}`)

})

setInterval( async () => {

	//console.log('run');

	if((Date.now() - status.lastReport) > (30 * 60 * 1000) ){

		//console.log('much time');

		const info = await sendMail('Report timeout! Muito tempo sem receber informação do servidor!');

		//console.log('mail', info);

	}
	
}, 10 * 60 * 1000 );