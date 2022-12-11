import axios from "axios";
import {showAlert} from "./alerts";

//type can be password or data
export const updateSettings = async (data, type) => {
    try{
        const url = type === 'password' ? 'updateMyPassword' : 'updateMe'

        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:3000/api/users/${url}`,
            data
        });

        if(res.data.status === 'success') {

            showAlert('success', `${type.toUpperCase()} updated successfully`);

            window.setTimeout(()=>{
                location.reload(true);
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}
