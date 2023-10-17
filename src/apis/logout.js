import axiosInstance from "./axios"
import { setUser } from "../store/userSlice"
import { useDispatch } from "react-redux";
import { LocalStorageService } from "../services";
import { setRoomData } from "../store/chatSlice";

export const useLogout = () => {
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            const response = await axiosInstance.post('logout')

            if (response.status === 200) {
                dispatch(setUser(null))
                LocalStorageService.remove("user");
                LocalStorageService.remove("chatId");
                dispatch(setRoomData(null))
            }
        } catch (error) {
            console.log(error)
        }
    }

    return [logout]
}
