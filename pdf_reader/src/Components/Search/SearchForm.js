import React, { useState, useContext, Fragment, useEffect } from "react";
import axios from "axios";

import ResultsList from "./ResultsList";
import FileUpload from "./FileUpload";
import UploadContext from "../../context/upload-context";
import Input from "./Input";
import Info from "./Info";
import Skeleton from "../UI/Skeleton";

import s from './SearchForm.module.scss';

const SearchForm = () => {
    let uploadCtx = useContext(UploadContext);

    let [searchPhrase, setSearchPhrase] = useState("");
    const [matches, setMatches] = useState([]);
    const [screenshots, setScreenshots] = useState([]);
    const [err, setErr] = useState("");
    const [skeleton, setSkeleton] = useState(false);
    const [fetchMessage, setFetchMessage] = useState("");

    const getFetchMessage = () => {
        let msgIndex = 0;
        let lastUpdateTime = Date.now();
        const messages = ["Fetching data...", "Still fetching data.", "Hang in there! Fetching..."];
        const longMessages = ["Searching for your term–it's like finding a WiFi signal in the desert, but we're getting warmer!", "Your term is playing hide and seek–we're sharpening our seeker skills!", "...we're rolling out the red carpet, fashionably slow!", "Your term is just around the corner!"];
        const longAF = ["This PDF is longer than a Sunday afternoon nap, but fear not, we're keeping our eyes wide open.", "Your PDF is in marathon mode, but we've got our running shoes on...", "The PDF is unfolding like an epic saga...we're scripting the finale–stay tuned!", "PDF search in progress–your term is on the VIP list, enjoying the wait with a front-row seat!"];

        let cummTime = 0;
        const intervalId = setInterval( () => {
            const currentTime = Date.now();
            const ellapsedTime = (currentTime + cummTime) - lastUpdateTime;
            
            if(ellapsedTime >= 60000) {
                setFetchMessage([...longAF, ...messages][msgIndex]);
            }
            else if(ellapsedTime >= 30000) {
                setFetchMessage([...longMessages, ...messages][msgIndex]);
            } 
            else {
                setFetchMessage(messages[msgIndex]);
            } 

            msgIndex = (msgIndex + 1) % messages.length;
            lastUpdateTime = currentTime;
            cummTime += 5000;
        }, 5000);

        return intervalId;
    }

    const searchHandler = term => {
        setSearchPhrase(term);
    }

    const handleSearch = async () => {
        // Check the environment
        const isDevelopment = process.env.NODE_ENV === 'development';

        const apiURL = isDevelopment
            ? "http://127.0.0.1:5000/search-pdf"
            : "https://pinkpanda-pdf.onrender.com/search-pdf"

        try {
            setMatches([]); // Clear matches
            setScreenshots([]); // Clear screenshots
            uploadCtx.setIsError(false); // Clear error
            setErr(""); // Clear error message
            setSkeleton(true); // Toggle skeleton loading animation
            setFetchMessage("Fetching data...");

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

            const response = await axios.post(apiURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setMatches(response.data.matches);
            setScreenshots(response.data.screenshots);
        } catch (err) {
            uploadCtx.setIsError(true);
            setErr('Error searching PDF. Try again.');
            setSkeleton(false);
            setFetchMessage("");
            console.log("Error searching PDF:", err);
        } finally {
            setSkeleton(false);
            setFetchMessage("");
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
            setFetchMessage(""); // Clear fetch message indicator
        }

        // eslint-disable-next-line 
    }, [uploadCtx.file]);

    useEffect( () => {
        if(skeleton) {
            let fetchId = getFetchMessage();
            return () => clearInterval(fetchId) && console.log('interval cleared');
        }
    }, [skeleton]);


    return (
        <Fragment>
            {
                uploadCtx.isSelected ?
                    <Fragment>
                        {uploadCtx.isError && <Info err={err} />}
                        {
                            skeleton &&
                            <Info className={s.fetchMssg} err={fetchMessage} />
                        }
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