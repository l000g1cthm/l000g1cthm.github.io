document.addEventListener('DOMContentLoaded', function() {
    // Initialize Mermaid
    mermaid.initialize({ startOnLoad: false });

    // Function to handle saving content as a file
    function saveContentToFile(editor) {
        const filename = prompt("Enter the filename (without extension):", "markdown");
        if (filename) {
            const content = editor.value();
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = filename + ".md";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }


    // Initialize EasyMDE
    var easyMDE = new EasyMDE({
        element: document.getElementById('markdown'),
        autoDownloadFontAwesome: true,
        spellChecker: false,
        maxHeight: '600px',
        placeholder: 'Enter Markdown here...',
        promptURLs: true,
        status: false,
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
        },
        toolbar: ["bold", "italic", "heading", "|", "quote", "code", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen",
        {
            name: "save",
            action: function(editor) {
                saveContentToFile(editor);
            },
            className: "fa fa-save",
            title: "Save Content",
        }
        ],
    });

    // Function to update the output
    function updateOutput() {
        // Get raw Markdown from EasyMDE
        const rawMarkdown = easyMDE.value();

        // Convert Markdown to HTML
        const renderedHTML = marked.parse(rawMarkdown);
        document.getElementById('htmlOutput').innerHTML = renderedHTML;

        // Process Mermaid diagrams
        processMermaidDiagrams();
    }

    // Process Mermaid Diagrams
    function processMermaidDiagrams() {
        document.querySelectorAll('.language-mermaid').forEach(function(mermaidBlock) {
            const mermaidContent = mermaidBlock.textContent;
            const mermaidDiv = document.createElement('div');
            mermaidBlock.parentNode.replaceChild(mermaidDiv, mermaidBlock);
            mermaid.render('mermaid' + Date.now(), mermaidContent, function(svgCode) {
                mermaidDiv.innerHTML = svgCode;
            });
        });
    }

    // Listen for changes in EasyMDE and update output
    easyMDE.codemirror.on("change", updateOutput);

    // Initial call to render content on page load
    updateOutput();

    // Copy to clipboard functionality
    document.getElementById('copyButton').addEventListener('click', function() {
        const outputHTML = document.getElementById('htmlOutput').innerHTML;
        navigator.clipboard.writeText(outputHTML).then(() => {
            alert('HTML copied to clipboard!');
        }).catch(err => {
            console.error('Error copying HTML to clipboard', err);
        });
    });
});
