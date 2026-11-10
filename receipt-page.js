function setButtons(disabled) {
  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = disabled;
  });
}

function showReceipt(receipt) {
  var preview = document.getElementById('preview');
  var image = document.getElementById('receipt-image');
  var download = document.getElementById('download');

  setButtons(true);
  image.src = receipt.file;
  image.alt = receipt.label;
  download.href = receipt.file;
  download.download = receipt.saveAs;
  download.textContent = 'Download ' + receipt.label;
  preview.hidden = false;
  document.getElementById('msg').textContent = 'Receipt selected.';
  setButtons(false);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('title').textContent = RECEIPT_PAGE.title;
  RECEIPT_PAGE.receipts.forEach(function (receipt) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = receipt.label;
    button.onclick = function () { showReceipt(receipt); };
    document.getElementById('receipts').appendChild(button);
  });
});
