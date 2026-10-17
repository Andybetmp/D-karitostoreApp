import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { orderService, CreateOrderRequest } from '../services/orderService';
import { paymentService, PaymentMethodType, PaymentRecord } from '../services/paymentService';

const CheckoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  padding: 2.5rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const CheckoutGrid = styled(motion.div)`
  max-width: 1040px;
  width: 100%;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 2rem;

  @media (max-width: 60em) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background-color: #27282E;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 2rem;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
`;

const Title = styled.h1`
  font-size: 1.85rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: #fff;
`;

const Subtitle = styled.p`
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 1.75rem;
`;

const SectionLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #a9dfd8;
  margin: 1.5rem 0 1rem 0;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 40em) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.15rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: rgba(255, 255, 255, 0.85);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: #171821;
  color: #fff;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #a9dfd8;
  }
`;

const MethodTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const MethodTab = styled.button<{ $active: boolean }>`
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1px solid ${props => (props.$active ? '#a9dfd8' : 'rgba(255, 255, 255, 0.16)')};
  background: ${props => (props.$active ? 'rgba(169, 223, 216, 0.14)' : '#171821')};
  color: ${props => (props.$active ? '#a9dfd8' : '#fff')};
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    border-color: #a9dfd8;
  }
`;

const VisualCard = styled.div`
  background: linear-gradient(135deg, #2d3446 0%, #171821 60%, #3a2d28 100%);
  border: 1px solid rgba(169, 223, 216, 0.35);
  border-radius: 14px;
  padding: 1.35rem 1.5rem;
  margin-bottom: 1.25rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 155px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
`;

const CardDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 0.85rem;

  @media (max-width: 48em) {
    grid-template-columns: 1fr;
  }
`;

const WalletBox = styled.div`
  background: #171821;
  border: 1px dashed #a9dfd8;
  border-radius: 10px;
  padding: 1.25rem;
  text-align: center;
  margin-bottom: 1.25rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.92rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  font-weight: 700;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: #a9dfd8;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 0.95rem 1.25rem;
  background-color: #a9dfd8;
  color: #171821;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #8ccfc6;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.25rem;
  background-color: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #a9dfd8;
    color: #a9dfd8;
  }
`;

const ReceiptBox = styled(motion.div)`
  max-width: 580px;
  width: 100%;
  background-color: #27282E;
  border: 1px solid rgba(169, 223, 216, 0.4);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
`;

const Checkout: React.FC = () => {
  const { cart, addToCart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || 'Jolaus Andy Meza Perez',
    email: user?.email || 'admin@dkarito.com',
    phone: '987 654 321',
    address: 'Av. Javier Prado Este 2450, San Borja, Lima',
    paymentMethod: 'CREDIT_CARD' as PaymentMethodType,
    cardNumber: '4532 •••• •••• 8841',
    expiry: '08/29',
    cvv: '842',
    walletPhone: '987654321',
    walletCode: '482910'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{
    orderId: number;
    totalAmount: number;
    shippingAddress: string;
    payment: PaymentRecord;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLoadDemoItems = () => {
    addToCart({
      id: '19',
      title: 'Bolso de Cuero Artesanal',
      price: 129.99,
      img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'
    });
    addToCart({
      id: '18',
      title: 'Cinturón de Cuero Clásico',
      price: 49.99,
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre completo es requerido';
    if (!formData.email.trim()) newErrors.email = 'Correo electrónico es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'Número de teléfono es requerido';
    if (!formData.address.trim()) newErrors.address = 'Dirección de envío es requerida';

    if (formData.paymentMethod === 'CREDIT_CARD' || formData.paymentMethod === 'DEBIT_CARD') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número de tarjeta es requerido';
      if (!formData.expiry.trim()) newErrors.expiry = 'Expiración requerida';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const totalAmount = getTotalPrice();
      const orderRequest: CreateOrderRequest = {
        userId: user?.id || 1,
        shippingAddress: formData.address,
        totalAmount,
        items: cart.map(item => ({
          productId: Number(item.id),
          productTitle: item.title,
          price: item.price || 0,
          quantity: item.quantity
        }))
      };

      // 1. Create order in order-service
      const orderRes = await orderService.createOrder(orderRequest);
      const createdOrder = orderRes.data;

      // 2. Create & process payment in payment-service
      await paymentService.createPayment({
        orderId: createdOrder.id,
        amount: totalAmount,
        paymentMethod: formData.paymentMethod,
      });
      const processedPaymentRes = await paymentService.processPayment(createdOrder.id);

      // 3. Update order status to CONFIRMED
      try {
        await orderService.updateOrderStatus(createdOrder.id, 'CONFIRMED');
      } catch (e) {}

      clearCart();
      setReceipt({
        orderId: createdOrder.id,
        totalAmount,
        shippingAddress: formData.address,
        payment: processedPaymentRes.data,
      });
    } catch (error) {
      console.error('Error processing checkout:', error);
      alert('Hubo un problema al procesar el pago. Por favor verifica tu conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <CheckoutContainer>
        <ReceiptBox
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(169, 223, 216, 0.18)', color: '#a9dfd8',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', marginBottom: '0.75rem'
            }}>
              ✓
            </div>
            <Title style={{ fontSize: '1.6rem' }}>¡Pago Aprobado con Éxito!</Title>
            <Subtitle style={{ marginBottom: 0 }}>
              Comprobante electrónico generado por D'Karito Payment Service
            </Subtitle>
          </div>

          <div style={{
            background: '#171821',
            borderRadius: 12,
            padding: '1.25rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <SummaryItem>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Orden de Compra:</span>
              <strong>#{receipt.orderId}</strong>
            </SummaryItem>
            <SummaryItem>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>ID Transacción:</span>
              <strong style={{ color: '#a9dfd8', fontFamily: 'monospace' }}>
                {receipt.payment.transactionId || 'TXN-DK-VERIFIED'}
              </strong>
            </SummaryItem>
            <SummaryItem>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Estado del Pago:</span>
              <span style={{
                background: 'rgba(40, 199, 111, 0.2)',
                color: '#28c76f',
                padding: '2px 10px',
                borderRadius: 99,
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                {receipt.payment.status}
              </span>
            </SummaryItem>
            <SummaryItem>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Método Utilizado:</span>
              <strong>{receipt.payment.paymentMethod}</strong>
            </SummaryItem>
            <SummaryItem>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Dirección de Envío:</span>
              <span>{receipt.shippingAddress}</span>
            </SummaryItem>
            <TotalRow>
              <span>Monto Pagado:</span>
              <span>${receipt.totalAmount.toFixed(2)}</span>
            </TotalRow>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <PrimaryButton
              type="button"
              style={{ marginTop: 0, flex: 1 }}
              onClick={() => navigate('/my-orders')}
            >
              Ver Mis Pedidos
            </PrimaryButton>
            <SecondaryButton
              type="button"
              style={{ flex: 1 }}
              onClick={() => navigate('/dashboard/payments')}
            >
              Panel de Pagos (Admin)
            </SecondaryButton>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <SecondaryButton type="button" onClick={() => navigate('/')} style={{ width: '100%' }}>
              ← Volver a la Tienda D'Karito
            </SecondaryButton>
          </div>
        </ReceiptBox>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <CheckoutGrid
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Panel as="form" onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title>Pasarela de Pago D'Karito</Title>
              <Subtitle>Transacción segura conectada a Order & Payment Microservices</Subtitle>
            </div>
            <SecondaryButton type="button" onClick={() => navigate('/')}>
              ← Tienda
            </SecondaryButton>
          </div>

          <SectionLabel>1. Datos de Facturación y Envío</SectionLabel>
          <FormRow>
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
              {errors.name && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.name}</span>}
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
              {errors.email && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.email}</span>}
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              {errors.phone && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.phone}</span>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="address">Dirección de entrega *</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              {errors.address && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.address}</span>}
            </FormGroup>
          </FormRow>

          <SectionLabel>2. Método de Pago</SectionLabel>
          <MethodTabs>
            <MethodTab
              type="button"
              $active={formData.paymentMethod === 'CREDIT_CARD'}
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'CREDIT_CARD' }))}
            >
              💳 Tarjeta de Crédito
            </MethodTab>
            <MethodTab
              type="button"
              $active={formData.paymentMethod === 'DEBIT_CARD'}
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'DEBIT_CARD' }))}
            >
              🏦 Tarjeta de Débito
            </MethodTab>
            <MethodTab
              type="button"
              $active={formData.paymentMethod === 'WALLET'}
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'WALLET' }))}
            >
              📱 Yape / Plin (Billetera)
            </MethodTab>
            <MethodTab
              type="button"
              $active={formData.paymentMethod === 'PAYPAL'}
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'PAYPAL' }))}
            >
              🌐 PayPal Express
            </MethodTab>
          </MethodTabs>

          {(formData.paymentMethod === 'CREDIT_CARD' || formData.paymentMethod === 'DEBIT_CARD') && (
            <>
              <VisualCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: '#a9dfd8' }}>
                    D'KARITO PRIVILEGE • {formData.paymentMethod === 'CREDIT_CARD' ? 'CRÉDITO' : 'DÉBITO'}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>VISA / MC</span>
                </div>
                <div style={{ fontSize: '1.35rem', letterSpacing: '0.14em', fontFamily: 'monospace', margin: '1rem 0' }}>
                  {formData.cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>
                  <span>TITULAR: {(formData.name || 'CLIENTE DKARITO').toUpperCase()}</span>
                  <span>EXP: {formData.expiry || 'MM/AA'}</span>
                </div>
              </VisualCard>

              <CardDetailsGrid>
                <FormGroup>
                  <Label htmlFor="cardNumber">Número de tarjeta *</Label>
                  <Input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="4532 1234 5678 9012"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="expiry">Vencimiento *</Label>
                  <Input
                    type="text"
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    type="password"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    maxLength={4}
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </CardDetailsGrid>
            </>
          )}

          {formData.paymentMethod === 'WALLET' && (
            <WalletBox>
              <p style={{ color: '#a9dfd8', fontWeight: 700, marginBottom: '0.5rem' }}>
                Pago Instantáneo con Yape o Plin
              </p>
              <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                Ingresa tu número celular afiliado y el código de aprobación de 6 dígitos.
              </p>
              <FormRow>
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label>Celular Yape / Plin</Label>
                  <Input
                    type="tel"
                    name="walletPhone"
                    value={formData.walletPhone}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label>Código de Aprobación</Label>
                  <Input
                    type="text"
                    name="walletCode"
                    value={formData.walletCode}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>
            </WalletBox>
          )}

          {formData.paymentMethod === 'PAYPAL' && (
            <WalletBox>
              <p style={{ color: '#a9dfd8', fontWeight: 700, marginBottom: '0.4rem' }}>
                PayPal Checkout Integrado
              </p>
              <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.7)' }}>
                Se procesará el cargo automáticamente con la cuenta asociada a <strong>{formData.email}</strong>.
              </p>
            </WalletBox>
          )}

          <PrimaryButton type="submit" disabled={isSubmitting || cart.length === 0}>
            {isSubmitting
              ? 'Procesando pago con Payment-Service...'
              : `Pagar Ahora $${getTotalPrice().toFixed(2)}`}
          </PrimaryButton>
        </Panel>

        <Panel>
          <SectionLabel style={{ marginTop: 0 }}>Resumen del Pedido</SectionLabel>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '1.25rem' }}>
                Tu carrito está vacío actualmente. Puedes cargar artículos de cuero de prueba para verificar el flujo de pago:
              </p>
              <PrimaryButton type="button" onClick={handleLoadDemoItems} style={{ marginTop: 0 }}>
                + Cargar Productos de Prueba
              </PrimaryButton>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <SummaryItem key={item.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.img && (
                      <img
                        src={item.img}
                        alt={item.title}
                        style={{ width: 46, height: 46, objectFit: 'cover', borderRadius: 8 }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                        Cantidad: {item.quantity} × ${(item.price || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <strong>${((item.price || 0) * item.quantity).toFixed(2)}</strong>
                </SummaryItem>
              ))}

              <SummaryItem style={{ borderBottom: 'none', paddingTop: '1rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>Envío Express Asegurado:</span>
                <span style={{ color: '#28c76f', fontWeight: 600 }}>GRATIS</span>
              </SummaryItem>

              <TotalRow>
                <span>Total a Pagar:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </TotalRow>
            </>
          )}

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            borderRadius: 10,
            background: 'rgba(169, 223, 216, 0.07)',
            border: '1px solid rgba(169, 223, 216, 0.2)',
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.5
          }}>
            🔒 <strong>Arquitectura de Microservicios D'Karito:</strong> Al confirmar, se registra el pedido en <code>order-service (:8084)</code>, se descuenta el stock en <code>inventory-service (:8083)</code> y se emite la transacción en <code>payment-service (:8085)</code>.
          </div>
        </Panel>
      </CheckoutGrid>
    </CheckoutContainer>
  );
};

export default Checkout;
