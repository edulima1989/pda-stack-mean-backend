import { connectDatabase } from './config/database.js';
import app from './app.js';


 
const port = 3000;
connectDatabase(); // Conexión a la base de datos

app.listen(port, ()=>{
    console.log('Servidor escuchando en el puerto ' + port); 
});