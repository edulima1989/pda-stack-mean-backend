import type { Request, Response } from 'express';
import type { IEmployeeRepository } from '../repositories/employee.repository.interface.js';
import { AppError } from '../middlewares/error-handler.js';
import { sendSuccess } from '../utils/response.js';

export class EmployeeController {

    constructor(private employeeRepository: IEmployeeRepository) {}

    async getAllEmpleados(req: Request, res: Response) {
        const empleados = await this.employeeRepository.getAllEmployees();
        return sendSuccess(res, 200, empleados);
    }

    async getEmpleado(req: Request<{ id: string }>, res: Response) {
        const empleado = await this.employeeRepository.getEmployeeById(req.params.id);

        if (!empleado) {
            throw new AppError(404, 'Empleado no encontrado');
        }

        return sendSuccess(res, 200, empleado);
    }

    async addEmpleado(req: Request, res: Response) {
        const empleado = await this.employeeRepository.createEmployee(req.body);
        return sendSuccess(res, 201, empleado, 'Empleado guardado');
    }

    async updateEmpleado(req: Request<{ id: string }>, res: Response) {
        await this.employeeRepository.updateEmployee(req.params.id, req.body);
        return sendSuccess(res, 200, null, 'Empleado actualizado');
    }

    async deleteEmpleado(req: Request<{ id: string }>, res: Response) {
        await this.employeeRepository.deleteEmployee(req.params.id);
        return sendSuccess(res, 200, null, 'Empleado eliminado');
    }

}


