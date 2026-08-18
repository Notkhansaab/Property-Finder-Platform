import React from "react";

const PropertyGallery = ({ images }) => {
  return (
    <div
      className="
grid 
grid-cols-1 
md:grid-cols-4 
grid-rows-2 
gap-2 
h-100
md:h-125
rounded-xl
overflow-hidden
"
    >
      <div className="md:col-span-2 md:row-span-2">
        <img src={images[0]} className="w-full h-full object-cover" />
      </div>

      {images.slice(1).map((img, index) => (
        <div key={index} className="hidden md:block">
          <img src={img} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
};

export default PropertyGallery;
