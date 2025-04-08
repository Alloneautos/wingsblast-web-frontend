import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const API = axios.create({
  baseURL: "https://api.wingsblast.com/api/v1",
  // baseURL: "http://localhost:6001/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get notification
export const useNotification = () => {
  const getNotification = async () => {
    const response = await API.get("/notification/all");
    return response.data.data;
  };

  const {
    data: notification = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notification"],
    queryFn: getNotification,
  });

  return { notification, isLoading, isError, error, refetch };
};

// category with food
export const useCategoryWithFood = () => {
  const getCategoryWithFood = async () => {
    const response = await API.get(`/category/allwithfoodforuser`);
    if (response.status === 201) {
      return [];
    }
    return response.data.data;
  };

  const {
    data: allwithfood = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allwithfood"],
    queryFn: getCategoryWithFood,
  });

  return { allwithfood, isLoading, isError, error, refetch };
};

// get category
export const useCategory = () => {
  const getCategory = async () => {
    const response = await API.get(`/category/all`);
    if (response.status === 201) {
      return [];
    }
    return response.data.data;
  };

  const {
    data: category = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  return { category, isLoading, isError, error, refetch };
};

// Flavor
export const useFlavor = () => {
  const getFlavor = async () => {
    const response = await API.get(`/flavor/all`);
    if (response.status === 201) {
      return [];
    }
    return response.data.data;
  };

  const {
    data: flavor = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["flavor"],
    queryFn: getFlavor,
  });

  return { flavor, isLoading, isError, error, refetch };
};

// kaj korte hobe
// food menu
export const useFoodAllMenu = () => {
  const getFoodAllMenu = async () => {
    try {
      const response = await API.get("/foodmenu/all");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Food All Menu:", error);
      throw error;
    }
  };

  const [foodAllMenu, setFoodAllMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodAllMenu = async () => {
      try {
        const menuData = await getFoodAllMenu();
        setFoodAllMenu(menuData);
      } catch (error) {
        setError("Failed to fetch all menu.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodAllMenu();
  }, []);

  return { foodAllMenu, loading, error };
};
// alllll fooood
export const useAllFood = () => {
  const getAllFood = async () => {
    try {
      const response = await API.get("/food-details");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Food All Menu:", error);
      throw error;
    }
  };

  const [allFood, setAllFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodAllMenu = async () => {
      try {
        const allFoodData = await getAllFood();
        setAllFood(allFoodData);
      } catch (error) {
        setError("Failed to fetch all menu.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodAllMenu();
  }, []);

  return { allFood, loading, error };
};
// search menu
export const useFoodSearch = (searchText) => {
  const getFoodSearch = async () => {
    try {
      const response = await API.get(`/food-details?name=${searchText}`);
      return response.data.data; // API রেসপন্স ডেটা রিটার্ন
    } catch (error) {
      console.error("Error fetching Food All Menu:", error);
      throw error;
    }
  };

  const [foodSearch, setFoodSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFoodSearch([]); // ফাঁকা ইনপুটের জন্য রিসেট করুন
      return;
    }

    const fetchFoodSearch = async () => {
      setLoading(true);
      try {
        const menuData = await getFoodSearch();
        setFoodSearch(menuData || []);
      } catch (error) {
        setError("Failed to fetch food search.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodSearch();
  }, [searchText]); // `searchText` পরিবর্তনের সাথে সাথে ডেটা আনুন।

  return { foodSearch, loading, error };
};

// kaj korte hobe
//  Food Details
export const useFoodDetails = (foodDetailsID) => {
  const getFoodDetails = async () => {
    try {
      const response = await API.get(`/food-details/${foodDetailsID}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Food Details:", error);
      throw error;
    }
  };

  const [foodDetails, setFoodDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const detailsData = await getFoodDetails();
        setFoodDetails(detailsData);
      } catch (error) {
        setError("Failed to fetch flavor.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodDetailsID]);

  return { foodDetails, loading, error };
};

// get food by category
export const useReletiveFood = (categoryID) => {
  const getReletiveFood = async () => {
    const response = await API.get(
      `/food-details/all?category_id=${categoryID}`
    );
    if (response.status === 201) {
      return [];
    }
    return response.data.data;
  };

  const {
    data: reletiveFood = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reletiveFood", categoryID],
    queryFn: getReletiveFood,
  });

  return { reletiveFood, isLoading, isError, error, refetch };
};

// my card
export const useMyCart = (guestUser) => {
  const getMyCard = async () => {
    const response = await API.get(`/card?guest_user_id=${guestUser}`);
    if (response.status === 201) {
      return [];
    }
    return response.data.data;
  };

  const {
    data: mycard = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mycard", guestUser],
    queryFn: getMyCard,
  });

  return { mycard, isLoading, isError, error, refetch };
};

export const useMyOrder = (user_id) => {
  const getMyOrder = async () => {
    const response = await API.get(`/orders/user-id/${user_id}`);

    return response.data.data;
  };

  const {
    data: myorder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myorder", user_id],
    queryFn: getMyOrder,
  });

  return { myorder, isLoading, isError, error, refetch };
};

// get orderDetails
export const useOrderDetails = (detailsID) => {
  const getOrderDetails = async () => {
    const response = await API.get(`/orders/${detailsID}`);

    return response.data.data;
  };

  const {
    data: orderDetails = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orderDetails", detailsID],
    queryFn: getOrderDetails,
  });

  return { orderDetails, isLoading, isError, error, refetch };
};

// kaj korte hobe
// guest user
export const useGuestUser = () => {
  const [guestUser, setGuestUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("Guest User:", guestUser);
  useEffect(() => {
    const fetchGuestUser = async () => {
      try {
        const guestUserToken = localStorage.getItem("guestUserToken");

        if (!guestUserToken) {
          console.warn("Guest user token not found!");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://api.wingsblast.com/api/v1/guest-user",
          {
            headers: {
              Authorization: `Bearer ${guestUserToken}`,
            },
          }
        );

        setGuestUser(response.data.guestUserId);
      } catch (error) {
        console.error("Error fetching guest user data:", error);
        setGuestUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGuestUser();
  }, []);

  return { guestUser, loading };
};

// get user
export const useUserProfile = () => {
  const getUser = async () => {
    const response = await API.get("/user/me");
    return response.data;
  };

  const {
    data: user = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return { user, isLoading, isError, error, refetch };
};

// sign out
export const signOutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/signin";
};

// kaj korte hobe
// get project
export const useSingleProjects = (projectID) => {
  const getProject = async () => {
    try {
      const response = await API.get(`/project/single/${projectID}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  };

  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getProject();
        setProject(projectData);
      } catch (error) {
        setError("Failed to fetch project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [projectID]);

  return { project, loading, error };
};

// get delevery-fee
export const useDeleveryFee = () => {
  const getDeleveryFee = async () => {
    const response = await API.get("/settings/delevery-fee");
    return response.data.data;
  };

  const {
    data: deleveryFee = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["deleveryFee"],
    queryFn: getDeleveryFee,
  });

  return { deleveryFee, isLoading, isError, error, refetch };
};

// get terms
export const useTerms = () => {
  const getTerms = async () => {
    const response = await API.get("/settings/terms");
    return response.data.data;
  };

  const {
    data: terms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["terms"],
    queryFn: getTerms,
  });

  return { terms, isLoading, isError, error, refetch };
};

// get privacy
export const usePrivacy = () => {
  const getPrivacy = async () => {
    const response = await API.get("/settings/privacy");
    return response.data.data;
  };

  const {
    data: privacy = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["privacy"],
    queryFn: getPrivacy,
  });

  return { privacy, isLoading, isError, error, refetch };
};

// get tax
export const useTax = () => {
  const getTax = async () => {
    const response = await API.get("/settings/tax");
    return response.data.data;
  };

  const {
    data: tax = [],
    isTaxLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tax"],
    queryFn: getTax,
  });

  return { tax, isTaxLoading, isError, error, refetch };
};

// get banner
export const useBanner = () => {
  const getBanner = async () => {
    const response = await API.get("/settings/banner");
    return response.data.data;
  };

  const {
    data: banner = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["banner"],
    queryFn: getBanner,
  });

  return { banner, isLoading, isError, error, refetch };
};

// get about
export const useAbout = () => {
  const getAbout = async () => {
    const response = await API.get("/settings/about");
    return response.data.data;
  };

  const {
    data: about = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["about"],
    queryFn: getAbout,
  });

  return { about, isLoading, isError, error, refetch };
};

// get Fees
export const useFees = () => {
  const getFees = async () => {
    const response = await API.get(`/fees`);
    return response.data.data;
  };

  const {
    data: fees = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fees"],
    queryFn: getFees,
  });

  return { fees, isLoading, isError, error, refetch };
};

// get Tips
export const useTipsRate = () => {
  const getTipsRate = async () => {
    const response = await API.get(`/tips`);
    return response.data.data;
  };

  const {
    data: tipsRate = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tipsRate"],
    queryFn: getTipsRate,
  });

  return { tipsRate, isLoading, isError, error, refetch };
};
