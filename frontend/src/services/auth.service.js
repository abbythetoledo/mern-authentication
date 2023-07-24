import axios from "axios";

const verifyUser = (code) => {
    return axios.get(`http://127.0.0.1:5000/api/users/confirm/${code}`).then((response) => {
        return response.data
    })
}

export default verifyUser