import React from 'react';

import SearchForm from '../Search/SearchForm';
import UploadProvider from '../../context/UploadProvider';

import s from './Main.module.scss';

function Main({start, onStart}) {
    return (
        <main className={s.wrapper}>
            <button type="button" onClick={onStart} className={start ? s.reset : null}>{start ? 'Reset' : 'Click to start'}</button>
            {
                // Upload file component
                start && <UploadProvider><SearchForm /></UploadProvider>
            }
        </main>
    );
}

export default Main;
