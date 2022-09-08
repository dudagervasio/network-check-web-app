require('dotenv').config();

const express = require('express')
const app = express()
const port = process.env.PORT || 80;

const obj = {
	error: false,
	count: 0
};


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/counter', (req, res) => {
  res.send( obj );
})

app.listen(port, (err) => {

  console.log(`Example app listening on port ${port}`)

})

setInterval( () => {

	count++;
}, 1000);