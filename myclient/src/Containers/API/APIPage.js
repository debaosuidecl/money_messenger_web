import React, { useState } from 'react'
import Layout from "../../Component/Layout/Layout";
import {useQuery, useMutation, useQueryClient} from 'react-query';
import classes from "./APIPage.module.css"
import { LinearProgress } from '@material-ui/core';
import GLOBAL from '../GLOBAL/GLOBAL';
import requestModule from '../../helperFunctions/requestModule';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCopy } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import {useAlert} from 'react-alert'
export default function APIPage() {
    // local state

    const [loadingmutation, setloadingmutation] = useState(false);

    const { isLoading, error, data } = useQuery('apidata', () => {

       return requestModule("GET", `${GLOBAL.domainMain}/api/apiroute`, null,true)
    },
    {
    cacheTime: Infinity,        
    })
    // client
    const queryClient = useQueryClient();

    // useAlert

    const myalert = useAlert()

    // mutations

    /** REGENERATE MUTATION */
    const regenerateMutation = useMutation(
        () =>   requestModule("GET", `${GLOBAL.domainMain}/api/apiroute/create`, null,true),
        {   
          onSuccess: () => {
            queryClient.invalidateQueries('apidata');
            myalert.show("API key regenerated", {
                type: "success"
            })
          },
          onError: ()=>{
            myalert.show("Error generating api key", {
                type: "success"
            })
          },
          onSettled: ()=>{
            setloadingmutation(false)
          }
          
        }
      );

      const copyToClipboard = async (apiKey) => {
        try {
          await navigator.clipboard.writeText(apiKey);
        //   setCopied(true);
    
          // Reset the copied state after a brief delay
        //   setTimeout(() => {
        //     setCopied(false);
        //   }, 2000);
            myalert.show("Copied to clipboard", {
                type: "info",
            })
        } catch (error) {
          console.error('Error copying to clipboard:', error);
        }
      };

    if(error){
        return <p>Could not generate API Key</p>
    }
    console.log(data?.data?.data.apiKey)



  return (
    <Layout>
        
        <div className={classes.APIPage}>
            <br></br>
            <h1 className={classes.Header}>Manage API Keys</h1>
            <br></br>
            <p className={classes.sub}>Generate API key, access documentation and restrict by IP</p>

            <br></br>
            <br></br>

            {isLoading? <LinearProgress/>:<p className={classes.ApiKey}><span className={classes.apikey1}>My API Key:</span>  <span className={classes.apikey2}>{data?.data?.data?.apiKey}</span>  <FontAwesomeIcon className={classes.Copy} onClick={()=> copyToClipboard(data?.data?.data?.apiKey)} icon={faCopy}/></p>}
            <br></br>
            <br></br>
            {loadingmutation && <LinearProgress/>}
            <Button onClick={()=>{
                setloadingmutation(true);             
                regenerateMutation.mutate();
            }}>Regenerate API key</Button>
            <br></br>
            <br></br>
            <a target="_blank" href="https://documenter.getpostman.com/view/4683244/2s9YeEcY8T">View API Documentation</a>
        </div>
        {/*  password: '$2a$10$zPlJNlgkJflDJiHWHPMF3.RgNobrfWcUkdZopXlEuI0GeFvh9qXuO', */}
    </Layout>
  )
}
