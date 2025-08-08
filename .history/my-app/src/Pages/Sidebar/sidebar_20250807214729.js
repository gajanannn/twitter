import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Divider from "@mui/material/Divider";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useLoggedinuser from "../../hooks/useLoggedinuser";
import "./sidebar.css";
import CustomLink from "./CustomLink";
import SidebarOption from "./sidebaroption";
import { NotificationButton } from "../Feed/NotificationButton";
import LanguageSwitcher from "../../assets/Language/LanguageSwitcher";
import LoginHistory from "../Login/LoginHistory";

const Sidebar = ({ handlelogout, user }) => {
  const [anchorE1, setanchorE1] = useState(null);
  const openmenu = Boolean(anchorE1);
  const [loggedinuser] = useLoggedinuser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [ShowHistory, setShowHistory] = useState(false);

  const handleClick = (e) => {
    setanchorE1(e.currentTarget);
  };

  const handleClose = () => {
    setanchorE1(null);
  };

  const result = user?.email?.split("@")[0];

  return (
    <>
      <div className="sidebar">
        <TwitterIcon className="sideber_twittericon" />

        <CustomLink to="/home/feed">
          <SidebarOption active Icon={HomeIcon} text={t("home")} />
        </CustomLink>

        <CustomLink to="/home/explore">
          <SidebarOption Icon={SearchIcon} text={t("explore")} />
        </CustomLink>
        <CustomLink to="/home/location">
          <SidebarOption Icon={LocationOnOutlinedIcon} text={t("location")} />
        </CustomLink>
        <CustomLink to="/home/notifications">
          <SidebarOption
            Icon={NotificationsNoneIcon}
            text={t("notifications")}
          />
        </CustomLink>
        <CustomLink to="/home/messages">
          <SidebarOption Icon={MailOutlineIcon} text={t("messages")} />
        </CustomLink>
        <CustomLink to="/home/bookmarks">
          <SidebarOption Icon={BookmarkBorderIcon} text={t("bookmarks")} />
        </CustomLink>
        <CustomLink to="/home/lists">
          <SidebarOption Icon={ListAltIcon} text={t("lists")} />
        </CustomLink>
        <CustomLink to="/home/profile">
          <SidebarOption Icon={PermIdentityIcon} text={t("profile")} />
        </CustomLink>
        <CustomLink to="/home/more">
          <SidebarOption Icon={MoreIcon} text={t("more")} />
        </CustomLink>

        <Button variant="outlined" className="sidebar_tweet">
          {t("tweet")}
        </Button>

        <div className="profile_info">
          <Avatar
            src={
              loggedinuser
                ? loggedinuser[0]?.profileImage
                : user && user.photoURL
            }
          />
          <div className="user_info">
            <h4>{loggedinuser ? loggedinuser[0]?.name : user?.displayName}</h4>
            <h5>@{result}</h5>
          </div>

          <IconButton
            size="small"
            sx={{ ml: 2 }}
            aria-controls={openmenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openmenu ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreHorizIcon />
          </IconButton>

          <Menu
            id="basic-menu"
            anchorE1={anchorE1}
            open={openmenu}
            onClose={handleClose}
          >
            <MenuItem
              className="Profile_info1"
              onClick={() => {
                navigate("/home/profile");
                handleClose();
              }}
            >
              <Avatar
                src={
                  loggedinuser
                    ? loggedinuser[0]?.profileImage
                    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                }
              />
              <div className="user_info subUse_info">
                <div>
                  <h4>
                    {loggedinuser ? loggedinuser[0]?.name : user?.displayName}
                  </h4>
                  <h5>@{result}</h5>
                </div>
                <ListItemIcon className="done_icon" color="blue">
                  <DoneIcon />
                </ListItemIcon>
              </div>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleClose}>
              {t("add_existing_account")}
            </MenuItem>
            <MenuItem onClick={handlelogout}>
              {t("logout")} @{result}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setShowHistory(!ShowHistory);
              }}
            >
              Show login History
            </MenuItem>

            <NotificationButton />
            <LanguageSwitcher />
          </Menu>
        </div>
      </div>
      {ShowHistory && <LoginHistory />}
    </>
  );
};

export default Sidebar;
