import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import React, { useContext } from 'react'
import { Button } from "../ui/button"
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";

const SignInDialog = ({ openDialog, closeDialog }) => {

    const {userDetail,setUserDetail} = useContext(UserDetailContext);

    const CreateUser=useMutation(api.users.CreateUser);

const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: 'Bearer '+tokenResponse?.access_token } },
      );
  
      console.log(userInfo);
      const user = userInfo.data;
      await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        uid: uuid4(),
      })

      if(typeof window !== 'undefined'){
        localStorage.setItem('user', JSON.stringify(user));
      }

      setUserDetail(userInfo?.data);
      closeDialog(false);
    },
    onError: errorResponse => console.log(errorResponse),
  });
    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription >
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.

                    </DialogDescription>
                </DialogHeader>
                <Button onClick={googleLogin}>Sign in with Google</Button>
            </DialogContent>
        </Dialog>

    )
}

export default SignInDialog