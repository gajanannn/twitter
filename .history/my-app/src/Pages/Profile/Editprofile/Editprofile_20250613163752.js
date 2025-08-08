import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import Button from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./Editprofile.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
};

function EditChild({ dob, setdob }) {
  const [open, setopen] = useState(false);
  const handleopen = () => {
    setopen(true);
  };
  const handleclose = () => {
    setopen(false);
  };
  return (
    <React.Fragment>
      <div className="birthdate-section" onClick={handleopen}>
        <text>Edit</text>
      </div>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleclose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 300, height: 300 }}>
          <div className="text">
            <h2>Edit Date of Birth</h2>
            <p>
              This can be Only changed few times
              <br />
              Make sure you enter the age of the <br />
              person using the account.{" "}
            </p>
            <input type="date" onChange={(e) => setdob(e.target.value)} />
            <button
              className="e-button"
              onClick={() => {
                setopen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

const Editprofile = (user, loggedinuser) => {
  const [name, setname] = useState("");
  const [bio, setbio] = useState("");
  const [location, setlocation] = useState("");
  const [open, setopen] = useState(false);
  const [dob, setdob] = useState("");
  const [website, setwebsite] = useState("");
  const handlesave = () => {
    const editinfo = {
      name,
      bio,
      location,
      website,
      dob,
    };
    fetch(`https://twitter-ot3r.onrender.com/userupdate/${user?.email}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(editinfo),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("done", data);
      });
  };

  return (
    <div>
      <button
        onClick={() => {
          setopen(true);
        }}
        className="Edit-profile-btn"
      >
        Edit Profile
      </button>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box style={style} className="modal">
          <div className="header">
            <IconButton onClick={() => setopen(false)}>
              <CloseIcon />
            </IconButton>
            <h2 className="header-title"> Edit Profile</h2>
            <button className="save-btn" onClick={handlesave}>
              Save
            </button>
          </div>
          <form className="fill-content">
            <TextField
              className="text-field"
              fullWidth
              label="Name"
              id="fullwidth"
              variant="filled"
              onChange={(e) => setname(e.target.value)}
              defaultValue={loggedinuser[0]?.name ? loggedinuser[0].name : ""}
            />
            <TextField
              className="text-field"
              fullWidth
              label="Bio"
              id="fullwidth"
              variant="filled"
              onChange={(e) => setbio(e.target.value)}
              defaultValue={loggedinuser[0]?.bio ? loggedinuser[0].bio : ""}
            />
            <TextField
              className="text-field"
              fullWidth
              label="Location"
              id="fullwidth"
              variant="filled"
              onChange={(e) => setlocation(e.target.value)}
              defaultValue={
                loggedinuser[0]?.location ? loggedinuser[0].location : ""
              }
            />
            <TextField
              className="text-field"
              fullWidth
              label="Website"
              id="fullwidth"
              variant="filled"
              onChange={(e) => setwebsite(e.target.value)}
              defaultValue={
                loggedinuser[0]?.website ? loggedinuser[0].website : ""
              }
            />
          </form>
          <div className="birthdate-section">
            <p>Birth date</p>
            <p>.</p>
            <EditChild dob={dob} setdob={setdob} />
          </div>
          <div className="last-section">
            {loggedinuser[0].dob ? (
              <h2>{loggedinuser[0].dob}</h2>
            ) : (
              <h2>{dob ? dob : "Add your date of birth"}</h2>
            )}
            <div className="last-btn">
              <h2>Switch to professional</h2>
              <ChevronRightIcon />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
export default Editprofile;
