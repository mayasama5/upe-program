import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Badge } from './badge';

export default {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

const sampleData = [
  {
    id: 'INV001',
    student: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    status: 'Activo',
    gpa: '8.5',
  },
  {
    id: 'INV002',
    student: 'María García',
    email: 'maria@ejemplo.com',
    status: 'Inactivo',
    gpa: '9.2',
  },
  {
    id: 'INV003',
    student: 'Carlos López',
    email: 'carlos@ejemplo.com',
    status: 'Activo',
    gpa: '7.8',
  },
  {
    id: 'INV004',
    student: 'Ana Martínez',
    email: 'ana@ejemplo.com',
    status: 'Graduado',
    gpa: '9.5',
  },
];

/**
 * Basic table with student data
 */
export const Default = {
  render: () => (
    <Table>
      <TableCaption>Lista de estudiantes registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Estudiante</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Promedio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleData.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{student.id}</TableCell>
            <TableCell>{student.student}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.status}</TableCell>
            <TableCell className="text-right">{student.gpa}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * Table with badges and footer
 */
export const WithBadgesAndFooter = {
  render: () => (
    <Table>
      <TableCaption>Resumen de estudiantes por estado</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Estudiante</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Promedio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleData.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{student.id}</TableCell>
            <TableCell>{student.student}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>
              <Badge
                variant={
                  student.status === 'Activo'
                    ? 'default'
                    : student.status === 'Graduado'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {student.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{student.gpa}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total de estudiantes</TableCell>
          <TableCell className="text-right">{sampleData.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

/**
 * Simple table without caption
 */
export const WithoutCaption = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead className="text-right">Permisos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Admin</TableCell>
          <TableCell>Administrador</TableCell>
          <TableCell className="text-right">Todos</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Empresa</TableCell>
          <TableCell>Company</TableCell>
          <TableCell className="text-right">Limitados</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Estudiante</TableCell>
          <TableCell>Student</TableCell>
          <TableCell className="text-right">Básicos</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
