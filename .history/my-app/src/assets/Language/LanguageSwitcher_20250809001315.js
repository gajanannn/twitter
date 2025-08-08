// import React, { useEffect, useState } from "react";
// import { MenuItem } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import { sendEmailVerification } from "firebase/auth";
// import { useUserAuth } from "../../context/Userauthcontext";

// const LanguageSwitcher = () => {
//   const { t, i18n } = useTranslation();
//   const { user } = useUserAuth();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [canChangeLang, setCanChangeLang] = useState(false);

//   useEffect(() => {
//     const flag = localStorage.getItem("lang_verified_time");
//     if (flag) {
//       const timePassed = Date.now() - parseInt(flag);
//       if (timePassed <= 5 * 60 * 1000) {
//         setCanChangeLang(true);
//       } else {
//         localStorage.removeItem("lang_verified_time");
//       }
//     }
//   }, []);

//   const handleRequest = async () => {
//     if (!user) return alert("Login first");

//     try {
//       await sendEmailVerification(user, {
//         handleCodeInApp: true,
//         url: window.location.href, // link redirects to current page
//       });

//       alert("Verification link sent to your email.");
//       localStorage.setItem("lang_verified_time", Date.now().toString());
//       setCanChangeLang(true);

//       setTimeout(() => {
//         setCanChangeLang(false);
//         localStorage.removeItem("lang_verified_time");
//       }, 5 * 60 * 1000); // 5 minutes
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send verification email");
//     }
//   };

//   const changeLanguage = (e) => {
//     if (!canChangeLang) {
//       alert("Please verify via email before changing language.");
//       return;
//     }
//     i18n.changeLanguage(e.target.value);
//     setShowDropdown(false);
//   };

//   return (
//     <div>
//       <MenuItem onClick={handleRequest}>{t("change_language")}</MenuItem>

//       {canChangeLang && showDropdown && (
//         <select onChange={changeLanguage} defaultValue={i18n.language}>
//           <option value="en">English</option>
//           <option value="hi">Hindi</option>
//           <option value="fr">Français</option>
//           <option value="es">Español</option>
//           <option value="pt">Português</option>
//           <option value="zh">中文</option>
//         </select>
//       )}

//       {canChangeLang && !showDropdown && (
//         <button onClick={() => setShowDropdown(true)}>
//           {t("select_language")}
//         </button>
//       )}
//     </div>
//   );
// };

// export default LanguageSwitcher;

// import React, { useEffect, useState } from "react";
// import { MenuItem } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import { useUserAuth } from "../../context/Userauthcontext";

// const LanguageSwitcher = () => {
//   const { t, i18n } = useTranslation();
//   const { user } = useUserAuth();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [canChangeLang, setCanChangeLang] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");

//   useEffect(() => {
//     const flag = localStorage.getItem("lang_verified_time");
//     if (flag) {
//       const timePassed = Date.now() - parseInt(flag);
//       if (timePassed <= 5 * 60 * 1000) {
//         setCanChangeLang(true);
//       } else {
//         localStorage.removeItem("lang_verified_time");
//       }
//     }
//   }, []);

//   const handleRequest = async () => {
//     if (!user || !user.email) return alert("Login first");

//     try {
//       const res = await fetch("http://localhost:5000/send-language-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: user.email }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert("OTP sent to your email.");

//         setOtpSent(true);
//       } else {
//         alert("Failed to send OTP: " + data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error sending OTP.");
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp) return alert("Enter OTP");

//     try {
//       const res = await fetch("http://localhost:5000/verify-language-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: user.email, otp }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert("OTP verified! You can now change language.");
//         localStorage.setItem("lang_verified_time", Date.now().toString());
//         setCanChangeLang(true);
//         setOtpSent(false); // reset OTP input
//         setOtp("");

//         // Expire access after 5 mins
//         setTimeout(() => {
//           setCanChangeLang(false);
//           localStorage.removeItem("lang_verified_time");
//         }, 5 * 60 * 1000);
//       } else {
//         alert("Invalid or expired OTP");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error verifying OTP.");
//     }
//   };

//   const changeLanguage = (e) => {
//     if (!canChangeLang) {
//       alert("Please verify OTP before changing language.");
//       return;
//     }
//     i18n.changeLanguage(e.target.value);
//     setShowDropdown(false);
//   };

//   return (
//     <div>
//       {!canChangeLang && (
//         <>
//           <MenuItem onClick={handleRequest}>{t("change_language")}</MenuItem>
//           {otpSent && (
//             <div>
//               <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <button onClick={handleVerifyOtp}>Verify OTP</button>
//             </div>
//           )}
//         </>
//       )}

//       {canChangeLang && showDropdown && (
//         <select onChange={changeLanguage} defaultValue={i18n.language}>
//           <option value="en">English</option>
//           <option value="hi">Hindi</option>
//           <option value="fr">Français</option>
//           <option value="es">Español</option>
//           <option value="pt">Português</option>
//           <option value="zh">中文</option>
//         </select>
//       )}

//       {canChangeLang && !showDropdown && (
//         <button onClick={() => setShowDropdown(true)}>
//           {t("select_language")}
//         </button>
//       )}
//     </div>
//   );
// };

// export default LanguageSwitcher;

import React, { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUserAuth } from "../../context/Userauthcontext";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUserAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [canChangeLang, setCanChangeLang] = useState(false);

  useEffect(() => {
    const flag = localStorage.getItem("lang_verified_time");
    if (flag) {
      const timePassed = Date.now() - parseInt(flag);
      if (timePassed <= 5 * 60 * 1000) {
        setCanChangeLang(true);
      } else {
        localStorage.removeItem("lang_verified_time");
      }
    }
  }, []);

  const handleRequest = async () => {
    if (!user || !user.email) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/send-language-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (data.success) {
        alert("OTP sent to your email.");

        // 🔸 Prompt user to enter OTP
        const enteredOtp = prompt("Enter the OTP you received:");

        if (!enteredOtp) {
          alert("OTP is required to proceed.");
          return;
        }

        // 🔸 Send OTP to backend for verification
        const verifyResponse = await fetch(
          "http://localhost:5000/verify-language-otp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email, otp: enteredOtp }),
          }
        );

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
          alert(
            "OTP Verified. You can now change language from the dropdown menu below the change language button."
          );
          localStorage.setItem("lang_verified_time", Date.now().toString());
          setCanChangeLang(true);
          setShowDropdown(true); // show dropdown immediately
        } else {
          alert("OTP verification failed: " + verifyData.message);
        }
      } else {
        alert("Failed to send OTP: " + data.message);
      }
    } catch (error) {
      console.error("OTP Error:", error);
      alert("Something went wrong.");
    }
  };

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    setShowDropdown(false);
  };

  return (
    <div>
      <MenuItem onClick={handleRequest}>{t("change_language")}</MenuItem>

      {canChangeLang && showDropdown && (
        <select onChange={changeLanguage} defaultValue={i18n.language}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="pt">Português</option>
          <option value="zh">中文</option>
        </select>
      )}
    </div>
  );
};

export default LanguageSwitcher;
