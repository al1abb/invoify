# Invoify

Invoify is a web-based invoice generator application built with Next.js 13, TypeScript, React, and the Shadcn UI library. It provides an easy way to create and manage professional invoices for your business.

## Table of Contents

- [Invoify](#invoify)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Demo](#demo)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)

## Features

- **Easily Create Invoices:** Utilize a simple form to quickly generate invoices.
- **Save for Future Access:** Store your invoices directly in your browser for easy retrieval.
- **Retrieve Invoices Effortlessly:** Load and access invoices seamlessly from your saved list.
- **Flexible Download Options:** Download invoices directly or send them via email in PDF format.
- **Template Variety:** Choose from multiple (currently 2) invoice templates.
- **Live Preview:** Edit the form and see changes in real-time with the live preview feature.
- **Export in Various Formats:** Export invoices in different formats, including JSON, XLSX, CSV, and XML.

## Demo

Visit the [live demo](https://invoify.vercel.app) to see Invoify in action.

> **Note**
> Please be aware that there is a known issue with Puppeteer and PDF generation in the current demo. You can find more information and updates on this issue [here](https://github.com/aliabb01/invoify/issues/4).

## Getting Started

Follow these instructions to get Invoify up and running on your local machine.

### Prerequisites

- Node.js and npm installed on your system.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aliabb01/invoify.git
   cd invoify
2. Install dependencies
   
   ```bash
   npm install
3. Create an .env.local file with this content (This step is for sending pdf to email feature):
   ```env
   NODEMAILER_EMAIL=your_email@example.com
   NODEMAILER_PW=your_email_password
4. Start development server

    ```bash
    npm run dev
5. Open your web browser and access the application at
    
    ```
    http://localhost:3000