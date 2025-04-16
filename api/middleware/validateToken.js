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
