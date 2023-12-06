import { useState, Fragment } from 'react';

import Popup from './Popup';

import s from './ListItem.module.scss';

const ListItem = (props) => {
    const { pageNum, text, img } = props;
    let [popupDisplay, setPopupDisplay] = useState(false);

    const popupDisplayHandler = () => {
        setPopupDisplay(!popupDisplay);
    }   

    return (
        <Fragment>
            {popupDisplay && <Popup url={img.url} onClose={setPopupDisplay} />}
            <li className={s.item}>
                <span className={s.img}>
                    <img
                        src={img.url}
                        alt={img.alt}
                        onClick={popupDisplayHandler}
                    />
                </span>
                <span className={s.page}>Page {pageNum}</span>
                <span className={s.text}>
                    {
                        text.length > 90 ?
                            text.slice(0, 90) + '...' :
                            text
                    }
                </span>
            </li>
        </Fragment>
    );
}

export default ListItem;