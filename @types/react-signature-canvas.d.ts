declare module "react-signature-canvas" {
    import { Component, Ref } from "react";

    interface SignatureCanvasProps {
        penColor?: string;
        canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
        onEnd?: React.MouseEventHandler;
    }

    class SignatureCanvas extends Component<SignatureCanvasProps> {
        clear: () => void;
        toDataURL: (type?: string, encoderOptions?: number) => string;
        onEnd: () => void;
    }

    export default SignatureCanvas;
}
