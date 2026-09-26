import type { EmployeeRepositoryInterface } from './employee.repository.interface.js';
import EmployeeModel from '../models/empleado.js';

export class MongoEmployeeRepository implements EmployeeRepositoryInterface {
    async createEmployee(employeeData: any): Promise<any> {
        const employee = new EmployeeModel(employeeData);
        await employee.save();
        // Implement the logic to create an employee in MongoDB
        return employee;
    }

    async getEmployeeById(employeeId: string): Promise<any> {
        
        const employee = await EmployeeModel.findById(employeeId);
        // Implement the logic to get an employee by ID from MongoDB
        return employee;
    }

    async updateEmployee(employeeId: string, employeeData: any): Promise<void> {
        await EmployeeModel.findByIdAndUpdate(employeeId, employeeData);
        // Implement the logic to update an employee in MongoDB
    }

    async getAllEmployees(): Promise<any[]> {
        const employees = await EmployeeModel.find();
        // Implement the logic to get all employees from MongoDB
        return employees;
    }

    async deleteEmployee(employeeId: string): Promise<void> {
        await EmployeeModel.findByIdAndDelete(employeeId);
        // Implement the logic to delete an employee from MongoDB
    }
}