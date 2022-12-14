/* eslint-disable react/jsx-props-no-spreading */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import { useLocalStorage } from 'usehooks-ts';
import useOrderFormStore from '../hooks/useOrderFormStore';

import numberFormat from '../utils/NumberFormat';

import Postcode from './Postcode';
import Error from './ui/Error';
import PrimaryButton from './ui/PrimaryButton';
import useCartStore from '../hooks/useCartStore';

const Container = styled.div`
  width: 70%;
  margin: 0 auto;
  padding: 1em;
`;

const Title = styled.h2`
  margin-bottom: 1em;
`;

const Table = styled.table`
  margin-bottom: 1em;
  padding: 1em;
  border: 1px solid black;
  border-radius: 4px;
  width: 100%;
  text-align: center;

  tr {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr ;
    align-items: center;
    gap: 3em;
    width: 100%;
  }
`;

const Form = styled.form`
  margin-bottom: 1em;
  padding: 1em;
  border: 1px solid black;
  border-radius: 4px;

  div {
    margin-bottom: 1em;
  }
`;

const Product = styled.td`
  display: flex;
  align-items: center;
`;

const OrderProduct = styled.tr`
    margin-block: 2em .5em;
`;

const PaymentDetail = styled.div`
  border-top: 1px solid black;
  padding-top: 1.3em;
`;

const Image = styled.img`
  background: center url(${(props) => props.url}) no-repeat;
  background-size: contain;
  width: 8em;
  height: 8em;
`;

export default function Order({ navigate, orderProducts }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [, setCart] = useLocalStorage('cart', '{"items":[]}');

  const orderFormStore = useOrderFormStore();
  const cartStore = useCartStore();

  useEffect(() => {
    orderFormStore.setOrderProducts(orderProducts);
  }, []);

  const {
    totalPrice, payment, deliveryFee,
    errorMessage,
  } = orderFormStore;

  const onSubmit = async (data) => {
    const {
      receiver, phoneNumber, deliveryRequest,
    } = data;

    const kakaoPayUrl = await orderFormStore.order({
      receiver,
      phoneNumber,
      deliveryRequest,
    });

    // const kakaoPayUrl = await orderStore.requestOrder({
    //   recipient,
    //   phoneNumber,
    //   orderProducts,
    //   totalOrderPayment,
    //   address,
    //   deliveryRequest,
    // }, accessToken);

    window.location.href = kakaoPayUrl;

    // if (orderId) {
    //   navigate('/order/success');
    cartStore.deleteOrderProducts(orderProducts);
    setCart(JSON.stringify(cartStore.cart));
    // }
  };

  return (
    <Container>
      <Title>?????? / ??????</Title>
      <Table>
        <thead>
          <tr>
            <th>?????? ??????</th>
            <th>??????</th>
            <th>??????</th>
            <th>??????</th>
          </tr>
        </thead>
        <tbody>
          {orderProducts.map((product) => (
            <OrderProduct key={nanoid()}>
              <Product>
                <a href={`products/${product.productId}`}>
                  <Image src={product.image} alt={product.name} />
                </a>
                <div>
                  <p>{product.name}</p>
                  <p>
                    {numberFormat(product.price)}
                    ???
                  </p>
                </div>
              </Product>
              <td>
                {product.optionName}
                {' '}
                (
                {numberFormat(product.optionPrice)}
                ???)
              </td>
              <td>
                {numberFormat(product.quantity)}
                ???
              </td>
              <td>
                {numberFormat((product.price + product.optionPrice) * product.quantity)}
                ???
              </td>
            </OrderProduct>
          ))}
        </tbody>
      </Table>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h3>????????? ??????</h3>
          <div>
            <label htmlFor="input-receiver">?????? ??? ??????</label>
            <input
              id="input-receiver"
              {...register(
                'receiver',
                { required: { value: true, message: '?????? ??? ????????? ??????????????????' } },
              )}
            />
            <Error>{errors.receiver ? errors.receiver.message : null}</Error>
          </div>
          <div>
            <label htmlFor="input-phoneNumber">
              ?????? ??? ??????
            </label>
            <input
              id="input-phoneNumber"
              {...register(
                'phoneNumber',
                {
                  required: { value: true, message: '?????? ??? ????????? ??????????????????' },
                  pattern: { value: /^01{1}[01]{1}[0-9]{7,8}$/, message: '????????? ?????? ??????????????????' },
                },
              )}
            />
            <Error>{errors.phoneNumber ? errors.phoneNumber.message : null}</Error>
          </div>
          <div>
            <Postcode
              register={register}
              errors={errors}
            />
          </div>
          <div>
            <label
              htmlFor="input-delivery-request"
            >
              ?????? ?????? ??????
            </label>
            <input
              id="input-delivery-request"
              {...register('deliveryRequest')}
            />
          </div>
          <div />
        </div>
        <PaymentDetail>
          <h3>?????? ??????</h3>
          <dl>
            <dt>????????????</dt>
            <dd>
              {numberFormat(payment)}
              ???
            </dd>
            <dt>????????????</dt>
            <dd>
              {numberFormat(totalPrice)}
              ???
            </dd>
            <dt>?????????</dt>
            <dd>
              {numberFormat(deliveryFee)}
              ???
            </dd>
          </dl>
        </PaymentDetail>
        <Error>{errorMessage}</Error>
        <PrimaryButton type="submit">
          ????????????
        </PrimaryButton>
      </Form>
    </Container>
  );
}
