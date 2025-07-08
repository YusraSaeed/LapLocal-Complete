


// src/hooks/useSellerDashboardData.js

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppContext } from "../context/AppContext.jsx";

// const useSellerDashboardData = () => {
//   const [seller, setSeller] = useState(null);
//   const [listings, setListings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const { userData, accessToken, setUserData, setAccessToken } = useAppContext();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!userData || !accessToken) {
//       setIsLoading(false);
//       return;
//     }

//     const fetchDashboardData = async () => {
//       setIsLoading(true);
//       try {
//         const profileRes = await fetch(
//           `http://localhost:5000/api/v1/sellers/getSeller/${userData?._id}`,
//           {
//             credentials: "include",
//             headers: { Authorization: `Bearer ${accessToken}` },
//           }
//         );

//         if (profileRes.status === 401) {
//           setUserData(null);
//           setAccessToken(null);
//           sessionStorage.clear();
//           navigate("/unauthorized");
//           return;
//         }

//         const profileData = await profileRes.json();
//         if (profileRes.ok) {
//           const ratingRes = await fetch(
//             `http://localhost:5000/api/v1/laptop-listing/${profileData.data._id}/ratings`
//           );
//           const ratingData = await ratingRes.json();
//           const averageRating =
//             Array.isArray(ratingData.data) && ratingData.data.length
//               ? ratingData.data.reduce((acc, r) => acc + (r.rating || 0), 0) / ratingData.data.length
//               : 0;
//           setSeller({ ...profileData.data, rating: averageRating });
//         }

//         const listingsRes = await fetch(
//           "http://localhost:5000/api/v1/laptop-listing/inventory/",
//           {
//             headers: { Authorization: `Bearer ${accessToken}` },
//             credentials: "include",
//           }
//         );

//         if (listingsRes.status === 401) {
//           setUserData(null);
//           setAccessToken(null);
//           sessionStorage.clear();
//           navigate("/unauthorized");
//           return;
//         }

//         const listingsData = await listingsRes.json();
//         if (listingsRes.ok) setListings(listingsData.data || []);
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [userData, accessToken, navigate, setAccessToken, setUserData]);

//   return { seller, listings, isLoading };
// };

// export default useSellerDashboardData;






// src/hooks/useSellerDashboardData.js

import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const useSellerDashboardData = () => {
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userData, accessToken } = useAppContext();

  useEffect(() => {
    if (!userData || !accessToken) {
      setIsLoading(false); // No redirect, just skip fetching
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const profileRes = await fetch(
          `http://localhost:5000/api/v1/sellers/getSeller/${userData._id}`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const profileData = await profileRes.json();
        if (profileRes.ok) {
          const ratingRes = await fetch(
            `http://localhost:5000/api/v1/laptop-listing/${profileData.data._id}/ratings`
          );
          const ratingData = await ratingRes.json();
          const averageRating =
            Array.isArray(ratingData.data) && ratingData.data.length
              ? ratingData.data.reduce((acc, r) => acc + (r.rating || 0), 0) / ratingData.data.length
              : 0;
          setSeller({ ...profileData.data, rating: averageRating });
        }

        const listingsRes = await fetch(
          "http://localhost:5000/api/v1/laptop-listing/inventory/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            credentials: "include",
          }
        );

        const listingsData = await listingsRes.json();
        if (listingsRes.ok) setListings(listingsData.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData, accessToken]);

  return { seller, listings, isLoading };
};

export default useSellerDashboardData;
