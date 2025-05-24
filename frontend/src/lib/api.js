import { axiosInstance } from "./axios.js";

export const signup = async(signupData)=>{
    const res = await axiosInstance.post("/auth/signup", signupData); 
    return res.data
}

export const login = async(loginData)=>{
    const res = await axiosInstance.post("/auth/login", loginData); 
    return res.data
}

export const logout = async()=>{
    const res = await axiosInstance.post("/auth/logout"); 
    return res.data
}

export const checkAuthUser = async()=>{
  try {
    const res = await axiosInstance.get("/auth/checkAuth");
    return res.data
  } catch (error) {
    console.error("Error in checkAuthUser function", error);
    return null
  }
}

export const completeOnBoard = async(userData)=>{
  const res = await axiosInstance.post("/auth/onboarding", userData);
  return res.data
}

export const getUserFriends = async()=>{
  const res = await axiosInstance.get("/user/friends");
  return res.data
}

export const getRecommendedUsers = async()=>{
  const res = await axiosInstance.get("/user");
  return res.data
}

export const getOutgoingFriendReqs = async()=>{
  const res = await axiosInstance.get("/user/outgoing-friend-requests");
  return res.data
}

export const sendFriendRequest = async(userId)=>{
  const res = await axiosInstance.post(`/user/friend-request/${userId}`);
  return res.data
}

export const acceptFriendRequests = async(userId)=>{
  const res = await axiosInstance.put(`user/friend-request/${userId}/accept`);
  return res.data
}

export const getFriendRequests = async()=>{
  const res = await axiosInstance.get(`/user/friend-requests`);
  return res.data
}

export const getStreamToken = async()=>{
  const res = await axiosInstance.get(`/chat/token`);
  return res.data
}