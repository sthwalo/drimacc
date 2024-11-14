import jsPDF from 'jspdf';

class PDFDocument {
    constructor() {
        this.doc = new jsPDF();
    }

    header() {
        this.doc.setFont('Arial', 'bold');
        this.doc.setFontSize(12);
        this.doc.text('ABM Dynamic Solutions - Financial Statements for the Year Ended 28 February 2023', this.doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
    }

    footer() {
        this.doc.setFont('Arial', 'italic');
        this.doc.setFontSize(8);
        const pageNumber = this.doc.internal.getNumberOfPages();
        this.doc.text(`Page ${pageNumber}`, this.doc.internal.pageSize.getWidth() / 2, this.doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    chapterTitle(num, label) {
        this.doc.setFont('Arial', 'bold');
        this.doc.setFontSize(12);
        this.doc.text(`${num}. ${label}`, 10, this.doc.internal.pageSize.getHeight() / 2);
        this.doc.addPage();
    }

    chapterBody(body) {
        this.doc.setFont('Arial', 'normal');
        this.doc.setFontSize(12);
        this.doc.text(body, 10, this.doc.internal.pageSize.getHeight() / 2 + 20, { maxWidth: 190 });
    }

    save(filename) {
        this.doc.save(filename);
    }
}

const pdf = new PDFDocument();
pdf.header();
pdf.footer();

// Introduction and accounting policies
pdf.chapterTitle(1, "Summary of Significant Accounting Policies");
// spell-checker:disable
const policies = `
Basis of Preparation: The financial statements have been prepared in accordance with the South African Statements of Generally Accepted Accounting Practices (GAAP) and the Companies Act of South Africa.
Revenue Recognition: Revenue is recognized to the extent that it is probable that the economic benefits will flow to the company and the revenue can be reliably measured.
Expenses: Expenses are recognized on an accrual basis.
`;
// spell-checker:enable
pdf.chapterBody(policies);

// Revenue
pdf.chapterTitle(2, "Revenue");
pdf.chapterBody("The company's revenue streams include various services provided to clients, with total income for the year amounting to ZAR 364,848.60.");

// Expenses
pdf.chapterTitle(3, "Expenses");
pdf.chapterBody("Total expenses for the year were ZAR 369,741.19. This includes an additional ZAR 20,191.54 allocated to miscellaneous expenses.");

// Net Loss
pdf.chapterTitle(4, "Net Loss");
pdf.chapterBody("The company incurred a net loss of ZAR 4,892.59 for the fiscal year.");

// Cash and Cash Equivalents
pdf.chapterTitle(5, "Cash and Cash Equivalents");
pdf.chapterBody("Cash at the end of the year was ZAR 15,289.79, held entirely in the company's bank account.");

// Equity and Liabilities
pdf.chapterTitle(6, "Equity and Liabilities");
pdf.chapterBody("The closing equity of the company was ZAR -4,901.75. This negative balance in equity is due to the net loss for the year combined with the total drawings.");

// Going Concern
pdf.chapterTitle(7, "Going Concern");
pdf.chapterBody("Given the negative equity and the operational challenges indicated by the net loss, there is substantial doubt about the company's ability to continue as a going concern.");

// Save the PDF to a file
const pdfFile = "/path/to/ABM_Dynamic_Solutions_Financial_Statements_2023_Corrected.pdf";
pdf.save(pdfFile);