import { useRef } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Test from "./Test";

//=>>> Sounds
import S1 from "../../assets/sounds/s-1.mp3";
import S2 from "../../assets/sounds/s-2.mp3";

const Profile = () => {
  const audioRef = useRef(null);
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Profile</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />
      {/* For go to top */}

      <div className="content animated fadeInDown">
        <h1 className="page-title">Profile</h1>
        <Test />

        <button onClick={playSound}>Play sound</button>
        <audio ref={audioRef} preload="auto">
          <source src={S1} type="audio/mpeg" />
          <source src={S2} type="audio/mpeg" />
        </audio>
      </div>
    </HelmetProvider>
  );
};

export default Profile;
