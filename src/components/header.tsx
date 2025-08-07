import styles from "../styles/Header.module.css"

const Header = () => {
    return (
        <div>
            <div className={styles.header}>
                <div className={styles['nav-section']}>
                    <div className={styles['logo-container']}>
                        <div className={styles['logo-circles']}>
                            <div className={`${styles.circle} ${styles['circle-1']}`}></div>
                            <div className={`${styles.circle} ${styles['circle-2']}`}></div>
                        </div>
                    </div>
                </div>

                <div className={styles['values-section']}>
                    <h3>+Menu</h3>
                    <ul>
                        <li><a href="#">Clarity</a></li>
                        <li><a href="#">Simplicity</a></li>
                        <li><a href="#">Creativity</a></li>
                        <li><a href="#">Authenticity</a></li>
                        <li><a href="#">Connect</a></li>
                    </ul>
                </div>

                <div className={styles['location-section']}>
                    <h3>+Location</h3>
                    <p>6357 Selma Ave</p>
                    <p>Los Angeles</p>
                    <p>CA 90028</p>
                </div>

                <div className={styles['contact-section']}>
                    <h3>+Get In Touch</h3>
                    <p>(310) 456-7890</p>
                    <p><a href="mailto:hi@filip.fyi">hi@filip.fyi</a></p>
                </div>

                <div className={styles['social-section']}>
                    <h3>+Social</h3>
                    <ul>
                        <li><a href="https://instagram.com/filipz__">Instagram</a></li>
                        <li><a href="https://x.com/filipz">X / Twitter</a></li>
                        <li><a href="https://linkedin.com/in/filipzrnzevic">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;