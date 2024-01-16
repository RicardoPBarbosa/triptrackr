export type TripDetailsParamProps = {
  params: { id: string };
};

export type TemplateParamProps = {
  params: { id?: string };
};

export type EditTripExpenseParamProps = {
  params: { id: string; expenseId: string };
};

export type AnnualReviewParamProps = {
  params: { year: string };
};
