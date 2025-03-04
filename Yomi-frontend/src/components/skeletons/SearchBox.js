import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function SearchBox() {
    const [isActive, setIsActive] = useState(false);

    const handleFocus = () => {
        setIsActive(true);
    };

    const handleBlur = () => {
        setIsActive(false);
    };

    

    return (
        <div className="w-full flex justify-center flex-row">
            <Form.Control
                className={`w-2/3 text-white align-middle justify-center ${isActive ? 'bg-background' : ''
                    }`}
                size="lg"
                type="text"
                placeholder="Search for Manga"
                data-bs-theme="dark"
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            
        </div>
    );
}
