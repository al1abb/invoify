declare module "react-signature-canvas" {
    import { Component, Ref } from "react";

    type SignatureCanvasProps = {
        penColor?: string;
        canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
        onEnd?: React.MouseEventHandler;
        velocityFilterWeight?: number;
        minWidth?: number;
        maxWidth?: number;
        minDistance?: number;
        dotSize?: number | Function;
        throttle?: number;
        backgroundColor?: string;
        clearOnResize?: boolean;
        onBegin?: () => void;
    };

    class SignatureCanvas extends Component<SignatureCanvasProps> {
        clear: () => void;
        toDataURL: (type?: string, encoderOptions?: number) => string;
        fromDataURL: (base64String: string, options?: any) => void; // Add this line
        onEnd: () => void;
    }

    export default SignatureCanvas;
}
