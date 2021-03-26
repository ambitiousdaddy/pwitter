import React, { useState } from "react";
import { dbService, storageService } from "myBase";
import { v4 as uuidv4 } from "uuid";

const PweetFactory = ({ userObj }) => {
  const [pweet, setPweet] = useState("");
  const [attachment, setAttachment] = useState();
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment != "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const pweetObj = {
      text: pweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("pweets").add(pweetObj);
    setPweet("");
    setAttachment("");
  };
  const onClear = () => setAttachment(null);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setPweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
        value={pweet}
        onChange={onChange}
      />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="pweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" alt="lslsls" />
          <button onClick={onClear}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default PweetFactory;
