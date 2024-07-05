/**
 * v0 by Vercel.
 * @see https://v0.dev/t/PmwTvNfrVgf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Container from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";
import { ny } from "@/lib/utils";
import { LucideActivitySquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { values } from "@/static/landing";
import Causes from "@/components/causes/Causes";
import Articles from "@/components/articles/Articles";

export default function LandingPage() {
  return (
    <>
      <main className="scroll-smooth">
        <section id="hero" className="w-full py-6 sm:py-12">
          <Container className="px-4 md:px-6 flex flex-col gap-6 lg:gap-12">
            <div className="flex flex-col gap-6 lg:gap-12 md:flex-row justify-between">
              <h1 className="text-4xl lg:text-6xl font-semibold">
                Giving <span className="text-primary">Hope</span>, <br />{" "}
                Creating Impact
              </h1>

              <div className="flex flex-col gap-6">
                <p className="text-muted-foreground">
                  Be a prideful part of something really great. We are utterly
                  dedicated to giving hope to those in need, creating a lasting
                  impact for them. Donate, Volunteer, and Spread awareness to
                  mitigate recent events&apos; damages
                </p>

                <div className="flex flex-col gap-6 md:flex-row">
                  <Link className={buttonVariants()} href="#ongoing-donations">
                    Donate Now
                  </Link>
                  <Link
                    href="#description"
                    className={buttonVariants({ variant: "link" })}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="gap-3 lg:gap-6 flex flex-col">
              <div className="w-full relative h-96 lg:h-[40rem]">
                <Image
                  alt="hero"
                  className="aspect-video overflow-hidden rounded-xl object-cover h-full"
                  src="https://utfs.io/f/ec750d6f-25ef-4f1b-a1ae-ef5fee99359b-6rio6t.jpg"
                  fill
                  priority
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-primary gap-3 lg:gap-6">
                <div className="px-4 md:px-6">
                  <h5 className="font-semibold text-lg lg:text-2xl">{`IDR130M+`}</h5>
                  <p className="text-muted-foreground">Fund Raised</p>
                </div>
                <div className="px-4 md:px-6">
                  <h5 className="font-semibold text-lg lg:text-2xl">{`200+`}</h5>
                  <p className="text-muted-foreground">Dedicated Volunteers</p>
                </div>
                <div className="px-4 md:px-6">
                  <h5 className="font-semibold text-lg lg:text-2xl">{`100%`}</h5>
                  <p className="text-muted-foreground">Delivered Donations</p>
                </div>
                <div className="px-4 md:px-6">
                  <h5 className="font-semibold text-lg lg:text-2xl">{`1.5M+`}</h5>
                  <p className="text-muted-foreground">Charity Participation</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section
          id="description"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <Container className="px-4 lg:px-6 flex flex-col gap-6 lg:gap-12 lg:flex-row lg:justify-between">
            <div className="grid grid-cols-1 gap-3 lg:gap-6 w-full max-w-4xl">
              <div className="col-span-2 rounded-xl w-full h-80 relative">
                <Image
                  alt="charity"
                  className="object-cover rounded-xl"
                  src="https://utfs.io/f/7c4305dd-b9e8-4cef-9397-685c2a575ef4-mtcq24.jpg"
                  fill
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-3 lg:gap-6 col-span-2">
                <div className="from-primary to-primary/60 bg-gradient-to-tr rounded-xl w-full relative h-64 col-span-1">
                  <LucideActivitySquare className="dark:text-foreground text-background w-8 h-8 absolute top-0 left-0 m-4" />

                  <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-3">
                    <h1 className="text-3xl lg:text-5xl font-semibold text-background dark:text-foreground">
                      50%
                    </h1>
                    <p className="dark:text-zinc-300 text-muted font-light">
                      Of kids worldwide do not have education
                    </p>
                  </div>
                </div>

                <div className="rounded-xl w-full h-64 relative col-span-1 xl:col-span-2">
                  <Image
                    alt="education"
                    className="rounded-xl object-cover"
                    src="https://utfs.io/f/872b4697-0e7a-4451-be44-1e66b703677e-trcusz.jpg"
                    fill
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:gap-6 max-w-3xl lg:self-center">
              <h2 className="text-3xl lg:text-5xl font-semibold">
                Donation for the better of our future world
              </h2>
              <p className="text-justify text-muted-foreground">
                WeHope is more than a charity; it is a movement dedicated to
                shaping a brighter future for women, children, and our planet.
                Through empowering programs, dedicated volunteers, and a global
                reach; we are fostering positive change and hope in communities
                worldwide.
              </p>
              <Link
                href="#values"
                className={buttonVariants({
                  className: "w-fit !px-0",
                  variant: "link",
                })}
              >
                Learn More
              </Link>
            </div>
          </Container>
        </section>

        <section className="py-12 md:py-24 lg:py-32" id="ongoing-donations">
          <Container className="px-4 lg:px-6 flex flex-col gap-6 lg:gap-12">
            <Causes />
          </Container>
        </section>

        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
          id="values"
        >
          <Container className="px-4 xl:px-6 flex flex-col gap-6 xl:gap-12 xl:flex-row xl:justify-between">
            <div className="gap-3 xl:gap-6 flex flex-col">
              <h1 className="text-4xl xl:text-6xl font-semibold">
                Overcoming the issues with our true values
              </h1>

              <div className="flex flex-col gap-3 xl:gap-6">
                {values.map((v) => (
                  <div
                    className="p-4 flex gap-3 xl:gap-6 bg-background rounded-xl shadow"
                    key={v.id}
                  >
                    <div
                      className={buttonVariants({
                        size: "icon",
                        variant: "ghost",
                        className: ny(
                          "shrink-0 text-background dark:text-foreground hover:text-background dark:hover:text-foreground",
                          {
                            "bg-foreground dark:!bg-muted-foreground dark:hover:!bg-muted-foreground/80 hover:!bg-foreground/80":
                              v.id % 2 === 0,
                            "bg-primary hover:bg-primary/80": v.id % 2 !== 0,
                          }
                        ),
                      })}
                    >
                      <v.icon className="h-6 w-6" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h5 className="font-semibold text-lg xl:text-2xl">
                        {v.title}
                      </h5>
                      <p className="text-muted-foreground">{v.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-80 xl:h-auto w-full">
              <LucideActivitySquare className="text-primary h-8 w-8 absolute top-0 right-0 m-4 z-10" />
              <Image
                alt="values"
                className="object-cover rounded-xl"
                src="https://utfs.io/f/348c43da-63d6-4b4e-bd2f-73740db433c7-xlzkqc.jpg"
                fill
              />
            </div>
          </Container>
        </section>

        <section className="py-12 md:py-24 lg:py-32" id="articles">
          <Container className="px-4 lg:px-6 flex flex-col gap-6 lg:gap-12">
            <Articles />
          </Container>
        </section>
      </main>

      <footer className="bg-foreground relative py-12 md:py-24 lg:py-32 mt-96 lg:drop-shadow min-h-[40rem]">
        <Container className="absolute top-0 inset-x-0 mx-auto bg-background lg:rounded-xl p-4 lg:p-6 flex flex-col gap-6 lg:gap-12 -mt-96">
          <div className="w-full relative h-[36rem]">
            <Image
              alt="footer-figure"
              className="object-cover rounded-xl w-full h-full"
              src="https://utfs.io/f/7c4305dd-b9e8-4cef-9397-685c2a575ef4-mtcq24.jpg"
              fill
            />
          </div>
          <div className="gap-3 lg:gap-6 flex flex-col items-center mb-20">
            <h1 className="text-4xl xl:text-6xl font-semibold">
              Join the <span className="text-primary">Hope Revolution</span>{" "}
              today
            </h1>
            <p>
              Together, we can empower women, nurture children&apos;s dreams,
              and preserve our planet.
            </p>
          </div>

          <div className="bg-foreground rounded-full p-2 absolute inset-x-0 mx-auto w-fit bottom-0 -mb-14">
            <div className="rounded-full bg-primary p-4">
              <LucideActivitySquare className="h-14 w-14 text-background dark:text-foreground" />
            </div>
          </div>
        </Container>
        <Container className="mt-[36rem] sm:mt-[28rem] lg:mt-[28rem] flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-center max-w-xl max-h-32 overflow-y-auto">
            WeHope is a non-profit organization that moves within the issues of
            women empowerment, children nourishment, and nature preservation.
          </p>

          <div className="flex items-center gap-1.5">
            {footerLinks.map((link) => (
              <Link
                className={buttonVariants({ variant: "link" })}
                href={link.href}
                key={link.id}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </Container>
      </footer>
    </>
  );
}

const footerLinks = [
  {
    id: 1,
    title: "Home",
    href: "/",
  },
  {
    id: 2,
    title: "About",
    href: "/about",
  },
];
