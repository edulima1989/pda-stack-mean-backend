import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'API de Gestión de Empleados',
            version: '1.0.0',
            description: 'API REST para administrar empleados.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],
        components: {
            parameters: {
                EmployeeId: {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Identificador MongoDB del empleado',
                    schema: { type: 'string', pattern: '^[a-fA-F\\d]{24}$' },
                    example: '507f1f77bcf86cd799439011'
                }
            },
            responses: {
                BadRequest: {
                    description: 'Datos de solicitud inválidos',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                },
                NotFound: {
                    description: 'Empleado no encontrado',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                }
            },
            schemas: {
                Empleado: {
                    type: 'object',
                    required: ['nombre', 'cargo', 'departamento', 'sueldo'],
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        nombre: { type: 'string', example: 'Andres Mendoza' },
                        cargo: { type: 'string', example: 'Arquitecto de Software' },
                        departamento: { type: 'string', example: 'Innovacion' },
                        sueldo: { type: 'number', format: 'double', example: 4500 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                EmpleadoInput: {
                    type: 'object',
                    required: ['nombre', 'cargo', 'departamento', 'sueldo'],
                    additionalProperties: false,
                    properties: {
                        nombre: { type: 'string', minLength: 1, example: 'Andres Mendoza' },
                        cargo: { type: 'string', minLength: 1, example: 'Arquitecto de Software' },
                        departamento: { type: 'string', minLength: 1, example: 'Innovacion' },
                        sueldo: { type: 'number', exclusiveMinimum: 0, example: 4500 }
                    }
                },
                EmpleadoUpdate: {
                    type: 'object',
                    minProperties: 1,
                    additionalProperties: false,
                    properties: {
                        nombre: { type: 'string', minLength: 1 },
                        cargo: { type: 'string', minLength: 1 },
                        departamento: { type: 'string', minLength: 1 },
                        sueldo: { type: 'number', exclusiveMinimum: 0 }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { nullable: true },
                        message: { type: 'string' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        data: { nullable: true, example: null },
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'string', example: 'VALIDATION_ERROR' },
                                message: { type: 'string' },
                                details: { type: 'array', items: { type: 'object' } }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);