"use client";
import { Button } from "@/components/ui/button";
import { createUser } from "@/convex/user";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);
  useEffect(() => {
    user && CheckUser();
  }, [user]);

  const CheckUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });
  };
  return (
    <>
      <h1>Hey WieDigital!</h1>
      <Button>Button</Button>

      <UserButton />
    </>
  );
}
