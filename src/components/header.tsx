

const Header = ()=>{
    return (
        <div>
            <div className="header">
                <div className="nav-section">
                    <div className="logo-container">
                        <div className="logo-circles">
                            <div className="circle circle-1"></div>
                            <div className="circle circle-2"></div>
                        </div>
                    </div>
                </div>

                <div className="values-section">
                    <h3>+Menu</h3>
                    <ul>
                        <li>
                            <a href="#">Clarity</a>
                        </li>
                        <li>
                            <a href="#">Simplicity</a>
                        </li>
                        <li>
                            <a href="#">Creativity</a>
                        </li>
                        <li>
                            <a href="#">Authenticity</a>
                        </li>
                        <li>
                            <a href="#">Connect</a>
                        </li>
                    </ul>
                </div>

                <div className="location-section">
                    <h3>+Location</h3>
                    <p>6357 Selma Ave</p>
                    <p>Los Angeles</p>
                    <p>CA 90028</p>
                </div>

                <div className="contact-section">
                    <h3>+Get In Touch</h3>
                    <p>(310) 456-7890</p>
                    <p>
                        <a href="mailto:hi@filip.fyi">hi@filip.fyi</a>
                    </p>
                </div>

                <div className="social-section">
                    <h3>+Social</h3>
                    <ul>
                        <li>
                            <a href="https://instagram.com/filipz__">
                                Instagram
                            </a>
                        </li>
                        <li>
                            <a href="https://x.com/filipz">X / Twitter</a>
                        </li>
                        <li>
                            <a href="https://linkedin.com/in/filipzrnzevic">
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header