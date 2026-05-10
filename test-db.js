const mongoose = require('mongoose');

const uri = "mongodb://eg%20jewels:Arshi786@ac-dm7a9ad-shard-00-00.jezzspw.mongodb.net:27017,ac-dm7a9ad-shard-00-01.jezzspw.mongodb.net:27017,ac-dm7a9ad-shard-00-02.jezzspw.mongodb.net:27017/?ssl=true&replicaSet=atlas-dm7a9ad-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAIL:", err.message);
    process.exit(1);
  });
