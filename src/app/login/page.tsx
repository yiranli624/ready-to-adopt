"use client";
import { Input } from "@heroui/input";
import { Button, Form } from "@heroui/react";
import { redirect } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputUserData = Object.fromEntries(new FormData(event.currentTarget));

    const { status } = await fetch(
      "https://frontend-take-home-service.fetch.com/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputUserData),
        credentials: "include"
      }
    );
    if (status === 200) {
      redirect("/dogs");
    } else {
      console.log("status code is", status);
    }
  };

  return (
    <div className='flex-1 flex flex-col gap-4 justify-center items-center text-slate-700 text-xl'>
      <p>Please enter your name and email address to get started!</p>
      <Form
        className='bg-slate-200 rounded shadow-lg w-full max-w-xs px-10 py-6 flex flex-col gap-4'
        validationBehavior='native'
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <Input
          isRequired
          errorMessage='Please enter a valid name'
          label='Name'
          name='name'
          type='text'
          size='lg'
        />
        <Input
          isRequired
          errorMessage='Please enter a valid email'
          label='Email'
          name='email'
          type='email'
          size='lg'
        />

        <div className='w-full flex gap-2 justify-around'>
          <Button
            type='submit'
            className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg'
            radius='full'
          >
            Submit
          </Button>
          <Button color='default' type='reset' variant='flat'>
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
