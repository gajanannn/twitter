import React from "react";
import { useTranslation } from "react-i18next";
import "../pages.css";

const Explore = () => {
  const { t } = useTranslation();

  return (
    <div className="page">
      <h2 className="pageTitle">{t("welcome_explore")}</h2>
    </div>
  );
};

export default Explore;
