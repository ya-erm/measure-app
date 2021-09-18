export const saveSvg = function (svg: SVGSVGElement) {
    var clone = svg.cloneNode(true);
    var svgDocType = document.implementation.createDocumentType(
        'svg',
        '-//W3C//DTD SVG 1.1//EN',
        'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd',
    );
    var svgDoc = document.implementation.createDocument(
        'http://www.w3.org/2000/svg',
        'svg',
        svgDocType,
    );
    svgDoc.replaceChild(clone, svgDoc.documentElement);
    var svgData = new XMLSerializer().serializeToString(svgDoc);

    downloadFile(
        svgData.replace(/></g, '>\n\r<'),
        `Plan ${new Date().toLocaleDateString()}.svg`,
        'image/svg+xml',
    );
};

export function downloadFile(content: any, fileName: string, contentType: string) {
    var a = document.createElement('a');
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    a.remove();
}

export function uploadFile(onLoad: (result?: string | null) => void) {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = (readerEvent) => {
            const content = readerEvent.target?.result as string | null;
            onLoad(content);
        };
    };
    input.click();
}
