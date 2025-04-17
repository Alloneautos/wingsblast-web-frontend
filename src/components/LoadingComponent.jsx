import Loader from "../assets/images/loader.gif"
const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center">
      {/* <img src={Loader} alt="Loading..." className="w-[150px]" /> */}
      <span className="loading loading-spinner bg-gradient-to-bl from-violet-500 to-fuchsia-500"></span>
    </div>
  );
};

export default LoadingComponent;
