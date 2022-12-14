import {
  cleanup, fireEvent, render, screen, waitFor,
} from '@testing-library/react';

import { productStore } from '../stores/ProductStore';

import Product from './Product';

const navigate = jest.fn();

const context = describe;

describe('Product', () => {
  afterEach(() => {
    cleanup();
  });

  const productId = 1;

  it('renders product information', async () => {
    render(
      <Product
        navigate={navigate}
        productId={productId}
      />,
    );

    // await productStore.fetchProduct(1);
    // await productStore.fetchOptions(1);

    await waitFor(() => {
      screen.getByText('상품 1');
      screen.getByText('구매하기');
      screen.getByText('총 상품 금액:');
      screen.getAllByText('500원');
      screen.getByText('1');
    });
  });

  it('listens for increase count button click event', async () => {
    render(
      <Product
        navigate={navigate}
        productId={productId}
      />,
    );

    // await productStore.fetchProduct(1);
    // await productStore.fetchOptions(1);

    await waitFor(() => {
      fireEvent.click(screen.getByText('➕'));
      fireEvent.click(screen.getByText('➕'));

      screen.getByText('3');
      screen.getByText('1,500원');
    });
  });

  it('listens for decrease count button click event', async () => {
    render(
      <Product
        navigate={navigate}
        productId={productId}
      />,
    );

    // await productStore.fetchProduct(1);
    // await productStore.fetchOptions(1);

    await waitFor(() => {
      fireEvent.click(screen.getByText('➖'));

      screen.getByText('1');
      screen.getAllByText('500원');
    });
  });

  it('listens for change option event', async () => {
    render(
      <Product
        navigate={navigate}
        productId={productId}
      />,
    );

    // await productStore.fetchProduct(1);
    // await productStore.fetchOptions(1);

    await waitFor(() => {
      fireEvent.change(
        screen.getByRole('combobox'),
        { target: { value: 2 } },
      );

      screen.getByText('1');
      screen.getAllByText(/1,500원/);
    });
  });

  context('옵션을 선택하지 않고 구매 버튼을 누를 때', () => {
    it('appear not choice option message', async () => {
      render(
        <Product
          navigate={navigate}
          productId={productId}
        />,
      );

      // await productStore.fetchProduct(1);
      // await productStore.fetchOptions(1);

      await waitFor(() => {
        fireEvent.click(screen.getByText('구매하기'));

        screen.getByText('옵션을 선택해주세요');
      });
    });
  });

  context('옵션을 선택하고 구매 버튼을 누를 때', () => {
    it('appear not choice option message', async () => {
      render(
        <Product
          navigate={navigate}
          productId={productId}
        />,
      );

      // await productStore.fetchProduct(1);
      // productStore.fetchOptions(1);

      await waitFor(() => {
        fireEvent.change(
          screen.getByRole('combobox'),
          { target: { value: 2 } },
        );

        fireEvent.click(screen.getByText('구매하기'));

        // expect(navigate).toBeCalled();
      });

      // await waitForElementToBeRemoved(() => {
      //   screen.getByText('구매하기');
      // });
    });
  });
});
