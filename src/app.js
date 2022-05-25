const express=require('express')
const app=express()
const config=require('./config.js')

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
    store:MongoStore.create({mongoUrl:config.cnxStr,mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true}}),
    resave:true,
    rolling: true, 
    saveUninitialized:false,   //si pongo true, crea mas de una cookie
    cookie: { maxAge : 1000 }
}))
//----------------------------------------
//SET EJS
app.set("view engine", "ejs");
app.set("views", __dirname + "/public");
//-----------------
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
let username


app.get('/bye',(req,res)=>{
    try {
        req.session.destroy(error=>{
            if(!error){
                username=''
                res.render('bye')
            } else res.send({status:'ERROR',error:error})
            })
    } catch (error) {
        console.log(error)
    }
})
app.get('/bienvenido',(req,res)=>{
     try {
         let active=req.session.name
        if (active){
            console.log('Expira cookie '+req.session.cookie.expires)
            res.render('bienvenido',{username,active})
        }else{
            res.redirect('/bye')
        }
     } catch (error) {
         console.log(error)
     }
})
app.get('/',(req,res)=>{
     try {
        username=''
        res.render('main',{username})
     } catch (error) {
         console.log(error)
     }
})
app.post('/',(req,res)=>{
    try {
       username=req.body.name
       req.session.name=username
       if(!username) return res.json({error:'faltan datos'})
       else res.redirect('/bienvenido')
        
    } catch (error) {
        console.log(error)
    }
})

app.listen(config.PORT,()=>{console.log(`Listen port ${config.PORT}`)})