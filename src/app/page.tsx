export default function Home() {
  return (
    <main className='bg-stone-100 flex flex-col h-screen'>
      <div className="h-60 bg-[url('/dog-adopt-banner.jpg')] bg-no-repeat bg-cover bg-center">
        <div className='flex flex-col h-full gap-4 px-20 justify-center text-amber-50 text-xl'>
          <p>ADOPTABLE DOGS</p>
          <p className='pl-30'>Providing second chances for better lives.</p>
        </div>
      </div>
    </main>
  );
}
