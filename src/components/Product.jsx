import { useEffect } from 'react';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';
import useCartStore from '../hooks/useCartStore';
import useProductStore from '../hooks/useProductStore';
import { orderFormStore } from '../stores/OrderFormStore';
import numberFormat from '../utils/NumberFormat';
import optionPriceFormat from '../utils/OptionPriceFormat';
import Error from './ui/Error';
import PrimaryButton from './ui/PrimaryButton';

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 1em;
`;

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 90vh;
// `;

const ProductImage = styled.img`
  width: 30em;
  height: auto;
`;

const ProductDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  height: 30em;
  width: 30em;
`;

const Name = styled.p`
  font-size: 1.5em;
`;

const Price = styled.span`
  font-size: 1.8em;
  font-weight: bold;
  padding-block: 1em;
  border-bottom: 1px solid #D9D9D9;
`;

const Detail = styled.dl`
  div {
    display: flex;
    padding-block: 1.3em;
    border-bottom: 1px solid #D9D9D9;
  }
  dt {
    width: 20%;
    
  }
  dd {
    color: #666666;
  }
`;

const TotalPrice = styled.span`
  margin-block: 1.2em .2em;
  text-align: end;
  font-size: 1em;
  span {
    font-size: 1.8em;
    font-weight: bold;
  }
`;

const CountForm = styled.dd`
  border: 1px solid #D9D9D9;
  border-radius: 5px;
  padding: .4em;
  button {
    border: none;
    background: none;
    font-weight: bold;
  }
  span {
    padding-inline: .4em;
  }
`;

export default function Product({ navigate, productId }) {
  const [, setCart] = useLocalStorage('cart', '{"items":[]}');

  const productStore = useProductStore();
  const cartStore = useCartStore();

  useEffect(() => {
    productStore.fetchProduct(productId);
    productStore.fetchOptions(productId);
  }, []);

  const {
    product, totalPrice, selectedCount, options,
    selectedOptionId, selectedOptionName, selectedOptionPrice,
    errorMessage,
  } = productStore;

  const orderProducts = [{
    productId: product.id,
    name: product.name,
    optionId: selectedOptionId,
    optionName: selectedOptionName,
    optionPrice: selectedOptionPrice,
    price: product.price,
    quantity: selectedCount,
    image: product.image,
  }];

  const handleClickPurchase = () => {
    if (selectedOptionId === 'none' || !selectedOptionId) {
      productStore.notChoiceOption();
      return;
    }

    orderFormStore.initialize();
    navigate(
      '/order',
      { state: orderProducts },
    );
  };

  const handleChangeOption = (e) => {
    productStore.changeOption(e.target.value);
  };

  const handleClickCart = () => {
    if (selectedOptionId === 'none' || !selectedOptionId) {
      productStore.notChoiceOption();
      return;
    }

    cartStore.addItem({
      productId: product.id,
      name: product.name,
      optionId: selectedOptionId,
      optionName: selectedOptionName,
      price: product.price,
      optionPrice: selectedOptionPrice,
      quantity: selectedCount,
      // image: product.image,
      // TODO ????????? ??????
    });

    setCart(JSON.stringify(cartStore.cart));
    navigate('/cart');
  };

  return (
    <Container>
      <ProductImage src={product.image} alt="product" />
      <ProductDescription>
        <Name>{product.name}</Name>
        <Price>
          {numberFormat(product.price)}
          ???
        </Price>
        <Detail>
          <div>
            <p>??????</p>
            <select
              id="options"
              onChange={handleChangeOption}
            >
              <option
                value="none"
              >
                {' '}
                ??????
                {' '}
              </option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                  {' '}
                  {optionPriceFormat(option.optionPrice)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <dt>????????????</dt>
            <CountForm>
              <button
                type="button"
                onClick={() => productStore.decreaseCount()}
                disabled={selectedCount < 2}
              >
                ???
              </button>
              <span>
                {selectedCount}
              </span>
              <button
                type="button"
                onClick={() => productStore.increaseCount()}
              >
                ???
              </button>
            </CountForm>
          </div>
        </Detail>
        <TotalPrice>
          ??? ?????? ??????:
          {' '}
          <span>
            {numberFormat(totalPrice)}
            ???
          </span>
        </TotalPrice>
        <PrimaryButton
          type="button"
          onClick={handleClickPurchase}
        >
          ????????????
        </PrimaryButton>
        <div>
          <button type="button">???</button>
          <button
            type="button"
            onClick={handleClickCart}
          >
            ????????????
          </button>
        </div>
        <Error>{errorMessage}</Error>
      </ProductDescription>
    </Container>
  );
}
