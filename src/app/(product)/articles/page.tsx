import Container from "@/components/Container";
import ArticlesComponent from "@/components/articles/ArticlesComponent";

export const dynamic = "force-dynamic";

function Articles() {
  return (
    <main>
      <div className="py-6 sm:py-12 md:py-24 lg:py-32">
        <Container className="px-4 md:px-6 flex flex-col gap-6 lg:gap-12">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-4xl lg:text-6xl font-semibold">
              Discover Helpful Articles
            </h1>
            <p className="text-muted-foreground">
              Seek through these articles to learn more about our platform and
              causes we work on.
            </p>
          </div>

          <ArticlesComponent />
        </Container>
      </div>
    </main>
  );
}

export default Articles;
