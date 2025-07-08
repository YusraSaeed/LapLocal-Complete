// import React from "react";
// import TopBar from "../../components/TopBar";
// import ViewProduct from "../../components/ViewProduct";

// const SellerProductView = () => {
//     return (
//         <div>
//             <TopBar/>
//             <ViewProduct/>
//         </div>
//     )
// }

// export default SellerProductView

import React from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../components/TopBar";
import ViewProduct from "../../components/ViewProduct";

const SellerProductView = () => {
  const { listingId } = useParams();

  return (
    <div>
      <TopBar />
      <ViewProduct listingId={listingId} />
    </div>
  );
};

export default SellerProductView;
