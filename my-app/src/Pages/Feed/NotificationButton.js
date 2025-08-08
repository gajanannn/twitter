import React from "react";
import { useUserAuth } from "../../context/Userauthcontext";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

export const NotificationButton = () => {
  const { t } = useTranslation();
  const { notificationEnabled, SetnotificationEnabled } = useUserAuth();

  const handleClick = () => {
    SetnotificationEnabled(!notificationEnabled);
  };

  return (
    <MenuItem onClick={handleClick}>
      {notificationEnabled
        ? t("disable_notifications")
        : t("enable_notifications")}
    </MenuItem>
  );
};
