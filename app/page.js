"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);

  const checkUser = async () => {
    await createUser({
      email: user?.primaryEmailAddress.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });
  };

  useEffect(() => {
    if (user) checkUser();
  }, [user]);
  return (
    <>
      <h1>Hey WieDigital!</h1>
      <Button>Button</Button>

      <UserButton />
    </>
  );
}
