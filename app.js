const express = require("express");
const path = require("path");
const multer = require("multer");
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware para procesar JSON y formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer para manejar el upload de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuración de sesiones
app.use(session({
    secret: 'numeroDeCuenta', // Cambia esto por una clave secreta segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Para pruebas, desactiva 'secure' si no estás usando HTTPS
}));


// Importar handlers de formularios desde formsController
const {
    handleUserForm,
    handlePerfilForm,
    handleTutorForm,
    handleProfesionalForm,
    handleSesionForm,
    confirmarLogin
} = require("./controllers/formsController");
// const { getPerfil } = require("./controllers/perfilController");
const {
    getUsers,
    getAreas,
    getEspecialidades,
    getPaises,
    getCiudades,
    getEstados,
    getSubareas,
    getTutores,
    getProfesionales,
    getSesiones
} = require("./controllers/extraccionController");


// Endpoint para insertar datos de usuario en la base de datos
app.post("/usuario", upload.fields([{ name: 'ine_user', maxCount: 1 }, { name: 'foto_user', maxCount: 1 }]), handleUserForm);

// Endpoint para insertar datos de perfil
app.post("/perfil", upload.fields([{ name: 'foto_perfil', maxCount: 1 }, { name: 'banner_perfil', maxCount: 1 }]), handlePerfilForm);


// Endpoint para insertar datos de tutor
app.post("/tutor", upload.single('foto_menor'), handleTutorForm);

// Endpoint para insertar datos de profesional
app.post("/profesional", handleProfesionalForm);

// Endpoint para insertar datos de sesión
app.post("/sesion", handleSesionForm);

// Endpoint para autenticar usuario y mantener la sesión activa
app.post("/login", confirmarLogin);

// // Endpoint para obtener datos del perfil del usuario
// app.get("/api/perfil", getPerfil);


// Endpoint para obtener datos de usuarios desde la base de datos
app.get("/usuarios", getUsers);

// Endpoint para obtener áreas
app.get("/areas", getAreas);

// Endpoint para obtener especialidades
app.get("/especialidades", getEspecialidades);

// Endpoint para obtener países
app.get("/paises", getPaises);

// Endpoint para obtener ciudades
app.get("/ciudades", getCiudades);

// Endpoint para obtener estado
app.get("/estado", getEstados);

// Endpoint para obtener subáreas
app.get("/subareas", getSubareas);

// Endpoint para obtener tutores
app.get("/tutores", getTutores);

// Endpoint para obtener profesionales
app.get("/profesionales", getProfesionales);

// Endpoint para obtener sesiones
app.get("/sesiones", getSesiones);

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, "public")));

// Función para servir archivos estáticos
function serveStaticFiles(route, folder) {
    app.get(`/public/${route}/:filename`, (req, res) => {
        const filename = req.params.filename;
        res.sendFile(path.join(__dirname, "public", route, filename));
    });
}

// Llamar la función para cada tipo de archivo estático
serveStaticFiles("html", "html");
serveStaticFiles("css", "css");
serveStaticFiles("js", "js");
serveStaticFiles("img", "img");

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports = app; // Exportar app si es necesario para pruebas u otros propósitos
