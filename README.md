# LexiQ - AI-Powered Contract Analysis

This is a Next.js application that uses Genkit and Google's Gemini models to provide AI-powered analysis of legal contracts.

## How It Works

The application provides a simple interface for users to upload a contract in PDF format. The AI then analyzes the document and presents a detailed breakdown of its clauses and potential risks.

### The Process Flow

1.  **File Upload**: The user uploads a contract document via a drag-and-drop interface or a file selector on the main page. The frontend only accepts files in PDF format.

2.  **Data Extraction (AI Flow 1)**: The uploaded PDF is sent to a Genkit AI flow (`identifyContractClauses`). This flow uses a multimodal model to read the PDF and identify key legal clauses within it, such as "Termination," "Liability," "Payment Terms," etc. It extracts the text content of each identified clause.

3.  **Risk Assessment (AI Flow 2)**: The text from the extracted clauses is then passed to a second Genkit AI flow (`assessContractRisk`). This flow prompts an AI model to analyze the language of the clauses for potential legal risks. It categorizes each risk with a severity level: `low`, `medium`, or `high`.

4.  **Displaying Results**: The application's frontend receives both the identified clauses and the risk assessment. The results are displayed in a user-friendly tabbed interface:
    *   **Risk Assessment**: This tab lists all identified risks, explaining the potential issue and its severity.
    *   **Identified Clauses**: This tab shows all the clauses extracted from the document, categorized by type.

5.  **Reporting**: The user has the option to download or print a formatted report of the complete analysis.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **AI**: [Genkit](https://firebase.google.com/docs/genkit) with Google Gemini
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
