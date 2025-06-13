import React from 'react'
import "./widgets.css"
import SearchIcon from "@mui/icons-material/Search";
import { TwitterTimelineEmbed, TwitterTweetEmbed } from "react-twitter-embed";

const Widgets = () => {
  return (
    <div className='widgets'>
      <div className='widgets_input'>
        <SearchIcon className='widget_serachIcon' />
        <input placeholder='Search Twitter' type='text' />
      </div>
      <div className='widgets_widgetContainer'>
        <h2>What's Happening</h2>
        <TwitterTweetEmbed tweetId={"1927445728172920968"} />
        <TwitterTimelineEmbed sourceType="profile" screenName="Valorent" options={{ height: 400 }} />

      </div>
    </div>
  )
}
export default Widgets;