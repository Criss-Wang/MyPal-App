const Auth = () => {
    if (localStorage.usertoken){
        return true;
    } else {
        return false;
    }
}

export default Auth