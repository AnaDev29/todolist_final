import { User } from '../models/index.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar multer para almacenar en memoria
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil'
    });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const user = req.user;

    if (nombre) user.nombre = nombre;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil'
    });
  }
};

// @desc    Subir foto de perfil
// @route   POST /api/users/upload-photo
// @access  Private
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    // Si hay Cloudinary configurado, subir a Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      // Convertir buffer a base64
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Subir a Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'todolist/avatars',
        public_id: `user_${req.user.id}_${Date.now()}`,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' }
        ]
      });

      // Actualizar usuario con URL de Cloudinary
      req.user.foto = result.secure_url;
      await req.user.save();

      return res.json({
        success: true,
        message: 'Foto subida exitosamente',
        data: {
          foto: result.secure_url
        }
      });
    } else {
      // Si no hay Cloudinary, guardar en base64 (solo para desarrollo)
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      req.user.foto = dataURI;
      await req.user.save();

      return res.json({
        success: true,
        message: 'Foto guardada exitosamente (modo desarrollo)',
        data: {
          foto: dataURI
        }
      });
    }
  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir foto',
      error: error.message
    });
  }
};

// @desc    Eliminar foto de perfil
// @route   DELETE /api/users/photo
// @access  Private
export const deletePhoto = async (req, res) => {
  try {
    req.user.foto = null;
    await req.user.save();

    res.json({
      success: true,
      message: 'Foto eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar foto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar foto'
    });
  }
};
