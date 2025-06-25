import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div>
        © {new Date().getFullYear()} Library Management System. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
