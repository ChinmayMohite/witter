import User from "../models/User.js";

export const getUser = async (req,res)=>{
    try {
        const {id} = req.param;
        const user = await User.findById(id);
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message : error.message})
    }
}

export const getUserFriends = async (req,res)=>{
    try {
    const {id} = req.param;
    const user = await User.findById(id);
    const friends = await Promise.all(
        user.friends.map((id)=>{
            User.findById(id)
        })
    );
    const formattedFriends = friends.map((
        {id,firsrName,lastName,occupation,location,picturePath})=>{
            return {id,firsrName,lastName,occupation,location,picturePath}
        })
    res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({message : error.message})
    }
}

export const addRemoveFriend = async (req,res)=>{
    try {
        const {id,friendId} = req.param;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        if(user.friends.include(friendId)){
            user.friends = user.friends.filter((id)=>id!== friendId);
            friend.friends = friend.friends.filter((id)=>id!==id);
        }
        else{
            user.friends.pus(friendId);
            user.friends.push(id);
        }
        await user.save();
        await friend.save();
        const friends = await Promise.all(
            user.friends.map((id)=>{
                User.findById(id)
            })
        );
        const formattedFriends = friends.map((
            {id,firsrName,lastName,occupation,location,picturePath})=>{
                return {id,firsrName,lastName,occupation,location,picturePath}
            })

        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}