require('dotenv').config()

const config={
    PORT:process.env.PORT || 8080,
    db:process.env.DB,
    client: 'mongodb',
    cnxStr: 'mongodb+srv://tomasgeneroso:dCpKbSThoQUkBMYN@cluster0.aq6yn.mongodb.net/?retryWrites=true&w=majority',
    timeExp:100000,
    secretKey:process.env.SECRET_KEY
}

module.exports=config