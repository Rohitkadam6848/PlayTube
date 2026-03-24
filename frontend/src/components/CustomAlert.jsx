import React, { useEffect, useState, useRef } from "react";

let showAlert;

export const showCustomAlert = (message) => {
  if (showAlert) {
    showAlert(message);
  }
};

function CustomAlert({ children }) {
  const [mess, setMess] = useState("");
  const [visible, setVisible] = useState(false);
  const alertRef = useRef(null);

  useEffect(() => {
    alertRef.current = (message) => {
      setMess(message);
      setVisible(true);
    };
    showAlert = alertRef.current;

    return () => {
      showAlert = null;
    };
  }, []);

  return (
    <>
      {children}
      {visible && (
        <div className="fixed inset-0 flex items-start justify-center pt-12 bg-black/50 z-50">
          <div className="bg-[#202124] text-white rounded-lg shadow-lg p-6 w-80">
            <p className="text-sm">{mess}</p>
            <div className="flex justify-end mt-10">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
                onClick={() => setVisible(false)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomAlert;
