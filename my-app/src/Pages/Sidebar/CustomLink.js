import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
const CustomLink = ({ children, to, props }) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });
  console.log(to);
  return (
    <div>
      <Link
        style={{
          textDecoration: "none",
          color: match ? "var(--twitter-color" : "black",
        }}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </div>
  );
};
export default CustomLink;
