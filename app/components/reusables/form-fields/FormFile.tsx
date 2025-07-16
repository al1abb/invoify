"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
// RHF
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn components
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { ImageMinus } from "lucide-react";

// Types
import { NameType } from "@/types";

type FormFileProps = {
  name: NameType;
  label?: string;
  placeholder?: string;
};

const FormFile = ({ name, label, placeholder }: FormFileProps) => {
  const { control, setValue } = useFormContext();

  const logoImage = useWatch({
    name: name,
    control,
  });

  const [base64Image, setBase64Image] = useState<string>(logoImage ?? "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target!.result as string;
        setBase64Image(base64String);
        setValue(name, base64String); // Set the value for form submission
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setBase64Image("");
    setValue(name, "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem>
            <Label>{label}:</Label>
            {base64Image ? (
              <Image
                id="logoImage"
                src={base64Image}
                alt="Logo preview"
                width={160}
                height={112}
                style={{
                  objectFit: "contain",
                  width: "10rem",
                  height: "7rem",
                }}
              />
            ) : (
              <div
                style={{
                  objectFit: "contain",
                  width: "10rem",
                  height: "7rem",
                }}
              >
                <Label
                  htmlFor={name}
                  className="flex justify-center items-center h-28 w-40 cursor-pointer rounded-md bg-gray-100 dark:bg-slate-800 border border-black dark:border-white hover:border-blue-500"
                >
                  <>
                    <div className="flex flex-col items-center">
                      <Image
                        src="/images/upload-image.png"
                        alt="Upload image icon"
                        width={100}
                        height={100}
                      />
                      <p>{placeholder}</p>
                    </div>
                    <FormControl>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id={name}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </FormControl>
                    <FormMessage />
                  </>
                </Label>
              </div>
            )}
          </FormItem>
        )}
      />
      {base64Image && (
        <div>
          <BaseButton variant="destructive" onClick={removeLogo}>
            <ImageMinus />
            Remove logo
          </BaseButton>
        </div>
      )}
    </>
  );
};

export default FormFile;
