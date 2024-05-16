interface SubType {
  items: {
    data: [
      {
        price: {
          id: string;
        };
      },
    ];
  };
  plan: {
    id: string;
  };
}

export const planOrPriceId = (subscription: SubType): string => {
  if (subscription?.plan?.id) return subscription?.plan?.id;
  if (subscription?.items?.data?.[0]?.price?.id) return subscription?.items?.data?.[0]?.price?.id;

  return '';
};

export default planOrPriceId;
