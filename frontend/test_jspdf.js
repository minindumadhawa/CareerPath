const { jsPDF } = require('jspdf');
const doc = new jsPDF();
doc.text('CERTIFICATE OF COMPLETION', 105, 10, { align: 'center', charSpace: 3 });
doc.save('test.pdf');
