require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

const generateCode = () => {
    return Math.random().toString(16).slice(2,8)
}

router.post('/sendEmail/newUser',(req,res) => {

    const {dni, cuit, email} = req.body;

    const sqlSelectCliente = `
                    SELECT 
                        Nombre
                    FROM 
                        clientes
                    WHERE 
                        NroDoc=? 
                        OR CUIT=?`

    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)

        else{
            db.query(sqlSelectCliente,[dni, cuit],(error, rows, fields) => {
                if(!error){
                    if(rows.length !== 0){
                        const client = rows[0];

                        const sqlSelectUsuario = `SELECT 
                                                    dni
                                                FROM usuarios
                                                WHERE
                                                    dni=?
                                                    OR CUIT=?
                                                    OR Email=?`;

                        db.query(sqlSelectUsuario,[dni, cuit, email],(error, rows, fields) => {
                            if(!error){
                                if(rows.length !== 0){
                                    res.json({msj:'Ya existe un usuario registrado con estos datos'});
                                }else{
                                    db.beginTransaction((error) => {
                                        if(error) res.json({msj: "No se ha podido iniciar la transaccion", msjError: error})
            
                                        else{
                                            const sqlInsert = `
                                                    INSERT INTO usuarios (dni,CUIT,email,nombre,contrasena)
                                                    VALUES (?,?,?,?,?)`;
            
                                            const code = generateCode();
                                            const nombre = client.Nombre
            
                                            db.query(sqlInsert,[dni, cuit, email, nombre, code],(error, rows, fields) => {
                                                if(!error) {
                                                    
                                                    const sqlSelectUsuariosXEmpresas = `SELECT 
                                                                                    id, EmpresaId 
                                                                                FROM 
                                                                                    usuarios u INNER JOIN clientes c ON u.dni = c.NroDoc OR u.CUIT = c.CUIT OR u.email = c.Email
                                                                                WHERE
                                                                                    u.dni = ? OR u.CUIT = ?`
                                                    db.query(sqlSelectUsuariosXEmpresas,[dni, cuit], (error, rows, fields) => {
                                                        if(!error){
                                                            const usuariosXEmpresas = rows;
                                                            for( let i=0 ; i < usuariosXEmpresas.length ; i++){
                                                                const sqlInsertUsuariosXEmpresas = `INSERT INTO usuariosxempresas(idUsuario,idEmpresa) VALUES (?,?)`
                                                                db.query(sqlInsertUsuariosXEmpresas,[usuariosXEmpresas[i].id,usuariosXEmpresas[i].EmpresaId],(error, rows, fields) => {
                                                                    if(error) {
                                                                        db.rollback();
                                                                        res.json({msj: 'No se han podido registrar las empresas de este usuario', msjError: error})
                                                                    }
                                                                })
                                                            }
                                                            
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
                                                                text: `Bienvenido/s! En este email se detallan sus datos y a continuación su nueva contraseña de 6 caractéres. Para una mayor seguridad se le recomienda cambiar esta contraseña a una nueva.
                                                                        DNI: ${dni}
                                                                        C.U.I.T.: ${cuit}
                                                                        Nombre: ${nombre}
                                                                        CONTRASEÑA: ${code}`
                                                            };
                                                            transporter.sendMail(mailOptions, (error, info) => {
                                                                if(error){
                                                                    db.rollback();
                                                                    res.send({msj: "Error en el envio del email ", errorMsj: error});
                                                                }else{
                                                                    db.commit();
                                                                    res.send({msj: "Email enviado con éxito"});
                                                                }
                                                            });
            
                                                        }
                                                        else{
                                                            db.rollback()
                                                            res.json({msj: 'No se ha podido realizar la consulta empresas', msjError: error});
                                                        }
                                                    })
                                                    
                                                }
                                                else{
                                                    res.json({msj: 'No se pudo realizar la insercion', errorMsj: error})
                                                }
                                            });
                                        }
                                    })
                                }
                            }
                            else{
                                res.json({msj:'Error al ejecutar la consulta de usuario', errorMsj: error});
                            }
                        })
        
                    }
                    else{
                        res.json({msj: 'Este DNI, CUIT y Email no esta asociado a ningún negocio'});
                    }
                }else{
                    res.json({msj: 'No se pudo realizar la consulta', errorMsj: error});
                }
            });
            db.release();            
        }
    });
});

router.post('/sendEmail/updatePassword',(req,res) => {

    const { email } = req.body;

    const sqlSelectUser = `
                    SELECT
                        *
                    FROM usuarios
                    WHERE
                        email=?`;
    
    mysqlConnection.getConnection((err,db) => {
        if(err) console.log(err)

        else{
            db.query(sqlSelectUser,[email],(error, rows, fields) => {
                if(!error){
                    if(rows.length !== 0){
                        const user = rows[0];
                        const code = generateCode();

                        db.beginTransaction((error) => {
                            if(error) res.json({msj: "No se ha podido iniciar la transaccion", msjError: error})
                            
                            else{
                                const sqlUpdateUser=`UPDATE 
                                                        usuarios
                                                     SET
                                                        contrasena=?
                                                     WHERE
                                                        id=?`;
                                db.query(sqlUpdateUser,[code,user.id],(error, rows, fields) => {
                                    if(!error){
                                        
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
                                            subject: "Reestauración de contraseña BBvSoft Consulta CtaCteMobile",
                                            text: `Hola ${user.nombre}! Se le acaba de otorgar una contraseña de 6 caractéres, para una mayor seguridad se le recomienda cambiar esta contraseña a una nueva. CONTRASEÑA: ${code}`
                                        };
                                        transporter.sendMail(mailOptions, (error, info) => {
                                            if(error){
                                                db.rollback();
                                                res.send({msj: "Error en el envio del email ", errorMsj: error});
                                            }else{
                                                db.commit();
                                                res.send({msj: "Email enviado con éxito"});
                                            }
                                        });
                                    }
                                    else{
                                        db.rollback();
                                        res.json({msj: 'No se ha podido realizar la modificación del usuario', msjError: error});
                                    }
                                });
                            }
                        });
                    }
                    else{
                        res.send({msj: 'No hay ningún usuario registrado con ese email'})
                    }
                }
                else{
                    res.send({msj: 'No se ha podido realizar la consulta del usuario'})
                }
            });
            db.release();
        }
    });
});

module.exports = router;