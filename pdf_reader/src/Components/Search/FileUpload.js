import { useState, useRef, useContext, Fragment } from 'react';

import Card from '../UI/Card';

import s from './FileUpload.module.scss';
import icon from "../../Assets/upload.svg";
import UploadContext from '../../context/upload-context';
import FileUploadProgress from './FileUploadProgress';
import CardTitle from './CardTitle';
import Info from './Info';

function FileUpload() {
    let [isDragging, setIsDragging] = useState(false);
    let uploadCtx = useContext(UploadContext);


    const fileInputRef = useRef();

    const dragEnterHandler = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const dragOverHandler = (e) => {
        e.preventDefault();
    };

    const dragLeaveHandler = (e) => {
        setIsDragging(false);
    };

    const dropHandler = (e) => {
        e.preventDefault();
        setIsDragging(false);

        // Handle dropped filed here
        // const file = e.dataTransfer.files[0];
        // console.log(file);
        uploadCtx.setFile(e.dataTransfer.files[0]);
    };

    const fileSelectedHandler = () => {
        uploadCtx.setFile(fileInputRef.current.files[0]);
    };

    const handleKeyPress = e => {
        e.key === 'Enter' && fileInputRef.current.click();
    }

    let fileUploadStatus;
   
    if (isDragging) {
        fileUploadStatus = <p>Drop file here</p>;
    } else if (uploadCtx.file) {
        // upload status here
        fileUploadStatus = <Fragment>
            <FileUploadProgress />
            <span className={s.dragDrop_icon}>
                <img src={icon} alt="Upload to cloud icon"></img>
            </span>
            <span>
                Drop file here <br />
                or{" "}
            </span>
            <label
                htmlFor="file"
                className={s.dragDrop_label}
                tabIndex="0"
                onKeyDown={handleKeyPress}
            >
                browse
            </label>
            <input
                type="file"
                accept="application/pdf"
                name="pdfPath"
                id="file"
                className={`${s.dragDrop_file}`}
                ref={fileInputRef}
                onInput={fileSelectedHandler}
            />
        </Fragment>
    } else {
        fileUploadStatus = <Fragment>
            <span className={s.dragDrop_icon}>
                <img src={icon} alt="Upload to cloud icon"></img>
            </span>
            <span>
                Drop file here <br />
                or{" "}
            </span>
            <label
                htmlFor="file"
                className={s.dragDrop_label}
                tabIndex="0"
                onKeyDown={handleKeyPress}
            >
                browse
            </label>
            <input
                type="file"
                accept="application/pdf"
                name="pdfPath"
                id="file"
                className={`${s.dragDrop_file}`}
                ref={fileInputRef}
                onInput={fileSelectedHandler}
                tabIndex="-1"
            />
        </Fragment>
    }
    return (
        <Fragment>
            {uploadCtx.isError && <Info err={'Oops, something went wrong!'} />}
            <Card className={s.uploadfile}>
                <CardTitle />   
                <div
                    className={`${s.dragDrop_area} ${isDragging ? s.highlight : ""}`}
                    onDragEnter={dragEnterHandler}
                    onDragOver={dragOverHandler}
                    onDragLeave={dragLeaveHandler}
                    onDrop={dropHandler}>
                    {fileUploadStatus}
                    <span className={s.disc_upload}>
                        <small>Only one PDF file at a time (max 184MB)</small>
                    </span>
                </div>
            </Card>
        </Fragment>
    );
}

export default FileUpload;
