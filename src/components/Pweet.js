import { dbService, storageService } from "myBase";
import React, { useState } from "react";

const Pweet = ({pweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newPweet, setNewPweet] = useState(pweetObj.text);
    const onDeleteClick = async () => {
        if (window.confirm("Are you sure you want to delete this pweet?")) {
            dbService.doc(`pweets/${pweetObj.id}`).delete()
            await storageService.refFromURL(pweetObj.attachmentUrl).delete();
        }
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(pweetObj.text, newPweet)
        await dbService.doc(`pweets/${pweetObj.id}`).update({
            text: newPweet
        });
        setEditing(false)
    }
    const onChange = (event) => {
        const {target:{value}} = event;
        setNewPweet(value);   
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    return(
        <div>
            { editing ? <>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Edit your pweet" value={newPweet} onChange={onChange} required />
                    <input type="submit" value="Update Pweet" />
                </form>
                </> : <>
                {pweetObj.attachmentUrl && (
                    <img src={pweetObj.attachmentUrl} width="50px" height="50px" />
                )}
                <h4>{pweetObj.text}</h4>
                {isOwner && <>
                <button onClick={onDeleteClick}>Delete Pweet</button>
                <button onClick={toggleEditing}>Edit Pweet</button>
                </>}
            </>}
        </div>
    )

}

export default Pweet;