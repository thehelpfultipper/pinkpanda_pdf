import React, { useState, useContext, Fragment, useEffect } from "react";
import axios from "axios";

import ResultsList from "./ResultsList";
import FileUpload from "./FileUpload";
import UploadContext from "../../context/upload-context";
import Input from "./Input";
import Info from "./Info";
import Skeleton from "../UI/Skeleton";

const SearchForm = () => {
    let uploadCtx = useContext(UploadContext);

    let [searchPhrase, setSearchPhrase] = useState("");
    const [matches, setMatches] = useState([]);
    const [screenshots, setScreenshots] = useState([]);
    const [err, setErr] = useState("");
    const [skeleton, setSkeleton] = useState(false);

    const searchHandler = term => {
        setSearchPhrase(term);
    }

    const handleSearch = async () => {
        try {
            setMatches([]); // Clear matches
            setScreenshots([]); // Clear screenshots
            uploadCtx.setIsError(false); // Clear error
            setErr(""); // Clear error message
            setSkeleton(true); // Toggle skeleton loading animation

            if (searchPhrase === '') {
                uploadCtx.setIsError(true);
                setErr('Please enter a search phrase.');
                return;
            }

            searchPhrase = searchPhrase.trim();

            const formData = new FormData();
            formData.append('searchPhrase', searchPhrase);
            // formData.append('pdfPath', fileInputRef.current.files[0]);
            formData.append('pdfPath', uploadCtx.file);

            // let pdfPath = fileInputRef.current.files[0];

            const response = await axios.post("https://pinkpandapdf-9v69y74n.b4a.run/search-pdf", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setSkeleton(false);

            setMatches(response.data.matches);
            setScreenshots(response.data.screenshots);
        } catch (err) {
            uploadCtx.setIsError(true);
            setErr('Error searching PDF. Try again.');
            setSkeleton(false);
            console.log("Error searching PDF:", err);
        }
    }
    
    useEffect(() => {
        if (uploadCtx.file !== '') {
            setMatches([]); // Clear matches
            setScreenshots([]); // Clear screenshots
            setSearchPhrase(''); // Clear search phrase
            uploadCtx.setIsError(false); // Clear error
            setErr(""); // Clear error message
            setSkeleton(false); // Clear skeleton loading animation
        }
        // eslint-disable-next-line 
    }, [uploadCtx.file]);


    return (
        <Fragment>
            {
                uploadCtx.isSelected ?
                    <Fragment>
                        {uploadCtx.isError && <Info err={err} />}
                        <Input
                            type="text"
                            id="searchPhrase"
                            value={searchPhrase}
                            name="searchPhrase"
                            onSearch={searchHandler}
                            onSubmit={handleSearch}
                            ctx={uploadCtx}
                        />
                        {
                            skeleton && !uploadCtx.isError ?
                                <Skeleton
                                    itemsNum={2}
                                    displayNum={3}
                                    dim={
                                        window.innerWidth > 423 ?
                                            [
                                                { w: '99px', h: '124px' },
                                                { w: '450px', h: '56px' }
                                            ] :
                                            [
                                                { w: '99px', h: '124px' },
                                                { w: '50px', h: '20px' }
                                            ]
                                    }
                                    dir={window.innerWidth > 423 ? 'row' : 'col'}
                                /> :
                                matches.length > 0 &&
                                <ResultsList data={{ items: matches, imgs: screenshots }} />
                        }
                    </Fragment> :
                    <FileUpload />
            }


        </Fragment>
    )
}

export default SearchForm;