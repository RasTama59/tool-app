import {ToolFaqSection} from "@/components/tools/tool-faq-section";
import {ToolLinkSection} from "@/components/tools/tool-link-section";
import {ToolStepsSection} from "@/components/tools/tool-steps-section";
import {AppLink} from "@/components/ui/app-link";
import {getButtonClasses} from "@/components/ui/button";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {LocalProcessingBadge} from "@/components/ui/local-processing-badge";
import {SectionHeading} from "@/components/ui/section-heading";
import type {GuideArticlePageContent} from "@/lib/guides";

type Props = GuideArticlePageContent;

export function GuideArticleShell({
  article,
  breadcrumbLabel,
  breadcrumbs,
  emptyStates,
  labels,
  localProcessingLabel,
}: Props) {
  return (
    <main id="main-content">
      <Container className="py-12 sm:py-16">
        <div className="space-y-8">
          <Breadcrumbs items={breadcrumbs} label={breadcrumbLabel} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_320px] xl:items-start">
            <div className="space-y-5">
              <p className="inline-flex rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-semibold tracking-[0.2em] text-[#215da8]">
                {article.category}
              </p>
              <SectionHeading
                description={article.description}
                title={article.title}
                titleAs="h1"
              />
              <LocalProcessingBadge label={localProcessingLabel} />
            </div>

            <Card className="space-y-5 p-6 sm:p-7" tone="soft">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {labels.summary}
                </h2>
                <p className="text-sm leading-7 text-muted sm:text-base">
                  {article.summary}
                </p>
              </div>

              <dl className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm font-semibold text-foreground">
                    {labels.published}
                  </dt>
                  <dd className="text-sm text-muted">{article.publishedAt}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm font-semibold text-foreground">
                    {labels.updated}
                  </dt>
                  <dd className="text-sm text-muted">{article.updatedAt}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm font-semibold text-foreground">
                    {labels.readTime}
                  </dt>
                  <dd className="text-sm text-muted">{article.readTime}</dd>
                </div>
              </dl>

              {article.primaryTool ? (
                <div className="space-y-3 rounded-[24px] border border-line bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {labels.relatedTools}
                  </p>
                  <div className="space-y-2">
                    <p className="text-base font-semibold tracking-tight text-foreground">
                      {article.primaryTool.label}
                    </p>
                    <p className="text-sm leading-7 text-muted">
                      {article.primaryTool.description}
                    </p>
                  </div>
                  <AppLink
                    className={getButtonClasses({fullWidth: true})}
                    href={article.primaryTool.href}
                  >
                    {labels.openTool}
                  </AppLink>
                </div>
              ) : null}
            </Card>
          </div>

          <Card className="p-6 sm:p-7">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {labels.intro}
            </h2>
            <div className="mt-4 space-y-4">
              {article.intro.map((paragraph) => (
                <p className="text-sm leading-8 text-muted sm:text-base" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>

          <div className="space-y-5">
            {article.sections.map((section) => (
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

                  {section.list?.length ? (
                    <ul className="space-y-2 pl-5 text-sm leading-7 text-muted sm:text-base">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}

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
                      {subsection.list?.length ? (
                        <ul className="space-y-2 pl-5 text-sm leading-7 text-muted sm:text-base">
                          {subsection.list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <ToolStepsSection items={article.steps} title={labels.steps} />

          <ToolFaqSection items={article.faq} title={labels.faq} />

          <div className="grid gap-6 xl:grid-cols-2">
            <ToolLinkSection
              emptyState={emptyStates.relatedTools}
              items={article.relatedTools}
              title={labels.relatedTools}
            />
            <ToolLinkSection
              emptyState={emptyStates.relatedArticles}
              items={article.relatedArticles}
              title={labels.relatedArticles}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
