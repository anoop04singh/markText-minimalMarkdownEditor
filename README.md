# MarkText: Ultra-Minimal Markdown Text Editor
![image](https://github.com/user-attachments/assets/3095662b-50ca-4c7e-8204-acd6d10bbd17)


A simple and distraction-free markdown text editor with preview and Word document export. This editor prioritizes a clean interface, focusing on your content without unnecessary clutter.

## Features

* **Markdown Preview**: See your markdown formatting applied instantly as you type by clicking on Preview Button.
* **Minimal Interface**: A clean and intuitive design that keeps your focus on writing.
* **Contextual Formatting**: A floating menu appears only when text is selected, offering quick formatting options.
* **Word Document Export**: Easily save your markdown as a `.docx` file.
* **Word and Character Count**: Quickly view the statistics of your document.
* **Markdown Toggle**: Switch between raw markdown editing and formatted preview modes with a single click.
* **Click-to-Edit Preview**: Simply click anywhere on the preview to return to the markdown editing mode.

## Demo

You can try MarkText directly on Vercel:

[**MarkText**](https://marktextbyanoop.vercel.app/)


## How to Use

### Using the Live Demo (Vercel)

1.  Open your web browser.
2.  Navigate to the Vercel deployment link provided above.
3.  Start typing your markdown content in the editor.
4.  Select text to reveal the contextual formatting menu (e.g., for bold, italic).

  ![image](https://github.com/user-attachments/assets/cf39ea8f-7282-49a4-b280-905f4eb02da4)


5.  Click the "Markdown" button in the top toolbar to toggle between markdown source and preview.
   
   ![Screenshot 2025-04-27 193021](https://github.com/user-attachments/assets/86ef8c82-cd3d-4475-b14b-f07f6fc1963a)

6.  Click anywhere on the preview to return to editing mode.
7.  Use the "Save as Word" button to download your document as a `.docx` file.

  ![Screenshot 2025-04-27 193021-1](https://github.com/user-attachments/assets/b829bb49-76fe-460d-bbf9-694e9fd3c66d)

  
8.  The word and character counts are displayed at the bottom.

   ![image](https://github.com/user-attachments/assets/acc51cf6-545d-44dd-be69-0857a3111ebb)


### Local Installation

Follow these steps to run MarkText on your local machine:

1.  **Clone the Repository** (if you have the project in a repository):
    ```bash
    git clone https://github.com/anoop04singh/markText-minimalMarkdownEditor
    cd markText-minimalMarkdownEditor
    ```

2.  **Install Dependencies**:
    This project requires its dependencies to be installed using npm. Due to potential peer dependency issues, it's recommended to use the `--legacy-peer-deps` flag:
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Run the Development Server**:
    Once the dependencies are installed, you can start the local development server using the following npm script:
    ```bash
    npm run dev
    ```

4.  **Access the Editor**:
    After running the development server, open your web browser and navigate to the address provided in your terminal (usually `http://localhost:3000` or a similar address).

Now you can use MarkText locally on your machine.
