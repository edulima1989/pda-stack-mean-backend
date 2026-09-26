import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import empleadosRouter from './routes/empleados.routes.js';
import { errorHandler } from './middlewares/error-handler.js';
import { swaggerSpec } from './config/swagger.js';


const app = express();
app.use(express.json());
//app.use(cors());

//settings
app.set('puerto',process.env.PORT|| 3000);
app.set('nombreApp','Gestión de empleados');
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', empleadosRouter);
app.use(errorHandler);

export default app;