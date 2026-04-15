import {AppLink} from "@/components/ui/app-link";
import {getButtonClasses} from "@/components/ui/button";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {LocalProcessingBadge} from "@/components/ui/local-processing-badge";
import {SectionHeading} from "@/components/ui/section-heading";
import type {GuideDirectoryContent} from "@/lib/guides";

type Props = GuideDirectoryContent;

export function GuideIndexShell({
  articles,
  breadcrumbLabel,
  breadcrumbs,
  description,
  eyebrow,
  localProcessingLabel,
  openArticleLabel,
  relatedToolLabel,
  title,
  updatedLabel,
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
            {articles.map((article) => (
              <Card className="p-6 sm:p-7" key={article.href}>
                <div className="space-y-5">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#215da8]">
                      {article.category}
                    </p>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        {article.title}
                      </h2>
                      <p className="text-sm leading-7 text-muted sm:text-base">
                        {article.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#d7e3f1] bg-[#f8fbff] px-3 py-2 text-sm text-foreground/80">
                      {article.readTime}
                    </span>
                    <span className="rounded-full border border-[#d7e3f1] bg-[#f8fbff] px-3 py-2 text-sm text-foreground/80">
                      {updatedLabel}: {article.updatedAt}
                    </span>
                  </div>

                  {article.relatedTool ? (
                    <div className="rounded-[24px] border border-line bg-[#fbfdff] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                        {relatedToolLabel}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                        {article.relatedTool.label}
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <AppLink className={getButtonClasses()} href={article.href}>
                      {openArticleLabel}
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
