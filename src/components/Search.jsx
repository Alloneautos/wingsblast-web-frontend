import { FaSearch } from "react-icons/fa";
import { useState, useRef } from "react";
import { useFoodSearch } from "../api/api";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const { foodSearch, loading, error } = useFoodSearch(searchText);
  const dialogRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
    }
  };

  const handleFoodClick = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <dialog
      id="search"
      ref={dialogRef}
      className="modal fixed inset-0 flex justify-center -mt-[0px] lg:-mt-[150px] ml-[20px] lg:ml-0"
    >
      <div className="modal-box rounded">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => dialogRef.current.close()}
        >
          ✕
        </button>
        <div className="relative mt-5">
          <input
            type="text"
            id="Search"
            placeholder="Search Food Items..."
            className="w-full p-2 border focus:outline-none"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Search</span>
              <FaSearch />
            </button>
          </span>
        </div>
        <div className="mt-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {foodSearch.length > 0 ? (
            <ul>
              {foodSearch.slice(0, 5).map((item, index) => (
                <li key={index} className="p-2 border-b">
                  <Link
                    to={`/food-details/${item.id}`}
                    onClick={handleFoodClick}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            searchText && !loading && <p>No results found</p>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
};

export default Search;
