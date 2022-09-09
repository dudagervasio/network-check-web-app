require('dotenv').config();

const express = require('express');
const { sendMail } = require('./src/services/mailService');
const app = express()
const port = process.env.PORT || 80;

const status = {
	error: false,
	count: 0
};


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/counter', (req, res) => {
  res.send( obj );
})

app.get('/sendMail', async (req, res) => {

	try{

		const info = await sendMail('teste');

		res.send( {
			success: true,
			info
		} );

	}catch(err){

		console.log(err);

		res.send( {
			success: false,
			err
		} );

	}
	
})

app.listen(port, (err) => {

  console.log(`Example app listening on port ${port}`)

})



setInterval( () => {

	obj.count++;
	
}, 1000);