import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('https://', 'wss://') : 'ws://localhost:5000');

global.socketInstance = socket;

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        socket,
        roomData: null,
        chatId: null,
    },
    reducers: {
        setRoomData: (state, action) => {
            state.roomData = action.payload
        },
        updateMessages: (state, action) => {
            state.roomData = { ...state.roomData, messages: [...state.roomData.messages, action.payload] }
        },
        setChatId: (state, action) => {
            state.chatId = action.payload
        }
    }
})

export const selectChatState = (state) => state.chat
export const chatReducer = chatSlice.reducer
export const { setRoomData, updateMessages, setChatId } = chatSlice.actions