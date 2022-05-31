const mongoose=require('mongoose')
const config=require('./config.js')
mongoose.connect(config.cnxStr,{useNewUrlParser:true}).then(db=>console.log('conectado')).catch(err=>console.log(err))