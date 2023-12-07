/* =========================
   * Navigation
   ========================= */
import BaseNavbar from "./layout/BaseNavbar";
import BaseFooter from "./layout/BaseFooter";

/* =========================
   * Invoice
   ========================= */
import InvoiceMain from "./invoice/InvoiceMain";
import InvoiceForm from "./invoice/InvoiceForm";
import InvoiceActions from "./invoice/InvoiceActions";

/* =========================
   * Invoice components
   ========================= */
// * Form
// Form / Components
import SingleItem from "./invoice/components/form/components/SingleItem";
import Charges from "./invoice/components/form/components/Charges";
import TemplateSelector from "./invoice/components/form/components/TemplateSelector";

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

// * Actions
import PdfViewer from "./invoice/components/actions/PdfViewer";

// Custom Selectors
import CurrencySelector from "./form-fields/CurrencySelector";
import SavedInvoicesList from "./modals/invoice/components/SavedInvoicesList";

// Form fields
import FormInput from "./form-fields/FormInput";
import FormTextarea from "./form-fields/FormTextarea";
import DatePickerFormField from "./form-fields/DatePickerFormField";
import FormLogoInput from "./form-fields/FormLogoInput";
import ChargeInput from "./form-fields/ChargeInput";
import FormCustomInput from "./form-fields/FormCustomInput";

// Reusable components
import BaseButton from "./reusables/BaseButton";
import ThemeSwitcher from "./reusables/ThemeSwitcher";
import LanguageSelector from "./reusables/LanguageSelector";
import Subheading from "./reusables/Subheading";

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
import DynamicInvoiceTemplate from "./templates/invoice-pdf/DynamicInvoiceTemplate";
import InvoiceLayout from "./templates/invoice-pdf/InvoiceLayout";
import InvoiceTemplate1 from "./templates/invoice-pdf/InvoiceTemplate1";
import InvoiceTemplate2 from "./templates/invoice-pdf/InvoiceTemplate2";

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
    Charges,
    TemplateSelector,
    WizardNavigation,
    WizardStep,
    WizardProgress,
    PaymentInformation,
    InvoiceSummary,
    CurrencySelector,
    SavedInvoicesList,
    PdfViewer,
    FormInput,
    FormTextarea,
    DatePickerFormField,
    FormLogoInput,
    ChargeInput,
    FormCustomInput,
    BaseButton,
    ThemeSwitcher,
    LanguageSelector,
    Subheading,
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
    DynamicInvoiceTemplate,
    InvoiceLayout,
    InvoiceTemplate1,
    InvoiceTemplate2,
    SendPdfEmail,
    DevDebug,
};
