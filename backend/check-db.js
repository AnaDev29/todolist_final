import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  let connection;
  try {
    console.log('Conectando a MySQL...\n');
    console.log('Host:', process.env.DB_HOST || 'localhost');
    console.log('User:', process.env.DB_USER || 'root');
    console.log('Database:', process.env.DB_NAME || 'todolist_db');
    console.log('');

    // Conectar a MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'todolist_db'
    });

    console.log(' CONECTADO A MYSQL\n');

    // Verificar si las tablas existen
    console.log('Verificando tablas...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tablas encontradas:', tables);
    console.log('');

    // Contar usuarios
    console.log('Contando usuarios en la tabla Users...');
    try {
      const [users] = await connection.query('SELECT COUNT(*) as count FROM Users');
      console.log('Total usuarios:', users[0].count);
      
      // Mostrar todos los usuarios
      const [allUsers] = await connection.query('SELECT id, nombre, alias, email FROM Users');
      console.log('\n Lista de usuarios:');
      allUsers.forEach(user => {
        console.log(`   - ID: ${user.id}, Alias: ${user.alias}, Nombre: ${user.nombre}, Email: ${user.email}`);
      });
    } catch (error) {
      console.log(' Error al consultar Users:', error.message);
    }

    console.log('');

    // Contar tareas
    console.log('Contando tareas en la tabla Tasks...');
    try {
      const [tasks] = await connection.query('SELECT COUNT(*) as count FROM Tasks');
      console.log(' Total tareas:', tasks[0].count);
    } catch (error) {
      console.log(' Error al consultar Tasks:', error.message);
    }

    await connection.end();
    console.log('\n Verificación completada\n');
  } catch (error) {
    console.error('\nERROR DE CONEXIÓN:');
    console.error('Mensaje:', error.message);
    console.error('Código:', error.code);
    console.error('\n Verifica que:');
    console.error('   1. MySQL está corriendo');
    console.error('   2. La base de datos "todolist_db" existe');
    console.error('   3. Las credenciales en .env son correctas\n');
    if (connection) await connection.end();
  }
}

checkDatabase();
