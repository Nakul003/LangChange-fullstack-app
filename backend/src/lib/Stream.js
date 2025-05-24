import { StreamChat } from "stream-chat"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_SECRET_KEY

if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret key is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return console.log(`Stream user created or updated ${userData.name}`);
    } catch (error) {
        console.error("Error in upsertStreamUser function", error);
    }
};

export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error in generateStreamToken function", error);
    }
};