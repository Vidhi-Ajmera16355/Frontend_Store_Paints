import React from "react";

const ContactUs = () => {
    return (
        <div className="contact-container">
            <div className="contact-header">
                <h1>Contact Us</h1>
                <p>We’re here to help you with all your painting needs.</p>
                <img
                    src="https://play-lh.googleusercontent.com/owb6jewHAtLyi9fizIrmT2sjKqgJ08ockyiSrkpriMN20ojQqu4vdrdwLfYgvEITq4o" // Replace with your image URL
                    alt="Contact Us Logo"
                    className="contact-logo"
                />
            </div>
            <div className="contact-content">
                <section className="contact-section">
                    <h2>Contact Details</h2>
                    <p>
                        For inquiries, support, or to learn more about our products, please reach out to us using the following contact details:
                    </p>
                    <ul>
                        <li><strong>Owner:</strong> Kamal Ajmera</li>
                        <li><strong>Phone:</strong> 9837140458</li>
                        <li><strong>Email:</strong> <a href="mailto:ajmerapaintsksg@gmail.com">ajmerapaintsksg@gmail.com</a></li>
                        <li><strong>Address:</strong> M/S Ajmera Paints, Barahdwari, Bilram Gate, Kasganj, Uttar Pradesh, India</li>
                    </ul>
                </section>
                <section className="contact-section">
                    <h2>Our Offerings</h2>
                    <p>
                        At Ajmera Paints, we offer a wide range of paints and related products to suit all your needs:
                        <ul>
                            <li>Interior and Exterior Paints</li>
                            <li>Primer and Sealers</li>
                            <li>Specialty Coatings</li>
                            <li>Paint Brushes and Rollers</li>
                            <li>Color Matching Services</li>
                        </ul>
                    </p>
                </section>
            </div>
            <div className="contact-footer">
                <p>We look forward to hearing from you and assisting with your next painting project!</p>
            </div>
        </div>
    );
};

export default ContactUs;
