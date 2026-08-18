import { useState } from "react";
import {
  FiInfo,
  FiTag,
  FiDollarSign,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";

export default function AddProperty() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    listingType: "",
    description: "",
    price: "",
    availableDates: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend API will connect here later
    console.log(formData);
  };

  return (
    <div className="max-w-9/10 mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-on-surface">
          Add New Property
        </h1>

        <p className="text-on-surface-variant mt-2">
          Provide the details to list your property on EstateLink.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <FiInfo className="text-blue-600" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Property Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern Apartment in Downtown"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium">Category</label>

              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 pr-10 outline-none focus:border-blue-600"
                >
                  <option value="">Select category...</option>

                  <option value="apartment">Apartment</option>

                  <option value="house">House</option>

                  <option value="villa">Villa</option>

                  <option value="condo">Condo</option>
                </select>

                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Listing Type */}
            <div>
              <label className="block mb-2 font-medium">Listing Type</label>

              <div className="relative">
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 pr-10 outline-none focus:border-blue-600"
                >
                  <option value="">Select type...</option>

                  <option value="rental">Rental</option>

                  <option value="selling">Selling</option>

                  <option value="leasing">Leasing</option>
                </select>

                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the key features and selling points of your property..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <FiTag className="text-blue-600" />
            Pricing & Availability
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block mb-2 font-medium">
                Price per Night/Month
              </label>

              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full pl-10 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Dates */}
            <div>
              <label className="block mb-2 font-medium">Available Dates</label>

              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="text"
                  name="availableDates"
                  value={formData.availableDates}
                  onChange={handleChange}
                  placeholder="Select date range"
                  className="w-full pl-10 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Property Images */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Property Pictures</h2>

          <label
            htmlFor="images"
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 text-2xl">
              +
            </div>

            <p className="font-medium">Upload Property Images</p>

            <p className="text-sm text-gray-500 mt-1">
              Add multiple photos of your property
            </p>

            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {formData.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt="property preview"
                  className="h-32 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </section>

        {/* Buttons */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Publish Listing
          </button>
        </div>
      </form>
    </div>
  );
}
