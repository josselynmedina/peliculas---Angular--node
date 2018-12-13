var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var path = require('path');
var router = express.Router();

mongoose.connect('mongodb://admin:admin123@ds029267.mlab.com:29267/dbpeliculas', { useMongoClient: true }, function(error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var modelSchema = mongoose.Schema({
    Titulo: String,
    Director: String,
    Actorp: String,
    Year: Number,
    Pais: String,
    Rating: Number,
    Url: String
}, { collection: 'Peliculas' });

var Peliculas = mongoose.model('Peliculas', modelSchema);

// RUTAS

router.get('/peliculas', function(req, res) {
    Peliculas.find(function(err, peliculas) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else {
            res.status(200).jsonp(peliculas);
        }
    })
});

router.get('/peliculas/:id', function(req, res) {
    Peliculas.findById(req.params.id, function(err, peliculas) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else {
            if (peliculas != null) {
                res.status(200).jsonp(peliculas);
            } else
                res.status(404).send('No se encontro la pelicula');
        }
    });
});

router.post('/peliculas', function(req, res) {

    var item = new Peliculas({
        Titulo: req.body.Titulo,
        Director: req.body.Director,
        Autorp: req.body.Autorp,
        Year: req.body.Year,
        Pais: req.body.Pais,
        Rating: req.body.Rating,
        Url: req.body.Url,
    });

    item.save(function(error, item) {
        if (error) {
            res.status(500).send('No se ha podido agregar.');
        } else {
            res.status(200).jsonp({ _id: item._id });
        }
    });
});


router.put('/peliculas/:id', function(req, res) {
    Peliculas.update({ _id: req.params.id }, {
        Titulo: req.body.Titulo,
        Director: req.body.Director,
        Autorp: req.body.Autorp,
        Year: req.body.Year,
        Pais: req.body.Pais,
        Rating: req.body.Rating,
        Url: req.body.Url
    }, function(error, result) {
        if (error)
            res.status(500).send('Error en la base de datos');
        else if (result.nModified > 0)
            res.status(200).send('Modificados');
        else
            res.status(500).send('No se pudo modificar');
    });
});

router.delete('/peliculas/:id', function(req, res) {
    Cancion.remove({ _id: req.params.id }, function(error, result) {
        if (error)
            res.status(500).send('Error en la base de datos');
        else if (result.result.n > 0)
            res.status(200).send('Eliminados');
        else
            res.status(500).send('No se pudo eliminar');
    });
});



router.get('/descarga/:id', function(req, res) {
    res.download(path.join(__dirname, 'img', req.params.id + '.jpg'), req.params.id + '.jpg', function(err) {
        if (err)
            console.log('Ocurrio un error en la descarga.');
        else
            console.log('Descarga exitosa.');
    });
});


module.exports.router = router;