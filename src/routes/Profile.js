import React, { useEffect, useState } from "react"
import {authService, dbService} from "myBase"
import {useHistory} from "react-router-dom"

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/")
    }
    const getMyPweets = async() => {
        const pweets = await dbService.collection("pweets").where(
            "creatorId", "==", userObj.uid
        ).orderBy("createdAt", "desc")
        .get();
        console.log(pweets.docs.map(doc => doc.data()))
    }
    useEffect(() => {
        getMyPweets();
    }, [])
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName
            })
            refreshUser();
        }
    }
    const onChange = (event) => {
        event.preventDefault();
        const {target:{value}} = event;
        setNewDisplayName(value);
    }
    return ( <>
    <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="Display name" value = {newDisplayName}/>
        <input type="submit" value="Update profile" />
    </form>
        <button onClick={onLogOutClick}>Log Out</button>
    </>)
}

<span>Profile</span>