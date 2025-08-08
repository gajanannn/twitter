import React from "react";
import "./widgets.css";
import SearchIcon from "@mui/icons-material/Search";
import { TwitterTimelineEmbed, TwitterTweetEmbed } from "react-twitter-embed";
import { useTranslation } from "react-i18next";

const Widgets = () => {
  const { t } = useTranslation();

  return (
    <div className="widgets">
      <div className="widgets_input">
        <SearchIcon className="widget_serachIcon" />
        <input placeholder={t("searchTwitter")} type="text" />{" "}
      </div>
      <div className="widgets_widgetContainer">
        <h2>{t("whatsHappening")}</h2>
        <TwitterTweetEmbed tweetId={"1927445728172920968"} />
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="Valorent"
          options={{ height: 400 }}
        />
      </div>
    </div>
  );
};
export default Widgets;
