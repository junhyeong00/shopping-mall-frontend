import Cart from './Cart';
import Item from './Item';

const context = describe;

describe('Cart', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart([]);
  });

  context('when there is no same product', () => {
    it('adds an item', () => {
      const productIds = [1, 2, 3];

      cart = productIds.reduce((prevCart, productId) => (
        prevCart.addItem({ productId, quantity: 1 })
      ), cart);

      expect(cart.items).toHaveLength(3);
    });
  });

  context('when there is the same product with same option', () => {
    it('adds an item', () => {
      const productId = 1;
      const optionId = 1;
      const quantities = [1, 2, 3];

      cart = quantities.reduce((prevCart, quantity) => (
        prevCart.addItem({ productId, optionId, quantity })
      ), cart);

      expect(cart.items).toHaveLength(1);

      expect(cart.items).toEqual([
        new Item({
          id: 1,
          productId: 1,
          optionId: 1,
          quantity: quantities.reduce((a, b) => a + b),
          selected: true,
        }),
      ]);
    });
  });

  it('delete an item', () => {
    const productIds = [1, 2, 3];
    const id = 2;

    cart = productIds.reduce((prevCart, productId) => (
      prevCart.addItem({ productId, quantity: 1 })
    ), cart);

    expect(cart.items).toHaveLength(3);

    cart = cart.deleteItem({ id });

    expect(cart.items).toHaveLength(2);
  });

  it('toggle selected', () => {
    const productIds = [1, 2, 3];

    cart = productIds.reduce((prevCart, productId) => (
      prevCart.addItem({ productId, quantity: 1 })
    ), cart);

    expect(cart.items).toHaveLength(3);

    cart = cart.toggleSelected({ id: 2 });

    expect(cart.items[0].selected).toBeTruthy();
    expect(cart.items[1].selected).toBeFalsy();
  });
});
