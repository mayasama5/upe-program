import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Exportar a PDF
export const exportToPDF = (data, title, columns) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Fecha
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

  // Tabla
  doc.autoTable({
    head: [columns],
    body: data.map(row => columns.map(col => row[col] || '')),
    startY: 35,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [6, 182, 212], // cyan-500
      textColor: [0, 0, 0]
    }
  });

  // Descargar
  doc.save(`${title.replace(/ /g, '_')}_${Date.now()}.pdf`);
};

// Exportar a Excel
export const exportToExcel = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

  // Auto-ajustar ancho de columnas
  const maxWidth = data.reduce((w, r) => Math.max(w, ...Object.values(r).map(val =>
    String(val).length
  )), 10);

  worksheet['!cols'] = Object.keys(data[0] || {}).map(() => ({ wch: maxWidth }));

  XLSX.writeFile(workbook, `${filename}_${Date.now()}.xlsx`);
};

// Exportar a CSV
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${Date.now()}.csv`;
  link.click();
};
