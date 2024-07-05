import Container from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function About() {
  return (
    <main>
      <div className="py-6 sm:py-12 md:py-24 lg:py-32">
        <Container className="px-4 md:px-6 flex flex-col gap-6 lg:gap-12">
          <section className="flex flex-col items-center gap-3">
            <h1 className="text-4xl lg:text-6xl font-semibold">
              About Our Charity
            </h1>
            <p className="text-muted-foreground">
              Our charity is dedicated to making a positive impact on the lives
              of those in need. We believe in the power of community,
              compassion, and collaboration to create a more just and equitable
              world.
            </p>
          </section>

          <section className="mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Our Key Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">Food Assistance</h3>
                <p className="text-muted-foreground">
                  We provide nutritious meals and food supplies to families and
                  individuals in need.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">Housing Support</h3>
                <p className="text-muted-foreground">
                  We offer temporary shelter, transitional housing, and
                  assistance with finding permanent homes.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">Educational Programs</h3>
                <p className="text-muted-foreground">
                  We provide educational resources, tutoring, and skills
                  training to empower individuals.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>BQ</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">Baiq</h3>
                    <p className="text-muted-foreground">Developer</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  John has over 15 years of experience in the nonprofit sector,
                  leading initiatives that have made a lasting impact on the
                  community.
                </p>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </main>
  );
}

export default About;
