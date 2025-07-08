



// import { createContext, useContext, useState, useEffect } from "react";

// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || "");
//   const [userData, setUserData] = useState(() => {
//     const stored = localStorage.getItem("userData");
//     return stored ? JSON.parse(stored) : null;
//   });
//   const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);
//   const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken") || null);

//   const [searchKeyword, setSearchKeyword] = useState("");

//   // ✅ 1. Handle accessToken & refreshToken from Google OAuth URL
//   useEffect(() => {
//     const query = new URLSearchParams(window.location.search);
//     const accessTokenFromURL = query.get("accessToken");
//     const refreshTokenFromURL = query.get("refreshToken");

//     if (accessTokenFromURL && refreshTokenFromURL) {
//       setAccessToken(accessTokenFromURL);
//       setRefreshToken(refreshTokenFromURL);

//       // Clean the URL
//       query.delete("accessToken");
//       query.delete("refreshToken");
//       const newUrl = `${window.location.pathname}?${query.toString()}`;
//       window.history.replaceState(null, "", newUrl);
//     }
//   }, []);

//   // ✅ 2. Fallback: load user from cookies if not already in context
//   useEffect(() => {
//     const loadUserFromServer = async () => {
//       if (userData || accessToken) return; // already authenticated

//       try {
//         const res = await fetch("http://localhost:5000/api/v1/buyers/me", {
//           method: "GET",
//           credentials: "include", // includes cookies
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message);

//         setUserData(data.data);
//         setUserRole("buyer");
//       } catch (err) {
//         console.warn("No user found in session/cookies:", err.message);
//       }
//     };

//     loadUserFromServer();
//   }, [userData, accessToken]);

//   // ✅ 3. Persist to localStorage
//   useEffect(() => {
//     if (userRole) {
//       localStorage.setItem("userRole", userRole);
//     } else {
//       localStorage.removeItem("userRole");
//     }
//   }, [userRole]);

//   useEffect(() => {
//     if (userData) {
//       localStorage.setItem("userData", JSON.stringify(userData));
//     } else {
//       localStorage.removeItem("userData");
//     }
//   }, [userData]);

//   useEffect(() => {
//     if (accessToken) {
//       localStorage.setItem("accessToken", accessToken);
//     } else {
//       localStorage.removeItem("accessToken");
//     }
//   }, [accessToken]);

//   useEffect(() => {
//     if (refreshToken) {
//       localStorage.setItem("refreshToken", refreshToken);
//     } else {
//       localStorage.removeItem("refreshToken");
//     }
//   }, [refreshToken]);

//   return (
//     <AppContext.Provider
//       value={{
//         userRole,
//         setUserRole,
//         userData,
//         setUserData,
//         accessToken,
//         setAccessToken,
//         refreshToken,
//         setRefreshToken,
//         searchKeyword,
//         setSearchKeyword,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => useContext(AppContext);



// before admin logout
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || "");
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken") || null);

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessTokenFromURL = query.get("accessToken");
    const refreshTokenFromURL = query.get("refreshToken");

    if (accessTokenFromURL && refreshTokenFromURL) {
      setAccessToken(accessTokenFromURL);
      setRefreshToken(refreshTokenFromURL);

      query.delete("accessToken");
      query.delete("refreshToken");
      const newUrl = `${window.location.pathname}?${query.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  useEffect(() => {
    const loadUserFromServer = async () => {
      if (userData || accessToken) return;

      try {
        const endpoints = [
          { role: "admin", url: "http://localhost:5000/api/v1/admin/me" },
          { role: "seller", url: "http://localhost:5000/api/v1/sellers/me" },
          { role: "buyer", url: "http://localhost:5000/api/v1/buyers/me" },
        ];

        for (const endpoint of endpoints) {
          try {
            const res = await fetch(endpoint.url, {
              method: "GET",
              credentials: "include",
            });

            const data = await res.json();
            if (res.ok) {
              setUserData(data.data);
              setUserRole(endpoint.role);
              break;
            }
          } catch (_) {}
        }
      } catch (err) {
        console.warn("No user found in session/cookies:", err.message);
      }
    };

    loadUserFromServer();
  }, [userData, accessToken]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem("userRole", userRole);
    } else {
      localStorage.removeItem("userRole");
    }
  }, [userRole]);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        userData,
        setUserData,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        searchKeyword,
        setSearchKeyword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

