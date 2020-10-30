import { Router, Request, Response  } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes = Router();

//Listar usuarios paginados
userRoutes.get('/', async ( req: Request, res: Response ) =>{

    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const body = req.body;

    const usuarios =  await Usuario.find( {activo: body.activo} )
                                    //Muestra ordenado por nombre
                                    .sort( { nombre: 1 } )
                                    .skip( skip )
                                    //Se pagina de 10 en 10 
                                    .limit(10)
                                    .exec();

    res.json({
        ok: true,
        pagina,
        usuarios
    });


});


//Servicio Crear Usuario  .
userRoutes.post('/create', ( req: Request, res: Response ) =>{

    const user = {
        documento         : req.body.documento,
        nombre            : req.body.nombre,
        apellido          : req.body.apellido,
        genero            : req.body.genero,
        telefono          : req.body.telefono,
        email             : req.body.email,
        rol               : req.body.rol,
        usuarioPlataforma : req.body.usuarioPlataforma,
        //Encriptamos el password y lo pasamos por 10 vueltas 
        password          : bcrypt.hashSync( req.body.password, 10),
        activo            : req.body.activo
        //fechaNacimiento,
        //avatar
    };

    //Login 
    userRoutes.post('/login', (req: Request, res: Response) => {
        
        const body = req.body;

        //Traemos el usuario por la llave en este caso email
        Usuario.findOne({ email: body.email }, (err, userDB ) => {

            if( err ) throw err;

            if( !userDB ) {
                return res.json({
                    ok: false,
                    mensaje: 'Usuario/Contraseña no son correctos'
                });
            }

            //Se utiliza el metodo comparar password
            if( userDB.compararPassword( body.password )) {

                const tokenUser = Token.getJwtToken({
                    _id: userDB._id,
                    documento: userDB.documento,
                    nombre: userDB.nombre,
                    apellido: userDB.apellido,
                    genero: userDB.genero,
                    telefono: userDB.telefono,
                    email: userDB.email,
                    rol: userDB.rol,
                    //usuarioPlataforma: userDB.usuarioPlataforma,
                    password: userDB.password                  

                });

                res.json ({
                  ok: true,
                  token: tokenUser
                });

            }else {
                return res.json({
                    ok: false,
                    mensaje: 'Usuario/Contraseña no son correctos ***'
                });
            }    

        })

    });

    //Se crea el usuario en Base de datos
    Usuario.create( user ).then( userDB => {

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
                    documento: userDB.documento,
                    nombre: userDB.nombre,
                    apellido: userDB.apellido,
                    genero: userDB.genero,
                    telefono: userDB.telefono,
                    email: userDB.email,
                    rol: userDB.rol,
                    //usuarioPlataforma: userDB.usuarioPlataforma,
                    password: userDB.password    
        });

        res.json ({
          ok: true,
          token: tokenUser
        });
       
    }).catch( err => {
        res.json( {
            ok: false,
            err
        })
    });
});



//Actualizar Usuario
userRoutes.post('/update', (req: any, res: Response) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {

    const user = {
        documento: req.body.documento || req.usuario.documento,
        nombre: req.body.nombre || req.usuario.nombre,
        apellido: req.body.apellido || req.usuario.apellido,
        genero: req.body.genero || req.usuario.genero,
        telefono: req.body.telefono || req.usuario.telefono,
        email: req.body.email || req.usuario.email,
        rol: req.body.rol || req.usuario.rol,
       // usuarioPlataforma: req.body.usuarioPlataforma || req.usuario.usuarioPlataforma,
        password: req.body.password || req.usuario.password
    }

    // Se entrega la información para actualizar 
    Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, ( err, userDB) => {
        
        if( err ) throw err;

        if( !userDB  ) {
            return res.json({
                ok: false,
                mensaje: 'Noexiste un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
                    documento: userDB.documento,
                    nombre: userDB.nombre,
                    apellido: userDB.apellido,
                    genero: userDB.genero,
                    telefono: userDB.telefono,
                    email: userDB.email,
                    rol: userDB.rol,
                   // usuarioPlataforma: userDB.usuarioPlataforma,
                    password: userDB.password    
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    });

   
});


//Eliminar Usuario
//En este caso no se eleiminara el registro si no que se pondra en un estado de inactivo
userRoutes.post('/delete', (req: any, res: Response) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {

    const user = {
        _id: req.body._id || req.usuario._id,        
        activo: req.body.activo || req.usuario.activo
    }

    // Se entrega la información para actualizar el campo activo a false
    Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, ( err, userDB) => {
        
        if( err ) throw err;

        if( !userDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
                    documento: userDB.documento,
                    activo: false  
        });

        res.json({
            ok: true,
            token: tokenUser
        });
    });   
});

//Se exporta 
export default userRoutes;