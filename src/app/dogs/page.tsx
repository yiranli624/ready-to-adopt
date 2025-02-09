"use client";

import { Button, Select, SelectItem } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import {
  FullDog,
  getDogs,
  getDogsBreeds,
  searchDogs,
  matchDogs
} from "@/apiCalls";
import DogCard from "../components/DogCard";

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
  const [dogs, setDogs] = useState<FullDog[]>([]);
  const [totalDogs, setTotalDogs] = useState<number | null>(null);
  const [isLoadingDogs, setIsLoadingDogs] = useState(true);
  const [nextFetchUrl, setNextFetchUrl] = useState("");
  const [dogsBreeds, setDogsBreeds] = useState<string[]>([]);
  const [selectedDogBreed, setSelectedDogBreed] = useState<string>("");
  const [selectedDogsIds, setSelectedDogsIds] = useState<string[]>([]);
  const [foundAMatch, setFoundAMatch] = useState(false);

  const initialFetch = useCallback(() => {
    searchDogs().then((data) => {
      setTotalDogs(data.total);
      setNextFetchUrl(data.next);
      setDogs(data.dogs);
      setIsLoadingDogs(false);
    });

    getDogsBreeds().then((data) => {
      setDogsBreeds(data);
    });
  }, []);

  useEffect(() => {
    initialFetch();
  }, []);

  const getNextPage = async () => {
    setIsLoadingDogs(true);
    const dogsData = await getDogs(nextFetchUrl);
    setDogs(dogsData.dogs);
    setNextFetchUrl(dogsData.next);
    setIsLoadingDogs(false);
    window.scrollTo(0, 300);
  };

  const sortDogsList = async (
    sortField: "breed" | "name" | "age",
    sortOrder: "asc" | "desc"
  ) => {
    setIsLoadingDogs(true);
    let dogsData;
    if (selectedDogBreed) {
      dogsData = await searchDogs({
        breeds: [selectedDogBreed],
        sortField,
        sortOrder
      });
    } else {
      dogsData = await searchDogs({ sortField, sortOrder });
    }
    setDogs(dogsData.dogs);
    setNextFetchUrl(dogsData.next);
    setIsLoadingDogs(false);
  };

  const handleBreedSelect = async (breed: string) => {
    setIsLoadingDogs(true);
    setSelectedDogBreed(breed);
    const dogsData = await searchDogs({ breeds: [breed] });
    setDogs(dogsData.dogs);
    setNextFetchUrl(dogsData.next);
    setTotalDogs(dogsData.total);
    setIsLoadingDogs(false);
  };

  const handleDogSelect = (dogId: string) => {
    const hasSelected = selectedDogsIds.some((id) => id === dogId);
    if (hasSelected) {
      setSelectedDogsIds((prev) => [...prev].filter((id) => id !== dogId));
    } else {
      setSelectedDogsIds((prev) => [...prev, dogId]);
    }
  };

  const handleDogMatch = async () => {
    if (foundAMatch) {
      initialFetch();
      setSelectedDogBreed("");
      setSelectedDogsIds([]);
      setFoundAMatch(false);
    } else {
      const matchedDog = await matchDogs(selectedDogsIds);
      setDogs([matchedDog]);
      setTotalDogs(1);
      setFoundAMatch((prev) => !prev);
    }
  };

  return (
    <div className='px-20'>
      <div className='h-20 p-8 border-b-4 text-center text-stone-700 text-lg'>
        Total Available dogs: {totalDogs}
      </div>
      <div className='flex gap-6 py-6 border-b-4 items-center'>
        <Select
          className='max-w-xs'
          label='Any Breed'
          variant='bordered'
          popoverProps={{ placement: "bottom" }}
          selectedKeys={[selectedDogBreed]}
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

        <Button
          size='lg'
          className='bg-gradient-to-tr from-sky-500 to-yellow-500 text-white shadow-lg text-xl'
          isDisabled={selectedDogsIds.length < 1}
          onPress={handleDogMatch}
        >
          {foundAMatch ? "Try again" : "Ready to match"}
        </Button>
      </div>

      <div className='flex gap-6 py-6 text-stone-700'>
        Sort by:
        {SORT_TYPES.map((sortType) => (
          <button
            key={sortType.name}
            className='border-b-2 border-transparent hover:border-stone-300'
            onClick={() => sortDogsList(sortType.field, sortType.order)}
          >
            {sortType.name}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-5 w-full gap-10'>
        {dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            isSelected={selectedDogsIds.includes(dog.id)}
            selectDog={handleDogSelect}
          />
        ))}
      </div>

      <div className='flex justify-center p-10'>
        {!foundAMatch && (
          <Button
            className='bg-gradient-to-tr from-sky-500 to-yellow-500 text-white shadow-lg'
            onPress={getNextPage}
            isDisabled={dogs.length < 1}
            isLoading={isLoadingDogs}
          >
            {isLoadingDogs ? "Loading.." : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
