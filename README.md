# Invoizer - Professional Invoice Generator

![Invoizer Logo](/public/assets/img/invoizer-logo.svg)

A modern, feature-rich invoice generator built with Next.js and React that helps businesses and freelancers create professional invoices quickly and efficiently.

## Features

- **🧙‍♂️ User-Friendly Interface**: Create invoices through a step-by-step wizard interface
- **📋 Complete Invoice Management**:
  - Create, save, and modify invoices
  - Bill from/to sections with custom fields
  - Line items with descriptions, quantities, and rates
  - Support for discounts, taxes, shipping, and advance payments
- **🎨 Multiple Invoice Templates**: Choose from various professional invoice designs
- **💱 Currency Support**: Select from a wide range of currencies
- **🌐 Multilingual Support**: Currently supports English and Arabic with an extendable framework
- **🖊️ Digital Signatures**: Draw, type, or upload your signature
- **📤 Export Options**: Export invoices as PDF, JSON, CSV, XML
- **📧 Email Integration**: Send invoices directly via email
- **🌓 Light/Dark Mode**: Switch between light and dark themes
- **📱 Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Framework**: Next.js 13+
- **UI**: React 18, Tailwind CSS, shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: Puppeteer/Chromium
- **Email**: React Email, Nodemailer
- **Internationalization**: next-intl
- **Styling**: Tailwind CSS
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/invoice-generator.git
   cd invoice-generator
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating an Invoice

1. Fill in the "Bill To" information for your client
2. Add invoice details (number, date, due date, etc.)
3. Add line items with descriptions, quantities, and rates
4. Configure additional charges (tax, discount, shipping)
5. Add payment information and terms
6. Optionally add your signature
7. Generate the PDF invoice
8. Download, print, or email your invoice

### Saving and Managing Invoices

- Invoices are automatically saved to your browser's local storage
- Load saved invoices from the invoice loader modal
- Export invoices in various formats (JSON, CSV, XML)
- Import previously exported JSON invoices

## Deployment

You can deploy this application using Vercel, Netlify, or any other platform that supports Next.js:

```
npm run build
npm run start
```

The application is also Dockerized for easy deployment to container platforms:

```
docker build -t invoice-generator .
docker run -p 3000:3000 invoice-generator
```

## Customization

### Adding New Templates

New invoice templates can be added by creating components in the `app/components/templates/invoice-pdf/` directory following the naming convention `InvoiceTemplateX.tsx` where X is the template number.

### Adding New Languages

1. Create a new language file in `i18n/locales/` (copy from existing)
2. Translate all the keys in the new file
3. Add the language to the language selector component

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- The shadcn/ui team for the excellent component library
- The React community for the amazing ecosystem
- All open-source contributors who made this project possible
