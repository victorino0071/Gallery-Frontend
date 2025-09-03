import styles from "../styles/Header.module.css";

const Header = () => {
    return (
        // O container principal do header agora será um flex container
        <div className={styles.header}>
            {/* Seção Esquerda: Logo */}
            <div className={styles['logo-container']}>
                <div className={styles['logo-squares']}>
                    <div className={`${styles.square} ${styles['square-1']}`}></div>
                    <div className={`${styles.square} ${styles['square-2']}`}></div>
                </div>
            </div>

            {/* Seção Direita: Agrupa as outras seções */}
            <div className={styles['right-section']}>
                {/* Seção Contato */}
                <div className={styles['values-section']}>
                    <h3>+Contato</h3>
                    <ul>
                        <li><a href="mailto:victor.emmanuel@aluno.ufr.edu.br">victor.emmanuel@aluno.ufr.edu.br</a></li>
                        <li><a href="https://wa.me/+5566992502003" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                        <li><a href="www.linkedin.com/in/victor-emmanuel-de-assis-martins-2256412ab" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                        <li><a href="https://github.com/victorino0071" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                    </ul>
                </div>

                {/* Seção Telefone */}
                <div className={styles['values-section']}>
                    <h3>+Telefone</h3>
                    <ul>
                        <li><a href="tel:+5566992502003">+55 (66) 99250-2003</a></li>
                    </ul>
                </div>

                {/* Seção Informações Gerais */}
                <div className={styles['values-section']}>
                    <h3>+Informações Gerais</h3>
                    <ul>
                        <li><span>Nome: Victor Emmanuel</span></li>
                        <li><span>Idade: 20 anos</span></li>
                        <li><span>Cidade: Poxoréu-MT</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
