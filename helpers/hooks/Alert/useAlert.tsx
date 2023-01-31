import React from "react";

export const useAlert = () => {
    const [showAlert, setShowAlert] = React.useState(false);

    function toggleAlert() {
        setShowAlert(!showAlert);
    }

    return {
        toggleAlert,
        showAlert,
        setShowAlert
    };
}