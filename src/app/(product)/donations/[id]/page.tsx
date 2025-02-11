import Container from "@/components/Container";
import DonationDetailComponent from "@/components/donations/DonationDetail";

export const dynamic = "force-dynamic";

async function DonationDetail(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <main>
      <div className="py-6 sm:py-12 md:py-24 lg:h-[calc(100vh-3.5rem)]">
        <Container className="px-4 md:px-6 gap lg:gap-12 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:relative lg:h-full lg:overflow-y-hidden">
          <DonationDetailComponent id={params.id} />
        </Container>
      </div>
    </main>
  );
}

export default DonationDetail;
