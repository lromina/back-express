//costante para llamar a express y traer la galeria
const express = require ('express');

const cors = require ('cors')

//crear const para activar a express y sus funcionalidades
const app = express();

//crear el puerto por defecto se usa el 3000
const PORT = 3001;

app.use(cors());
//invocamos a express para usarlo
app.use(express.json());

//luego de instalar fs "npm i fs" que nos permitira trabajar con el archivo json lo invocamos
const fs = require('fs');

//Middleware para parsear el cuerpo de las solicitudes
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Usa el middleware body-parser para analizar el cuerpo de la solicitud JSON


//creamos una constante para traer el archivo creado
const allUser = 'user.json';

//Funcion de Autenticacion de usuarios - libreria Body Parser
const autheticateUser = (req, res, next)=>{

    const { user, clave } = req.body; // Obtén userName y clave del cuerpo de la solicitud
   
    fs.readFile(allUser,'utf-8',(err,data) => {
        if(err){
            // console.log('Error al leer:', err);
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }
        try{
            const objJSON = JSON.parse(data) 
            // const {userName, clave} = req.headers;

            const usuarioEncontrado = objJSON.usuarios.find(u => u.user === user && u.clave === clave);
            //creamos una constante para guardar los datos del archivo json

            console.log('usuario encontrado', usuarioEncontrado);
            if (usuarioEncontrado){
                req.autheticateUser = user;
                next();
            }else{
                res.status(401).json({mensaje: 'Credenciales no encontrado'})
            }        
    
        } catch (parseError){
            console.error('error al leer el json: ', parseError)
        }
    })
}




//Login de usuario
app.post("/login", (req,res)=>{
        
fs.readFile(allUser,'utf-8',(err,data) => {
    if(err){
        console.log('error al leer: ', err)
        return;
    }
    try{
        const objJSON = JSON.parse(data) 
        const{user,clave} = req.body

        console.log('encontre este usuario', user)

        const usuarioEncontrado = objJSON.usuarios.find(u => u.user === user && u.clave === clave);

        console.log('objJSON', objJSON);
        console.log('usuario encontrado', usuarioEncontrado)
        //creamos una constante para guardar los datos del archivo json
        if (usuarioEncontrado !== undefined){
            res.json('bienvenido')
        }else{
            res.json('usuario no encontrado')
        }        //mostramos en postman esos datos. 

    } catch (parseError){
        console.error('error al leer el json: ', parseError)
    }
})
});



//funcion q nos muestra despues de loguearse

app.get('/data', autheticateUser, (req,res)=>{
    res.send('Bienvenido a data');

})


//parte que nos lista los datos cargados

app.get("/", (req,res)=>{

    //con la libreria fs puedo leer el archivo de json creado
    
fs.readFile(allUser,'utf-8',(err,data) => {
    if(err){
        console.log('error al leer: ', err)
        return;
    }
    try{
        const objJSON = JSON.parse(data) //creamos una constante para guardar los datos del archivo json
        res.json({objJSON})         //mostramos en postman esos datos. 

    } catch {
        console.error('error al leer el json: ', parseError)
    }
})

});



//Registro de usuarios
app.post("/register",(req,res) => {
    const {user,email,clave,nombre} = req.body;
    fs.readFile(allUser,'utf-8',(err,data) => {
        if(err){
            console.log('error al leer: ', err)
            return  res.status(500).json({ error: 'Error al leer el archivo' });;
        }
        try{
            
            const objJSON = JSON.parse(data) //creamos una constante para guardar los datos del archivo json
            const usuarioExiste= objJSON.usuarios.find(u => u.user === user || u.email === email);
        //creamos una constante para guardar los datos del archivo json
        if (usuarioExiste){
            return res.status(400).json({ error: 'El usuario ya existe' });
            // res.send('el usuario ya existe')
        }else{
            objJSON.usuarios.push({ user, email, clave, nombre }); // Modificar el objeto JSON parseado
                fs.writeFile(allUser, JSON.stringify(objJSON), (writeErr) => { // Escribir de nuevo en el archivo
                    if (writeErr) {
                        console.error('Error al escribir en el archivo:', writeErr);
                        return res.status(500).json({ error: 'Error al escribir en el archivo' });
                    }
                    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
                });
        }                        
    
        } catch {
            return res.status(500).json({ error: 'Error al leer el JSON' });
        }
    })
 
    
})



//Funcion para establecer el puerto por donde escuchamos y verificar la conexion
app.listen (PORT,() =>{
    console.log(`listen in localhost: ${PORT}`)
}
);






