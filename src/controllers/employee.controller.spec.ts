import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EmployeeController } from './employee.controller.js';
import type { IEmployeeRepository } from '../repositories/employee.repository.interface.js';
import { createEmployeeSchema } from '../dtos/employee.dto.js';
import { validate } from '../middlewares/validate.js';
import { errorHandler } from '../middlewares/error-handler.js';
import { z } from 'zod';
describe('🧪 Unit Test: EmployeeController (Mantenibilidad & Testabilidad)', () => {
 let controller: EmployeeController;
 let mockRepository: jest.Mocked<IEmployeeRepository>;
 let mockRequest: Partial<Request>;
 let mockResponse: Partial<Response>;
 let statusMock: jest.Mock;
 let jsonMock: jest.Mock;
 beforeEach(() => {
 // 1. Crear un Mock 100% aislado de la interfaz (Cero dependencia de Mongoose)
 mockRepository = {
 getAllEmployees: jest.fn(),
 createEmployee: jest.fn(),
 getEmployeeById: jest.fn(),
 updateEmployee: jest.fn(),
 deleteEmployee: jest.fn(),
 };
 controller = new EmployeeController(mockRepository);
 // 2. Mockear los objetos del ciclo de vida de Express
 jsonMock = jest.fn();
 statusMock = jest.fn().mockReturnValue({ json: jsonMock });
 mockResponse = { status: statusMock as Response['status'] };
 });
 it('Debería retornar un estado 200 y la lista de empleados de la abstracción', async () => {
 const fakeEmployees = [
 { nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4000 }
 ];

 // Configurar el comportamiento esperado de la abstracción
 mockRepository.getAllEmployees.mockResolvedValue(fakeEmployees);
 mockRequest = {};
 await controller.getAllEmpleados(mockRequest as Request, mockResponse as Response);
 // Verificaciones asertivas del contrato
 expect(statusMock).toHaveBeenCalledWith(200);
 expect(jsonMock).toHaveBeenCalledWith({ success: true, data: fakeEmployees });
 expect(mockRepository.getAllEmployees).toHaveBeenCalledTimes(1);
 });

 it('Debería retornar un empleado por su id', async () => {
 const fakeEmployee = { nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4000 };
 mockRepository.getEmployeeById.mockResolvedValue(fakeEmployee);
 mockRequest = { params: { id: 'employee-1' } };

 await controller.getEmpleado(mockRequest as Request<{ id: string }>, mockResponse as Response);

 expect(statusMock).toHaveBeenCalledWith(200);
 expect(jsonMock).toHaveBeenCalledWith({ success: true, data: fakeEmployee });
 expect(mockRepository.getEmployeeById).toHaveBeenCalledWith('employee-1');
 });

 it('Debería devolver un error 404 cuando el empleado no existe', async () => {
 mockRepository.getEmployeeById.mockResolvedValue(null);
 mockRequest = { params: { id: 'missing-employee' } };

 await expect(
 controller.getEmpleado(mockRequest as Request<{ id: string }>, mockResponse as Response)
 ).rejects.toMatchObject({ statusCode: 404, message: 'Empleado no encontrado' });
 expect(mockRepository.getEmployeeById).toHaveBeenCalledWith('missing-employee');
 });

 it('Debería crear un empleado y retornar un estado 201', async () => {
 const employeeData = { nombre: 'Lucía Torres', cargo: 'Analista', departamento: 'Finanzas', sueldo: 3500 };
 const createdEmployee = { id: 'employee-2', ...employeeData };
 mockRepository.createEmployee.mockResolvedValue(createdEmployee);
 mockRequest = { body: employeeData };

 await controller.addEmpleado(mockRequest as Request, mockResponse as Response);

 expect(statusMock).toHaveBeenCalledWith(201);
 expect(jsonMock).toHaveBeenCalledWith({
 success: true,
 data: createdEmployee,
 message: 'Empleado guardado'
 });
 expect(mockRepository.createEmployee).toHaveBeenCalledWith(employeeData);
 });

 it('Debería actualizar un empleado', async () => {
 const employeeData = { cargo: 'Líder técnico', sueldo: 5000 };
 mockRepository.updateEmployee.mockResolvedValue();
 mockRequest = { params: { id: 'employee-3' }, body: employeeData };

 await controller.updateEmpleado(mockRequest as Request<{ id: string }>, mockResponse as Response);

 expect(statusMock).toHaveBeenCalledWith(200);
 expect(jsonMock).toHaveBeenCalledWith({
 success: true,
 data: null,
 message: 'Empleado actualizado'
 });
 expect(mockRepository.updateEmployee).toHaveBeenCalledWith('employee-3', employeeData);
 });

 it('Debería eliminar un empleado', async () => {
 mockRepository.deleteEmployee.mockResolvedValue();
 mockRequest = { params: { id: 'employee-4' } };

 await controller.deleteEmpleado(mockRequest as Request<{ id: string }>, mockResponse as Response);

 expect(statusMock).toHaveBeenCalledWith(200);
 expect(jsonMock).toHaveBeenCalledWith({
 success: true,
 data: null,
 message: 'Empleado eliminado'
 });
 expect(mockRepository.deleteEmployee).toHaveBeenCalledWith('employee-4');
 });

 it('Debería devolver un error cuando el sueldo contiene letras', () => {
 const nextMock = jest.fn();
 const request = {
 body: {
 nombre: 'Andrés Mendoza',
 cargo: 'Arquitecto',
 departamento: 'TI',
 sueldo: 'letras'
 }
 } as Request;

 validate({ body: createEmployeeSchema })(request, mockResponse as Response, nextMock);

 expect(nextMock).toHaveBeenCalledWith(expect.any(z.ZodError));
 const validationError = nextMock.mock.calls[0]?.[0] as z.ZodError;
 expect(validationError.issues[0]).toEqual(expect.objectContaining({
 path: ['sueldo'],
 message: 'Invalid input: expected number, received string'
 }));
 errorHandler(validationError, request, mockResponse as Response, jest.fn());
 expect(statusMock).toHaveBeenCalledWith(400);
 expect(mockRepository.createEmployee).not.toHaveBeenCalled();
 });
});
