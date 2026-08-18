import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full h-\[600px] md:h-175 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
        }}
      ></div>

      <div className="relative z-10 w-full px-6 md:px-14 flex flex-col items-center text-center -mt-25">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 drop-shadow-lg">
          Find Your Perfect Space
        </h1>

        <div className="w-full md:w-225 bg-white rounded-full shadow-xl p-2 flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 px-4 py-1.5 rounded-full hover:bg-gray-100 transition">
            <label className="block text-xs font-bold text-gray-800">
              Where to?
            </label>
            <input
              className="w-full bg-transparent outline-none text-sm text-gray-500"
              placeholder="Search destinations"
            />
          </div>

          <div className="hidden md:block w-px h-7 bg-gray-300"></div>

          <div className="flex-1 px-4 py-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
            <label className="block text-xs font-bold text-gray-800">
              Dates
            </label>
            <span className="text-sm text-gray-400">Add dates</span>
          </div>

          <div className="hidden md:block w-px h-7 bg-gray-300"></div>

          <div className="flex-1 flex items-center justify-between px-4 py-1.5 rounded-full hover:bg-gray-100 transition">
            <div>
              <label className="block text-xs font-bold text-gray-800">
                Guests
              </label>
              <span className="text-sm text-gray-400">Add guests</span>
            </div>

            <button className="bg-blue-700 hover:bg-blue-800 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
              🔍
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
