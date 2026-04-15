import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {SectionHeading} from "@/components/ui/section-heading";

type Props = {
  id: string;
  title: string;
  description: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};

export function FaqSection({id, title, description, items}: Props) {
  return (
    <section className="py-12 sm:py-14" id={id}>
      <Container size="narrow">
        <SectionHeading description={description} title={title} />

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <Card className="px-5 py-4" key={item.question}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span className="text-lg font-semibold tracking-tight text-foreground">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="rounded-full border border-[#d7e3f1] px-3 py-1 text-xs font-semibold text-[#215da8] transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                  {item.answer}
                </p>
              </details>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
