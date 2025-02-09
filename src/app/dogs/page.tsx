"use client";

import Image from "next/image";
import { Button, Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import {
  Dog,
  getDogs,
  getDogsBreeds,
  getDogsByBreed,
  getDogsWithSort
} from "@/apiCalls";

const SORT_TYPES: {
  name: string;
  field: "breed" | "name" | "age";
  order: "asc" | "desc";
}[] = [
  { name: "Oldest", field: "age", order: "desc" },
  { name: "Youngest", field: "age", order: "asc" },
  { name: "Breed(A-Z)", field: "breed", order: "asc" },
  { name: "Breed(Z-A)", field: "breed", order: "desc" },
  { name: "Name(A-Z)", field: "name", order: "asc" },
  { name: "Name(Z-A)", field: "name", order: "desc" }
];

export default function DogsHomePage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalDogs, setTotalDogs] = useState<number | null>(null);
  const [isLoadingDogs, setIsLoadingDogs] = useState(true);
  const [nextFetchUrl, setNextFetchUrl] = useState("");
  const [dogsBreeds, setDogsBreeds] = useState<string[]>([]);

  useEffect(() => {
    getDogsWithSort().then((data) => {
      setTotalDogs(data.total);
      setNextFetchUrl(data.next);
      setDogs(data.dogs);
      setIsLoadingDogs(false);
    });

    getDogsBreeds().then((data) => {
      setDogsBreeds(data);
    });
  }, []);

  const getNextPage = async () => {
    console.log(nextFetchUrl);
    setIsLoadingDogs(true);
    const dogsData = await getDogs(nextFetchUrl);
    setDogs(dogsData.dogs);
    setNextFetchUrl(dogsData.next);
    setIsLoadingDogs(false);
  };

  const sortDogsList = async (
    field: "breed" | "name" | "age",
    order: "asc" | "desc"
  ) => {
    setIsLoadingDogs(true);
    const dogsData = await getDogsWithSort({ field, order });
    setDogs(dogsData.dogs);
    setNextFetchUrl(dogsData.next);
    setIsLoadingDogs(false);
  };

  const handleBreedSelect = async (breed: string) => {
    setIsLoadingDogs(true);
    const dogsData = await getDogsByBreed(breed);
    setDogs(dogsData.dogs);
    setNextFetchUrl(dogsData.next);
    setIsLoadingDogs(false);
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

      <div className='px-20'>
        <div className='h-20 p-8 border-b-4 text-center text-stone-700'>
          Total Available {totalDogs}
        </div>
        <div className='flex gap-6 py-6 border-b-4'>
          <Select
            className='max-w-xs'
            label='Any Breed'
            variant='bordered'
            popoverProps={{ placement: "bottom" }}
          >
            {dogsBreeds.map((breed) => (
              <SelectItem
                key={breed}
                className='text-stone-700'
                onPress={() => handleBreedSelect(breed)}
              >
                {breed}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className='flex gap-6 py-6 text-stone-700'>
          Sort by:
          {SORT_TYPES.map((sortType) => (
            <button
              key={sortType.name}
              onClick={() => sortDogsList(sortType.field, sortType.order)}
            >
              {sortType.name}
            </button>
          ))}
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
                {dog.age > 0 ? `${dog.age} years old` : "less than a year old"}
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
    </main>
  );
}
