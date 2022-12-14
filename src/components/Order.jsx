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
      <Title>주문 / 결제</Title>
      <Table>
        <thead>
          <tr>
            <th>상품 정보</th>
            <th>옵션</th>
            <th>수량</th>
            <th>금액</th>
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
                    원
                  </p>
                </div>
              </Product>
              <td>
                {product.optionName}
                {' '}
                (
                {numberFormat(product.optionPrice)}
                원)
              </td>
              <td>
                {numberFormat(product.quantity)}
                개
              </td>
              <td>
                {numberFormat((product.price + product.optionPrice) * product.quantity)}
                원
              </td>
            </OrderProduct>
          ))}
        </tbody>
      </Table>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h3>배송지 정보</h3>
          <div>
            <label htmlFor="input-receiver">받는 분 성함</label>
            <input
              id="input-receiver"
              {...register(
                'receiver',
                { required: { value: true, message: '받는 분 성함을 입력해주세요' } },
              )}
            />
            <Error>{errors.receiver ? errors.receiver.message : null}</Error>
          </div>
          <div>
            <label htmlFor="input-phoneNumber">
              받는 분 번호
            </label>
            <input
              id="input-phoneNumber"
              {...register(
                'phoneNumber',
                {
                  required: { value: true, message: '받는 분 번호를 입력해주세요' },
                  pattern: { value: /^01{1}[01]{1}[0-9]{7,8}$/, message: '번호를 다시 확인해주세요' },
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
              배송 요청 사항
            </label>
            <input
              id="input-delivery-request"
              {...register('deliveryRequest')}
            />
          </div>
          <div />
        </div>
        <PaymentDetail>
          <h3>결제 상세</h3>
          <dl>
            <dt>결제금액</dt>
            <dd>
              {numberFormat(payment)}
              원
            </dd>
            <dt>상품금액</dt>
            <dd>
              {numberFormat(totalPrice)}
              원
            </dd>
            <dt>배송비</dt>
            <dd>
              {numberFormat(deliveryFee)}
              원
            </dd>
          </dl>
        </PaymentDetail>
        <Error>{errorMessage}</Error>
        <PrimaryButton type="submit">
          결제하기
        </PrimaryButton>
      </Form>
    </Container>
  );
}
