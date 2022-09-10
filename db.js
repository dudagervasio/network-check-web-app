require('dotenv').config();

const CyclicDb = require("cyclic-dynamodb");

const db = CyclicDb("clumsy-pear-vestmentsCyclicDB");

const animals = db.collection("animals");

( async () => {

	let leo = await animals.set("leo", {
		type: "catas",
		color: "orangase"
	})

	// get an item at key "leo" from collection animals
	let item = await animals.get("leo")

	console.log(item)	
}
)();
