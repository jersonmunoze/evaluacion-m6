// Jerson Muñoz Espinoza Evaluación - M6 
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;
const path = 'anime.json';

app.use(express.json());


const obtenerAnimes = () => {
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
};

const escribirAnime = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

//Función para entregar la respuesta del POST y GET con el id incluido
const formatearRespuesta = (id, obj) => {
    const respuesta = new Object();
    respuesta[id] = obj;
    return respuesta;
};

app.get('/animes', (req, res) => {
    const animes = obtenerAnimes();
    res.send(animes);
});

//Ruta para obtener anime por id o por id y nombre
//Si busca por id y nombre, estos deben coincidir para que encuentre el anime
app.get('/animes/:id', (req, res) => {
    const animes = obtenerAnimes();
    const id = parseInt(req.params.id);
    const { nombre } = req.query;
    const animeEncontrado = animes[id];
    const nombreCoincide = animeEncontrado.nombre === nombre;
    if (animeEncontrado && (!nombre || nombreCoincide)) {
        const respuesta = formatearRespuesta(id, animes[id]);
        res.json(respuesta);
    } else {
        res.status(404).json({ mensaje: 'Anime no encontrado' });
    }
});

//Ruta para obtener anime por nombre
app.get('/animes/nombre/:nombre', (req, res) => {
    const animes = obtenerAnimes();
    const { nombre } = req.params;
    const animeEncontrado = Object.values(animes).filter(x => x.nombre === nombre);
    if (animeEncontrado.length > 0) {
        let id = Object.keys(animes).find(x => animes[x] === animeEncontrado[0]);
        const respuesta = formatearRespuesta(id, animeEncontrado[0]);
        res.json(respuesta);
    } else {
        res.status(404).json({ mensaje: 'Anime no encontrado' });
    }
});

//Ruta POST creación de animes
//Obtiene el último id y le suma 1 para evitar colisiones debido a eliminaciones anteriores
app.post('/animes', (req, res) => {
    const animes = obtenerAnimes();
    const idsAnimes = Object.keys(animes);
    const nuevoId = parseInt(idsAnimes[idsAnimes.length - 1]) + 1;
    const datosAnime = { ...req.body };
    animes[nuevoId] = datosAnime;
    escribirAnime(animes);
    const respuesta = formatearRespuesta(nuevoId, req.body);
    res.status(201).json(respuesta);
});

app.delete('/animes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const animes = obtenerAnimes();
    if (animes[id]) {
        delete animes[id];
        escribirAnime(animes);
        res.json({ mensaje: `Anime con id ${id} eliminado correctamente` });
    } else {
        res.status(404).json({ 'mensaje': 'Anime no encontrado' });
    }
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto:', PORT);
});

module.exports = { app }