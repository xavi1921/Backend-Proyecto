const express = require('express')
const app=express();
const cors=require('cors');
require('./database');

app.use(cors());
//esta linea hace que no salga undefind al momento de enviar 
//datos y muestre los datos en consola por express
app.use(express.json());

app.use('/api',require('./routes/index'))

app.listen(3000);
console.log('Server on port',3000);


