import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './context/authContext'


export default function Home() {
    const { accessToken, currentUser } = useContext(AuthContext);
    console.log(currentUser)
  return (
    <div className='container'>
        <div className="row my-5">
            <div className="col-md-10 mx-auto">
                <div className="card">
                    <div className="card-body">
                        <h3 className="text-center mt-2">
                            DASHBOARD
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}