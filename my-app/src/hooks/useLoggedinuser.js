import React, { use, useEffect, useState } from "react";
import { useUserAuth } from "../context/Userauthcontext";

const useLoggedinuser = () => {
  const { user } = useUserAuth();
  const email = user?.email;
  const [loggedinuser, setloggedinuser] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/loggedinuser?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setloggedinuser(data);
      });
  }, [email, loggedinuser]);
  return [loggedinuser, setloggedinuser];
};

export default useLoggedinuser;
