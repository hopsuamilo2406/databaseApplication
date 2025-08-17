import {ACCESS_TOKEN, EMAIL, USERNAME} from "../../API/utils";

const Logout = () => {
    localStorage.removeItem(EMAIL);
    localStorage.removeItem(USERNAME);
    localStorage.removeItem(ACCESS_TOKEN);

    window.location = "/";
}

export default Logout;