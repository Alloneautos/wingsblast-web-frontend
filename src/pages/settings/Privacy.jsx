import { usePrivacy } from "../../api/api";

const Privacy = () => {
  const { privacy, isLoading, isError, error } = usePrivacy();

  if (isLoading)
    return (
      <div className="text-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div>
      <div className="bg-gradient-to-r from-sky-100 to-indigo-100 h-28 text-center">
        <h1 className="text-5xl font-bold pt-12 text-black">PRIVACY</h1>
      </div>

      <div className="w-10/12 mx-auto my-4">
        <div dangerouslySetInnerHTML={{ __html: privacy.content }} />
      </div>
    </div>
  );
};

export default Privacy;
