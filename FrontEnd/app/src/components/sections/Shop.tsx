import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import React, { useLayoutEffect } from "react";
import styled from "styled-components";
import { useRef } from "react";

import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { productService, Product as ProductType } from "../../services/productService";
import { useState, useEffect } from "react";


const Section = styled.section`
  min-height: 100vh;
  height: auto;
  width: 100vw;
  margin: 0 auto;
  overflow: hidden;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  position: relative;
`;
const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxxl};
  font-family: "Kaushan Script";
  font-weight: 300;
  text-shadow: 1px 1px 1px ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  position: absolute;
  top: 1rem;
  left: 5%;
  z-index: 11;

  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontxxl};
  }
  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const Left = styled.div`
  width: 35%;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};

  min-height: 100vh;
  z-index: 5;

  position: fixed;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: ${(props) => props.theme.fontlg};
    font-weight: 300;
    width: 80%;
    margin: 0 auto;
  }

  @media (max-width: 64em) {
    p {
      font-size: ${(props) => props.theme.fontmd};
    }
  }

  @media (max-width: 48em) {
    width: 40%;
    p {
      font-size: ${(props) => props.theme.fontsm};
    }
  }

  @media (max-width: 30em) {
    p {
      font-size: ${(props) => props.theme.fontxs};
    }
  }
`;
const Right = styled.div`
  position: absolute;
  left: 35%;
  padding-left: 30%;
  min-height: 100vh;

  background-color: ${(props) => props.theme.grey};
  /* width: 65%; */
  display: flex;
  justify-content: flex-start;
  align-items: center;

  h1 {
    width: 5rem;
    margin: 0 2rem;
  }
`;

const Item = styled(motion.div)`
  width: 20rem;
  margin-right: 6rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    height: auto;
    cursor: pointer;
  }
  h1 {
    display: inline-block;
    width: fit-content;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
  }

  .price {
    font-size: ${props => props.theme.fontlg};
    font-weight: 600;
    color: ${props => props.theme.text};
    margin-top: 0.5rem;
  }

  @media (max-width: 48em) {
    width: 15rem;
  }
`;

const AddToCartButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  border: none;
  border-radius: 4px;
  font-size: ${props => props.theme.fontsm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.grey};
  }
`;

const Product = ({ img, title = "", id, price }: { img: string; title: string; id: string; price: number }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, img, title, price });
  };

  return (
    <Item
      initial={{ filter: "grayscale(100%)" }}
      whileInView={{ filter: "grayscale(0%)" }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false, amount: "all" }}
    >
      <img
        src={img}
        alt={title}
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image';
          e.currentTarget.onerror = null; // Prevent infinite loop
        }}
      />
      <h1>{title}</h1>
      <div className="price">${price}</div>
      <AddToCartButton onClick={handleAddToCart}>
        Agregar al carrito
      </AddToCartButton>
    </Item>
  );
};

const Shop = () => {
  gsap.registerPlugin(ScrollTrigger);

  const ref = useRef(null);
  const horizontalRef = useRef(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        // Handle paginated response - response.data contains {content: [], totalElements: ...}
        const productData = response.data;
        if (productData && typeof productData === 'object' && 'content' in productData) {
          // Paginated response
          setProducts(Array.isArray(productData.content) ? productData.content : []);
        } else if (Array.isArray(productData)) {
          // Direct array response
          setProducts(productData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useLayoutEffect(() => {
    let element = ref.current;
    let scrollingElement = horizontalRef.current;

    if (!element || !scrollingElement) return;

    let pinWrapWidth = scrollingElement.offsetWidth;

    let t1 = gsap.timeline();

    setTimeout(() => {
      t1.to(element, {
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: pinWrapWidth,
          scroller: ".App", // locomotive element
          scrub: true,
          pin: true,
          // markers:true,
        },
        // we have to increase scrolling height of this section same as the scrolling element width
        height: `${scrollingElement.scrollWidth}px`,
        ease: "none,",
      });

      // Horizontal Scrolling
      t1.to(scrollingElement, {
        scrollTrigger: {
          trigger: scrollingElement,
          start: "top top",
          end: pinWrapWidth,
          scroller: ".App", // locomotive element
          scrub: true,

          // markers:true,
        },
        // we have to increase scrolling height of this section same as the scrolling element width
        x: -pinWrapWidth,
        ease: "none,",
      });
      ScrollTrigger.refresh();
    }, 1000);

    // Cleanup is handled above in the main effect return
  }, []);

  return (
    <Section ref={ref} id="shop">
      <Title data-scroll data-scroll-speed="-1">
        Nueva Colección
      </Title>
      <Left>
        <p>
          Cada pieza de nuestra colección es el resultado de un cuidadoso
          proceso artesanal, donde la calidad del cuero peruano se combina
          con diseños modernos y funcionales. Desde elegantes correas y
          billeteras hasta accesorios únicos, cada producto refleja nuestra
          pasión por el detalle y el compromiso con la excelencia.
          <br />
          <br />
          Explora nuestra tienda y descubre artículos pensados para quienes
          valoran la autenticidad, el diseño y la durabilidad. En D’Karito,
          cada accesorio cuenta una historia hecha a mano, pensada para durar contigo.
        </p>
      </Left>
      <Right ref={horizontalRef}>
        {loading ? (
          <h1>Cargando productos...</h1>
        ) : products.length === 0 ? (
          <h1>No hay productos disponibles</h1>
        ) : (
          products.map((product) => (
            <Product
              key={product.id}
              id={String(product.id!)}
              img={product.img}
              title={product.title}
              price={product.price}
            />
          ))
        )}
      </Right>
    </Section>
  );
};

export default Shop;
