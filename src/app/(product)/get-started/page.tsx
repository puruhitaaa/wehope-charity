import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

function GetStarted() {
  const { userId } = auth();

  if (userId) redirect("/");

  return (
    <main>
      <section className="w-full items-center flex py-12 md:py-24 lg:py-32 xl:py-48 h-[calc(100vh-3.5rem)]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Be The Difference Maker
                </h1>
                <p className="text-muted-foreground md:text-xl text-justify">
                  Join us in our mission to make a difference. Our charity
                  website is here to empower individuals and organizations to
                  make a positive impact in the world.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/sign-in"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            <Image
              src="https://utfs.io/f/d761a323-45af-4bb3-8e15-f1d6062bf86f-71dtew.jpg"
              width={500}
              height={500}
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-bottom h-[48rem] sm:w-full"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Easily Contribute
              </p>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Discover the Power of Our Platform
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                With our platform, you can fundraise, donate, volunteer, or
                spread awareness for causes that matter to you. Every small
                contribution, no matter how big or small, can make a significant
                difference in shaping a brighter future for all.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl items-center py-12">
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li className="bg-secondary border border-primary p-4 rounded-xl hover:bg-primary group transition-colors ease-out">
                  <Link className="grid gap-1" href="/donations">
                    <h3 className="text-xl font-bold">Donate</h3>
                    <p className="text-muted-foreground group-hover:text-primary-foreground">
                      Contribute with funds of any amount
                    </p>
                  </Link>
                </li>
                <li className="bg-secondary border border-primary p-4 rounded-xl hover:bg-primary group transition-colors ease-out">
                  <Link className="grid gap-1" href="/volunteer">
                    <h3 className="text-xl font-bold">Volunteer</h3>
                    <p className="text-muted-foreground group-hover:text-primary-foreground">
                      Contribute to our numerous activities online or offline
                    </p>
                  </Link>
                </li>
                <li className="bg-secondary border border-primary p-4 rounded-xl hover:bg-primary group transition-colors ease-out">
                  <Link className="grid gap-1" href="#">
                    <h3 className="text-xl font-bold">Discuss</h3>
                    <p className="text-muted-foreground group-hover:text-primary-foreground">
                      Talk about recent events and possibly raise a new concern
                      that the community can help directly
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default GetStarted;
