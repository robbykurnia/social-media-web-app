import React from "react";

const ProfileJumbotron = ({ idThisProfile, usernameThisProfile }) => {
  const styleJumbotron = {
    background: `url("https://i.picsum.photos/id/1${idThisProfile}/1000/200.jpg") no-repeat center center`,
    backgroundSize: "cover",
    // justifyContent: "center",
    // alignItems: "center",
    // display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    height: "200px"
  };

  const styleCard = {
    maxHeight: "300px"
  };

  const stylePhoto = {
    borderRadius: "50%",
    border: "2px solid grey",
    width: "150px",
    height: "150px",
    position: "absolute",
    transform: "translateY(80px)"
  };
  return (
    <div className="card mb-3" style={styleCard}>
      <div
        className="container jumbotron jumbotron-fluid rounded-top"
        style={styleJumbotron}
      ></div>
      <img
        style={stylePhoto}
        className="ml-4"
        src={`https://i.picsum.photos/id/${idThisProfile}/160/160.jpg`}
        alt="Profile"
      />
      <h4 className="ml-4">{usernameThisProfile}</h4>
    </div>
  );
};

export default ProfileJumbotron;
