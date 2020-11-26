import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';


import 'react-activity-indicator/src/activityindicator.css'
import ActivityIndicator from 'react-activity-indicator'
async function RecoverUserPassword({code , password}) {
  const req = {
    method : "POST",
    headers : {
      "Content-Type" : "application/json",
    },
    body : JSON.stringify({code : code , password : password})
  }
  
  const resp = await fetch("https://appi.samasecentro.com/users/password/recover",req)

  if(!resp.ok) {
    console.log(resp)
    throw Error
  }
  
  return await resp.json()
}


function DotsLoader({dotCountLimit}) {
  const [dotCount , setDotCount] = useState(0)  
  useEffect(()=>{
    setInterval(()=>{
      if(dotCount < dotCountLimit) {
        setDotCount(dotCount+1)
      } else {
        setDotCount(1)
      }
    },1000)
  },[])

  function renderDots() {
    var dots = []
    for(let i = 0 ; i < dotCount ; i++) {
      dots.push(
        <span key={i} style={{marginRight:5,backgroundColor:"#f00",width:30,height:30,borderRadius:30}}>WoW</span>
      )
    }
    return dots
  }

  return (
    <div>
      {renderDots()}
    </div>
  )

}


function App() {
  const [passwordOne ,setPasswordOne] = useState("")
  const [passwordTwo , setPasswordTwo] = useState("")
  const [error , setError] = useState("")
  const [success , setSuccess] = useState("")
  const [loading , setLoading] = useState(false)
  function onSubmit(e) {
    e.preventDefault()
    setSuccess("")
    setError("")
    if(!!passwordTwo) {
      if(passwordOne != passwordTwo) {
        setError("Kata kunci tidak sama")
        return
      } else {
        setError("")
      }
    }
    
    var url = new URL(window.location.href)
    var code = url.searchParams.get("code");
    console.log(code)
    setLoading(true)

    RecoverUserPassword({code : code , password : passwordOne}).then((resp)=>{
      console.log("Woi",resp)
      setSuccess("Kata sandi berhasil diganti")
      setLoading(false)
      // setTimeout(()=>{setSuccess("")},3000)
    }).catch((error)=>{
      setError("Kata sandi gagal diganti")
      setLoading(false)
    })
  
  }


  return (
    <div>
      <div className={"col-12"}>
        <div className={"col-lg-6"} style={{margin : "20px auto",border : "solid 1px #ccc",padding:20}}>
            <center><h3>Atur ulang kata sandi</h3></center>
            <form onSubmit={onSubmit}>
              <table className={"table"}>
                <tr>
                  <td>Kata sandi</td>
                </tr>

                <tr>
                  <td>
                    <input 
                      onChange={(e)=>{
                        setPasswordOne(e.target.value)
                      }}
                      required={true} 
                      type={"password"} 
                      className={"form-control"} />
                  </td>
                </tr>
                
                <tr>
                      <td>Masukkan ulang kata sandi</td>
                </tr>


                <tr>
                  <td>
                    <input
                      onChange={(e)=>{
                        setPasswordTwo(e.target.value)
                        if(!!e.target.value) {
                          if(passwordOne != e.target.value) {
                            setError("Kata kunci tidak sama")
                          } else {
                            setError("")
                          }
                        }
                      }}                     
                      required={true} 
                      type={"password"} 
                      className={"form-control"} />
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <button className={"btn btn-primary"}>SIMPAN</button>
                    <br/>
                    <br/>

                    {!!error && 
                        <span className={"btn btn-danger"}>{error}</span>
                    } 
                    {!!loading &&
                      <ActivityIndicator
                      number={5}
                      diameter={0}
                      borderWidth={1}
                      duration={200}
                      activeColor="#999"
                      borderColor="white"
                      color={"#000"}
                      borderWidth={5}
                      borderRadius="50%" 
                      />
                    }

                    {!!success &&
                      <span className={"btn btn-success"}>{success}</span>
                    }


                  </td>
                </tr>
              </table>
            </form>
         
        </div>
      </div>
    </div>
  );
}



export default App;
