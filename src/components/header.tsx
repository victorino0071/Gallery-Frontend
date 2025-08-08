import styles from "../styles/Header.module.css";

const Header = () => {
    return (
        // O container principal do header agora será um flex container
        <div className={styles.header}>
            {/* Seção Esquerda: Logo */}
            <div className={styles['logo-container']}>
                <div className={styles['logo-circles']}>
                    <div className={`${styles.circle} ${styles['circle-1']}`}></div>
                    <div className={`${styles.circle} ${styles['circle-2']}`}></div>
                </div>
            </div>

            {/* Seção Direita: Agrupa as outras seções */}
            <div className={styles['right-section']}>
                <div className={styles['values-section']}>
                    <h3>+Slogan</h3>
                    <ul>
                        <li><a href="#">Gestão leve, negócio forte</a></li>
                    </ul>
                </div>
                <div className={styles['values-section']}>
                    <h3>+Integrantes</h3>
                    <ul>
                        <li><a href="#">Alysson Rodrigues</a></li>
                        <li><a href="#">Pedro Americano</a></li>
                        <li><a href="#">Hugo Adriano</a></li>
                        <li><a href="#">Marco Antônio</a></li>
                        <li><a href="#">Victor Emmanuel</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;