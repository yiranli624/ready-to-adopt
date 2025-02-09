import { FullDog } from "@/apiCalls";
import classNames from "classnames";

export default function DogCard({
  dog,
  isSelected,
  selectDog
}: {
  dog: FullDog;
  isSelected: boolean;
  selectDog: (id: string) => void;
}) {
  return (
    <div
      key={dog.id}
      className={classNames(
        "text-stone-700 shadow-xl rounded hover:cursor-pointer hover:scale-110 ease-in-out duration-300 border-2",
        {
          "border-yellow-500": isSelected,
          "border-transparent": !isSelected
        }
      )}
      onClick={() => {
        selectDog(dog.id);
      }}
    >
      <div
        className={`w-full h-60 bg-no-repeat bg-cover bg-center relative`}
        style={{ backgroundImage: `url('${dog.img}')` }}
      >
        <div className='absolute bottom-[-10px] left-0 py-2 px-4  bg-fuchsia-200 z-10 flex justify-center items-center'>
          <p className='font-bold text-stone-600'>
            {dog.name.toLocaleUpperCase()}
          </p>
        </div>
      </div>
      <div className='p-4'>
        <p className='font-bold'>{dog.breed}</p>
        <p>{dog.age > 0 ? `${dog.age} years old` : "less than a year old"}</p>
        <p>
          {dog.city}, {dog.state}
        </p>
        <p>{dog.zip_code}</p>
      </div>
    </div>
  );
}
