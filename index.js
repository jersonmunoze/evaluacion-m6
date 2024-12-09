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

//Función para entregar la respuesta del POST con el nuevo id incluido
const formatearRespuesta = (id, obj) => {
    const respuesta = new Object()
    respuesta[id] = obj
    return respuesta
};

const escribirAnime = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

app.get('/animes', (req, res) => {
    const animes = obtenerAnimes();
    res.send(animes);
});

app.post('/animes', (req, res) => {
    const animes = obtenerAnimes();
    const idsAnimes = Object.keys(animes);
    //Obtiene el último id y le suma 1 para evitar colisiones con ids eliminados anteriormente
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
    console.log('Servidor corriendo en el puerto: ', PORT);
});

module.exports = { app }