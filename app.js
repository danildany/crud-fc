const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: './uploads/images' });
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const ShortUniqueId = require('short-unique-id');
const PUERTO = 8080;
const app = express();
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
console.log(__dirname);
app.use(express.static(path.join(`${__dirname}/views`)));
app.use(express.static(path.join(`${__dirname}/uploads`)));
app.use(express.static(path.resolve(`${__dirname}/public`)));

const uid = new ShortUniqueId();
let equipos = require('./data/equipos.json');
const Equipo = require('./entidades/equipo.js');

app.get('/', (req, res) => {
    res.render('inicio', {
      layout: 'base',
      data: {
        equipos,
      },
    });
});

app.get('/crear', (req, res) => {
    res.render('crear', {
      layout: 'base',
    });
});

app.post('/crear', upload.single('imagen'), (req, res) => {
  const { nombre, pais, ubicacion, fundacion } = req.body;
  if (!nombre || !pais || !ubicacion || !fundacion) {
    res.status(400).send('Tenes que llenar todos los campos');
    return;
  }

  const imagen = req.file == undefined ? '/images/default' : `/images/${req.file.filename}`;
  const nuevoEquipo = new Equipo(
    uid.stamp(11),
    pais,
    nombre,
    imagen,
    ubicacion,
    fundacion,
    (new Date()).toLocaleDateString('es-AR'),

  );
  equipos.push(nuevoEquipo);
  const jsonNuevoEquipo = JSON.stringify(equipos, null, 2);
  fs.writeFileSync('./data/equipos.json', jsonNuevoEquipo, 'utf-8');
  res.redirect('/');
});

app.get('/:equipo/:id/leer', (req, res) => {
  const equipoId = req.params.id;
  const equipo = equipos.filter((equipoParam) => equipoParam.id == equipoId);
  data = equipo[0];
  res.render('leer', {
    layout: 'base',
    data,
  });
});


app.get('/:id/editar', (req, res) => {
  const equipoId = req.params.id;
  const equipo = equipos.filter((equipoParam) => equipoParam.id == equipoId);
  data = equipo[0];
  res.render('editar', {
    layout: 'base',
    data,
  });
});
app.put('/:id/editar', upload.single('imagen'), (req, res) => {
  const equipoId = req.params.id;
  const equipoAEditar = equipos.filter((equipoParam) => equipoParam.id == equipoId);
  data = equipoAEditar[0];

  const { nombre, pais, ubicacion, fundacion} = req.body;
  if (!nombre || !pais || !ubicacion || !fundacion) {
    res.status(400).send('Tenes que llenar todos los campos');
    return;
  }
  const imagen = req.file == undefined ? data.crestUrl : `/images/${req.file.filename}`;
  const nuevoEquipo = new Equipo(
    equipoId,
    pais,
    nombre,
    imagen,
    ubicacion,
    fundacion,
    (new Date()).toLocaleDateString('es-AR'),
  );
  const equipoEditado = equipos.map((dato) => {
    if (dato.id == equipoId) {
      const result = Object.assign(dato, nuevoEquipo);
      return result;
    }
    return dato;
  });
  const jsonNuevoEquipo = JSON.stringify(equipoEditado, null, 2);
  fs.writeFileSync('./data/equipos.json', jsonNuevoEquipo, 'utf-8');
  res.redirect('/');
});

app.get('/:id/eliminar', (req, res) => {
  const equipoId = req.params.id;

  equipos = equipos.filter((equipoParam) => equipoParam.id != equipoId);
  const jsonNewEquipo = JSON.stringify(equipos, null, 2);
  fs.writeFileSync('./data/equipos.json', jsonNewEquipo, 'utf-8');
  res.redirect('/');
});

app.listen(PUERTO);
console.log(`Escuchando en http://localhost:${PUERTO}`);