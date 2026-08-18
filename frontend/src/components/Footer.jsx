import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 px-6 md:px-14 py-10 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="font-bold text-lg">EstateLink</h3>
          <p className="text-gray-500 text-sm">
            © 2024 EstateLink Inc. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap gap-6 text-gray-600">
          <a>Privacy</a>
          <a>Terms</a>
          <a>Company</a>
          <a>Support</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
