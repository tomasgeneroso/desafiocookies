const express=require('express')
const app=express()
const config=require('./config.js')
const mongoose=require('mongoose')
//IMPORTO express session y connectmongo
const session=require('express-session')
const cookieParser=require('cookie-parser')
const MongoStore = require('connect-mongo')
//----------------------------------------
const User=require('./models/user.js')
//INICIALIZO COOKIES
app.use(cookieParser())
app.use(session({
    //Conecto db en mongoatlas
    secret:'secret',
    //configuracion session-file-store
    //store:new MongoStore({mongooseConnection:mongoose.connection}),
    store:MongoStore.create({mongoUrl:config.cnxStr,dbName:'usuarios',collectionName:'usuarios',mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true}}),
    resave:true,
    rolling: true, 
    saveUninitialized:false,   //crea recien cuando algo es guardado
    cookie: { maxAge : config.timeExp }
}))
//----------------------------------------

//SET EJS

app.set("view engine", "ejs");
app.set("views", __dirname+ "/public");
//-----------------

app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//IMPORTO PASSPORT Y PASSPORT LOCAL
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy

passport.use('login',new LocalStrategy({usernameField:'email',passwordField:'password',passReqToCallback:true}, 
    async (email,password,done)=>{
        try{
            let user= await User.findOne({email:email}) 
                    
            if(!user){
                return done(null,false)
            }else{
                //if(!user.comparePassword(password)) return done(null,false)
                if(user.password!==password) return done(null,false)
                return done(null,user)  
            } 
        }catch (error){
            console.log(error)
        }
    }
))
passport.use('register',new LocalStrategy({usernameField:'email',passwordField:'password',passReqToCallback:true},async (req,email,password,done)=>{//que nos envie un 4to param que sea el req
    try {
        //ACA QUEDA COLGADO ESPERANDO.
        let user=await User.find({email:email}).then(user=>{console.log(user)}).catch(error=>console.log('Error buscando user '+error))
        
        console.log('ENTRO AL REGISTER PASSPORT')
        if(user){ //si existe el usuario tirar error de registro
            return done(null,user.email)
        }else{
            password2=req.body.password2
            if(password!=password2){
                console.log('The passwords are not the same')
                res.send('register')
            }   
            else {
                const newuser=new User()
                newuser.email=email
                newuser.password=password
                await user.save().then('user added').catch(error=>console.log('ERROR to add user '+error))
                res.render('welcome',{email})
            }
        }
    } catch (error) {
        console.log(error)
    }
}))

passport.serializeUser((user,done)=>{done(null,user.username)})

passport.deserializeUser(async (username,done)=>{let user= await collection.find({"username":username});done(null,user)})

app.use(passport.initialize())
app.use(passport.session())
//--------------------------

let username
let password
let password2

const isLogin=(req,res,next)=>{
    //existe en db
    try {
        if(req.isAuthenticated()){
            console.log('usuario actualmente en sesion')
            next()
        }else{
            res.redirect('/register')
        }
    } catch (error) {
        console.log(error)
    }
}
const isNotLogin=(req,res,next)=>{
    //existe en db
    try {
         if(!req.isAuthenticated()){
             console.log('El usuario no está autenticado')
             next()
         }else{
             
             res.redirect('/welcome') 
         }
    } catch (error) {
         console.log(error)
    }
}
app.get('/welcome',isLogin,(req,res)=>{
    try {
        // req.session.destroy(error=>{
        //     if(!error){
        //         username=''
        //         res.redirect('/',{username})
        //     } else res.send({status:'ERROR',error:error})
        //     })
        console.log('WELCOME')
        res.render('welcome',{username})
    } catch (error) {
        console.log(error)
    }
})
app.get('/error',(req,res)=>{
     try {  
        res.render('error')
     } catch (error) {
         console.log(error)
     }
})
app.get('/register',isNotLogin,(req,res)=>{
     try {  
        res.render('register')
     } catch (error) {
         console.log(error)
     }
})

app.get('/',isLogin,(req,res)=>{
     try {  
        res.render('main')
     } catch (error) {
         console.log(error)
     }
})
 
app.post('/register',passport.authenticate('register',{failureMessage:true,successRedirect:'/welcome'}),(req,res)=>{
    try {  
    
       res.redirect('/register')
    } catch (error) {
        console.log(error)
    }
})
app.post('/',passport.authenticate('login',{failureRedirect:'/register',successRedirect:'/welcome'}))

app.listen(config.PORT,()=>{console.log(`Listen port ${config.PORT}`)})