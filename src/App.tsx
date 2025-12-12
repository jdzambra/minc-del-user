import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { signIn } from 'aws-amplify/auth';
import { deleteUser } from 'aws-amplify/auth';

import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
Amplify.configure(config);

Amplify.configure({
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_VZFgpRZBj',
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: '7fo3497l3l0ji5gou2qohuemb6',
    }
  }
});

const currentConfig = Amplify.getConfig();

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [textResult, setTextResult] = useState("");
  const [disabledel, setDisabledel] = useState(true);

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    // You can pass formData as a fetch body directly:
    //fetch("/some-api", { method: form.method, body: formData });
    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    
    async function handlesignIn ({username, password}) {
      try {
        const {isSignedIn, nextStep} = await signIn ({username, password});
        console.log(isSignedIn, nextStep.signInStep);
        if (isSignedIn) {
          disabledel === true ? setDisabledel(false) : setDisabledel(true);
          setTextResult("Account confirmed, please click on Delete...");
        }
      } catch (error) {
        
        console.log("amplify error signI", error);
        setTextResult("Error: " + error + " Please try later");
        
      }
    }

    handlesignIn ({
      username: formJson.email,
      password: formJson.password,
    });
    

  }

  function handleReset(e) {
    setEmail("");
    setPassword("");
    setTextResult("Form reseted");
    disabledel === true ? setDisabledel(false) : setDisabledel(true);
    
  }

  async function handledelete() {
    try {
      await deleteUser();
    } catch (error) {
      console.log(error);
    }
    setTextResult("Account deleted, do not forget sign out your app, you can come back any time. Thank you");
    disabledel === true ? setDisabledel(false) : setDisabledel(true);
  }

  return (
    <><div className="App">
      
    </div>
      <form className='App-header' method="post" onSubmit={handleSubmit} onReset={handleReset}>
        <h1>
          Welcome, please type your email and password to delete your account from Calchi app
        </h1>
        <label>
          E-mail:
          <input className='Field'
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <div>
          <h4> </h4>
        </div>
        <label>
          Password:
          <input className='Field'
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div>
          <h4> </h4>
        </div>
        <button
          type="submit"
        >
          Confirm Account
        </button>
        <div>
          <h4> </h4>
        </div>
        <button type="reset">
          Reset form
        </button>
        <div>
          <h4>{textResult}</h4>
        </div>
        <button
          type='button'
          disabled={disabledel === true ? true : false}
          onClick={handledelete}
        >
          Delete
        </button>
        <div>
          <h4> </h4>
        </div>
      </form>

    </>
  );
}

export default App;
