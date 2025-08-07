import styles from '../styles/Footer.module.css';

const Footer = () => {
    return (
        <div>
            <div>
                <div className={styles.footer}>
                    <div className={styles['info-section']}>
                        <p> 16°28'01"S 54°34'36"O</p>
                    </div>
                </div>
                
                {/* Aplicamos a nova classe ao h1 */}
                <h1 className={styles.thinpactLogo}>thinpact</h1>
            </div>
        </div>
    );
};

export default Footer;