import {StreamChat} from "stream-chat";
import "dotenv/config";


const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if(!apiKey || !apiSecret) {
    console.error("Strem API key or secret is missing.");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
       await streamClient.upsertUser({
           id: userData.id,
           name: userData.name,
           image: userData.image || "",
       });
       return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
};


// todo: do it later
export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
};
