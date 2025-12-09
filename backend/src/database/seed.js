import { sequelize } from '../config/database.js';
import { User, Task } from '../models/index.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('Iniciando seed de la base de datos...');

    // Sincronizar base de datos (eliminar tablas existentes y recrearlas)
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada');

    // Encriptar contraseñas MANUALMENTE
    console.log(' Encriptando contraseñas...');
    const hashedPassword1 = await bcrypt.hash('santi123', 10);
    const hashedPassword2 = await bcrypt.hash('ana123', 10);
    console.log('Contraseñas encriptadas');

    // Crear usuarios con contraseñas YA encriptadas
    console.log('Creando usuario 1...');
    const user1 = await User.create({
      nombre: 'Santiago Hurtado',
      alias: 'santi',
      email: 'santiago@example.com',
      contraseña: hashedPassword1
    });
    console.log('Usuario 1 creado:', user1.alias);

    console.log('Creando usuario 2...');
    const user2 = await User.create({
      nombre: 'Anita',
      alias: 'ana',
      email: 'ana@example.com',
      contraseña: hashedPassword2
    });
    console.log('Usuario 2 creado:', user2.alias);

    const users = [user1, user2];
    console.log('Usuarios creados con contraseñas encriptadas');

    // Crear tareas de prueba para Santiago
    await Task.bulkCreate([
      {
        text: 'Completar el backend de la aplicación',
        completed: false,
        userId: users[0].id
      },
      {
        text: 'Configurar base de datos MySQL',
        completed: true,
        userId: users[0].id
      },
      {
        text: 'Implementar autenticación JWT',
        completed: false,
        userId: users[0].id
      }
    ]);

    // Crear tareas de prueba para Ana
    await Task.bulkCreate([
      {
        text: 'Revisar documentación',
        completed: false,
        userId: users[1].id
      },
      {
        text: 'Testear la aplicación',
        completed: false,
        userId: users[1].id
      }
    ]);

    console.log('Tareas creadas');
    console.log(' Seed completado exitosamente!');
    console.log('\n Usuarios de prueba:');
    console.log('   Usuario: santi | Contraseña: santi123');
    console.log('   Usuario: ana   | Contraseña: ana123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
};

seedDatabase();
