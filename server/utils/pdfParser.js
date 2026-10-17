const pdfParse = require("pdf-parse");

const extractTextFromPDF = async (pdfBuffer) => {
    if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
        throw new Error("Invalid PDF file.");
    }

    try {
        let text = "";

        // pdf-parse v2
        if (pdfParse.PDFParse) {
            const parser = new pdfParse.PDFParse({
                data: pdfBuffer,
            });

            const result = await parser.getText();

            text = result.text?.trim() || "";

            await parser.destroy();
        }

        // pdf-parse v1
        else if (typeof pdfParse === "function") {
            const result = await pdfParse(pdfBuffer);

            text = result.text?.trim() || "";
        }

        else {
            throw new Error(
                "Unsupported pdf-parse version or API."
            );
        }

        if (!text) {
            throw new Error(
                "Could not extract text from the PDF."
            );
        }

        return text;
    } catch (error) {
        console.error(
            "PDF Text Extraction Error:",
            error
        );

        if (
            error.message ===
            "Could not extract text from the PDF."
        ) {
            throw error;
        }

        throw new Error(
            "Failed to extract text from resume PDF."
        );
    }
};

module.exports = {
    extractTextFromPDF,
};