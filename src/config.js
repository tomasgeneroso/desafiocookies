require('dotenv').config()

const config={
    PORT:process.env.PORT || 8080,
    client: 'mongodb',
    cnxStr: 'mongodb+srv://tomasgeneroso:dCpKbSThoQUkBMYN@cluster0.aq6yn.mongodb.net/?retryWrites=true&w=majority'
}

module.exports=config