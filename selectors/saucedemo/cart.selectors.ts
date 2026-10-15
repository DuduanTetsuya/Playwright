export const CartSelectors = {
    checkoutButton: '[data-test="checkout"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    cartItems: '.cart_item',
    itemName: '.cart_item .inventory_item_name',
    itemPrice: '.cart_item .inventory_item_price',
    removeButton: (itemId: string) => `[data-test="remove-${itemId}"]`,
    cartTitle: '.title'
};
