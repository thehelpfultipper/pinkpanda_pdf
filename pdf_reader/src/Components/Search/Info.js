import { useContext } from 'react';

import Card from '../UI/Card';
import UploadContext from '../../context/upload-context';

import s from './Info.module.scss';

const Info = ({ err, className }) => {
    let uploadCtx = useContext(UploadContext);

    return (
        <Card className={`${s.Info_wrap} ${uploadCtx.isError ? s.error : ""} ${className ? className : ""}`}>
            <p>
                {err}
            </p>
        </Card>
    )
}

export default Info;