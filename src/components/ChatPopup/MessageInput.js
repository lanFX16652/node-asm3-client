import { Input } from 'antd'
import React, { useState } from 'react'
import axiosInstance from '../../apis/axios'
import { LocalStorageService } from '../../services'
import { useDispatch, useSelector } from 'react-redux'
import { setRoomData, updateMessages, setChatId } from '../../store/chatSlice';

export const MessageInput = () => {
    const chatId = useSelector((state) => state.chat.chatId)
    const [content, setContent] = useState('')

    const dispatch = useDispatch()

    const onChat = async (value) => {

        if (!value) return

        if (!chatId) {
            const response = await axiosInstance.post('/chat/create-room', {
                content: value,
                authorType: 'Client'
            })

            LocalStorageService.store('chatId', response.data._id)
            dispatch(setChatId(response.data._id))
            dispatch(setRoomData(response.data))
        } else {
            const response = await axiosInstance.post('/chat/new-message', {
                content: value,
                chatId,
                authorType: 'Client'
            })

            dispatch(updateMessages(response.data))
        }

        setContent('')
    }

    return (
        <Input.Search value={content} onChange={(e) => setContent(e.target.value)} allowClear enterButton="Send" onSearch={onChat} width={'100%'} placeholder="enter your message" />
    )
}
