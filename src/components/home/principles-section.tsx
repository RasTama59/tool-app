import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {SectionHeading} from "@/components/ui/section-heading";

type Props = {
  id: string;
  title: string;
  description: string;
  items: Array<{
    indexLabel: string;
    title: string;
    description: string;
  }>;
};

export function PrinciplesSection({id, title, description, items}: Props) {
  return (
    <section className="py-12 sm:py-14" id={id}>
      <Container>
        <SectionHeading description={description} title={title} />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Card
              className="h-full p-6"
              key={item.title}
              tone="default"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#215da8]">
                {item.indexLabel}
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
