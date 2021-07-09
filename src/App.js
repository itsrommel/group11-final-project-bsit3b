import './App.css';
import Post from "./pages/Post";
import ImageUpload from './pages/ImageUpload';
import logo from "./images/Logo.svg";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import React, {useState, useEffect} from "react";
import { db, auth } from './utils/firebase';
import { Button, Input } from '@material-ui/core';




function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    [theme.breakpoints.down('sm')]: {
        width: 300,
    }
  },

}));



function App() {



    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [posts, setPosts] = useState ([]); 
    const [Open, setOpen] = useState ([false]);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [username, setUsername] = useState ('');
    const [user, setUser] = useState (null);
    const [payload, setPayload] = useState({
      email:"",
      password:"",
      confirmPassword:"",
    });
    const handleChange = (prop) => (e) => {
      setPayload({...payload, [prop]: e.target.value});
    };

    useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((authUser) => {
          if(authUser){
            //user logged in

              
              setUser(authUser);   
            }
               else{
                 //user logged out
                   setUser(null);
                    }

        })

        return () => {
          unsubscribe();
        }
    }, [user, username]);

    useEffect(() => {

      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
          //evrytime new post added is added, this code runs 
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id, 
          post: doc.data()
        })));
      })}, []);
    
    

    const signIn = (e) => {
      e.preventDefault();

      if(payload.password.length <5){
        alert("Password should be atleast 6 characters!");
      }
      else{
      auth
      .signInWithEmailAndPassword (payload.email, payload.password) 
      .catch((error) => {
        alert("The email or password that you have entered is incorrect. Please signup first before you login.");
      })
      setOpenSignIn(false);

      setUsername('');
      
      setPayload(false);  
    }
    
    }


    const signUp = (e) => {
      e.preventDefault();


       if (payload.password !== payload.confirmPassword){
        alert("Password didn't match!");
      }
      else if (payload.password.length < 5){
        alert("Password should be atleast 6 characters!");
      }
      
      else{
      auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
      setOpen(false);
      setPayload(false);  
      setUsername('');
    }     
  }
  return (
    <div className="app">
      
      
         <Modal
           open={openSignIn}
           onClose={() => setOpenSignIn(false)}
           >
           <div style={modalStyle} className={classes.paper}>
           <form className="app_signup">
              <center>
              <img className="app_headerImage"
                   src={logo} 
                   alt="InstaBSU" 
                   height="80px" 
                   width="250px"
             />
             </center>
          
            
              <Input 
                placeholder ="Email"
                type="text" 
                value={payload.email} 
                onChange={handleChange("email")}
              >
              </Input>
              <Input 
                placeholder ="Password"
                type="password" 
                value={payload.password} 
                onChange={handleChange("password")}
              >
              </Input>
              <Button type="submit" onClick={signIn} >Sign In</Button>
             </form>  
             
           </div>
         </Modal>


         <Modal
           open={Open}
           onClose={() => setOpen(false)}
           >
           <div style={modalStyle} className={classes.paper}>
           <form className="app_signup">
              <center>
              <img className="app_headerImage"
                   src={logo} 
                   alt="InstaBSU" 
                   height="80px" 
                   width="250px"
             />
             </center>
          
             <Input 
                placeholder ="Username"
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              >
              </Input>
              <Input 
                placeholder ="Email"
                type="text" 
                value={payload.email} 
                onChange={handleChange("email")}
              >
              </Input>
              <Input 
                placeholder ="Password"
                type="password" 
                value={payload.password} 
                onChange={handleChange("password")}
              >
              </Input>
              <Input 
                placeholder ="Confirm password"
                type="password" 
                value={payload.confirmPassword} 
                onChange={handleChange("confirmPassword")}
              >
              </Input>
              <Button type="submit" onClick={signUp}>Sign Up</Button>
              
             </form>  
           </div>
         </Modal>
         
      <div className="app_header">
        <img className="app_headerImage"
             src={logo} 
             alt="InstaBSU" 
             height="80px" 
             width="250px"
        />
        {user ?(
         <Button onClick={() => auth.signOut()} >Logout</Button>
      ):(
        <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)} >Sign In</Button>
            <Button onClick={() => setOpen(true)} >Sign Up</Button>
        </div>
        
      )}
      </div>
      {user?.displayName ? (
          <ImageUpload username={user.displayName}/>
        ):( 
          <h3>Sorry you need to Login first to upload</h3>
        )}
      <div className="app_posts">
       {
        posts.map(({id, post })=> (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
       }  

      </div>
    </div>
    
  );

}

export default App;
