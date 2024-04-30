//costante para llamar a express y traer la galeria
const express = require ('express');

//crear const para activar a express y sus funcionalidades
const app = express();

//crear el puerto por defecto se usa el 3000
const PORT = 3001;

//invocamos a express para usarlo
app.use(express.json());

//llamar a un servicio para traer lista de usuario

// let pokemon = [
//     {nombre: 'pikachu',
//     id: 1,
//     especie: 'electrico'
//     },

//     {nombre: 'charizer',
//     id: 2,
//     especie: 'fuego'
//     },

//     {nombre: 'bulbazur',
//     id: 3,
//     especie: 'planta'
//     }
// ];

// app.get('/all',(req,res) => {
//     res.json(pokemon)
// });

// //es como crear el home
// app.get('/', (req,res)=>{
//     res.send('hola estamos en el back de node')
// });

// //para que el puerto se activo tengo que escucharlo



// //buscamos datos por ID

// app.get('/all/:id', (req,res)=>{
//     const allPoke = parseInt(req.params.id); //extrae el id colocado en la ruta
//     const pokeId = pokemon.find(poke => poke.id === allPoke); //compara con el id del arreglo pokemon

//     if (pokeId){
//         res.json(pokeId)
//     }else{
//         res.status(404).json({mensaje: 'pokemon no encontrado'})
//     }
// });


// //para crear infomacion

// app.post('/new' , (req,res) => {
//     const nuevoPokemon = req.body; //asigna a la variable lo que hay en el body
//     //si no existe cargado nada o nombre
//     if(!nuevoPokemon || !nuevoPokemon.nombre || !nuevoPokemon.id){
//         return res.status(400).json({mensaje: 'Datos invalidos'});
//     }
//     const nuevoId = pokemon.find (e => e.id === nuevoId.id)
//     const nuevoNombre = pokemon.find (e => e.nombre === nuevoPokemon.nombre)
//     if(nuevoNombre && nuevoId){
//         return res.status(400).json({mensaje: 'Datos ya existente'})
//     }else{

//     nuevoPokemon.id = pokemon.length + 1;
//     pokemon.push(nuevoPokemon); //agrega los datos que cargamos
//     res.status(201).json(nuevoPokemon);
// }
// })

//Middleware para parsear el cuerpo de las solicitudes
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Usa el middleware body-parser para analizar el cuerpo de la solicitud JSON


//creamos una constante para traer el archivo creado
const allUser = 'user.json';

//luego de instalar fs "npm i fs" que nos permitira trabajar con el archivo json lo invocamos
const fs = require('fs');

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
        const usuarioEncontrado = objJSON.usuarios.find(u => u.user === user && u.clave === clave);
        //creamos una constante para guardar los datos del archivo json
        if (usuarioEncontrado){
            res.send('bienvenido')
        }else{
            res.send('usuario no encontrado')
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






