import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./dirname.js"
import routes from "../src/routes/index.routes.js"
import Handlebars from "handlebars"
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access"
import path from "path"
import initializePassport from "../src/config/passport.config.js"
import cookieParser from "cookie-parser"
import config from "../src/config/config.js"
import errorHandler from "../src/middlewares/errors/index.js"
import { addLogger } from "../src/utils/logger.js"
import ErrorList from "./utils/ErrorList.js"
import CustomError from "./utils/CustomError.js"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import {swaggerOptions} from "./docs/swaggerOptions.js"
import session from "express-session"
import MongoStore from "connect-mongo"


//Configuracion del servidor
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(config.PORT, () => console.log(`Escuchando en el puerto ${config.PORT}`))

//Passport
initializePassport()
//app.use(passport.initialize())
//app.use(passport.session())

//Swagger
const specs = swaggerJSDoc(swaggerOptions)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs))

//Handlebars
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  }))
app.set('view engine', 'hbs')

//Middlewares
app.set('views', `${__dirname}/views`)
app.use(express.static(path.join(__dirname, '/src/public')));
app.use(cookieParser())
app.use(errorHandler)
app.use(addLogger)
app.use( session(
  {
  store: MongoStore.create({
      mongoUrl: "mongodb+srv://Meli:Melisa537@noeserver.c5gx1p7.mongodb.net/Login?retryWrites=true&w=majority",
      mongoOptions:{
          useNewUrlParser: true,
          useUnifiedTopology:true,
      },
      ttl:60,
  }),
  secret: "coderhouse",
  resave: false,
  saveUninitialized: false,
})
)

//Routes
app.get('/', (req, res) => {
  req.logger.warning('Se accedio por ruta indefinida')
  res.redirect('/api')
})
app.use('/api', routes)
 
//se eliminó cors

