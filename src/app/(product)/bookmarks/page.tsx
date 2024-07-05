import Container from "@/components/Container";
import BookmarksComponent from "@/components/bookmarks/Bookmarks";

function Bookmarks() {
  return (
    <main>
      <div className="py-6 sm:py-12 md:py-24 lg:py-32">
        <Container className="px-4 md:px-6 flex flex-col gap-6 lg:gap-12">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-4xl lg:text-6xl font-semibold">Saved Causes</h1>
            <p className="text-muted-foreground">
              Saved causes for you to check out.
            </p>
          </div>

          <BookmarksComponent />
        </Container>
      </div>
    </main>
  );
}

export default Bookmarks;
