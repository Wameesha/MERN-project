import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {

    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const getRecommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } }, // Exclude friends
                {isOnBoarded: true} // Only include users who have completed onboarding
            ]
        })
        res.status(200).json(recommendedUsers)
    } catch (error) {
        console.error("Error fetching recommended users:", error.message);
        res.status(500).json({message: "Internal server error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilepic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error fetching friends:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}