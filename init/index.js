let mongoose = require("mongoose")
let initData = require("./data.js")
let Listing = require("../models/listing.model.js")

let mongodb_url = "mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("connected !")
}).catch((err)=>console.log(err))

async function main() {
    await mongoose.connect(mongodb_url)
}

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "68fa4c2c646b33c5f1a43a75"
    }))
    await Listing.insertMany(initData.data)
    console.log("Data added !")
}

initDB()
