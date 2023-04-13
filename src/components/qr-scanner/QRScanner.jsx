import React, { useState } from "react";

import CameraImage from "./assets/camera.png"
import { QrReader } from 'react-qr-reader';

function QRScanner(props) {

    // chrome://flags/#unsafely-treat-insecure-origin-as-secure

    const [data, setData] = useState("");
    const [showScanner, setShowScanner] = useState(false);

    const renderScanner = () => {
        if (showScanner) {
            return <QrReader
                constraints={{ facingMode: "environment"}}
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                        setShowScanner(false);
                    }
                }}
                />
        } else {
            return null;
        }
    }

    return (
        <div style={{marginTop: "20px"}}>
            <button onClick={() => {
                setShowScanner(!showScanner);
                setData("");
            }}>
                <img src={CameraImage} style={{height: "60px", width: "60px"}}/>
            </button>
            <div style={{maxWidth: "320px", margin: "0 auto"}}>
                {renderScanner()}
            </div>
            <p>{data}</p>
        </div>
    );
}
    
export default QRScanner;