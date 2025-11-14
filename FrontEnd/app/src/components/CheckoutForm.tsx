import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';

const CheckoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const CheckoutForm = motion(styled.form`
  max-width: 600px;
  width: 100%;
  background-color: ${props => props.theme.grey};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 48em) {
    padding: 1rem;
  }
`);

const Title = styled.h1`
  font-size: ${props => props.theme.fontxxl};
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fontmd};
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.text};
  border-radius: 4px;
  font-size: ${props => props.theme.fontmd};
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.text};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.text};
  border-radius: 4px;
  font-size: ${props => props.theme.fontmd};
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.text};
  }
`;

const CardDetails = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: 48em) {
    grid-template-columns: 1fr;
  }
`;

const OrderSummary = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.text};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: ${props => props.theme.fontsm};
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.fontlg};
  font-weight: 600;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.text};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  border: none;
  border-radius: 4px;
  font-size: ${props => props.theme.fontlg};
  font-weight: 600;
  cursor: pointer;
  margin-top: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.grey};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background-color: ${props => props.theme.grey};
  border-radius: 8px;
  margin-top: 2rem;
`;

const SuccessText = styled.p`
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  border: none;
  border-radius: 4px;
  font-size: ${props => props.theme.fontmd};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.grey};
  }
`;

const Checkout: React.FC = () => {
  const { cart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nombre completo es requerido';
    if (!formData.email.trim()) newErrors.email = 'Correo electrónico es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'Número de teléfono es requerido';
    if (!formData.address.trim()) newErrors.address = 'Dirección de envío es requerida';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número de tarjeta es requerido';
      if (!formData.expiry.trim()) newErrors.expiry = 'Fecha de expiración es requerida';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Simulate payment processing
    setTimeout(() => {
      const order: Order = {
        id: Date.now().toString(),
        user: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        items: cart,
        total: getTotalPrice(),
        paymentMethod: formData.paymentMethod as 'card' | 'wallet',
        cardDetails: formData.paymentMethod === 'card' ? {
          number: formData.cardNumber,
          expiry: formData.expiry,
          cvv: formData.cvv
        } : undefined,
        createdAt: new Date()
      };

      // Save order to localStorage (simulate backend)
      const existingOrders = JSON.parse(localStorage.getItem('d-karito-orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('d-karito-orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      // Show success message
      setIsSubmitted(true);
    }, 2000); // Simulate 2 second processing
  };

  if (isSubmitted) {
    return (
      <CheckoutContainer>
        <SuccessMessage
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessText>✅ ¡Gracias por tu compra! Tu pedido ha sido registrado correctamente.</SuccessText>
          <BackButton onClick={() => navigate('/')}>
            Volver al inicio
          </BackButton>
        </SuccessMessage>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <CheckoutForm
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
      >
        <Title>Finalizar Compra</Title>

        <FormGroup>
          <Label htmlFor="name">Nombre completo *</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          {errors.name && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</span>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</span>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Número de teléfono *</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          {errors.phone && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone}</span>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="address">Dirección de envío *</Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          {errors.address && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.address}</span>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="paymentMethod">Método de pago *</Label>
          <Select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
          >
            <option value="card">Tarjeta de crédito/débito</option>
            <option value="wallet">Billetera digital</option>
          </Select>
        </FormGroup>

        {formData.paymentMethod === 'card' && (
          <CardDetails>
            <FormGroup>
              <Label htmlFor="cardNumber">Número de tarjeta *</Label>
              <Input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
              {errors.cardNumber && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.cardNumber}</span>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="expiry">Fecha de expiración *</Label>
              <Input
                type="text"
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleInputChange}
                required
              />
              {errors.expiry && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.expiry}</span>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                required
              />
              {errors.cvv && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.cvv}</span>}
            </FormGroup>
          </CardDetails>
        )}

        <OrderSummary>
          <h3>Resumen del pedido</h3>
          {cart.map(item => (
            <SummaryItem key={item.id}>
              <span>{item.title} x{item.quantity}</span>
              <span>${(item.price || 0) * item.quantity}</span>
            </SummaryItem>
          ))}
          <Total>
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </Total>
        </OrderSummary>

        <SubmitButton type="submit">
          Confirmar compra
        </SubmitButton>
      </CheckoutForm>
    </CheckoutContainer>
  );
};

export default Checkout;
