type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};

type Location = {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
};

export type FullDog = Dog & {
  city: string;
  state: string;
};

const BASE_URL = "https://frontend-take-home-service.fetch.com";

export const getDogs = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });
  const dogsRawData: { total: number; resultIds: string[]; next: string } =
    await res.json();

  const dogsRes = await fetch(`${BASE_URL}/dogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dogsRawData.resultIds),
    credentials: "include"
  });

  const dogs: Dog[] = await dogsRes.json();
  const dogsWithCityState: FullDog[] = await Promise.all(
    dogs.map(async (dog) => {
      const location = await getCityState(dog.zip_code);
      return { ...dog, city: location.city, state: location.state };
    })
  );

  return {
    dogs: dogsWithCityState,
    total: dogsRawData.total,
    next: `${BASE_URL}${dogsRawData.next}`
  };
};

export const searchDogs = async ({
  sortField = "breed",
  sortOrder = "asc",
  breeds = []
}: {
  sortField?: "breed" | "name" | "age";
  sortOrder?: "asc" | "desc";
  breeds?: string[];
} = {}) => {
  const url = new URL(`${BASE_URL}/dogs/search`);
  breeds.forEach((breed) => {
    url.searchParams.append("breeds", breed);
  });
  url.searchParams.append("sort", `${sortField}:${sortOrder}`);

  return await getDogs(url.toString());
};

export const getDogsBreeds = async () => {
  const res = await fetch(`${BASE_URL}/dogs/breeds`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });
  return await res.json();
};

export const matchDogs = async (dogsIds: string[]) => {
  const dogRes = await fetch(`${BASE_URL}/dogs/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dogsIds),
    credentials: "include"
  });

  const matchDog: { match: string } = await dogRes.json();

  const dogsRes = await fetch(`${BASE_URL}/dogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify([matchDog.match]),
    credentials: "include"
  });

  const dogs: Dog[] = await dogsRes.json();

  const dogsWithCityState: FullDog[] = await Promise.all(
    dogs.map(async (dog) => {
      const location = await getCityState(dog.zip_code);
      return { ...dog, city: location.city, state: location.state };
    })
  );

  return dogsWithCityState[0];
};

export const getCityState = async (zipcode: string) => {
  const locationRes = await fetch(`${BASE_URL}/locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify([zipcode]),
    credentials: "include"
  });

  const locations: Location[] = await locationRes.json();

  return { city: locations[0]?.city, state: locations[0]?.state };
};
