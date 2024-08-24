document.getElementById('fileInput').addEventListener('change', handleFileSelect);
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file.type === 'application/pdf') {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const typedArray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
                let pagesPromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    pagesPromises.push(pdf.getPage(i).then(page => {
                        return page.getTextContent().then(textContent => {
                            let textItems = textContent.items.map(item => item.str).join(' ');
                            return textItems;
                        });
                    }));
                }
                Promise.all(pagesPromises).then(pagesText => {
                    document.getElementById('output').textContent = pagesText.join('\n');
                });
            });
        };
        fileReader.readAsArrayBuffer(file);
    } else {
        alert('Please upload a PDF file.');
    }
}
