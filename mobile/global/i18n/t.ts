import { useI18nStore } from './i18n.store';

/**
 * A helper function to access the translation function `t` from the i18n store.
 * This allows us to use `t` in non-React contexts where we can't use the `useI18nStore` hook directly.
 */

/**
 * Infer the type of the translation function `t` from the i18n store
 * */
type StoreT = ReturnType<typeof useI18nStore.getState>['t'];

/**
 * A global helper function that proxies the `t` function inside the i18n store.
 *
 * This wrapper preserves the exact parameter and return types of the store's `t` function by using `Parameters<StoreT>` and `ReturnType<StoreT>`.
 *
 * @param args - The arguments accepted by the `t` function inside the i18n store. These are inferred automatically from the store's `t` signature.
 *
 * @returns The translated string (or whatever the store's `t` returns),
 *          matching the return type of the store's `t` function.
 *
 * This allows you to call `t()` anywhere (even outside React components)
 * while keeping full type safety and without subscribing to store updates.
 */
export const t = (...args: Parameters<StoreT>): ReturnType<StoreT> => {
  return useI18nStore.getState().t(...args);
};
