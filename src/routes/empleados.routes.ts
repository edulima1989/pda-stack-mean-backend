import express from 'express';
import { EmployeeController } from '../controllers/employee.controller.js';
import { MongoEmployeeRepository } from '../repositories/mongo-employee.respository.js';
import { createEmployeeSchema, employeeParamsSchema, updateEmployeeSchema } from '../dtos/employee.dto.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();
const empleado = new EmployeeController(new MongoEmployeeRepository());

/**
 * @openapi
 * /api/v1/empleados:
 *   get:
 *     summary: Lista todos los empleados
 *     tags: [Empleados]
 *     responses:
 *       200:
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Empleado'
 */
router.get('/empleados', empleado.getAllEmpleados.bind(empleado));

/**
 * @openapi
 * /api/v1/empleados/{id}:
 *   get:
 *     summary: Obtiene un empleado por su identificador
 *     tags: [Empleados]
 *     parameters:
 *       - $ref: '#/components/parameters/EmployeeId'
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/empleados/:id', validate({ params: employeeParamsSchema }), empleado.getEmpleado.bind(empleado));

/**
 * @openapi
 * /api/v1/empleados:
 *   post:
 *     summary: Crea un empleado
 *     tags: [Empleados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmpleadoInput'
 *     responses:
 *       201:
 *         description: Empleado creado
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/empleados', validate({ body: createEmployeeSchema }), empleado.addEmpleado.bind(empleado));

/**
 * @openapi
 * /api/v1/empleados/{id}:
 *   put:
 *     summary: Actualiza un empleado
 *     tags: [Empleados]
 *     parameters:
 *       - $ref: '#/components/parameters/EmployeeId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmpleadoUpdate'
 *     responses:
 *       200:
 *         description: Empleado actualizado
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.put('/empleados/:id', validate({ params: employeeParamsSchema, body: updateEmployeeSchema }), empleado.updateEmpleado.bind(empleado));

/**
 * @openapi
 * /api/v1/empleados/{id}:
 *   delete:
 *     summary: Elimina un empleado
 *     tags: [Empleados]
 *     parameters:
 *       - $ref: '#/components/parameters/EmployeeId'
 *     responses:
 *       200:
 *         description: Empleado eliminado
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/empleados/:id', validate({ params: employeeParamsSchema }), empleado.deleteEmpleado.bind(empleado));

export default router;