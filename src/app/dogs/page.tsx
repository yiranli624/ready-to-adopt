"use client";

import Image from "next/image";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from "@heroui/react";
import React, { useEffect, useState } from "react";
type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};
const BASE_URL = "https://frontend-take-home-service.fetch.com";
export default function DogsHomePage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalDogs, setTotalDogs] = useState<number | null>(null);
  const [isLoadingDogs, setIsLoadingDogs] = useState(true);
  const [nextFetchUrl, setNextFetchUrl] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/dogs/search?sort=breed:asc`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalDogs(data.total);
        setNextFetchUrl(`${BASE_URL}${data.next}`);

        fetch(`${BASE_URL}/dogs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data.resultIds),
          credentials: "include"
        })
          .then((res) => res.json())
          .then((data: Dog[]) => {
            setDogs(data);
            setIsLoadingDogs(false);
          });
      });
  }, []);

  const getNextPage = () => {
    fetch(nextFetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setNextFetchUrl(`${BASE_URL}${data.next}`);
        fetch(`${BASE_URL}/dogs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data.resultIds),
          credentials: "include"
        })
          .then((res) => res.json())
          .then((data: Dog[]) => {
            // data.sort((a, b) => a.breed.localeCompare(b.breed));
            setDogs(data);
            setIsLoadingDogs(false);
          });
      });
  };

  const sortDogsList = (
    field: "breed" | "name" | "age",
    order: "asc" | "desc"
  ) => {
    fetch(`${BASE_URL}/dogs/search?sort=${field}:${order}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalDogs(data.total);
        setNextFetchUrl(`${BASE_URL}${data.next}`);

        fetch(`${BASE_URL}/dogs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data.resultIds),
          credentials: "include"
        })
          .then((res) => res.json())
          .then((data: Dog[]) => {
            setDogs(data);
            setIsLoadingDogs(false);
          });
      });
  };

  return (
    <main className='bg-stone-100 flex flex-col h-screen'>
      <div className="flex-none h-60 bg-[url('/dog-adopt-banner.jpg')] bg-no-repeat bg-cover bg-center">
        <div className='flex flex-col h-full gap-4 px-20 justify-center text-amber-50 text-xl'>
          <p>ADOPTABLE DOGS</p>
          <p className='pl-30'>Providing second chances for better lives.</p>
        </div>
      </div>
      {isLoadingDogs && <div>loading...</div>}
      {!isLoadingDogs && (
        <div className='px-20'>
          <div className='h-20 p-8 border-b-4 text-center text-stone-700'>
            Total Available {totalDogs}
          </div>
          <div className='flex gap-6 py-6 border-b-4'>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className='capitalize'
                  color='primary'
                  variant='bordered'
                >
                  Any Breed
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Dropdown Variants'
                color='default'
                variant='bordered'
              >
                <DropdownItem key='new'>New file</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  className='capitalize'
                  color='primary'
                  variant='bordered'
                >
                  Any Location
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Dropdown Variants'
                color='default'
                variant='bordered'
              >
                <DropdownItem key='new'>New file</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className='flex gap-6 py-6 text-stone-700'>
            Sort by:
            <button onClick={() => sortDogsList("age", "desc")}>Oldest</button>
            <button onClick={() => sortDogsList("age", "asc")}>Youngest</button>
            <button onClick={() => sortDogsList("breed", "asc")}>
              Breed(a-z)
            </button>
            <button onClick={() => sortDogsList("breed", "desc")}>
              Breed(z-a)
            </button>
          </div>

          <div className='grid grid-cols-5 w-full gap-10'>
            {dogs.map((dog) => (
              <div key={dog.id} className='text-stone-700 border-4'>
                <div
                  className={`w-full h-40 bg-no-repeat bg-cover bg-center`}
                  style={{ backgroundImage: `url('${dog.img}')` }}
                ></div>
                <p>{dog.name}</p>
                <p>{dog.breed}</p>
                <p>
                  {dog.age > 0
                    ? `${dog.age} years old`
                    : "less than a year old"}
                </p>
                <p>Location zipcode: {dog.zip_code}</p>
              </div>
            ))}
          </div>

          <div className='flex justify-center p-6'>
            <Button color='primary' onPress={getNextPage}>
              Next
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
