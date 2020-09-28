const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path")
const express = require("express")

const helmet = require("helmet")
const compress = require("compression")

const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

const homeRoutes = require("./routes/index")
const courseRoutes = require("./routes/course")
const addRoutes = require("./routes/add")
const cartRoutes = require("./routes/cart")
const orderRoutes = require("./routes/order.js")
const authRoutes = require("./routes/auth")
const profileRoutes = require("./routes/profile")

const keys = require("./keys")

const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const pageNotFoundMiddleware = require("./middleware/404");
const fileUploadMiddleware = require("./middleware/file")
const csurf = require("csurf");
const flash = require("connect-flash");

const app = express();

const hbs = exphbs.create({
    defaultLayout : "main",
    extname : "hbs"
})

const store = new MongoStore({
    collection : "sessions",
    uri : keys.MONGO_DB_URL
})



app.engine("hbs", hbs.engine);

app.set("view engine", "hbs");
app.set("views","pages")


app.use(express.static(path.join(__dirname,"public")))
app.use("/images",express.static(path.join(__dirname,"images")))

app.use(express.urlencoded({extended : true}))

app.use(session({
    secret : keys.SECRET_KEY,
    resave : false,
    saveUninitialized : false,
    store
}))

app.use(fileUploadMiddleware.single("avatar"))

app.use(csurf())
app.use(flash())

app.use(compress())
app.use(helmet({
    contentSecurityPolicy: false
}))

app.use(varMiddleware)
app.use(userMiddleware)

app.use("/",homeRoutes)
app.use("/courses",courseRoutes)
app.use("/add",addRoutes)
app.use("/cart",cartRoutes)
app.use("/order",orderRoutes)
app.use("/auth",authRoutes)
app.use("/profile",profileRoutes)

app.use(pageNotFoundMiddleware)

const PORT = process.env.PORT || 3000

async function start(){
    try {
        await mongoose.connect(keys.MONGO_DB_URL, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useFindAndModify : false
        })      

        app.listen((PORT),()=>{
            console.log("Сервер запущен..."+PORT)
        })
    } catch(err){
        console.log(err)
    }
    
}

start()



//db user : daswer_server
//db pass : 1XLpnSuGk5J8s6pE