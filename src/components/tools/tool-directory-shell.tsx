import {AppLink} from "@/components/ui/app-link";
import {getButtonClasses} from "@/components/ui/button";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {LocalProcessingBadge} from "@/components/ui/local-processing-badge";
import {SectionHeading} from "@/components/ui/section-heading";

type Props = {
  breadcrumbLabel: string;
  breadcrumbs: Array<{
    href?: string;
    label: string;
  }>;
  description: string;
  eyebrow: string;
  localProcessingLabel: string;
  openToolLabel: string;
  supportedFormatsLabel: string;
  title: string;
  tools: Array<{
    category: string;
    description: string;
    href: string;
    supportedFormats: string[];
    title: string;
  }>;
};

export function ToolDirectoryShell({
  breadcrumbLabel,
  breadcrumbs,
  description,
  eyebrow,
  localProcessingLabel,
  openToolLabel,
  supportedFormatsLabel,
  title,
  tools,
}: Props) {
  return (
    <main id="main-content">
      <Container className="py-12 sm:py-16">
        <div className="space-y-8">
          <Breadcrumbs items={breadcrumbs} label={breadcrumbLabel} />

          <div className="space-y-5">
            <SectionHeading
              description={description}
              eyebrow={eyebrow}
              title={title}
              titleAs="h1"
            />
            <LocalProcessingBadge label={localProcessingLabel} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {tools.map((tool) => (
              <Card className="p-6 sm:p-7" key={tool.href}>
                <div className="space-y-5">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#215da8]">
                      {tool.category}
                    </p>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        {tool.title}
                      </h2>
                      <p className="text-sm leading-7 text-muted sm:text-base">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                      {supportedFormatsLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tool.supportedFormats.map((format) => (
                        <span
                          className="rounded-full border border-[#d7e3f1] bg-[#f8fbff] px-3 py-2 text-sm text-foreground/80"
                          key={format}
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <AppLink className={getButtonClasses()} href={tool.href}>
                      {openToolLabel}
                    </AppLink>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
