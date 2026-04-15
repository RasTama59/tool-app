import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {SectionHeading} from "@/components/ui/section-heading";

type Props = {
  id: string;
  title: string;
  description: string;
  items: Array<{
    stepNumber: string;
    title: string;
    description: string;
  }>;
};

export function ProcessSection({id, title, description, items}: Props) {
  return (
    <section className="py-12 sm:py-14" id={id}>
      <Container>
        <Card className="p-6 sm:p-8" tone="soft">
          <SectionHeading description={description} title={title} />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {items.map((item) => (
              <Card className="p-5" key={item.stepNumber} tone="default">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#215da8]">
                  {item.stepNumber}
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
        </Card>
      </Container>
    </section>
  );
}
