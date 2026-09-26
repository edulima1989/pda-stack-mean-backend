export interface IEmployeeRepository {
    getAllEmployees(): Promise<any[]>;
    createEmployee(employeeData: any): Promise<any>;
    getEmployeeById(employeeId: string): Promise<any>;
    updateEmployee(employeeId: string, employeeData: any): Promise<void>;
    deleteEmployee(employeeId: string): Promise<void>;
}
