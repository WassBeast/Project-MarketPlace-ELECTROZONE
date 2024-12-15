import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { getAuth } from 'firebase/auth';
import './Payment.css';
import { toast } from "react-toastify";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const Payment = () => {
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    postalCode: '',
  });
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [panierItems, setPanierItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setPanierItems(savedItems);

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserEmail(user.email);
      setUserName(user.displayName || 'User');
    } else {
      console.error('No user is currently signed in.');
    }

    const address = localStorage.getItem('address');
    if (!address) navigate('/adresse');
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentInfo.cardholderName.trim())
      newErrors.cardholderName = 'Name on Card is required.';
    if (!paymentInfo.cardNumber.trim())
      newErrors.cardNumber = 'Card Number is required.';
    else if (!/^\d{16}$/.test(paymentInfo.cardNumber))
      newErrors.cardNumber = 'Card Number must be 16 digits.';
    if (!paymentInfo.expiryDate.trim())
      newErrors.expiryDate = 'Expiry Date is required.';
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate))
      newErrors.expiryDate = 'Expiry Date must be in MM/YY format.';
    if (!paymentInfo.cvv.trim())
      newErrors.cvv = 'CVV is required.';
    else if (!/^\d{3}$/.test(paymentInfo.cvv))
      newErrors.cvv = 'CVV must be 3 digits.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    toast.success("Payment Successful! You will receive your order in 48 hours.");
    navigate('/');

    if (!userEmail) {
      console.error('User email not found');
      return;
    }

    const generatedOrderNumber = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(generatedOrderNumber);

    const details = panierItems.map(item => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    }));
    setOrderDetails(details);

    const total = panierItems.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalPrice(total);

    const date = new Date().toLocaleString();

    let invoiceMessage = `Order Number: ${generatedOrderNumber}\nDate: ${date}\n\nItems:\n`;
    details.forEach(item => {
      invoiceMessage += `- ${item.title} (Quantity: ${item.quantity}): $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    invoiceMessage += `\nTotal Price: $${total.toFixed(2)}`;

    emailjs.send(
      'service_lren8pj',
      'template_o0uxo74',
      {
        to_email: userEmail,
        to_name: userName,
        message: invoiceMessage,
      },
      '3WqoKaeQjsB2rysUI'
    )
      .then(response => console.log('Email sent successfully!', response.status, response.text))
      .catch(error => console.error('Failed to send email:', error));

    const orderData = {
      orderNumber: generatedOrderNumber,
      date: new Date().toISOString(),
      items: details,
      totalPrice: total,
      userEmail,
    };

    try {
      const db = getFirestore();
      const orderDocRef = doc(db, 'orders', `order_${generatedOrderNumber}`);
      await setDoc(orderDocRef, orderData);
      console.log('Order details saved successfully!');

      for (const item of panierItems) {
        const itemRef = doc(db, 'Products', item.id);

        if (item.quantity === item.maxQuantity) {
          await deleteDoc(itemRef);
          console.log(`Deleted item ${item.title} from Firestore.`);
        } else {
          const updatedQuantity = item.maxQuantity - item.quantity;
          await updateDoc(itemRef, { quantity: updatedQuantity });
          console.log(`Updated item ${item.title} quantity to ${updatedQuantity} in Firestore.`);
        }
      }
    } catch (error) {
      console.error('Failed to save order details:', error);
    }

    localStorage.removeItem('cartItems');
    setPanierItems([]);
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">Secure Payment</h2>
      <form className="payment-form" noValidate>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={paymentInfo.cardNumber}
            onChange={handleChange}
            required
          />
          {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="cardholderName">Name on Card</label>
          <input
            name="cardholderName"
            placeholder="John Doe"
            value={paymentInfo.cardholderName}
            onChange={handleChange}
            required
          />
          {errors.cardholderName && (
            <span className="error-message">{errors.cardholderName}</span>
          )}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              name="expiryDate"
              placeholder="MM/YY"
              value={paymentInfo.expiryDate}
              onChange={handleChange}
              required
            />
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              name="cvv"
              placeholder="123"
              value={paymentInfo.cvv}
              onChange={handleChange}
              required
            />
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>
        </div>
        <button
          type="button"
          className="payment-button"
          onClick={handlePayment}
        >
          Complete Purchase
        </button>
      </form>
    </div>
  );
};

export default Payment;
