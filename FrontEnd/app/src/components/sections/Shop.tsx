import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { productService, Product as ProductType } from "../../services/productService";

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

const Title = styled.h2`
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
    line-height: 1.6;
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
  padding-left: 18%;
  padding-right: 10%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.grey};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Item = styled(motion.div)`
  width: 20rem;
  margin-right: 4.5rem;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(6px);

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.15rem;
    font-weight: 600;
    text-align: center;
    color: #fff;
    margin: 0.25rem 0;
  }

  .price {
    font-size: ${(props) => props.theme.fontlg};
    font-weight: 700;
    color: #a9dfd8;
    margin-top: 0.35rem;
  }

  @media (max-width: 48em) {
    width: 15rem;
    margin-right: 2.5rem;
    img {
      height: 200px;
    }
  }
`;

const AddToCartButton = styled.button<{ $added?: boolean }>`
  margin-top: 1rem;
  width: 100%;
  padding: 0.65rem 1rem;
  background-color: ${(props) => (props.$added ? "#28c76f" : props.theme.text)};
  color: ${(props) => (props.$added ? "#fff" : props.theme.body)};
  border: none;
  border-radius: 8px;
  font-size: ${(props) => props.theme.fontsm};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const Product = ({
  img,
  title = "",
  id,
  price,
}: {
  img: string;
  title: string;
  id: string;
  price: number;
}) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id, img, title, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Item
      initial={{ filter: "grayscale(60%)" }}
      whileInView={{ filter: "grayscale(0%)" }}
      transition={{ duration: 0.45 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <img
        src={img}
        alt={title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600";
          e.currentTarget.onerror = null;
        }}
      />
      <h3>{title}</h3>
      <div className="price">${Number(price || 0).toFixed(2)}</div>
      <AddToCartButton $added={added} onClick={handleAddToCart} aria-label={`Agregar ${title} al carrito`}>
        {added ? "✓ Agregado al carrito" : "Agregar al carrito"}
      </AddToCartButton>
    </Item>
  );
};

const Shop = () => {
  gsap.registerPlugin(ScrollTrigger);

  const ref = useRef<HTMLElement | null>(null);
  const horizontalRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        const productData = response.data as any;
        if (productData && typeof productData === "object" && "content" in productData) {
          setProducts(Array.isArray(productData.content) ? productData.content : []);
        } else if (Array.isArray(productData)) {
          setProducts(productData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useLayoutEffect(() => {
    const element = ref.current;
    const scrollingElement = horizontalRef.current;

    if (!element || !scrollingElement || products.length === 0) return;

    let t1 = gsap.timeline();

    const timer = setTimeout(() => {
      if (!element.isConnected || !scrollingElement.isConnected) return;
      const pinWrapWidth = scrollingElement.offsetWidth;
      if (!pinWrapWidth) return;

      t1.to(element, {
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: pinWrapWidth,
          scroller: ".App",
          scrub: true,
          pin: true,
        },
        height: `${scrollingElement.scrollWidth}px`,
        ease: "none",
      });

      t1.to(scrollingElement, {
        scrollTrigger: {
          trigger: scrollingElement,
          start: "top top",
          end: pinWrapWidth,
          scroller: ".App",
          scrub: true,
        },
        x: -pinWrapWidth,
        ease: "none",
      });
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(timer);
      t1.scrollTrigger?.kill();
      t1.kill();
    };
  }, [products]);

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
          <h3 style={{ color: "#fff", margin: "0 2rem" }}>Cargando catálogo de cuero...</h3>
        ) : products.length === 0 ? (
          <h3 style={{ color: "#fff", margin: "0 2rem" }}>No hay productos disponibles</h3>
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
