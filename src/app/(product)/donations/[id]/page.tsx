import Container from "@/components/Container";
import DonationDetailComponent from "@/components/donations/DonationDetail";

function DonationDetail({ params }: { params: { id: string } }) {
  return (
    <main>
      <div className="py-6 sm:py-12 md:py-24">
        <Container className="px-4 md:px-6 flex flex-col gap lg:gap-12">
          <DonationDetailComponent id={params.id} />
        </Container>
      </div>
    </main>
  );
}

export default DonationDetail;