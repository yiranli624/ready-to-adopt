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

export const getDogsWithSort = async ({
  field = "breed",
  order = "asc"
}: {
  field?: "breed" | "name" | "age";
  order?: "asc" | "desc";
} = {}) => {
  const url = `${BASE_URL}/dogs/search?sort=${field}:${order}`;
  return await getDogs(url);
};

const getDogsBreeds = async () => {
  const res = await fetch(`${BASE_URL}/dogs/breeds`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });
  return await res.json();
};

const searchDogs = () => {};
