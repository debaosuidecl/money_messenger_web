import React from 'react'
import Layout from '../../Component/Layout/Layout'
import classes from "./_2wayAI.module.css"
import Brain from "../../images/brain.gif"
export default function _2wayAI() {
  return (
    <Layout>
      <div className={classes._2wayAI}>
        <img src={Brain} height={300}/>
        <h2>2 WAY ARTIFICIAL INTELLIGENCE</h2>

        <p>This feature is currently being beta tested and is coming soon.</p>
      </div>
      
    </Layout>
  )
}
