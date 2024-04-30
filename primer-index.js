//costante para llamar a express y traer la galeria
const express = require ('express');

//crear const para activar a express y sus funcionalidades
const app = express();

//crear el puerto por defecto se usa el 3000
const PORT = 3001;

//invocamos a express para usarlo
app.use(express.json());

//llamar a un servicio para traer lista de usuario

let pokemon = [
    {nombre: 'pikachu',
    id: 1,
    especie: 'electrico'
    },

    {nombre: 'charizer',
    id: 2,
    especie: 'fuego'
    },

    {nombre: 'bulbazur',
    id: 3,
    especie: 'planta'
    }
];

app.get('/all',(req,res) => {
    res.json(pokemon)
});

//es como crear el home
app.get('/', (req,res)=>{
    res.send('hola estamos en el back de node')
});

//para que el puerto se activo tengo que escucharlo



//buscamos datos por ID

app.get('/all/:id', (req,res)=>{
    const allPoke = parseInt(req.params.id); //extrae el id colocado en la ruta
    const pokeId = pokemon.find(poke => poke.id === allPoke); //compara con el id del arreglo pokemon

    if (pokeId){
        res.json(pokeId)
    }else{
        res.status(404).json({mensaje: 'pokemon no encontrado'})
    }
});


//para crear infomacion

app.post('/new' , (req,res) => {
    const nuevoPokemon = req.body; //asigna a la variable lo que hay en el body
    //si no existe cargado nada o nombre
    if(!nuevoPokemon || !nuevoPokemon.nombre || !nuevoPokemon.id){
        return res.status(400).json({mensaje: 'Datos invalidos'});
    }
    const nuevoId = pokemon.find (e => e.id === nuevoId.id)
    const nuevoNombre = pokemon.find (e => e.nombre === nuevoPokemon.nombre)
    if(nuevoNombre && nuevoId){
        return res.status(400).json({mensaje: 'Datos ya existente'})
    }else{

    nuevoPokemon.id = pokemon.length + 1;
    pokemon.push(nuevoPokemon); //agrega los datos que cargamos
    res.status(201).json(nuevoPokemon);
}
})



//Funcion para establecer el puerto por donde escuchamos y verificar la conexion
app.listen (PORT,() =>{
    console.log(`listen in localhost: ${PORT}`)
}
);






