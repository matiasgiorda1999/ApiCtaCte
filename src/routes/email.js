require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

const generateCode = () => {
    return Math.random().toString(16).slice(2,8)
}

router.post('/sendEmail',(req,res) => {

    const {dni, cuit, email} = req.body;

    const sqlSelectCliente = `
                    SELECT 
                        Nombre
                    FROM 
                        clientes
                    WHERE 
                        NroDoc=? 
                        AND CUIT=? 
                        AND Email=?`

    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)

        else{
            db.query(sqlSelectCliente,[dni, cuit, email],(error, rows, fields) => {
                if(!error){
                    if(rows.length !== 0){
                        const sqlInsert = `
                                        INSERT INTO usuarios (dni,CUIT,email,nombre,contraseña)
                                        VALUES (?,?,?,?,?)`;

                        const code = generateCode();
                        const nombre = rows[0].Nombre
                        mysqlConnection.query(sqlInsert,[dni, cuit, email, nombre, code],(error, rows, fields) => {
                            if(!error) {
    
                                let transporter = nodemailer.createTransport({
                                    host: 'smtp.gmail.com',
                                    port: 465,
                                    auth: {
                                        user: process.env.EMAIL,
                                        pass: process.env.PASSWORD
                                    },
                                    secure: true
                                });
                
                                let mailOptions = {
                                    from: "Remitente",
                                    to: `${email}`,
                                    subject: "Codigo de validacion BBv Software Consulta CtaCte Mobile",
                                    text: `Bienvenido/s! En este email se detallan sus datos y a continuación un código de 6 dígito que usted debera introducir a la hora de registrarse.
                                            DNI: ${dni}
                                            C.U.I.T.: ${cuit}
                                            Nombre: ${nombre}
                                            CÓDIGO: ${code}`
                                };
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if(error){
                                        res.send({msj: "Error en el envio del email ", errorMsj: error});
                                    }else{
                                        res.send({msj: "Email enviado con éxito"});
                                    }
                                })
                            }
                            else{
                                res.json({msj: 'No se pudo realizar la insercion', errorMsj: error})
                            }
                        });
        
                    }
                    else{
                        res.json({msj: 'Este DNI, CUIT y Email no esta asociado a ningún negocio'});
                    }
                }else{
                    res.json({msj: 'No se pudo realizar la consulta', errorMsj: error});
                }
            });            
        }
    });
});

module.exports = router;