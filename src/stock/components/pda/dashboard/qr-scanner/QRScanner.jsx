import React, { useState } from "react";

import { QrReader } from 'react-qr-reader';
import { Visible } from "amiga-core/components/auth";
import { Button } from "lib-frontsga";

function QRScanner(props) {

    // chrome://flags/#unsafely-treat-insecure-origin-as-secure

    const [data, setData] = useState("");
    const [showScanner, setShowScanner] = useState(false);

    return (
        <div style={{margin: "20px"}}>
            <Button kind="icon" icon="sga-icon-camera" onClick={() => {
                setShowScanner(!showScanner);
                setData("");
            }}/>
            <Visible onlyIf={() => showScanner}>
                <QrReader
                    constraints={{ facingMode: "environment"}}
                    visible={false}
                    onResult={(result, error) => {
                        if (!!result) {
                            setData(result?.text);
                            setShowScanner(false);
                        }
                    }}
                    style={{ width: '100%' }}
                />
            </Visible>
            <p>{data}</p>
        </div>
    );
}
    
export default QRScanner;