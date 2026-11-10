function setButtons(disabled) {
  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = disabled;
  });
}

function formatDateTime() {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit',
    minute: '2-digit', second: '2-digit', hour12: true
  });
}

function downloadStampedReceipt(receipt) {
  var image = new Image();
  image.onload = function () {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    context.drawImage(image, 0, 0);

    var fontSize = Math.max(22, Math.round(canvas.width * 0.04));
    var stampY = Math.round(canvas.height * (receipt.stampYRatio || 0.025));
    context.font = 'bold ' + fontSize + 'px Georgia, serif';
    context.fillStyle = '#9b1c1c';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText('Date & Time: ' + formatDateTime(), canvas.width / 2, stampY);

    canvas.toBlob(function (blob) {
      if (!blob) {
        setButtons(false);
        return;
      }
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = receipt.saveAs;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      setButtons(false);
    }, 'image/jpeg', 0.95);
  };
  image.onerror = function () {
    setButtons(false);
  };
  image.src = receipt.file + '?v=2';
}

document.addEventListener('DOMContentLoaded', function () {
  var title = document.getElementById('title');
  if (title) title.textContent = RECEIPT_PAGE.title;
  RECEIPT_PAGE.receipts.forEach(function (receipt) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = receipt.label;
    button.onclick = function () {
      setButtons(true);
      downloadStampedReceipt(receipt);
    };
    document.getElementById('receipts').appendChild(button);
  });
});
