import express from 'express';
import { getProfile, updateProfile, uploadPhoto, deletePhoto, upload } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/upload-photo', upload.single('photo'), uploadPhoto);
router.delete('/photo', deletePhoto);

export default router;
