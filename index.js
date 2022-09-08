require('dotenv').config();

const express = require('express')
const app = express()
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, (err) => {

  console.log(`Example app listening on port ${port}`)

})