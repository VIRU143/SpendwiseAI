# SpendWise AI

SpendWise AI is a modern, intelligent expense tracking application designed to demonstrate the power of integrating generative AI into a real-world web app. Built with Next.js, TypeScript, and ShadCN for a polished user interface, it leverages Google's Gemini models via Genkit to offer smart features like automatic receipt scanning and expense categorization. This project serves as an excellent portfolio piece to showcase skills in full-stack development and practical AI implementation.

## Features

*   **Manual Expense Entry:** Add, edit, and delete expenses.
*   **AI-Powered Receipt Scanning:** Upload a receipt image, and the AI will automatically extract the total, date, and vendor details.
*   **AI Category Suggestion:** Get smart category suggestions based on your expense notes.
*   **Interactive Dashboard:** Visualize your spending with an interactive chart and a summary of total expenses.
*   **Persistent Storage:** Your expense data is saved in your browser's local storage.

## Running Locally

To get this project running on your local machine, follow these steps.

### 1. Prerequisites

*   **Node.js:** Make sure you have Node.js version 18 or later installed. You can download it from [nodejs.org](https://nodejs.org/).
*   **Git:** You'll need Git to clone the repository.

### 2. Get a Google AI API Key

The AI features in this app are powered by Google's Gemini models. You'll need a free API key to use them.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click **"Create API key in new project"**.
3.  Copy the generated API key.

### 3. Setup Project

1.  **Clone the Repository:** If you've uploaded the project to your GitHub, clone it.
    ```bash
    git clone <YOUR_GITHUB_REPO_URL>
    cd <your-project-folder>
    ```

2.  **Install Dependencies:** This command will install all the necessary packages for the project.
    ```bash
    npm install
    ```

3.  **Create Environment File:** Create a new file named `.env.local` in the root of your project folder. Add your Google AI API key to it like this:
    ```
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```
    Replace `YOUR_API_KEY_HERE` with the key you copied from Google AI Studio.

### 4. Run the Development Servers

This project requires two separate processes to run simultaneously in two different terminal windows.

*   **In your first terminal**, run the Next.js app:
    ```bash
    npm run dev
    ```
    This will start the user interface. You can access it at `http://localhost:9002`.

*   **In your second terminal**, run the Genkit AI server:
    ```bash
    npm run genkit:watch
    ```
    This starts the AI backend that your app communicates with. It will automatically restart if you make changes to the AI flow files.

Now you're all set! Your app should be running locally, fully connected to the AI backend.
