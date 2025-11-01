import React from 'react'

const TemplateHeaderForScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <style>
        {`
        .screen-header {
            display: block;
            width: 100%;
        }

        @media print {
            /* Hide the header intended for the screen */
            .screen-header {
            display: none;
            }
        }
      `}
      </style>
      <div className="avoid-break screen-header">
        {children}
      </div>
    </>
  )
}

export default TemplateHeaderForScreen