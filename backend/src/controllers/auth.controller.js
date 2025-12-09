import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

// Generar tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );

  return { accessToken, refreshToken };
};

// @desc    Registro de usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    console.log('📝 Datos recibidos:', req.body);
    let { nombre, alias, email, contraseña } = req.body;

    // Validar campos requeridos
    if (!nombre || !alias || !contraseña) {
      console.log('❌ Faltan campos requeridos');
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona nombre, alias y contraseña'
      });
    }

    // Convertir email vacío a null
    if (email === '' || email === undefined) {
      email = null;
    }

    // Verificar si el usuario ya existe
    console.log('🔍 Verificando si existe:', alias);
    const userExists = await User.findOne({ where: { alias } });
    if (userExists) {
      console.log('❌ Usuario ya existe');
      return res.status(400).json({
        success: false,
        message: 'El alias ya está en uso'
      });
    }

    // ENCRIPTAR CONTRASEÑA
    console.log('🔐 Encriptando contraseña...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    console.log('✅ Contraseña encriptada:', hashedPassword.substring(0, 20) + '...');

    // Crear usuario
    console.log('✨ Creando usuario en la base de datos...');
    const user = await User.create({
      nombre,
      alias,
      email,
      contraseña: hashedPassword
    });
    console.log('✅ Usuario GUARDADO en BD con ID:', user.id);
    console.log('✅ Datos del usuario:', { nombre: user.nombre, alias: user.alias, email: user.email });

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Guardar refresh token
    user.refreshToken = refreshToken;
    await user.save();

    console.log('🎉 Registro exitoso');
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('💥 Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { alias, contraseña } = req.body;

    // Validar campos
    if (!alias || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona alias y contraseña'
      });
    }

    // Buscar usuario (incluir contraseña para comparar)
    const user = await User.findOne({ 
      where: { alias },
      attributes: { include: ['contraseña'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    let isPasswordValid = false;
    
    // Verificar si es un hash de bcrypt (empieza con $2a$ o $2b$)
    if (user.contraseña.startsWith('$2a$') || user.contraseña.startsWith('$2b$')) {
      // Contraseña encriptada - comparar con bcrypt
      isPasswordValid = await user.comparePassword(contraseña);
    } else {
      // Contraseña en texto plano (para usuarios del seed antiguo)
      isPasswordValid = user.contraseña === contraseña;
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Guardar refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Logout de usuario
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    const user = req.user;
    
    // Limpiar refresh token
    user.refreshToken = null;
    await user.save();

    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión'
    });
  }
};

// @desc    Refrescar access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requerido'
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Buscar usuario
    const user = await User.findByPk(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    // Generar nuevos tokens
    const tokens = generateTokens(user.id);

    // Actualizar refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error('Error al refrescar token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario'
    });
  }
};
