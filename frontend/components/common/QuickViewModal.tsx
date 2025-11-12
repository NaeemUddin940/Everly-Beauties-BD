// components/QuickViewModal.jsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import { IoMdStar } from 'react-icons/io';

const QuickViewModal = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  const [selectedVariation, setSelectedVariation] = useState(null);

  if (!product) return null;

  const {
    image,
    title,
    brand,
    price,
    rating = 5,
    variations = [],
  } = product;

  const handleAddToCart = () => {
    if (selectedVariation) {
      onAddToCart(selectedVariation);
      setSelectedVariation(null);
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {
        setSelectedVariation(null);
        onClose();
      }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#00000073]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

              <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Product Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={image}
                    alt={title}
                    width={300}
                    height={300}
                    className="object-cover rounded"
                  />
                </div>

                {/* Right: Details */}
                <div className="flex-1 space-y-3">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="text-sm text-gray-500">{brand}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-pink-600 font-bold text-xl">৳ {price}</span>
                    <div className="flex items-center text-yellow-400">
                      <IoMdStar /><span className="ml-1 text-gray-600 text-sm">{rating}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                  <p className="font-semibold text-sm mb-2">
                    Select a variation:{" "}
                    <span className="text-pink-600">
                      {selectedVariation ? selectedVariation.name : ''}
                    </span>
                  </p>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {variations.map((variation, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedVariation(variation)}
                          className={`border rounded overflow-hidden focus:outline-none transition-transform hover:scale-105 ${
                            selectedVariation === variation ? 'border-pink-500 ring-2 ring-pink-300' : 'border-gray-200'
                          }`}
                        >
                          <Image
                            src={variation.image}
                            alt={variation.name}
                            width={80}
                            height={80}
                            className="w-full cursor-pointer h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <p className='font-semibold text-sm mt-2'>
                      {variations.length} variation{variations.length !== 1 && 's'} available
                    </p>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariation}
                    className={`w-full py-2 cursor-pointer rounded font-semibold text-white transition-colors ${
                      selectedVariation ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {selectedVariation ? 'Add to Cart' : 'Select a Variation'}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default QuickViewModal;