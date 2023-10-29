/* =========================
   * Navigation
   ========================= */
import BaseNavbar from "./navigation/BaseNavbar";
import BaseFooter from "./navigation/BaseFooter";

/* =========================
   * Invoice
   ========================= */
import InvoiceMain from "./invoice/InvoiceMain";
import InvoiceForm from "./invoice/InvoiceForm";
import InvoiceActions from "./invoice/InvoiceActions";

/* =========================
   * Invoice components
   ========================= */
// Form
// Form / Components
import SingleItem from "./invoice/components/form/components/SingleItem";

// Form / Components / Wizard
import WizardNavigation from "./invoice/components/form/components/wizard/WizardNavigation";
import WizardStep from "./invoice/components/form/components/wizard/WizardStep";
import WizardProgress from "./invoice/components/form/components/wizard/WizardProgress";

// Form / Sections
import BillFromSection from "./invoice/components/form/sections/BillFromSection";
import BillToSection from "./invoice/components/form/sections/BillToSection";
import InvoiceDetails from "./invoice/components/form/sections/InvoiceDetails";
import Items from "./invoice/components/form/sections/Items";
import PaymentInformation from "./invoice/components/form/sections/PaymentInformation";
import InvoiceSummary from "./invoice/components/form/sections/InvoiceSummary";

// Form / Sections / Footer
import Charges from "./invoice/components/form/components/Charges";

// Actions
import PdfViewer from "./invoice/components/actions/PdfViewer";

// Custom Selectors
import CurrencySelector from "./form-fields/CurrencySelector";
import SavedInvoicesList from "./modals/invoice/components/SavedInvoicesList";

// Form fields
import InputFormField from "./form-fields/InputFormField";
import DatePickerFormField from "./form-fields/DatePickerFormField";
import FileFormField from "./form-fields/FileFormField";
import ChargeInput from "./form-fields/ChargeInput";
import CustomInputField from "./form-fields/CustomInputField";

// Reusable components
import BaseButton from "./reusables/BaseButton";

/* =========================
   * Modals & Alerts
   ========================= */
import SendPdfToEmailModal from "./modals/email/SendPdfToEmailModal";

// Import/Export
import InvoiceLoaderModal from "./modals/invoice/InvoiceLoaderModal";
import InvoiceExportModal from "./modals/invoice/InvoiceExportModal";

// Signature
import SignatureModal from "./modals/signature/SignatureModal";

// Signature / Tabs
import DrawSignature from "./modals/signature/tabs/DrawSignature";
import TypeSignature from "./modals/signature/tabs/TypeSignature";
import UploadSignature from "./modals/signature/tabs/UploadSignature";

// Signature / Components
import SignatureColorSelector from "./modals/signature/components/SignatureColorSelector";
import SignatureFontSelector from "./modals/signature/components/SignatureFontSelector";

// Alerts
import NewInvoiceAlert from "./modals/alerts/NewInvoiceAlert";

/* =========================
   * Templates
   ========================= */
// Invoice templates
import InvoiceTemplate from "./templates/invoice-pdf/InvoiceTemplate";

// Email templates
import SendPdfEmail from "./templates/email/SendPdfEmail";

/* =========================
   ? DEV ONLY
   ========================= */
import DevDebug from "./dev/DevDebug";

export {
    BaseNavbar,
    BaseFooter,
    InvoiceMain,
    InvoiceForm,
    InvoiceActions,
    BillFromSection,
    BillToSection,
    InvoiceDetails,
    Items,
    SingleItem,
    WizardNavigation,
    WizardStep,
    WizardProgress,
    PaymentInformation,
    InvoiceSummary as InvoiceFooter,
    Charges,
    CurrencySelector,
    SavedInvoicesList,
    PdfViewer,
    InputFormField,
    DatePickerFormField,
    FileFormField,
    ChargeInput,
    CustomInputField,
    BaseButton,
    SendPdfToEmailModal,
    InvoiceLoaderModal,
    InvoiceExportModal,
    SignatureModal,
    DrawSignature,
    TypeSignature,
    UploadSignature,
    SignatureColorSelector,
    SignatureFontSelector,
    NewInvoiceAlert,
    InvoiceTemplate,
    SendPdfEmail,
    DevDebug,
};
