import React, { useEffect, useState } from "react";

import { dbService } from "myBase";
import Pweet from "../components/Pweet";
import PweetFactory from "components/PweetFactory";

const Home = ({ userObj }) => {
  const [pweets, setPweets] = useState([]);

  useEffect(() => {
    dbService.collection("pweets").onSnapshot((snapshot) => {
      const pweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPweets(pweetArray);
    });
  }, []);

  return (
    <>
      <div>
        <PweetFactory userObj={userObj} />
      </div>
      <div>
        {pweets.map((pweet) => (
          <Pweet
            key={pweet.id}
            pweetObj={pweet}
            isOwner={pweet.creatorId === userObj.uid}
          />
        ))}
      </div>
      <span>Home</span>
    </>
  );
};
export default Home;
