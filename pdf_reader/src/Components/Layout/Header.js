
import s from './Header.module.scss';
import logo from '../../Assets/logo.svg';

function Header({start}) {
    return (
        <header className={`${s.header} ${start ? s.start : ''}`}>
            <div className={`${s.logo} ${start ? s.small : ''}`}>
                <img src={logo} alt="Pink Panda logo" />
            </div>
            <h1>
                PinkPanda PDF
            </h1>
        </header>
    );
}

export default Header;
