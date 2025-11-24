// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";

// export const ProductPageWrapper = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Replace with your API call or data fetching logic
//     async function fetchData() {
//       setLoading(true);
//       const data = await fetch(`/api/products/${id}`).then(res => res.json());
//       setProduct(data.product);
//       setRelatedProducts(data.related);
//       setLoading(false);
//     }
//     fetchData();
//   }, [id]);

//   return <ProductPage product={product} relatedProducts={relatedProducts} loading={loading} />;
// };
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProductPage } from "../pages/ProductPage";

export const ProductPageWrapper = () => {
  const { id } = useParams();

  // Fake product data
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setLoading(true);
    setTimeout(() => {
      const fakeProduct = {
        id,
        name: "Classic Tee",
        price: "34TND",
        images: [
          "https://picsum.photos/seed/p1/600/400",
          "https://picsum.photos/seed/p2/600/400",
        ],
      };

      const fakeRelated = [
        {
          name: "Everyday Hoodie",
          price: "89TND",
          image: "https://picsum.photos/seed/p3/600/400",
          status: "None",
        },
        {
          name: "Minimal Cap",
          price: "19TND",
          image: "https://picsum.photos/seed/p4/600/400",
          status: "Sold Out",
        },
        {
          name: "Weekender Bag",
          price: "129TND",
          image: "https://picsum.photos/seed/p5/600/400",
          status: "None",
        },
      ];

      setProduct(fakeProduct);
      setRelatedProducts(fakeRelated);
      setLoading(false);
    }, 1000);
  }, [id]);

  return <ProductPage product={product} relatedProducts={relatedProducts} loading={loading} />;
};
