import React, { useEffect } from 'react'
import axios from "axios";
import { useUserAuth } from '../../context/Userauthcontext';


const LoginHistory = async () => {
    const { user } = useUserAuth()
    const email = user?.email
    const [history, setHistory]= useEffect("")
    
    const fetchHistory = async(() => {
        const response = await axios.get(
            `http://localhost:5000/loginHistory?email=${email}`
        )
        setHistory(response.data);
    }
        
    })
    
  return (
    <div>LoginHistory</div>
  )
}

export default LoginHistory