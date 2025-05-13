import { createContext, useEffect, useState } from "react";


export const DContext = createContext()


const DataContext = ({ children }) => {

    const BeURL = process.env.REACT_APP_BeURL
    const [isAuth, setIsAuth] = useState(null)




    const handleLogout = () => {
        fetch(`${BeURL}/logout`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message)
                if (data.success) {
                    setIsAuth(false)

                }
            })
            .catch(err => {
                console.log("Erron in Logout:", err)
                alert("Trouble in connecting to the Server, please try again later.")
            })
    }

    const data = { isAuth, setIsAuth, BeURL, handleLogout }

    return (
        <DContext.Provider value={data}>
            {children}
        </DContext.Provider>
    )
}

export default DataContext