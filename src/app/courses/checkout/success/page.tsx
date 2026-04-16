import CheckoutSuccess from "../../../../ui/CheckoutSuccess";

type PageProps = {
  searchParams: { session_id?: string };
};

const CheckoutSuccessPage = ({ searchParams }: PageProps) => {
  return <CheckoutSuccess sessionId={searchParams.session_id} />;
}

export default CheckoutSuccessPage;

