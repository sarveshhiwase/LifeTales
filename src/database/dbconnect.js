const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then((conn) => console.log(conn.connections[0].host))
  .catch(() => console.log("error connecting to database"));
