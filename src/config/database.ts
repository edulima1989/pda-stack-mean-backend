// src/config/database.ts
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('La variable de entorno MONGO_URI no está configurada');
    }

    await mongoose.connect(mongoUri);
    console.log('🔄 [Database]: Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error crítico al conectar a la base de datos:', error);
    process.exit(1);
  }
};
    