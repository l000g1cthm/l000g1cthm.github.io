document.addEventListener('DOMContentLoaded', function() {

    mermaid.initialize({ startOnLoad: false });

    const markdownInput = document.getElementById('markdown');
    const outputDiv = document.getElementById('htmlOutput');

    markdownInput.addEventListener('input', function() {
        outputDiv.innerHTML = marked.parse(markdownInput.value);
        processMermaidDiagrams();
    });

    function processMermaidDiagrams() {
        document.querySelectorAll('.language-mermaid').forEach(function(mermaidBlock) {
            const mermaidContent = mermaidBlock.textContent;
            const mermaidDiv = document.createElement('div');

            mermaidBlock.parentNode.replaceChild(mermaidDiv, mermaidBlock);

            mermaid.render('mermaid' + Date.now(), mermaidContent, function(svgCode) {
                mermaidDiv.innerHTML = svgCode;
                //convertSVGToPNG(svgCode, mermaidDiv);
            });
        });
    }

    function convertSVGToPNG(svgCode, container) {
        const svgElement = new DOMParser().parseFromString(svgCode, 'image/svg+xml').querySelector('svg');
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
    
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = svgElement.clientWidth || 600; // Default width
            canvas.height = svgElement.clientHeight || 400; // Default height
            const ctx = canvas.getContext('2d');
    
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url); // Clean up URL
    
            try {
                const pngUrl = canvas.toDataURL('image/png');
                container.innerHTML = '<img src="' + pngUrl + '" alt="Mermaid Diagram">';
            } catch (e) {
            console.error('Error converting SVG to PNG:', e);
            container.innerHTML = '<p>Error converting diagram to image.</p>';
            }
            };
            img.onerror = function() {
                console.error('Error loading SVG as image');
                container.innerHTML = '<p>Error loading diagram.</p>';
            };
            
            img.src = url;
        }            
    
    markdownInput.dispatchEvent(new Event('input'));
});
