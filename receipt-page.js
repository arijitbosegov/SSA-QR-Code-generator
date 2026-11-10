function setButtons(disabled) {
  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = disabled;
  });
}

async function getPdf(file, saveAs) {
  var msg = document.getElementById('msg');
  setButtons(true);
  try {
    msg.textContent = 'Preparing your document...';
    var response = await fetch(file);
    if (!response.ok) throw new Error('PDF is not available yet');
    var bytes = await response.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
    var font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
    var stamp = 'Downloaded: ' + new Date().toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit',
      minute: '2-digit', second: '2-digit'
    });
    doc.getPages().forEach(function (page) {
      page.drawText(stamp, {
        x: 20, y: 15, size: 9, font: font,
        color: PDFLib.rgb(0.3, 0.3, 0.3)
      });
    });
    var blob = new Blob([await doc.save()], { type: 'application/pdf' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = saveAs;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    msg.textContent = 'Downloaded ' + saveAs;
  } catch (error) {
    msg.textContent = 'Error, please try again: ' + error.message;
  } finally {
    setButtons(false);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('title').textContent = RECEIPT_PAGE.title;
  RECEIPT_PAGE.receipts.forEach(function (receipt) {
    var button = document.createElement('button');
    button.textContent = receipt.label;
    button.onclick = function () { getPdf(receipt.file, receipt.saveAs); };
    document.getElementById('receipts').appendChild(button);
  });
});
