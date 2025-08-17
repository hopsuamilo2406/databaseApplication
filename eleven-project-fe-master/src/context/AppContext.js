import {createContext, useState} from "react";

export const AppContext = new createContext({});

export const AppProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState({});
    const [cartInfo, setCartInfo] = useState({});
    const [isAuthen, setIsAuthen] = useState(false);
    const [totalCart, setTotalCart] = useState(0);

    // useEffect(() => {
    //     let username = localStorage.getItem(USERNAME);
    //     let email = localStorage.getItem(EMAIL);
    //     console.log("AppProvider: " + username);
    //     console.log("AppProvider: " + email);
    //
    //     setUserInfo({username: username, email: email});
    //     console.log("AppProvider: " + JSON.stringify(userInfo));
    //
    //     setIsAuthen(userInfo?.username !== undefined);
    //     console.log("AppProvider: " + isAuthen);
    // }, [])

    return <AppContext.Provider value={{userInfo, setUserInfo, cartInfo, setCartInfo, isAuthen, setIsAuthen, totalCart, setTotalCart}}>
        {children}
    </AppContext.Provider>
}