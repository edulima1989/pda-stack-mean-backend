import { z } from 'zod';

const employeeFields = {
    nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
    cargo: z.string().trim().min(1, 'El cargo es obligatorio'),
    departamento: z.string().trim().min(1, 'El departamento es obligatorio'),
    sueldo: z.number().positive('El sueldo debe ser mayor que cero')
};

export const createEmployeeSchema = z.object(employeeFields).strict();

export const updateEmployeeSchema = createEmployeeSchema.partial().refine(
    (employee) => Object.keys(employee).length > 0,
    'Debe enviar al menos un campo para actualizar'
);

export const employeeParamsSchema = z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'El id debe ser un ObjectId válido')
}).strict();

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;