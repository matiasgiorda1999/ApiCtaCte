const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/usuarios',(req,res) => {
    const{ email, contrasena} = req.query;
    
    const sqlSelect = `
                SELECT 
                    nombre 
                FROM 
                    usuarios 
                WHERE 
                    email=? AND contrasena=?`;

    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)

        else{
            db.query(sqlSelect,[email,contrasena],(error, rows, fields) => {
                if(!error){
                    if(rows.length > 0){
                        res.json({msj: 'Correcto'});
                    }
                    else{
                        res.json({msj: 'Incorrecto'});
                    }
                }else{
                    res.json({msj: 'No se pudo realizar la consulta', errorMsj: error});
                }
            });
            db.release();
        }
    });
});

//Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

router.put('/usuarios', verifyToken ,(req, res) => {
    
    jwt.verify(req.token, 'secretKey', (error, authData) => {
        if(error){
            res.sendStatus(403);
        }else{
            const user = authData.user;
            const { password } = req.body;
            const sqlUpdate = `
                            UPDATE usuarios
                            SET 
                                contrasena=?
                            WHERE
                                id=?`;
            
            mysqlConnection.getConnection((err,db) => {
                if(err) console.log(err)
        
                else{
                    db.query(sqlUpdate,[password,user.id], (error, rows, fields) => {
                        if(!error){
                            res.json({msj: 'Registro usuario modificado exitosamente'});
                        }else{
                            res.json({msj: 'No se ha podido modificar el registro usuario', errorMsj: error});
                        }
                    });
                }
            });
        }
    });
});

router.delete('/usuarios', verifyToken ,(req,res) => {


    jwt.verify(req.token, 'secretKey', (error, authData) => {
        if(error){
            res.sendStatus(403);
        }else{
            const {dni, cuit, email} = req.query;

            const sqlDelete = `
                            DELETE FROM usuarios
                            WHERE
                                dni=? 
                                AND CUIT=?
                                AND email=?
                            `;
            
            mysqlConnection.getConnection((err,db) => {
                if(err) console.log(err)
        
                else{
                    db.query(sqlDelete,[dni, cuit, email], (error, rows, fields) => {
                        if(!error){
                            res.json({msj: 'Registro usuario eliminado exitosamente'});
                        }else{
                            res.json({msj: 'No se ha podido eliminar el registro usuario', errorMsj: error});
                        }
                    });
                }
            });
        }
    });
});

router.get('/usuarios/getIdClient', verifyToken , (req,res) => {

    jwt.verify(req.token, 'secretKey', (error, authData) => {
        if(error){
            res.sendStatus(403);
        }else{
            const user = authData.user;

            const { idEmpresa } = req.query; 

            const sqlSelect = `SELECT 
                                    ClienteId 
                                FROM 
                                    clientes 
                                WHERE 
                                    EmpresaId=?
                                    AND (Email=?
                                    OR NroDoc=?
                                    OR CUIT=?) `;
            mysqlConnection.getConnection((err,db) => {
                if(err) console.log(err)
                                
                else{
                    db.query(sqlSelect,[idEmpresa, user.email, user.dni, user.CUIT], (error, rows, fields) => {
                        if(!error){
                            res.json(rows[0]);
                        }else{
                            res.json({msj: 'No se ha podido realizar la consulta', errorMsj: error});
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;