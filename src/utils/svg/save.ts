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

    var a = document.createElement('a');
    a.href =
        'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
    a.download = `Plan ${new Date().toLocaleDateString()}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
};
