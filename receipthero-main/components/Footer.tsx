import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-12 border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} Receipt Hero. All rights reserved.
        </p>
      </div>
    </footer>
  );
}