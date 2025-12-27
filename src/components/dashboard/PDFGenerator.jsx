import { jsPDF } from 'jspdf';
import { Button } from '../ui';

export default function PDFGenerator({ menu }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(menu.name, 20, yPosition);
    yPosition += 10;

    if (menu.description) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(menu.description, 20, yPosition);
      yPosition += 10;
    }

    yPosition += 5;

    // Sections
    menu.sections
      .filter(section => section.isActive)
      .forEach(section => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        // Section Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(section.name, 20, yPosition);
        yPosition += 8;

        if (section.description) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.text(section.description, 20, yPosition);
          yPosition += 6;
        }

        // Dishes
        section.items
          .filter(item => item.isActive)
          .forEach(dish => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(dish.name, 25, yPosition);

            // Price
            doc.setFont('helvetica', 'normal');
            const priceText = `$${dish.price.toFixed(2)}`;
            const priceWidth = doc.getTextWidth(priceText);
            doc.text(priceText, 190 - priceWidth, yPosition);

            yPosition += 5;

            // Description
            if (dish.description) {
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              const splitDescription = doc.splitTextToSize(dish.description, 150);
              doc.text(splitDescription, 25, yPosition);
              yPosition += splitDescription.length * 4;
            }

            // Discount
            if (dish.discount > 0) {
              doc.setFontSize(9);
              doc.setTextColor(220, 38, 38);
              doc.text(`-${dish.discount}% descuento`, 25, yPosition);
              doc.setTextColor(0, 0, 0);
              yPosition += 4;
            }

            yPosition += 4;
          });

        yPosition += 5;
      });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Página ${i} de ${pageCount}`, 180, 287);
    }

    // Download
    doc.save(`${menu.name.replace(/\s+/g, '_')}_menu.pdf`);
  };

  return (
    <Button variant="outline" onClick={generatePDF}>
      📄 Descargar PDF
    </Button>
  );
}
