import jwt from 'jsonwebtoken';

export const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar si el token está presente y comienza con "Bearer"
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado', success: false });
  }

  // Extraer el token del header
  const token = authHeader.split(' ')[1];

  try {
    // Verificar el token usando JWT
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Almacenar los datos del usuario en el objeto req para usar en los controladores
    req.user = user;

    // Pasar al siguiente middleware o ruta
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado', success: false });
  }
};


export const validateTokenSocket =(socket, next) => {
  // Obtener el token del encabezado 'Authorization'
  const token = socket.handshake.headers.authorization;

  // Verificar si el token está presente
  if (!token?.startsWith('Bearer ')) {
    return next(new Error('Token no proporcionado'));
  }

  const actualToken = token.split(' ')[1]; // Extraer el token sin 'Bearer'

  // Verificar el token usando JWT
  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Token inválido o expirado'));
    }

    // Agregar la información del usuario decodificada al socket para usarla en las emisiones posteriores
    socket.user = decoded; 

    next(); // Continuar con la conexión
  });
}