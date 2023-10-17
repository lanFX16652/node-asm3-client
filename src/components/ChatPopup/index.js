import React, { useEffect, useState } from "react";
import classes from "./ChatPopup.module.css";
import { Outlet, useLocation } from "react-router-dom";
import { CloseCircleOutlined, MessageTwoTone } from "@ant-design/icons";
import { Card, Space, Typography } from "antd";
import { MessageInput } from "./MessageInput";
import { useDispatch, useSelector } from "react-redux";
import { selectChatState, setRoomData, updateMessages } from "../../store/chatSlice";
import { styled } from "styled-components";
import { LocalStorageService } from "../../services";
import axiosInstance from "../../apis/axios";

const ChatPopup = () => {
  const dispatch = useDispatch();
  const [openChat, setOpenChat] = useState(false);
  const { roomData } = useSelector(selectChatState);
  const chatId = LocalStorageService.load("chatId");
  const location = useLocation()

  useEffect(() => {
    if (chatId) {
      axiosInstance.get(`/chat/${chatId}`).then((result) => {
        dispatch(setRoomData(result.data));
      });
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    global.socketInstance.on("new-message", (message) => {
      if (message.authorType === "Admin") {
        dispatch(updateMessages(message))
      }
    });

    return () => {
      global.socketInstance.off("new-message");
    };
  }, [dispatch]);

  useEffect(() => {
    setOpenChat(false)
  }, [location.pathname])

  return (
    <>
      <Outlet />
      <div className={classes.wrapper}>
        {openChat ? (
          <Card
            title={
              <SpaceStyled>
                <Typography.Title level={5}>Customer Support</Typography.Title>
                <CloseCircleOutlined onClick={() => setOpenChat(false)} />
              </SpaceStyled>
            }
            className={classes.popup}
          >
            <div className={classes["chat-view"]}>
              {roomData?.messages?.map((message) => {
                return (
                  <MessageItemStyled key={message?._id} $message={message}>
                    {message.authorType === 'Admin' ? ' Admin:' : ''}   {message.content}  {message.authorType === 'Client' ? ' :You' : ''}

                  </MessageItemStyled>
                );
              })}
            </div>
            <MessageInput />
          </Card>
        ) : (
          <MessageTwoTone
            onClick={() => setOpenChat(true)}
            style={{ fontSize: 50, cursor: "pointer" }}
          />
        )}
      </div>
    </>
  );
};

export default ChatPopup;

const SpaceStyled = styled(Space)`
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .ant-space-item {
    display: flex;
    align-items: center;

    h5 {
      margin-bottom: 0;
    }
  }
`;

const MessageItemStyled = styled.div`
  margin-top: 8px;
  text-align: ${(props) => props.$message.authorType === 'Client' ? 'right' : 'left'}
`;
