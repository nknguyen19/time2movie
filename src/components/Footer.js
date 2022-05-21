import React from "react";

const Footer = () => {
    return (
        <div className="footer">
            <div className="logo">
                <img src="/logo.png"/>
            </div>
            <div className="project-info">
                <h3>Time2Movie</h3>
                <p>This is a project for course CS422</p>
                <p>Movie data is from</p>
            </div>
            <div className="contact-info">
                <h3>Contact us</h3>
                <p>Nguyen Khanh Nguyen: nknguyen19@apcs.fitus.edu.vn</p>
                <p>Nguyen Thieu Khang: ntkhang19@apcs.fitus.edu.vn</p>
                <p>Nguyen Quoc Khanh Tuyen: nqktuyen@apcs.fitus.edu.vn</p>
            </div>
        </div>
    )
}

export default Footer;