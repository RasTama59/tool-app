import {AppLink} from "@/components/ui/app-link";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {Notice} from "@/components/ui/notice";
import {SectionHeading} from "@/components/ui/section-heading";

type Props = {
  breadcrumbLabel: string;
  currentLabel: string;
  description: string;
  homeHref: string;
  homeLabel: string;
  notice?: {
    description: string;
    title: string;
  };
  panels?: Array<{
    title: string;
    items: Array<{
      href?: string;
      label: string;
      value: string;
    }>;
  }>;
  sections: Array<{
    body: string[];
    subsections?: Array<{
      body: string[];
      title: string;
    }>;
    title: string;
  }>;
  title: string;
};

export function StaticPageShell({
  breadcrumbLabel,
  currentLabel,
  description,
  homeHref,
  homeLabel,
  notice,
  panels,
  sections,
  title,
}: Props) {
  return (
    <main id="main-content">
      <Container className="py-12 sm:py-16" size="narrow">
        <div className="space-y-8">
          <Breadcrumbs
            items={[
              {
                href: homeHref,
                label: homeLabel,
              },
              {
                label: currentLabel,
              },
            ]}
            label={breadcrumbLabel}
          />

          <SectionHeading description={description} title={title} titleAs="h1" />

          {notice ? (
            <Notice description={notice.description} title={notice.title} tone="info" />
          ) : null}

          {panels?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {panels.map((panel) => (
                <Card className="p-6 sm:p-7" key={panel.title}>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {panel.title}
                  </h2>
                  <dl className="mt-5 space-y-4">
                    {panel.items.map((item) => (
                      <div className="space-y-1.5" key={`${item.label}-${item.value}`}>
                        <dt className="text-sm font-semibold text-foreground">
                          {item.label}
                        </dt>
                        <dd className="text-sm leading-7 text-muted sm:text-base">
                          {item.href ? (
                            <AppLink
                              className="text-[#215da8] hover:underline"
                              href={item.href}
                            >
                              {item.value}
                            </AppLink>
                          ) : (
                            item.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              ))}
            </div>
          ) : null}

          <div className="space-y-5">
            {sections.map((section) => (
              <Card className="p-6 sm:p-7" key={section.title}>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p className="text-sm leading-8 text-muted sm:text-base" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}

                  {section.subsections?.map((subsection) => (
                    <div className="space-y-3 pt-2" key={subsection.title}>
                      <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                        {subsection.title}
                      </h3>
                      {subsection.body.map((paragraph) => (
                        <p
                          className="text-sm leading-8 text-muted sm:text-base"
                          key={paragraph}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
