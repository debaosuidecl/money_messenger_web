import React from 'react'
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import classes from "./SMSROUTE.module.css";
import { useParams } from "react-router";
import VerticalImage from "../../images/business2.jpg";

import SMSROUTEAPI from './SMSROUTEAPI';
import Layout from "../../Component/Layout/Layout"
import {Link} from "react-router-dom"
import SMSROUTESMPP from './SMSROUTESMPP';
// import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Loader from '../../Component/Loader/Loader';

function SMSROUTEWRAPPER() {
    const { id } = useParams();
    const [route, setroute] = React.useState({})
    const [error, seterror] = React.useState(false)
    const [loading, setloading] = React.useState(true)
    React.useEffect(()=>{

        getSMSROUTE(id)
        
    }, [])

    const getSMSROUTE = async (id) => {
        try {
          const res = await REQ(
            "get",
            `${GLOBAL.domainMain}/api/smsroutes/single/${id}`,
            null,
            true
          );
          console.log(res);
          const data = res.data;
          setloading(false)

          if(!data){
              return seterror(true)
          }

          if(!data.routetype){
                return seterror(true)
          }
          setroute(res.data)
  
        } catch (error) {
            console.log(error)
        }   
      };
    return (
        <Layout>
            <br></br>
            {/* <br></br> */}
            
            {loading? <div className={classes.ErrorsOn}>

                <br></br>

                <div className=" p-5">
                    <Loader/>
                </div>
                </div>
                :  route.routetype === "API" ?
                <SMSROUTEAPI sroute={route}/>:
                route.routetype === "SMPP"?

                <SMSROUTESMPP sroute={route}/> :
                <div>
                      <img src={VerticalImage} height="360px" alt="" />
                        <br></br>
                        <br></br>
                        <p>This Route was not found</p>

                        <p>
                            <Link to="/sms-routes">Go  Back To  Routes</Link>
                        </p>
                </div>
            }
        </Layout>
    )
}

export default SMSROUTEWRAPPER
