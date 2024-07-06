import Container from "@/components/Container";
import DonationsComponent from "@/components/donations/Donations";

export const dynamic = "force-dynamic";

function Donations() {
  return (
    <main>
      <div className="py-6 sm:py-12 md:py-24 lg:py-32">
        <Container className="px-4 md:px-6 flex flex-col gap-6 lg:gap-12">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-4xl lg:text-6xl font-semibold">
              Donate to Worthy Causes
            </h1>
            <p className="text-muted-foreground">
              Make a difference by supporting the causes you care about. Every
              donation, big or small, helps create positive change.
            </p>
          </div>

          <DonationsComponent />
        </Container>
      </div>
    </main>
  );
}

export default Donations;
