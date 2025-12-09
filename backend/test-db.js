import { sequelize } from './src/config/database.js';
import { User, Task } from './src/models/index.js';
import bcrypt from 'bcryptjs';

async function testDatabase() {
  try {
    console.log('Probando conexión a la base de datos...\n');

    // 1. Probar conexión
    await sequelize.authenticate();
    console.log('CONEXIÓN EXITOSA a MySQL\n');

    // 2. Sincronizar tablas
    console.log('Sincronizando tablas...');
    await sequelize.sync({ alter: false });
    console.log('Tablas sincronizadas\n');

    // 3. Contar usuarios existentes
    const userCount = await User.count();
    console.log(`Usuarios existentes en BD: ${userCount}\n`);

    // 4. Crear usuario de prueba
    console.log('Creando usuario de prueba...');
    const hashedPassword = await bcrypt.hash('test123', 10);
    console.log('   Contraseña encriptada:', hashedPassword);

    const testUser = await User.create({
      nombre: 'Usuario Test',
      alias: 'test_' + Date.now(),
      email: 'test' + Date.now() + '@test.com',
      contraseña: hashedPassword
    });

    console.log('USUARIO CREADO EXITOSAMENTE:');
    console.log('   ID:', testUser.id);
    console.log('   Nombre:', testUser.nombre);
    console.log('   Alias:', testUser.alias);
    console.log('   Email:', testUser.email);
    console.log('   Contraseña (hash):', testUser.contraseña.substring(0, 30) + '...\n');

    // 5. Verificar en BD
    const foundUser = await User.findByPk(testUser.id);
    if (foundUser) {
      console.log('VERIFICACIÓN: Usuario encontrado en BD');
      console.log('   Datos:', {
        id: foundUser.id,
        nombre: foundUser.nombre,
        alias: foundUser.alias
      });
    } else {
      console.log('ERROR: Usuario NO encontrado en BD');
    }

    // 6. Contar usuarios después
    const newUserCount = await User.count();
    console.log(`\n Total usuarios en BD ahora: ${newUserCount}`);

    console.log('\n PRUEBA COMPLETADA - LA BASE DE DATOS FUNCIONA CORRECTAMENTE\n');
    process.exit(0);
  } catch (error) {
    console.error('\n ERROR EN LA PRUEBA:');
    console.error('Mensaje:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

testDatabase();
