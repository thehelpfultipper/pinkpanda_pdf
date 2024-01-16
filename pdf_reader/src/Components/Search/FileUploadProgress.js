import { useState, useEffect, useContext } from 'react';

import fileUpload from '../../Assets/file-upload.svg';
import fileSuccess from '../../Assets/upload-success.svg';
import fileFail from '../../Assets/upload-fail.svg';
import dismiss from '../../Assets/dismiss.svg';
import del from '../../Assets/delete.svg';
import UploadContext from '../../context/upload-context';

import s from './FileUploadProgress.module.scss';

const FileUploadProgress = () => {
    let [icon, setIcon] = useState();
    let [iconAction, setIconAction] = useState();
    let [percentage, setPercentage] = useState(0);
    let { 
        file, 
        isError, 
        isUploaded, 
        setIsUploaded, 
        setIsError, 
        setFile, 
        setIsSelected 
    } = useContext(UploadContext);

    const fileSize = file.size;

    useEffect(() => {
        if (file && file.type === 'application/pdf') {
            // Execute file upload
            getPercentage(file);
        } else {
            setIsError(true);
            setIcon(fileFail);
            setIconAction(del);
            setIsUploaded(false);
        }
    }, [file]);

    const getPercentage = () => {
        const chunkSize = 1024 * 10; // 10KB chunk size (adjust as needed)
        let uploadedSize = 0;

        const uploadInterval = setInterval(() => {
            // Update progress bar & text
            uploadedSize += chunkSize;
            const newPercentage = (uploadedSize / fileSize) * 100;
            setPercentage(newPercentage);
            setIcon(fileUpload);
            setIconAction(dismiss);
            // setIsLoading(true);

            if (uploadedSize >= fileSize) {
                clearInterval(uploadInterval);
                setPercentage(100);
                setIconAction(del);
                setIcon(fileSuccess);
                setIsError(false);
                setIsUploaded(true)
                // setIsLoading(false);

            }
        }, 50); // Update every 100 milliseconds
    };

    const getFileSizeInKb = () => {
        const fileSizeInKB = fileSize / 1024;

        // check if the size is less than 1MB
        if (fileSizeInKB < 1024) {
            // return fileSizeInKB.toFixed(2) + ' KB';
            return `${(fileSizeInKB * (percentage / 100)).toFixed(2)} KB of ${fileSizeInKB.toFixed(2)} KB uploaded (${Math.round(percentage)}%)`;
        } else if (fileSizeInKB >= 1024) {
            // return (fileSizeInKB / 1024).toFixed(2) + ' MB';
            return `${((fileSizeInKB / 1024) * (percentage / 100)).toFixed(2)} MB of ${(fileSizeInKB / 1024).toFixed(2)} MB uploaded (${Math.round(percentage)}%)`;
            // set a limit to 184MB
        } else if (fileSizeInKB >= 1024 * 1024 && fileSizeInKB <= 184320) {
            // return (fileSizeInKB / (1024 * 1024)).toFixed(2) + ' GB';
            return `${((fileSizeInKB / (1024 * 1024)) * (percentage / 100)).toFixed(2)} GB of ${(fileSizeInKB / (1024 * 1024)).toFixed(2)} GB uploaded (${Math.round(percentage)}%)`;
        } else {
            setIsError(true);
            setIcon(fileFail);
            setIsUploaded(false);
            return 'Upload failed, please try again.';
        }
    };

    const cancelHandler = () => {
        // Cancel upload
        setFile(null);
        setPercentage(0);
        setIsError(false);
        setIsUploaded(false);
    };

    const fileLinkHandler = (e) => {
        e.preventDefault();
        setIsSelected(true);
    }

    return (
        <div className={`${s.Progress_wrapper} ${isError ? s.error : ''}`}>
            <div className={s.Progress_icon}>
                <div className={s.Progress_icon__img}><img src={icon} alt='File status icon' /></div>
                <svg
                    className="progress-ring"
                    width="50"
                    height="50">
                    <circle
                        stroke={isError ? 'red' : '#e0e0e0'}
                        strokeWidth="2"
                        fill="transparent"
                        r="23"
                        cx="25"
                        cy="25"
                        vectorEffect="non-scaling-stroke"
                        shapeRendering="geometricPrecision"
                        strokeLinecap="round" />
                    <circle
                        className={s['progress-ring__circle']}
                        strokeDasharray={`${23 * 2 * Math.PI} ${23 * 2 * Math.PI}`}
                        strokeDashoffset={`${(23 * 2 * Math.PI) - (percentage / 100) * (23 * 2 * Math.PI)}`}
                        stroke={isError ? 'red' : '#000'}
                        strokeWidth="3"
                        fill="transparent"
                        transform="rotate(-90 25 25)"
                        r="23"
                        cx="25"
                        cy="25"
                        vectorEffect="non-scaling-stroke"
                        shapeRendering="geometricPrecision"
                        strokeLinecap="round" />
                </svg>
            </div>
            <div className={s.Progress_info}>
                <div className={s.Progress_status}>
                    <span className={`${s.Progress_text} ${s.Progress_filename}`}>
                        {isUploaded ? <a href='#' rel='noopener nofollow' onClick={fileLinkHandler}>{file.name}</a> : file.name}
                    </span>
                    <span className={`${s.Progress_text} ${isError ? s.error : ''}`}>{getFileSizeInKb()}</span>
                </div>
                <div className={s.Progress_dismiss} onClick={cancelHandler}>
                    <img src={iconAction} alt='' />
                </div>
            </div>
        </div>
    );
}

export default FileUploadProgress;