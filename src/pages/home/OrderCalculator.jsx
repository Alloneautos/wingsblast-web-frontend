import { useState } from 'react';
import Bannar from '../../assets/images/food.jpg'

const OrderCalculator = () => {
  const [hungerLevel, setHungerLevel] = useState('Snacky');

  const hungerLevels = ['Snacky', 'Hungry', 'Starving'];

  const handleHungerClick = (level) => {
    setHungerLevel(level);
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center space-y-8 py-14"
      style={{
        backgroundImage: `url(${Bannar})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="hero-overlay bg-opacity-60"></div>

      {/* Title Section */}
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Need a Hand with Your Order?</h1>
        <p className="text-base sm:text-lg text-gray-600">How many in your crew?</p>
      </div>

      {/* Hunger Level Tabs */}
      <div className="flex w-11/12 max-w-lg mx-auto flex-wrap justify-center gap-3 border-2 border-teal-900 p-2">
        {hungerLevels.map((level) => (
          <button
            key={level}
            onClick={() => handleHungerClick(level)}
            className={`px-1 md:px-4 lg:px-4 sm:px-6 py-2 rounded font-medium ${hungerLevel === level
              ? 'bg-green-800 text-white'
              : 'bg-white text-green-500'
              } transition-colors duration-200`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Run the Numbers Button */}
      <button className="bg-green-700 text-white px-6 sm:px-8 py-2 rounded-lg text-base sm:text-lg font-semibold hover:bg-green-600 transition-colors duration-200">
        Run the Numbers
      </button>
    </div>
  );
};

export default OrderCalculator;
