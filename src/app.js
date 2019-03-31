const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const bodyParser = require("body-parser")
const fs = require("fs")
const funciones = require("./funciones")
const helpers = require("./helpers")

const directorioPublico = path.join(__dirname, "../public")
const directorioPartials = path.join(__dirname, "../partials")
app.use(express.static(directorioPublico))
hbs.registerPartials(directorioPartials)
app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'hbs')




app.get('/', function (req, res)
{
    res.render('main')
})


app.get('/crear', function (req, res)
{
    res.render('crear')
})

app.post('/creacionCurso', (req,res) => 
{
    curso = req.body
    curso["estado"] = "Disponible"
    funciones.crearCurso(curso)
    res.render("main")
})

app.get('/verCursos', function (req, res)
{
    res.render('verCursos')
})


app.get('/inscribir', function (req, res)
{
    res.render('inscribir')
})

app.post('/inscribir', function (req,res)
{
    datos = req.body
    estudiante = 
    {
        "nombre": datos.nombre,
        "CC": datos.CC,
        "correo": datos.correo,
        "telefono": datos.telefono
    }
    matricula = 
    {
        "CC": datos.CC,
        "CursoId": datos.CursoID
    }

    if (funciones.crearEstudiante(estudiante))
    {
        funciones.crearMatricula(matricula)
        res.render("mensaje", {mensaje: "ha sido registrado con exito"})
    }
    else
    {
        res.render("mensaje", {mensaje: "ya existe"})

    }
})

app.get('/verInscritos', function (req, res)
{
    res.render('verInscritos')
})

app.get('/verCurso/:id', function(req, res){
    cursos = require("./cursos.json")
    if (cursos.filter(curso => curso.ID == req.params.id)[0].estado == "Disponible")
    {
        res.render('verCurso', {
            id: req.params.id
        })
    }
    else
    {
        res.send("Error")
    }

 })

 app.get('/cerrarCurso/:id', function (req,res)
 {
    cursos = require("./cursos.json")
    cursos.filter(curso => curso.ID == req.params.id)[0].estado = "Cerrado"
    funciones.guardarCurso()
    res.redirect("/")
 })

 app.post('/eliminarMatricula/', function(req,res)
{
    datos = req.body
    matriculas = require("./matriculas.json")
    indice = -1
    for (i = 0; i < matriculas.length; i ++)
    {
        if (datos.CC == matriculas[i].CC && datos.cursoID == matriculas[i].CursoId)
        {
            indice = i
            break
        }
    }
    if (indice >= 0)
    {
        delete matriculas[indice]
        funciones.guardarMatriculas()
    }
    res.redirect("/verInscritos")
})

app.listen(3000, () =>
{
    console.log("Escuchando en el puerto 3000")
})