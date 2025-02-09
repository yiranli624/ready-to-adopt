export type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
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

  return {
    dogs,
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

  const dog: Dog[] = await dogsRes.json();

  return dog;
};
