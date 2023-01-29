const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

//Settings - Seccion de configuracion del servidor para definir el puerto, tu entorno de desarrollo, el nombre de tu aplicacion
//           o que motor de plantilla
app.set("port", process.env.PORT || 3001);

//Middlewares - Funciones que se ejecutan antes de que proceses algo. Si estas esperando a que el server reciba algun archivo,
//              antes de eso puedes ejecutar una funcion para procesar esos archivos
app.use(express.json({ limit: "500mb" }));
app.use(cors());
app.use(express.static(path.join(__dirname, "images")));

//Routes - Nosotros vamos a poder crear urls de nuestro server para poder procesar datos, recibirlos, reenviar datos, etc. Es
//         tan solo la manera en que vamos a comunicar el server con el navegador
app.use(require("./routes/clientRoute"));
app.use(require("./routes/checkingAccountRoute"));
app.use(require("./routes/receiptPaymentRoute"));
app.use(require("./routes/userRoute"));
app.use(require("./routes/enterpriseRoute"));
app.use(require("./routes/afipRoute"));

//Starting server
app.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
