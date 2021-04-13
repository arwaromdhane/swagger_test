const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const providersRouter = require("./routes/providers");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ providers: [] }).write();

const options = {
	definition: {
		swagger: "2.0.0",
		info: {
			title: "PROVIDER CRUD",
			description: " A provider is a person who can repair some things roadside or domestic",
			version: "1.0.0"
		},
		host: 
			{
				url: "localhost",
		},
		schemes: 
	    	{
			url: "https",
	    },
		consumes: 
		   {
		   content: "application/json",
    	},
	    produces: 
	      {
		content: "application/json",
       },
        basePath: 
          {
        url: "/localhost:3000/",
        },
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/providers", providersRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
