// Navigation
import BaseNavbar from "./navigation/BaseNavbar";
import BaseFooter from "./navigation/BaseFooter";

// Invoice
import InvoiceMain from "./invoice/InvoiceMain";
import InvoiceForm from "./invoice/InvoiceForm";
import InvoiceActions from "./invoice/InvoiceActions";

//* Invoice components
// --- Form
// ---/--- Sections
import BillFromSection from "./invoice/components/form/sections/BillFromSection";
import BillToSection from "./invoice/components/form/sections/BillToSection";
import InvoiceDetails from "./invoice/components/form/sections/InvoiceDetails";
import Items from "./invoice/components/form/sections/Items";
import PaymentInformation from "./invoice/components/form/sections/PaymentInformation";
import InvoiceFooter from "./invoice/components/form/sections/InvoiceFooter";

// ---/--- Components
import SingleItem from "./invoice/components/form/SingleItem";

// --- Actions
import PdfViewer from "./invoice/components/actions/PdfViewer";

// Custom Selectors
import CurrencySelector from "./form-fields/CurrencySelector";
import SavedInvoiceSelector from "./invoice/components/form/SavedInvoiceSelector";

// Form fields
import InputFormField from "./form-fields/InputFormField";
import DatePickerFormField from "./form-fields/DatePickerFormField";
import FileFormField from "./form-fields/FileFormField";
import ChargeInput from "./form-fields/ChargeInput";
import CustomInputField from "./form-fields/CustomInputField";

// Reusable components
import BaseButton from "./reusables/BaseButton";

//* Modals
import SendPdfToEmailModal from "./modals/SendPdfToEmailModal";

// --- Alerts
import NewInvoiceAlert from "./modals/alerts/NewInvoiceAlert";

//* Templates
// --- Invoice templates
import InvoiceTemplate from "./templates/invoice-pdf/InvoiceTemplate";

// --- Email templates
import SendPdfEmail from "./templates/email/SendPdfEmail";

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
    PaymentInformation,
    InvoiceFooter,
    CurrencySelector,
    SavedInvoiceSelector,
    PdfViewer,
    InputFormField,
    DatePickerFormField,
    FileFormField,
    ChargeInput,
    CustomInputField,
    BaseButton,
    SendPdfToEmailModal,
    NewInvoiceAlert,
    InvoiceTemplate,
    SendPdfEmail,
};
