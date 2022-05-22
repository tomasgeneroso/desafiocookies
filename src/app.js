const express=require('express')
const app=express()
const PORT=process.env.PORT || 8080
const path=require('path')
const {user}=require('./public/main.js')
//IMPORTO express session y connectmongo
const session=require('express-session')
const cookieParser=require('cookie-parser')
const MongoStore = require('connect-mongo')
//----------------------------------------

//INICIALIZO COOKIES
app.use(cookieParser())
app.use(session({
    //Conecto db en mongoatlas
    secret:'secret',
    //configuracion session-file-store
    store:MongoStore.create({mongoUrl:'mongodb+srv://tomasgeneroso:dCpKbSThoQUkBMYN@cluster0.aq6yn.mongodb.net/?retryWrites=true&w=majority',mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true}}),
    resave:false,
    saveUninitialized:false,
    maxAge:1000
}))
//----------------------------------------

app.use(express.static(__dirname+'/public'))

 app.get('/',(req,res)=>{
     try {
        console.log(user)
        res.sendFile(path.join(__dirname+'/public/main.html'))  
     } catch (error) {
         console.log(error)
     }
    
 })

app.listen(PORT,()=>{console.log(`Listen port ${PORT}`)})