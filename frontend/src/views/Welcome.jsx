import React from 'react'
import verifyUser from '../services/auth.service'
import { Link, useParams } from 'react-router-dom'

const Welcome = () => {
    
    const { confirmationCode } = useParams()

    if(confirmationCode){
        verifyUser(confirmationCode)
    }

    return (
        <div className="container">
          <header className="jumbotron">
            <h3>
              <strong>Account confirmed!</strong>
            </h3>
          </header>
          <Link to={"/login"}>
            Please Login
          </Link>
        </div>
      )
}

export default Welcome