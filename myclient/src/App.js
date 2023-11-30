import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./Containers/Home/Home";
import React, { useContext } from "react";
import Auth from "./Containers/Auth/Auth";
import createVertical from "./Containers/createVertical/createVertical";
import Verticals from "./Containers/Verticals/Verticals";
import Vertical from "./Containers/Vertical/Vertical";
import Dataowner from "./Containers/Dataowner/Dataowner";
import DomainGroup from "./Containers/DomainGroup/DomainGroup";
import DomainPurchase from "./Containers/DomainPurchase/DomainPurchase";
import MyDomains from "./Containers/MyDomains/MyDomains";
import Namecheap from "./Containers/Namecheap/Namecheap";
import SMSROUTES from "./Containers/SMSROUTES/SMSROUTES";
// import SMSROUTE from "./Containers/SMSROUTE/SMSROUTE";
import Smsroutephones from "./Containers/Smsroutephones/Smsroutephones";
import SmsAddPhones from "./Containers/SmsAddPhones/SmsAddPhones";
import SmsAddPhonesStep2 from "./Containers/SmsAddPhonesStep2/SmsAddPhonesStep2";
import Leads from "./Containers/Leads/Leads";
import UploadLeadStep1 from "./Containers/Leads/UploadLeadStep1";
import UploadLeadStep2 from "./Containers/Leads/UploadLeadStep2";
import MessageFormatter from "./Containers/MessageFormatter/MessageFormatter";
import CreateMessageSchema from "./Containers/CreateMessageSchema/CreateMessageSchema";
import Campaigns from "./Containers/Campaigns/Campaigns";
import CreateCampaigns from "./Containers/Campaigns/CreateCampaigns";
import DataownerData from "./Containers/DataownerData/DataownerData";
import Settings from "./Containers/Settings/Settings";
import UpdatePassword from "./Containers/UpdatePassword/UpdatePassword";
import SuccessPasswordSet from "./Containers/UpdatePassword/SuccessPasswordSet";
import { AuthContext } from "./context/Auth.context";
import Subscription from "./Containers/Subscription/Subscription";
// import Helmet from "helmet";
// admin imports

import HomeAdmin from "./AdminContainer/Home/Home";
import UpdateLogo from "./AdminContainer/UpdateLogo/UpdateLogo";
import Users from "./AdminContainer/Users/Users";
import UserStatisticsPage from "./AdminContainer/Users/UserStatisticsPage";
import SMSROUTEWRAPPER from "./Containers/SMSROUTE/SMSROUTEWRAPPER";
import FAQ from "./Containers/FAQ/FAQ";
import Payments from "./Containers/Payments/Payments";
import Paypal from "./Containers/Payments/Paypal";
import APIPage from "./Containers/API/APIPage";
// import Bitcoin from "./Payments/Bitcoin";
import ErrorPage from "./Containers/ErrorPage/ErrorPage";
import _2wayAI from "./Containers/_2wayAI/_2wayAI";
function App() {
  const { admin , email} = useContext(AuthContext);
  // console.log(company);
  let app = (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/apidocs" component={APIPage} exact />
        <Route path="/payments" component={Payments} exact />
        <Route path="/payments/paypal" component={Paypal} exact />
        {/* <Route path="/payments/bitcoin" component={Bitcoin} exact /> */}
        <Route path="/login" component={Auth} exact />
        <Route path="/create-vertical" exact component={createVertical} />
        <Route path="/verticals" exact component={Verticals} />
        <Route path="/vertical/:id" exact component={Vertical} />
        <Route path="/dataowners" exact component={Dataowner} />
        <Route path="/dataowners/:id" exact component={DataownerData} />
        <Route path="/domain-groups" exact component={DomainGroup} />
        <Route path="/domain-purchase" exact component={DomainPurchase} />
        <Route path="/domains" exact component={MyDomains} />
        <Route path="/campaign-message" exact component={MessageFormatter} />
        <Route
          path="/campaign-message/:id"
          exact
          component={CreateMessageSchema}
        />
        <Route path="/domain-purchase/namecheap" exact component={Namecheap} />
        <Route path="/sms-routes" exact component={SMSROUTES} />
        <Route path="/leads" exact component={Leads} />
        <Route path="/sms-routes/:id" exact component={SMSROUTEWRAPPER} />
        <Route path="/sms-route-phones/:id" exact component={Smsroutephones} />
        <Route
          path="/sms-route-phones-create/step1/:id"
          exact
          component={SmsAddPhones}
        />
        <Route
          path="/sms-route-phones-create/step2/:id"
          exact
          component={SmsAddPhonesStep2}
        />
        <Route path="/leads/create/step1" exact component={UploadLeadStep1} />
        <Route
          path="/leads/create/step2/:id"
          exact
          component={UploadLeadStep2}
        />
        <Route path="/campaigns" exact component={Campaigns} />
        <Route path="/campaigns/create" exact component={CreateCampaigns} />
        <Route path="/reset-password" exact component={UpdatePassword} />
        <Route
          path="/reset-password-success"
          exact
          component={SuccessPasswordSet}
        />

        <Route path="/frequently-asked-questions" exact component={FAQ} />
        <Route path="/info/update-my-info" exact component={Settings} />
        <Route path="/2way-ai" exact component={_2wayAI} />

        <Route path="/subscription" exact component={Subscription} />
        {/* <Redirect exact from="/" to={email? "/dashboard":"/login"} /> */}
        <Route component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );

  if (admin) {
    app = (
      <BrowserRouter>
        <Switch>
          <Route path="/admin/dashboard" component={HomeAdmin} exact />
          <Route path="/admin/logo/update" component={UpdateLogo} exact />
          <Route path="/admin/user-management" component={Users} exact />
          <Route
            path="/admin/user-management/:id"
            component={UserStatisticsPage}
            exact
          />

          <Redirect exact from="/dashboard" to="/admin/dashboard" />

          {/* <Route path="/admin/logo/update" component={UpdateLogo} exact /> */}
        </Switch>
      </BrowserRouter>
    );
  }

  return <div className="App">{app}</div>;
}

export default App;
